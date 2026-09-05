// Storage adapter: Manus Forge is available in the managed preview, while the
// Render deployment uses Cloudinary once its production credentials are set.
import { createHash } from "node:crypto";
import { ENV } from "./_core/env";

type StorageProvider = "cloudinary" | "forge" | "unconfigured";

type CloudinaryConfig = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

function getCloudinaryConfig(): CloudinaryConfig | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim() ?? "";
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim() ?? "";
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim() ?? "";
  return cloudName && apiKey && apiSecret ? { cloudName, apiKey, apiSecret } : null;
}

export function getStorageProvider(): StorageProvider {
  if (getCloudinaryConfig()) return "cloudinary";
  if (ENV.forgeApiUrl && ENV.forgeApiKey) return "forge";
  return "unconfigured";
}

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "");
}

function appendHashSuffix(relKey: string): string {
  const hash = crypto.randomUUID().replace(/-/g, "").slice(0, 8);
  const lastDot = relKey.lastIndexOf(".");
  if (lastDot === -1) return `${relKey}_${hash}`;
  return `${relKey.slice(0, lastDot)}_${hash}${relKey.slice(lastDot)}`;
}

function toBlob(data: Buffer | Uint8Array | string, contentType: string) {
  if (typeof data === "string") return new Blob([data], { type: contentType });
  const copiedBytes = new Uint8Array(data);
  return new Blob([copiedBytes.buffer], { type: contentType });
}

async function uploadToCloudinary(
  data: Buffer | Uint8Array | string,
  contentType: string,
): Promise<{ key: string; url: string }> {
  const config = getCloudinaryConfig();
  if (!config) throw new Error("Cloudinary não está configurado.");

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "aluga-rodas/vehicles";
  const signature = createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${config.apiSecret}`)
    .digest("hex");
  const form = new FormData();
  form.set("file", toBlob(data, contentType), "vehicle-image");
  form.set("folder", folder);
  form.set("timestamp", String(timestamp));
  form.set("api_key", config.apiKey);
  form.set("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const body = await response.json().catch(() => ({})) as { secure_url?: string; public_id?: string; error?: { message?: string } };
  if (!response.ok || !body.secure_url || !body.public_id) {
    throw new Error(`Falha ao enviar imagem ao armazenamento externo${body.error?.message ? `: ${body.error.message}` : ""}.`);
  }
  return { key: body.public_id, url: body.secure_url };
}

async function uploadToForge(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType: string,
): Promise<{ key: string; url: string }> {
  const forgeUrl = ENV.forgeApiUrl;
  const forgeKey = ENV.forgeApiKey;
  if (!forgeUrl || !forgeKey) throw new Error("Armazenamento interno não está configurado.");

  const key = appendHashSuffix(normalizeKey(relKey));
  const presignUrl = new URL("v1/storage/presign/put", `${forgeUrl.replace(/\/+$/, "")}/`);
  presignUrl.searchParams.set("path", key);
  const presignResponse = await fetch(presignUrl, { headers: { Authorization: `Bearer ${forgeKey}` } });
  if (!presignResponse.ok) throw new Error("Não foi possível preparar o envio da imagem.");
  const { url: uploadUrl } = await presignResponse.json() as { url?: string };
  if (!uploadUrl) throw new Error("Armazenamento interno não retornou uma URL de envio.");

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: toBlob(data, contentType),
  });
  if (!uploadResponse.ok) throw new Error("Não foi possível enviar a imagem.");
  return { key, url: `/manus-storage/${key}` };
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream",
): Promise<{ key: string; url: string }> {
  const provider = getStorageProvider();
  if (provider === "cloudinary") return uploadToCloudinary(data, contentType);
  if (provider === "forge") return uploadToForge(relKey, data, contentType);
  throw new Error("O envio de fotos ainda não está configurado no servidor de produção.");
}

export async function storageGet(relKey: string): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return { key, url: `/manus-storage/${key}` };
}
