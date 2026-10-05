import { createHmac } from "node:crypto";
export interface RazorpayOptions { keyId: string; keySecret: string; baseUrl?: string; }
export class RazorpayService {
  constructor(private readonly options: RazorpayOptions) {}
  async createOrder(amountPaise: number, currency = "INR", receipt: string): Promise<unknown> {
    const credentials = Buffer.from(`${this.options.keyId}:${this.options.keySecret}`).toString("base64");
    const response = await fetch(`${this.options.baseUrl ?? "https://api.razorpay.com/v1"}/orders`, { method: "POST", headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/json" }, body: JSON.stringify({ amount: amountPaise, currency, receipt }) });
    if (!response.ok) throw new Error(`Razorpay order failed: ${response.status}`);
    return response.json();
  }
  verifyPayment(orderId: string, paymentId: string, signature: string): boolean {
    const expected = createHmac("sha256", this.options.keySecret).update(`${orderId}|${paymentId}`).digest("hex");
    return expected === signature;
  }
}
