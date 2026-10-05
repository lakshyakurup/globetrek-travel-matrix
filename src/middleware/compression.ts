export async function compressResponse(body: Uint8Array, acceptEncoding: string | null): Promise<{ body: Uint8Array; encoding?: "gzip" | "deflate" }> {
  if (typeof CompressionStream === "undefined") return { body };
  const encoding = acceptEncoding?.includes("br") ? "gzip" : acceptEncoding?.includes("gzip") ? "gzip" : acceptEncoding?.includes("deflate") ? "deflate" : undefined;
  if (!encoding) return { body };
  const copy = new Uint8Array(body.byteLength); copy.set(body);
  const stream = new Blob([copy.buffer]).stream().pipeThrough(new CompressionStream(encoding));
  return { body: new Uint8Array(await new Response(stream).arrayBuffer()), encoding };
}
