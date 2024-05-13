import AWS from 'aws-sdk';
import { Key } from 'lucide-react';

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

        await upload.then(() => {
            console.log('Uploaded scuuessfully');
        });
        return Promise.resolve({
            file_key,
            file_name: file.name,
        })
    } catch(error) {

    }
}

export const getUrl = async (file_key: string) => {
    const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${file_key}`;
    return url;
}