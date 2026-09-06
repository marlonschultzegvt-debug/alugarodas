import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("atalhos compactos da home", () => {
  it("mantém cinco categorias em uma faixa compacta com ícones semânticos", () => {
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

    expect(home).toContain("Bike");
    expect(home).toContain("CalendarDays");
    expect(styles).toContain("grid-template-columns: repeat(5, minmax(0, 1fr))");
    expect(styles).toContain("min-height: 72px");
    expect(styles).toContain("scroll-snap-type: x proximity");
  });
});
