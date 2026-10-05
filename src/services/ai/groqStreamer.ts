export interface GroqStreamerOptions { apiKey: string; model?: string; baseUrl?: string; }
export interface ChatMessage { role: "system" | "user" | "assistant"; content: string; }
export class GroqStreamer {
  constructor(private readonly options: GroqStreamerOptions) {}
  async *stream(messages: ChatMessage[], signal?: AbortSignal): AsyncGenerator<string> {
    const response = await fetch(`${this.options.baseUrl ?? "https://api.groq.com/openai/v1"}/chat/completions`, {
      method: "POST", headers: { Authorization: `Bearer ${this.options.apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: this.options.model ?? "llama-3.3-70b-versatile", messages, stream: true }), signal,
    });
    if (!response.ok || !response.body) throw new Error(`Groq request failed: ${response.status}`);
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      buffer += decoder.decode(chunk.value, { stream: true });
      const lines = buffer.split("\n"); buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ") || line === "data: [DONE]") continue;
        const parsed = JSON.parse(line.slice(6)) as { choices?: Array<{ delta?: { content?: string } }> };
        if (parsed.choices?.[0]?.delta?.content) yield parsed.choices[0].delta.content;
      }
    }
  }
}
