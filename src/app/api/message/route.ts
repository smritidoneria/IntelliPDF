import { db } from "@/db";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { reportWebVitals } from "next/dist/build/templates/pages";
import { NextRequest } from "next/server";
import { TaskType } from "@google/generative-ai";
import { pinecone } from "@/lib/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { format } from "path";
import { OpenAIStream, StreamingTextResponse } from "ai";
import OpenAI from "openai";
import { Stream } from "stream";
import genAI from "genai"; // Replace 'genAI-library' with the actual library name or path
import Gemini from "gemini-ai";

if (!process.env.GOOGLE_API_KEY) {
  throw new Error(
    "Google API key is not defined in the environment variables."
  );
}
const gemini = new Gemini(process.env.GOOGLE_API_KEY);

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    if (!user || !user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { fileId, message } = SendMessageValidator.parse(body);

    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId: user.id,
      },
    });

    if (!file) {
      return new Response("File not found", { status: 404 });
    }

    await db.message.create({
      data: {
        text: message,
        isUserMessage: true,
        userId: user.id,
        fileId: fileId,
      },
    });

    // vectorize the message
    const embeddings = new GoogleGenerativeAIEmbeddings({
      model: "embedding-001", // 768 dimensions
      taskType: TaskType.RETRIEVAL_DOCUMENT,
      title: "Document title",
    });

    const pineconeIndex = pinecone.Index("intellipdf");

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.id,
    });

    const result = await vectorStore.similaritySearch(message, 5);
    console.log("result", result);

    const prevMessage = await db.message.findMany({
      where: {
        fileId: fileId,
      },
      orderBy: {
        createdAt: "asc",
      },
      take: 10,
    });

    //   const formattedMessages=prevMessage.map((m)=>({
    //         id:m.id,
    //         text:m.text,
    //         isUserMessage:m.isUserMessage,
    //         createdAt:m.createdAt
    //     }))
    const formattedPrevMessages = prevMessage.map((msg) => ({
      role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
      content: msg.text,
    }));
    const messages = [
      {
        role: "system",
        content:
          "Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format.",
      },
      {
        role: "user",
        content: `Use the following pieces of context (or previous conversation if needed) to answer the users question in markdown format. \nIf you don't know the answer, just say that you don't know, don't try to make up an answer.
            
    \n----------------\n
    
    PREVIOUS CONVERSATION:
    ${formattedPrevMessages.map((message) => {
      if (message.role === "user") return `User: ${message.content}\n`;
      return `Assistant: ${message.content}\n`;
    })}
    
    \n----------------\n
    
    CONTEXT:
    ${result.map((r) => r.pageContent).join("\n\n")}
    
    USER INPUT: ${message}`,
      },
    ];
    const chatMessages: [string, string][] = messages.map((msg) => [
      msg.role,
      msg.content,
    ]);

    const newChat = await gemini.createChat({
      messages: chatMessages,
    });
    console.log("newChat response:", newChat);
    console.log("ayushhhhhh", await newChat.ask(message));

    const jsonResponse = JSON.stringify(newChat);
    console.log("newChat JSON:", jsonResponse);
    await db.message.create({
        data: {
          text: jsonResponse   ,
          isUserMessage: false,
          userId: user!.id,
          fileId: fileId,
        },
      });

   return new Response(JSON.stringify(newChat), { status: 200 });

   
  } catch (error) {
    console.error("Error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }

  //   const geminiApiResponse = await sendToGeminiAPI(messages);
  //   async function sendToGeminiAPI(messages: any) {
  //     const geminiApiUrl = "https://api.gemini.com/chat";
  //     const requestOptions = {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // Add any necessary headers (e.g., authorization token)
  //       },
  //       body: JSON.stringify({ messages }),
  //     };

  //     const response = await fetch(geminiApiUrl, requestOptions);
  //     console.log("response", response)
  //     if (!response.ok) {
  //       throw new Error(`Gemini API request failed: ${response.statusText}`);
  //     }

  //     await response.json();
//   const stream = OpenAIStream(response, {
//     async onCompletion(completion) {
//       await db.message.create({
//         data: {
//           text: completion,
//           isUserMessage: false,
//           userId: user!.id,
//           fileId: fileId,
//         },
//       });
//     },
//   });
//   return new StreamingTextResponse(stream);
  //   }
};
