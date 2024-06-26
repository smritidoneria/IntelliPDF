import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import {PDFLoader} from 'langchain/document_loaders/fs/pdf'
import { pinecone } from "@/lib/pinecone";
import { OpenAI } from 'openai';
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

const { spawn } = require('child_process');
const fs = require('fs');
 
const f = createUploadthing();
 
 

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();
      if (!user || !user.id) {
        throw new Error("Unauthorized");
      }

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("########fileurfdfdnjl", file.url)
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: file.url,
          uploadStatus: 'Processing'
        }
      })

      try {
        const response = await fetch(file.url)
        console.log("response", response)
        const blob = await response.blob()

        const loader = new PDFLoader(blob)
        console.log("loader", loader)

        const pageLevelDocs = await loader.load()
        console.log("PageLevelDocs",pageLevelDocs)

        const pagesAmt = pageLevelDocs.length

        const pineconeIndex = pinecone.Index("intellipdf")

        // const embeddings = new OpenAIEmbeddings({
        //   openAIApiKey: process.env.OPENAI_API_KEY
        // });
        // await PineconeStore.fromDocuments(pageLevelDocs,
        //   embeddings, {
        //     pineconeIndex,
        //     namespace: createdFile.id
        //   }
        // )

        const embeddings = new GoogleGenerativeAIEmbeddings({
          model: "embedding-001", // 768 dimensions
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        });
        const res = await embeddings.embedQuery("OK Google");

          console.log(res, res.length);


           await PineconeStore.fromDocuments(pageLevelDocs,
          embeddings, {
            pineconeIndex,
            namespace: createdFile.id
          }
        )


        await db.file.update({
          where: {
            id: createdFile.id
          },
          data: {
            uploadStatus: 'Complete',
          }
        })

      } catch (error) {
        console.log("errorrrrr", error)
        await db.file.update({
          where: {
            id: createdFile.id
          },
          data: {
            uploadStatus: 'Failed',
          }
        })
      }
    })
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;