import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("instalação PWA", () => {
  it("usa ícones quadrados oficiais e diferencia prompt nativo de instrução manual", () => {
    const manifest = readFileSync(resolve(process.cwd(), "client/public/manifest.webmanifest"), "utf8");
    const prompt = readFileSync(resolve(process.cwd(), "client/src/components/PwaInstallPrompt.tsx"), "utf8");
    const main = readFileSync(resolve(process.cwd(), "client/src/main.tsx"), "utf8");
    const offline = readFileSync(resolve(process.cwd(), "client/public/offline.html"), "utf8");
    expect(manifest).toContain('"sizes": "192x192"');
    expect(manifest).toContain('"sizes": "512x512"');
    expect(manifest).toContain("files.manuscdn.com");
    expect(manifest).not.toContain("/manus-storage/");
    expect(prompt).toContain("installEvent.prompt()");
    expect(prompt).toContain("Adicionar à Tela de Início");
    expect(prompt).toContain("Fechar instruções");
    expect(main).toContain('navigator.serviceWorker.register("/sw.js", { scope: "/" })');
    expect(offline).not.toContain("/manus-storage/");
  });
});
