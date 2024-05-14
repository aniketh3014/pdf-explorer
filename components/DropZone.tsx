"use client";

import { UploadFile } from '@/lib/s3';
import { Inbox, Loader2 } from 'lucide-react';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMutation } from "react-query";
import axios from 'axios';

export const DropZone = () => {
    const {mutate} = useMutation({
        mutationFn: async({file_name, file_key}:{file_name: string, file_key: string}) => {
            const res = await axios.post('/api/create-chat', {
                file_name,
                file_key
            })
        }
    })

    const [loading, setLoading] = React.useState(false);

    const onDrop = useCallback(async (acceptedFiles:any) => {
        const file = acceptedFiles[0];

        if (file.size > 10 * 1024 * 1024) {
            alert('File size should be less than 10MB');
            return;
        }

        try {
            setLoading(true);
            const done = await UploadFile(file);

            if (!done?.file_key || !done?.file_name) {
                alert('Error while uploading the file');
                return;
            }
            mutate(done, {
                onSuccess: () => {
                    console.log(done);
                },
                onError: (error) => {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
    });

    return (
        <div className='bg-gray-50 p-2 rounded-xl dark:text-black border-dashed border-2 dark:border-transparent'>
            <div {...getRootProps()} className='border-dashed border-2 rounded-xl cursor-pointer bg-gray-200 py-16'>
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop the files here ...</p>
                ) : (
                    <div className='flex flex-col items-center'>
                        {loading ? (
                            <div>
                                <Loader2 className='h-10 w-10 animate-spin text-blue-500' />
                                <p>Uploading your document...</p>
                            </div>
                        ) : (
                            <div>
                                <Inbox className='m-auto h-6 w-6 text-blue-500' />
                                <p>Drag 'n' drop your PDF here, or click to select PDF</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};