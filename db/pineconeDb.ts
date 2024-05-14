import { downloadFile } from '@/lib/s3-down';
import { Pinecone } from '@pinecone-database/pinecone';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

export const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
});

export const loadPdfIntoPinecone = async (filekey: string) => {
    // downloadig the file from s3 to local storage
    const file_name = await downloadFile(filekey);
    if(!file_name) {
        throw new Error('Error while downloading the file');
    }
    const loader = new PDFLoader(file_name);
    const pages = await loader.load();
    return pages;
}