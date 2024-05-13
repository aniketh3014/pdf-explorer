"use client"

import { UploadFile } from '@/lib/s3'
import { Inbox } from 'lucide-react'
import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

export const DropZone = () => {
    
  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    console.log(acceptedFiles)
    const file = acceptedFiles[0];
    if(file.size > 10*1024*1024) {
        alert('File size should be less than 10MB');
        return;
    }

    try {
        const done = UploadFile(file);
        console.log(done);
    } catch(error) {
        console.log(error);
    }

  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({  
    onDrop,
    accept: {'application/pdf': [".pdf"]},
    maxFiles: 1,
    
})

  return (<div className='bg-gray-50 p-2 rounded-xl dark:text-black border-dashed border-2 dark:border-transparent'>
    <div {...getRootProps()} className='border-dashed border-2 rounded-xl cursor-pointer bg-gray-200 py-16'>
      <input {...getInputProps()}/>
      {
        isDragActive ?
          <p>Drop the files here ...</p> :<div className=''>
            <Inbox className='m-auto h-6 w-6'/>
          <p>Drag 'n' drop your PDF here, or click to select PDF</p></div>
      }
    </div>
  </div>

  )
}