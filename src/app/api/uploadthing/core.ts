import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();
 
 

export const ourFileRouter = {
  
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
   
    .middleware(async ({ req }) => {
        const {getUser}=getKindeServerSession();
        const user=await getUser();
        if(!user||!user.id){
            throw new Error("Unauthorized");
        }

 

      return { userId:user.id};
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("########fileurfdfdnjl",file.url)
      const createdFile=await db.file.create({
      data:{
        key:file.key,
        name:file.name,
        userId:metadata.userId,
        url:file.url,
        uploadStatus:'Processing'
      }
      })
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;