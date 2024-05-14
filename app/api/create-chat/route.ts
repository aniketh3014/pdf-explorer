import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { file_key, file_name } = body;
        console.log(file_key, file_name);
        return NextResponse.json({ success: 'success in create-chat route'});
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'error in create-chat route'});
    }
}