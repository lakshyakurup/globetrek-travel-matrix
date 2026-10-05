import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
const algorithm = "aes-256-gcm";
export function encrypt(value: string, key: Uint8Array): string {
  if (key.byteLength !== 32) throw new Error("AES-256 keys must be 32 bytes");
  const iv = randomBytes(12); const cipher = createCipheriv(algorithm, key, iv); const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]); const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64url");
}
export function decrypt(payload: string, key: Uint8Array): string {
  if (key.byteLength !== 32) throw new Error("AES-256 keys must be 32 bytes");
  const data = Buffer.from(payload, "base64url"); const decipher = createDecipheriv(algorithm, key, data.subarray(0, 12)); decipher.setAuthTag(data.subarray(12, 28)); return Buffer.concat([decipher.update(data.subarray(28)), decipher.final()]).toString("utf8");
}
