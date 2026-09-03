import { describe, expect, it, vi } from "vitest";
import { securityHeaders } from "./_core/security";

describe("securityHeaders", () => {
  it("applies browser hardening headers on HTTPS requests", () => {
    const setHeader = vi.fn();
    const next = vi.fn();
    securityHeaders(
      { secure: true, header: vi.fn() } as any,
      { setHeader } as any,
      next,
    );

    expect(setHeader).toHaveBeenCalledWith("X-Content-Type-Options", "nosniff");
    expect(setHeader).toHaveBeenCalledWith("X-Frame-Options", "SAMEORIGIN");
    expect(setHeader).toHaveBeenCalledWith("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    expect(next).toHaveBeenCalledOnce();
  });
});
