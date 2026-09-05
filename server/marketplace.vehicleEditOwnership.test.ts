import { describe, expect, it, vi } from "vitest";

const { getVehicleById, updateVehicle, deleteVehicleImage, setVehicleImageCover } = vi.hoisted(() => ({
  getVehicleById: vi.fn().mockResolvedValue({ id: 77, companyId: 99, company: { id: 99, ownerUserId: 2 } }),
  updateVehicle: vi.fn(),
  deleteVehicleImage: vi.fn(),
  setVehicleImageCover: vi.fn(),
}));

vi.mock("./db", () => ({
  getVehicleById,
  updateVehicle,
  deleteVehicleImage,
  setVehicleImageCover,
  getCompanyById: vi.fn(),
  createVehicle: vi.fn(),
  listVehicleImages: vi.fn(),
  createVehicleImage: vi.fn(),
  listVehicles: vi.fn(),
  recordVehicleView: vi.fn(),
  listCompaniesByOwner: vi.fn(),
  getPublisherDashboard: vi.fn(),
  createCompany: vi.fn(),
  createLead: vi.fn(),
  deleteLeadForOwner: vi.fn(),
  getClientArea: vi.fn(),
  saveFavorite: vi.fn(),
  removeFavorite: vi.fn(),
  createClientInterest: vi.fn(),
  getUserByEmail: vi.fn(),
  createLocalUser: vi.fn(),
  invalidateLocalSessions: vi.fn(),
  updateLocalPassword: vi.fn(),
  updateLocalPhone: vi.fn(),
  upsertUser: vi.fn(),
  listAdminVehicles: vi.fn(),
  updateVehicleStatus: vi.fn(),
  updateVehicleFeatured: vi.fn(),
  deleteAdminVehicle: vi.fn(),
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const caller = appRouter.createCaller({
  user: { id: 1, openId: "locador-1", email: "locador@example.com", name: "Locador", loginMethod: "password", role: "locador", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
  req: { protocol: "https", headers: {} }, res: {},
} as TrpcContext);

describe("vehicle edit ownership", () => {
  const updates = { vehicleId: 77, brand: "Renault", model: "Kwid", year: 2024, category: "carro" as const, fuel: "flex" as const, transmission: "manual" as const, state: "PR", city: "Curitiba", description: "Veículo disponível para trabalho e uso pessoal." };

  it("rejects update of a vehicle owned by another locador", async () => {
    await expect(caller.marketplace.vehicleUpdate(updates)).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(updateVehicle).not.toHaveBeenCalled();
  });

  it("rejects image deletion and cover changes on another locador vehicle", async () => {
    await expect(caller.marketplace.vehicleImageDelete({ vehicleId: 77, imageId: 10 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    await expect(caller.marketplace.vehicleImageCover({ vehicleId: 77, imageId: 10 })).rejects.toMatchObject({ code: "FORBIDDEN" });
    expect(deleteVehicleImage).not.toHaveBeenCalled();
    expect(setVehicleImageCover).not.toHaveBeenCalled();
  });

  it("allows a locador to update a vehicle owned by their company", async () => {
    getVehicleById.mockResolvedValueOnce({ id: 77, companyId: 1, company: { id: 1, ownerUserId: 1 } });
    updateVehicle.mockResolvedValueOnce(77);
    await expect(caller.marketplace.vehicleUpdate(updates)).resolves.toBe(77);
    expect(updateVehicle).toHaveBeenCalledWith(77, expect.objectContaining({ brand: "Renault", city: "Curitiba" }));
  });
});
