"use server"
import AWS from 'aws-sdk';
import * as fs from 'fs';

export const UploadFile = async (file: File) => {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            },
            region: process.env.NEXT_PUBLIC_AWS_REGION,
        })

        const file_key = `${Date.now()}-${file.name.replace(' ', '_')}`;

        const params = {
            Key: file_key,
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            Body: file,
        }

        const upload = await s3.putObject(params).on('httpUploadProgress', evt => {
            console.log(evt.loaded, evt.total);
        }).promise();

        console.log('Uploaded successfully');
        return Promise.resolve({
            file_key,
            file_name: file.name,
        })
    } catch(error) {
        alert('Error while uploading the file');
    }
}

export const getUrl = async (file_key: string) => {
    const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${file_key}`;
    return url;
}

export const downloadFile = async (file_key: string) => {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME,
            },
            region: process.env.NEXT_PUBLIC_AWS_REGION,
        })
        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            Key: file_key,
        }
        const file_name = `/tem/pdf-${Date.now()}.pdf`
        const obj = await s3.getObject(params).promise();
        fs.writeFileSync(file_name, obj.Body as Buffer);
        return file_name;
    } catch(error) {
        alert('Error while downloading the file');
        return null;
    }
}