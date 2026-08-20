import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("instalação PWA", () => {
  it("usa ícones quadrados oficiais e diferencia prompt nativo de instrução manual", () => {
    const manifest = readFileSync(resolve(process.cwd(), "client/public/manifest.webmanifest"), "utf8");
    const prompt = readFileSync(resolve(process.cwd(), "client/src/components/PwaInstallPrompt.tsx"), "utf8");
    expect(manifest).toContain("aluga-rodas-icon-192_809a55a3.png");
    expect(manifest).toContain("aluga-rodas-icon-512_d9b6f500.png");
    expect(prompt).toContain("installEvent.prompt()");
    expect(prompt).toContain("Adicionar à Tela de Início");
    expect(prompt).toContain("Fechar instruções");
  });
});
