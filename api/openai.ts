// services/OpenAIService.ts

import {
    ChatCompletion,
    OpenAICompletionsBody
} from "@/types/openAI";

const BASE_URL = "https://api.openai.com/v1/chat/completions";

export class OpenAIService {
    // Don't hardcode this—use env or server!
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async sendMessage(
        body: OpenAICompletionsBody
    ): Promise<ChatCompletion> {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenAI error: ${errorText}`);
        }

        const json = (await response.json()) as ChatCompletion;
        return json;
    }
}
