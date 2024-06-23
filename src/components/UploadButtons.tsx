// UploadButton.tsx
"use client";
import React, { useState } from "react";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button"; // Assuming Button component is imported from './ui/button'
import Dropzone from "react-dropzone";
import { Cloud, Divide,File} from "lucide-react";
import { Progress } from "./ui/progress";
import { set } from "date-fns";

const UploadDropzone = () => {

    const [isUploading,setIsUploading]=useState<boolean|null>(true)
    const [uploadProgress, setUploadProgress] = useState<number>(0)
    
    const startSimulationProgress=()=>{
        setUploadProgress(0)

        const interval=setInterval(()=>{
            setUploadProgress((prevProgress)=>{
                if(prevProgress>=50){
                    clearInterval(interval)
                    return prevProgress
                }
                return prevProgress+5
            })
        },500)

        return interval
    }



  return (
    <Dropzone
      multiple={false}
      onDrop={(acceptedFiles) => {
        setIsUploading(true)

        const progressInterval=startSimulationProgress()


        //handle file uploading

        clearInterval(progressInterval)
        setUploadProgress(100)
      }}
    >
      {({ getRootProps, getInputProps, acceptedFiles }) => (
        <div
          {...getRootProps()}
          className="border h-64 m-4 border-dashed border-gray-300 rounded-lg"
        >
          <div className="flex items-center justify-center h-full w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-full rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Cloud className="h-6 w-6 text-zinc-500 mb-2" />
                <p className="mb-2 text-sm text-zinc-700">
                  <span className="font-semibold">Click to upload</span>
                  {""}
                  or drag or drop
                </p>
                <p className="text-xs text-zinc=500">PDF (upto 4 MB)</p>
              </div>

              {acceptedFiles && acceptedFiles[0] ? 
              (<div className="max-w-xs bg-white flex items-center rounded-mg overflow-hidden outline outline-[1px] outline-zinc-200 divide-x divide-zinc-200">
                <div className="px-3 py-2 h-full grid place-items-center">
                    <File className='h-4 w-4 text-blue-500'/>
                </div>
                <div className="px-3 py-2 h-full text-sm truncate">
                {acceptedFiles[0].name}
                </div>
              </div>): null}


              {isUploading ?(
                <div className="w-full mt-4 max-w-xs mx-auto">
                    <Progress value={uploadProgress} className="h-1 w-full bg-zinc-200"/>
                </div>
              ):null}
            </label>
          </div>
        </div>
      )}
    </Dropzone>
  );
};

const UploadButtons = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      {/* Single parent element wrapper */}
      <div>
        {/* Dialog content */}
        <DialogTrigger onClick={() => setIsOpen(true)} asChild>
          <Button>Upload pdf</Button>
        </DialogTrigger>

        <DialogContent>
          <UploadDropzone />
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default UploadButtons;