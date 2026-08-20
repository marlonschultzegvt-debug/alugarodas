import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("fluxo de interesse do cliente", () => {
  it("cria lead persistente para veículo de marketplace e mantém o interesse do cliente", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/pages/VehicleDetails.tsx"), "utf8");
    const clientBranch = source.slice(source.indexOf('if (user?.role === "cliente"'));

    expect(clientBranch).toContain("leadMutation.mutateAsync");
    expect(clientBranch).toContain("persistentVehicle?.companyId");
    expect(clientBranch).toContain("interestMutation.mutateAsync");
  });
});
