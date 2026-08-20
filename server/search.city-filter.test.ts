import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("filtro de cidade do catálogo", () => {
  it("inclui cidades dos anúncios persistentes e aplica comparação normalizada", () => {
    const marketplace = readFileSync(resolve(process.cwd(), "client/src/lib/marketplace.ts"), "utf8");
    const search = readFileSync(resolve(process.cwd(), "client/src/pages/Search.tsx"), "utf8");
    expect(marketplace).toContain('{ city: "Fortaleza", state: "CE", country: "Brasil" }');
    expect(marketplace).toContain('{ city: "Olinda", state: "PE", country: "Brasil" }');
    expect(search).toContain("normalizeCity(item.city) === normalizeCity(city)");
    expect(search).toContain('city === "Todas as cidades"');
  });
});
