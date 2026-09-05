import { afterEach, describe, expect, it } from "vitest";
import { getStorageProvider } from "./storage";

const original = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

afterEach(() => {
  process.env.CLOUDINARY_CLOUD_NAME = original.cloudName;
  process.env.CLOUDINARY_API_KEY = original.apiKey;
  process.env.CLOUDINARY_API_SECRET = original.apiSecret;
});

describe("configuração de armazenamento externo", () => {
  it("prioriza Cloudinary somente quando as três credenciais estão presentes", () => {
    process.env.CLOUDINARY_CLOUD_NAME = "aluga-rodas";
    process.env.CLOUDINARY_API_KEY = "key";
    process.env.CLOUDINARY_API_SECRET = "secret";
    expect(getStorageProvider()).toBe("cloudinary");

    delete process.env.CLOUDINARY_API_SECRET;
    expect(getStorageProvider()).not.toBe("cloudinary");
  });
});
