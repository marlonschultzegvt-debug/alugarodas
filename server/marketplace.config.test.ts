import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const context: TrpcContext = {
  user: null,
  req: { protocol: "https", headers: {} } as TrpcContext["req"],
  res: {} as TrpcContext["res"],
};

describe("marketplace backend configuration", () => {
  it("keeps the public vehicle endpoint callable after enabling the marketplace", async () => {
    const result = await appRouter.createCaller(context).marketplace.vehicles({});
    expect(Array.isArray(result)).toBe(true);
  });
});
