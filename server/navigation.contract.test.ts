import { describe, expect, it } from "vitest";
import { ADMIN_PATH, PUBLIC_LOGIN_PATH } from "../client/src/lib/navigation";

describe("public navigation contract", () => {
  it("keeps Entrar on the public login route", () => {
    expect(PUBLIC_LOGIN_PATH).toBe("/entrar");
    expect(PUBLIC_LOGIN_PATH).not.toBe(ADMIN_PATH);
  });

  it("keeps the admin route separate", () => {
    expect(ADMIN_PATH).toBe("/adm");
    expect(ADMIN_PATH).not.toBe(PUBLIC_LOGIN_PATH);
  });
});
