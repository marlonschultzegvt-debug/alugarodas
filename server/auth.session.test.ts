import { describe, expect, it } from "vitest";
import { sdk } from "./_core/sdk";

describe("local session contract", () => {
  it("signs and verifies a local-password session", async () => {
    const token = await sdk.signSession({
      openId: "local_test_user",
      appId: "local-password",
      name: "Teste Aluga Rodas",
    }, { expiresInMs: 60_000 });
    const session = await sdk.verifySession(token);
    expect(session).toMatchObject({ openId: "local_test_user", appId: "local-password", name: "Teste Aluga Rodas" });
  });

  it("rejects an invalid local session", async () => {
    await expect(sdk.verifySession("invalid.token.value")).resolves.toBeNull();
  });
});
