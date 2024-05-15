import { downloadFile } from '@/lib/s3-down';
import { Pinecone } from '@pinecone-database/pinecone';
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import {Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter';
import { getEmbedding } from '@/lib/embed';
import md5 from 'md5';
import { convertToAscii } from '@/lib/utils';

export const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
});

interface Page {
    pageContent: string;
    metadata: {
        loc: {pageNumber:number}
    }
}

export const loadPdfIntoPinecone = async (filekey: string) => {
    // downloadig the file from s3 to local storage
    const file_name = await downloadFile(filekey);
    if(!file_name) {
        throw new Error('Error while downloading the file');
    }
    const loader = new PDFLoader(file_name);
    const pages = (await loader.load()) as Page[];

    const docs = await Promise.all(pages.map(prepareData));
    const vectors = await Promise.all(docs.flat().map(embedData));
    const pineconeIndex = pc.Index('pdf-explorer');
    console.log('loading vectors into pinecone');
    const nameSpace = convertToAscii(filekey);
    if (!vectors || Object.keys(vectors).length === 0) {
        console.error('No vectors provided for upsert');
        return;
    }
    try {
        await pineconeIndex.namespace(nameSpace).upsert(vectors);
    } catch(error) {
        console.error('error in upserting data into pinecone', error);
        throw error;
    }
}

const embedData = async (doc: Document) => {
    try {
        const embeddings = await getEmbedding(doc.pageContent);
        const hash = md5(doc.pageContent);
        const vector = {
            id: hash,
            values: embeddings,
            metadata: {
                text: doc.metadata.text,
                pageNumber: doc.metadata.pageNumber
            }
        }
        console.log('embedding done', vector.id, vector.metadata.pageNumber);
        return vector;
    } catch(error) {
        console.error('error in embedding', error);
        throw error;
    }
}

const breakIntoChunks = (str: string, byte: number) => {
    const enc = new TextEncoder();
    return new TextDecoder('utf-8').decode(enc.encode(str.slice(0, byte)));
}

const prepareData = async (page: Page) => {
    let {pageContent, metadata} = page;
    pageContent = pageContent.replace(/(\r\n|\n|\r)/gm, " ");

    const splitter = new RecursiveCharacterTextSplitter();
    const docs = await splitter.splitDocuments([
        new Document({
            pageContent,
            metadata: {
                pageNumber: metadata.loc.pageNumber,
                text: breakIntoChunks(pageContent, 30000)
            }
        })
    ])
    return docs;
}