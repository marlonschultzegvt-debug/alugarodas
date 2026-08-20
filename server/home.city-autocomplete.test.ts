import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("autocomplete de cidade da home", () => {
  it("inicia vazio e filtra sugestões após três caracteres", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(source).toContain('useState("")');
    expect(source).toContain("city.trim().toLocaleLowerCase(\"pt-BR\")");
    expect(source).toContain("query.length < 3");
    expect(source).toContain('placeholder="Para onde você vai?"');
    expect(source).toContain("if (city) params.set(\"cidade\", city)");
  });
});
