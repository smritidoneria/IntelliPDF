import { createContext, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/app/_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { set } from "date-fns";


type StreamMessage={
    addMessage:()=>void,
    message:string,
    handleInputChange:(event:React.ChangeEvent<HTMLTextAreaElement>)=>void,
    isLoading:boolean
}

export const ChatContext=createContext<StreamMessage>({
    addMessage:()=>{},
    message:'',
    handleInputChange:()=>{},
    isLoading:false
})

interface Props{
    fileId:string
    children:React.ReactNode
}

export const ChatContextProvider=({fileId,children}:Props)=>{
    const[message,setMessage]=useState<string>('')
    const [isLoading,setIsLoading]=useState<boolean>(false)
    const {toast}=useToast()

    const utils=trpc.useContext()

    const backup=useRef<string>('')


    // we are not using trpc here bcoz we want to stream back the response form the api to this query
    const {mutate:sendMessage}=useMutation({
        mutationFn:async({message}:{message:string})=>{
            const response=await fetch('/api/message',{
                method:'POST',
                body:JSON.stringify({message,fileId}),
            })
            if(!response.ok){
                throw new Error('Failed to send message')
            }


            return response.body
        },
        onMutate:async({message})=>{
            backup.current=message
            setMessage('')

            await utils.getFileMessage.cancel()


            const previousMessages=utils.getFileMessage.getInfiniteData()

            utils.getFileMessage.setInfiniteData(
                {fileId,limit:INFINITE_QUERY_LIMIT},
                (old)=>{
                    if(!old){
                        return {
                            pages:[],
                            pageParams:[]
                        }
                    }

                    let newPages=[...old.pages]
                    let latestPage=newPages[0]!
                    latestPage.messages=[
                        {
                            createdAt:new Date().toISOString(),
                            id:crypto.randomUUID(),
                            isUserMessage:true,
                            text:message
                        },
                        ...latestPage.messages
                    ]

                    newPages[0]=latestPage

                    return {
                        ...old,
                        pages:newPages
                    }
                }
            )
            setIsLoading(true)
            return {
                previousMessages:previousMessages?.pages.flatMap((page)=>page.messages)??[],
            }
        },
        onSuccess:async(stream)=>{
            setIsLoading(false)
            if(!stream){
                return toast({
                    title:"There was an error sending the message",
                    description:"Please try again",
                    variant:"destructive"
                })
            }
            const reader=stream.getReader()
            const decoder=new TextDecoder()
            let done=false

            //accumulated response

            let accResponse=''
            while(!done){
                const{value,done:doneReading}=await reader.read()
                done=doneReading
                const chunkValue=decoder.decode(value)
                accResponse+=chunkValue

                //appendin the response to the actual message

                utils.getFileMessage.setInfiniteData(
                    {fileId,limit:INFINITE_QUERY_LIMIT},
                    (old)=>{
                        if(!old){
                            return {
                                pages:[],
                                pageParams:[]
                            }
                        }

                        let isAiResponseCreated=old.pages.some((page)=>page.messages.some((message)=>message.id==='ai-response'))

                        let updatedPages=old.pages.map((page)=>{
                            if(page===old.pages[0]){
                                let updatedMessages
                                if(!isAiResponseCreated){
                                    updatedMessages=[
                                        {
                                            createdAt:new Date().toISOString(),
                                            id:'ai-response',
                                            isUserMessage:false,
                                            text:accResponse
                                        },
                                        ...page.messages
                                    ]
                                }else{
                                    updatedMessages=page.messages.map((message)=>{
                                        if(message.id==='ai-response'){
                                            return {
                                                ...message,
                                                text:accResponse
                                            }
                                        }

                                        return message
                                    })
                                }

                                return {
                                    ...page,
                                    messages:updatedMessages
                                
                                }
                            }
                            return page
                        })

                        return {...old,pages:updatedPages}
                    }
                )
            }
        },
        onError:(error,variables,context)=>{
            setMessage(backup.current)
            utils.getFileMessage.setData(
                {fileId},
                {messages:context?.previousMessages??[]}
            )
        },

        onSettled:async()=>{
            setIsLoading(false)

            await utils.getFileMessage.invalidate({fileId})
        }
    })

    const addMessage=()=>{
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&",message)
        sendMessage({message})
    }

    const handleInputChange=(event:React.ChangeEvent<HTMLTextAreaElement>)=>{
        setMessage(event.target.value)
    
    }


   return(
        <ChatContext.Provider value={{
            addMessage,
            message,
            handleInputChange,
            isLoading
        }}>
            {children}
        </ChatContext.Provider>
   )
            

    

    
}