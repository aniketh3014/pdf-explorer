import { error } from 'console';
import {OpenAIApi, Configuration} from 'openai-edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config);

export const getEmbedding = async (text: string) => {
    try {
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: text.replace(/(\r\n|\n|\r)/gm, " ")
        })
        const res = await response.json();
        return res.data[0].embedding as number[];
    } catch(error) {
        console.error("error in openaiApi",error);
    }
}