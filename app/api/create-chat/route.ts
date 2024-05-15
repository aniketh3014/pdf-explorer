import { db } from "@/db";
import { loadPdfIntoPinecone } from "@/db/pineconeDb";
import { chats } from "@/db/schema";
import { getUrl } from "@/lib/s3";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    const {userId} = await auth();
    if(!userId) {
        return NextResponse.json({ error: 'user not authenticated'});
    }
    try {
        const body = await req.json();
        const { file_key, file_name } = body;
        const url = await getUrl(file_key);
        console.log(file_key, file_name);
        await loadPdfIntoPinecone(file_key);
        const chatId = await db.insert(chats).values({
            fileKey: file_key,
            pdfName: file_name,
            pdfUrl: url,
            userId
        }).returning({
            insertedChatId: chats.id
        });
        return NextResponse.json({ 
            chatId: chatId[0].insertedChatId,
            pdfUrl: url
         }, {status: 200});    
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'error in create-chat route'});
    }
}