"use client";
import { trpc } from "@/app/_trpc/client";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import React, { useContext } from "react";
import { ChevronLeft, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import { ChatContextProvider } from "./ChatContext";


interface ChatWrapperProps {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapperProps) => {
  // const { data, isLoading, error }=trpc.getFileUploadStatus.useQuery(
  //     {fileId}
  // )
  const { data, isLoading } = trpc.getFileUploadStatus.useQuery({ fileId });

  if (isLoading) {
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center flex-col mb-20">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin"/>
            <h3 className="font-semibold text-xl">Loading...</h3>
            <p className="text-zinc-500 text-sm">
                We&apos;re fetching the file for you
            </p>
          </div>
        </div>
        <ChatInput isDisabled/>
      </div>
    );


  }

  if(data?.status==="Processing"){
    return (
        <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
          <div className="flex-1 flex justify-center flex-col mb-20">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin"/>
              <h3 className="font-semibold text-xl">Processing pDF</h3>
              <p className="text-zinc-500 text-sm">
                  This won&apos;t take long
              </p>
            </div>
          </div>
          <ChatInput isDisabled/>
        </div>
      );
  
  }

  if(data?.status==="Failed"){
    return (
        <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
          <div className="flex-1 flex justify-center flex-col mb-20">
            <div className="flex flex-col items-center gap-2">
              <XCircle className="h-8 w-8 text-red-500 "/>
              <h3 className="font-semibold text-xl">Too many pages in pdf</h3>
              <p className="text-zinc-500 text-sm">
                  Your <span className="font-medium"> Free</span>plan supports upto 5 pages in the pdf
              </p>
              <Link href='/dashboard' className={buttonVariants({variant:"secondary",className:"mt-4"})}> <ChevronLeft className="h-3 w-3 mr-1.5"/>Back</Link>
            </div>
          </div>
          <ChatInput isDisabled/>
        </div>
      );
  
  }

  return (
    <ChatContextProvider fileId={fileId}>
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-center">
      <div className="flex-1 justify-center flex flex-col mb-28">
        <Messages />
      </div>

      <ChatInput />
    </div>
    </ChatContextProvider>
  );
};
export default ChatWrapper;
