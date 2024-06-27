import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { keepPreviousData } from "@tanstack/react-query";
import { Loader2, MessageSquare } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Message from "./Message";

interface MessagesProps {
  fileId: string;
}

const Messages = ({ fileId }: MessagesProps) => {
  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessage.useInfiniteQuery(
      {
        fileId,
        limit: INFINITE_QUERY_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage?.nextCursor,
        staleTime: 800, //(replacement of keep previous data)
      }
    );

  const loadingMessages = {
    createdAt: new Date().toISOString(),
    id: "loading-message",
    isUserMessage: false,
    text: (
      <span className="flec h-full items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </span>
    ),
  };

  const messages = data?.pages.flatMap((page) => page.messages);
  const combinedMessages = [
    ...(true ? [loadingMessages] : []),
    ...(messages ?? []),
  ];
  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch">
      {combinedMessages&& combinedMessages.length > 0 ? (
        combinedMessages.map((message,i)=>{
          //edge case
          const isMessagesameMessage=combinedMessages[i-1]?.isUserMessage===combinedMessages[i]?.isUserMessage
          if(i===combinedMessages.length-1){
            return <Message key={message.id} isNextMessageSamePerson={isMessagesameMessage} message={message}/>
          }else{
            return <Message key={message.id} isNextMessageSamePerson={isMessagesameMessage} message={message}/>
          }
            
          
        })
      ):isLoading?(<div className="w-full flex-flex-col gap-2">
        <Skeleton className="h-16"/>
        <Skeleton className="h-16"/>
        <Skeleton className="h-16"/>
      </div>):<div className="flex-1 flex flex-col justify-center items-center gap-2">
        <MessageSquare className="h-8 w-8 text-blue-500"/>
        <h3 className="font-semibold text-xl">You&pos re all set</h3>
        <p>Ask your question</p>
        </div>}
    </div>
  );
};
export default Messages;
