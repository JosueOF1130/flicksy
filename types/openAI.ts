
export interface Message {
    role: string;
    content: string;
}

export interface OpenAICompletionsBody {
    model: string;
    messages: Message[];
    temperature?: number;
}

export interface Choice {
    index: number;
    message: Message;
    logprobs?: string | null;
    finish_reason: string;
}

export interface Usage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
}

export interface ChatCompletion {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Choice[];
    usage: Usage;
    system_fingerprint?: string;
}