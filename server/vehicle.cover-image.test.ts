import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("capa do anúncio", () => {
  it("prioriza a capa enviada e permite escolher outra foto", () => {
    const advertise = readFileSync(resolve(process.cwd(), "client/src/pages/Advertise.tsx"), "utf8");
    const search = readFileSync(resolve(process.cwd(), "client/src/pages/Search.tsx"), "utf8");
    expect(advertise).toContain("coverPhotoIndex");
    expect(advertise).toContain("orderedPhotos");
    expect(advertise).toContain("Usar como capa");
    expect(search).toContain("item.coverImageUrl");
  });
});
