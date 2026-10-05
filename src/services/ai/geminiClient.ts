export interface GeminiClientOptions { apiKey: string; model?: string; baseUrl?: string; }
export interface GeminiResponse { text: string; raw: unknown; }
export class GeminiClient {
  private readonly model: string;
  private readonly baseUrl: string;
  constructor(private readonly options: GeminiClientOptions) {
    this.model = options.model ?? "gemini-2.0-flash";
    this.baseUrl = options.baseUrl ?? "https://generativelanguage.googleapis.com/v1beta";
  }
  async generate(prompt: string, signal?: AbortSignal): Promise<GeminiResponse> {
    const response = await fetch(`${this.baseUrl}/models/${this.model}:generateContent?key=${encodeURIComponent(this.options.apiKey)}`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }), signal,
    });
    if (!response.ok) throw new Error(`Gemini request failed: ${response.status}`);
    const raw = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
    return { text: raw.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("") ?? "", raw };
  }
}
