import { describe, expect, it } from "vitest";

describe("credenciais Cloudinary", () => {
  it("autentica na API administrativa sem expor chaves", async () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    expect(cloudName).toBeTruthy();
    expect(apiKey).toBeTruthy();
    expect(apiSecret).toBeTruthy();

    const authorization = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=1`, {
      headers: { Authorization: `Basic ${authorization}` },
      signal: AbortSignal.timeout(12_000),
    });

    expect(response.status).toBe(200);
  }, 15_000);
});
