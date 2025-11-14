import ollama from 'ollama';
import OpenAI from 'openai';
import 'dotenv/config';

export type ChatMessage = {
    role: 'system' | 'user' | 'assistant';
    content: string;
};

export interface ChatClient {
    chat(messages: ChatMessage[]): Promise<string>;
}

export function createChatClient(): ChatClient {
    const provider = process.env.CHAT_CLIENT;
    if (!provider) throw new Error('Missing CHAT_CLIENT environment variable');

    if (provider === 'openai') {
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) throw new Error('Missing OPENAI_API_KEY');
        const model = process.env.OPENAI_MODEL;
        if (!model) throw new Error('Missing OPENAI_MODEL');

        return new OpenAIChatClient(new OpenAI({ apiKey }), model);
    }

    const ollamaModel = process.env.OLLAMA_LANGUAGE_MODEL;
    if (!ollamaModel) throw new Error('Missing OLLAMA_LANGUAGE_MODEL');

    return new OllamaChatClient(ollamaModel);
}

export class OllamaChatClient implements ChatClient {
    constructor(private model: string) {}

    async chat(messages: ChatMessage[]): Promise<string> {
        const stream = await ollama.chat({
            model: this.model,
            messages,
            stream: false,
        });
        return stream.message.content || '[Nema odgovora]';
    }
}

export class OpenAIChatClient implements ChatClient {
    constructor(private openai: OpenAI, private model: string) {}

    async chat(messages: ChatMessage[]): Promise<string> {
        const response: any = await this.openai.responses.create({
            model: this.model,
            input: messages,
        });
        return response.output_text || '[Nema odgovora]';
    }
}
