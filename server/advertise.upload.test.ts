import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context: TrpcContext = {
  user: { id: 902, openId: "locador-test", name: "Locador QA", email: "qa@example.com", role: "locador", loginMethod: "oauth", createdAt: new Date(), updatedAt: new Date() },
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("advertiser image upload contract", () => {
  it("rejects unsupported file types before touching storage", async () => {
    await expect(appRouter.createCaller(context).marketplace.vehicleImageUpload({
      vehicleId: 1,
      fileName: "document.pdf",
      contentType: "application/pdf" as never,
      data: "a".repeat(32),
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});
