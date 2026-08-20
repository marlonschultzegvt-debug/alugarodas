import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import type { UserRole } from "../client/src/lib/access";

const authState = vi.hoisted(() => ({ role: "cliente" as UserRole }));
const adminQueryState = vi.hoisted(() => ({ status: "error" as "error" | "success" }));

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: 7, role: authState.role, name: "Usuário de teste" },
    loading: false,
  }),
}));

vi.mock("wouter", () => ({
  useLocation: () => ["/adm", vi.fn()],
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => <a href={href} {...props}>{children}</a>,
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    admin: {
      dashboard: {
        useQuery: () => adminQueryState.status === "success"
          ? { data: { ok: true, role: "admin", canManage: true }, isLoading: false, error: null }
          : { data: undefined, isLoading: false, error: new Error("FORBIDDEN") },
      },
      vehicles: {
        useQuery: () => ({ data: [], isLoading: false, error: null }),
      },
      vehicleStatus: {
        useMutation: () => ({ isPending: false, mutate: vi.fn() }),
      },
      vehicleDelete: {
        useMutation: () => ({ isPending: false, mutate: vi.fn() }),
      },
    },
    useUtils: () => ({ admin: { vehicles: { invalidate: vi.fn() } } }),
  },
}));

import AuthGuard from "../client/src/components/AuthGuard";
import Admin from "../client/src/pages/Admin";

function AdminChildren() {
  return <section data-testid="admin-metrics">Controle administrativo</section>;
}

describe("/adm AuthGuard render integration", () => {
  it.each([
    ["cliente", false],
    ["locador", false],
    ["admin", true],
  ] as const)("%s %s admin content", (role, allowed) => {
    authState.role = role;
    const html = renderToStaticMarkup(<AuthGuard roles={["admin"]}><AdminChildren /></AuthGuard>);
    if (allowed) {
      expect(html).toContain("admin-metrics");
      expect(html).toContain("Controle administrativo");
    } else {
      expect(html).toContain("Acesso restrito.");
      expect(html).not.toContain("admin-metrics");
      expect(html).not.toContain("Controle administrativo");
    }
  });
});

describe("/adm server authorization integration", () => {
  it("does not expose administrative confirmation when admin.dashboard fails", () => {
    authState.role = "admin";
    adminQueryState.status = "error";
    const html = renderToStaticMarkup(<Admin />);
    expect(html).toContain("A sessão não foi autorizada pelo servidor");
    expect(html).not.toContain("Sessão administrativa confirmada");
    expect(html).not.toContain("<strong>Ativa</strong>");
    expect(html).not.toContain("metric-grid");
    expect(html).not.toContain("Aguardando dados reais");
  });
});
