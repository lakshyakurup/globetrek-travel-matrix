export interface UploadObject { bucket: string; key: string; body: Uint8Array; contentType: string; }
export interface S3UploaderOptions { endpoint: string; accessKeyId: string; secretAccessKey: string; }
export class S3Uploader {
  constructor(private readonly options: S3UploaderOptions) {}
  async upload(object: UploadObject): Promise<{ key: string; etag: string | null }> {
    const copy = new Uint8Array(object.body.byteLength); copy.set(object.body);
    const response = await fetch(`${this.options.endpoint.replace(/\/$/, "")}/${object.bucket}/${encodeURIComponent(object.key)}`, { method: "PUT", headers: { "Content-Type": object.contentType, "Content-Length": String(object.body.byteLength), "X-Access-Key": this.options.accessKeyId }, body: copy.buffer });
    if (!response.ok) throw new Error(`Object upload failed: ${response.status}`);
    return { key: object.key, etag: response.headers.get("etag") };
  }
}
