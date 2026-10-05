import { AuthenticationError } from "@/src/core/errors";

export interface JwtClaims { sub: string; exp?: number; iat?: number; [key: string]: unknown; }
export type JwtVerifier = (token: string) => Promise<JwtClaims>;

export async function authenticateBearer(header: string | null | undefined, verify: JwtVerifier): Promise<JwtClaims> {
  if (!header?.startsWith("Bearer ")) throw new AuthenticationError("Bearer token required");
  const token = header.slice(7).trim();
  if (!token) throw new AuthenticationError("Bearer token is empty");
  const claims = await verify(token);
  if (!claims.sub || (claims.exp !== undefined && claims.exp <= Math.floor(Date.now() / 1000))) throw new AuthenticationError("Token is invalid or expired");
  return claims;
}
