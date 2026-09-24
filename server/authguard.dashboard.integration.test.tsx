import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/_core/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: 7, role: "cliente", name: "Cliente de teste" },
    loading: false,
  }),
}));

vi.mock("wouter", () => ({
  useLocation: () => ["/dashboard", vi.fn()],
}));

import AuthGuard from "../client/src/components/AuthGuard";
import { dashboardRouteRoles } from "../client/src/lib/access";

function DashboardChildren() {
  return <section data-testid="dashboard-metrics">Visualizações 1.284</section>;
}

describe("/dashboard AuthGuard render integration", () => {
  it("renders dashboard metrics for cliente-anunciante", () => {
    const html = renderToStaticMarkup(<AuthGuard roles={dashboardRouteRoles}><DashboardChildren /></AuthGuard>);
    expect(html).toContain("dashboard-metrics");
    expect(html).toContain("1.284");
  });
});
