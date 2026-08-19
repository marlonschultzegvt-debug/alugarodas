import { describe, expect, it } from "vitest";
import { SUPPORT_EMAIL, SUPPORT_MAILTO } from "../client/src/lib/contact";

describe("official support contact", () => {
  it("uses the verified Zoho support address", () => {
    expect(SUPPORT_EMAIL).toBe("suporte@alugarodas.com.br");
    expect(SUPPORT_MAILTO).toBe("mailto:suporte@alugarodas.com.br");
  });
});
