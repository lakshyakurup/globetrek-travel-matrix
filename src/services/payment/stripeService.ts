import { createHmac, timingSafeEqual } from "node:crypto";
export interface CheckoutRequest { amountCents: number; currency: string; successUrl: string; cancelUrl: string; metadata?: Record<string, string>; }
export interface StripeServiceOptions { secretKey: string; webhookSecret: string; apiBaseUrl?: string; }
export class StripeService {
  constructor(private readonly options: StripeServiceOptions) {}
  async createCheckout(request: CheckoutRequest): Promise<unknown> {
    const response = await fetch(`${this.options.apiBaseUrl ?? "https://api.stripe.com/v1"}/checkout/sessions`, {
      method: "POST", headers: { Authorization: `Bearer ${this.options.secretKey}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ mode: "payment", success_url: request.successUrl, cancel_url: request.cancelUrl, "line_items[0][price_data][currency]": request.currency, "line_items[0][price_data][product_data][name]": "Globetrek booking", "line_items[0][price_data][unit_amount]": String(request.amountCents), "line_items[0][quantity]": "1" }),
    });
    if (!response.ok) throw new Error(`Stripe checkout failed: ${response.status}`);
    return response.json();
  }
  verifyWebhook(payload: string, signature: string): boolean {
    const timestamp = signature.match(/t=(\d+)/)?.[1]; const digest = signature.match(/v1=([a-f0-9]+)/)?.[1];
    if (!timestamp || !digest || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
    const expected = createHmac("sha256", this.options.webhookSecret).update(`${timestamp}.${payload}`).digest("hex");
    return digest.length === expected.length && timingSafeEqual(Buffer.from(digest), Buffer.from(expected));
  }
}
