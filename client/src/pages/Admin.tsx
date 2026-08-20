import React from "react";
import { BarChart3, CarFront, CheckCircle2, Loader2, LogOut, PauseCircle, PlayCircle, ShieldCheck, Users } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

type VehicleStatus = "draft" | "active" | "paused" | "rented";

const statusLabel: Record<VehicleStatus, string> = {
  draft: "Em análise",
  active: "Ativo",
  paused: "Pausado",
  rented: "Alugado",
};

export default function Admin() {
  const { logout } = useAuth();
  const dashboardQuery = trpc.admin.dashboard.useQuery();
  const serverAuthorized = dashboardQuery.data?.canManage === true;
  const vehiclesQuery = trpc.admin.vehicles.useQuery(undefined, { enabled: serverAuthorized });
  const utils = trpc.useUtils();
  const statusMutation = trpc.admin.vehicleStatus.useMutation({
    onSuccess: () => void utils.admin.vehicles.invalidate(),
  });
  const securityLabel = dashboardQuery.isLoading
    ? "Verificando"
    : serverAuthorized
      ? "Ativa"
      : "Requer atenção";
  const securityNote = dashboardQuery.isLoading
    ? "Validando autorização no servidor"
    : serverAuthorized
      ? "Sessão administrativa confirmada"
      : "Não foi possível confirmar a autorização";

  return (
    <main className="dashboard-page">
      <div className="container dashboard-layout">
        <aside className="dashboard-sidebar">
          <div className="dashboard-profile">
            <span className="avatar">AR</span>
            <div><strong>Aluga Rodas</strong><span> administração</span></div>
          </div>
          <nav>
            <a className="active" href="#visao-geral"><BarChart3 size={17} /> Visão geral</a>
            <a href="#usuarios"><Users size={17} /> Usuários</a>
            <a href="#anuncios"><CheckCircle2 size={17} /> Anúncios</a>
            <a href="#seguranca"><ShieldCheck size={17} /> Segurança</a>
          </nav>
        </aside>

        <section className="dashboard-main" id="visao-geral">
          <div className="dashboard-heading">
            <div>
              <span className="eyebrow orange">ADMINISTRAÇÃO</span>
              <h1>Visão da plataforma.</h1>
              <p>Modere usuários, anúncios e sinais de confiança do marketplace.</p>
            </div>
            <div className="admin-heading-actions"><Link href="/" className="outline-button">Ver site público</Link><button type="button" className="outline-button" onClick={() => void logout()}><LogOut size={15} /> Sair</button></div>
          </div>

          {!dashboardQuery.error && (
            <div className="metric-grid">
              <div><span><Users size={17} /> Usuários</span><strong>—</strong><em className="neutral">Dados de usuários</em></div>
              <div><span><CarFront size={17} /> Anúncios</span><strong>{vehiclesQuery.data?.length ?? "—"}</strong><em className="neutral">Inventário total</em></div>
              <div><span><BarChart3 size={17} /> Leads</span><strong>—</strong><em className="neutral">Métricas de leads</em></div>
              <div id="seguranca"><span><ShieldCheck size={17} /> Segurança</span><strong>{securityLabel}</strong><em className={serverAuthorized ? "" : "neutral"}><CheckCircle2 size={14} /> {securityNote}</em></div>
            </div>
          )}

          <div className="dashboard-panel" id="usuarios">
            <div className="panel-heading"><div><span className="eyebrow orange">OPERAÇÕES</span><h2>Moderação de anúncios</h2></div></div>
            {dashboardQuery.isLoading && <p className="admin-placeholder">Confirmando a autorização administrativa antes de carregar operações.</p>}
            {dashboardQuery.error && <p className="admin-placeholder">A sessão não foi autorizada pelo servidor. Nenhum dado administrativo foi carregado.</p>}
            {serverAuthorized && vehiclesQuery.isLoading && <p className="admin-placeholder"><Loader2 size={15} className="spin" /> Carregando anúncios reais.</p>}
            {serverAuthorized && vehiclesQuery.error && <p className="admin-placeholder">Não foi possível carregar os anúncios. Tente novamente.</p>}
            {serverAuthorized && !vehiclesQuery.isLoading && !vehiclesQuery.error && vehiclesQuery.data?.length === 0 && <p className="admin-placeholder">Nenhum anúncio cadastrado ainda.</p>}
            {serverAuthorized && vehiclesQuery.data && vehiclesQuery.data.length > 0 && (
              <div className="admin-vehicle-list" id="anuncios">
                {vehiclesQuery.data.map(({ vehicle, company }) => {
                  const status = vehicle.status as VehicleStatus;
                  const nextStatus: VehicleStatus = status === "active" ? "paused" : "active";
                  return (
                    <article className="admin-vehicle-row" key={vehicle.id}>
                      <div className="admin-vehicle-copy">
                        <strong>{vehicle.brand} {vehicle.model}</strong>
                        <span>{vehicle.city} - {vehicle.state} · {company?.name ?? "Locadora não informada"}</span>
                        <small className={`status-chip status-${status}`}>{statusLabel[status]}</small>
                      </div>
                      <button type="button" className="outline-button admin-status-button" disabled={statusMutation.isPending} onClick={() => statusMutation.mutate({ vehicleId: vehicle.id, status: nextStatus })}>
                        {statusMutation.isPending ? <Loader2 size={14} className="spin" /> : status === "active" ? <PauseCircle size={14} /> : <PlayCircle size={14} />}
                        {status === "active" ? "Pausar" : "Ativar"}
                      </button>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
