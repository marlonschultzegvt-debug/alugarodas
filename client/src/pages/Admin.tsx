import React from "react";
import { BarChart3, Building2, CarFront, CheckCircle2, Eye, Loader2, LogOut, PauseCircle, PlayCircle, ShieldCheck, Trash2, Users } from "lucide-react";
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
  const [selectedAdvertiser, setSelectedAdvertiser] = React.useState<{ name: string; type?: string | null; email?: string | null; phone?: string | null; whatsapp?: string | null; verified?: boolean | null } | null>(null);
  const statusMutation = trpc.admin.vehicleStatus.useMutation({
    onSuccess: () => void utils.admin.vehicles.invalidate(),
  });
  const deleteMutation = trpc.admin.vehicleDelete.useMutation({
    onSuccess: () => void utils.admin.vehicles.invalidate(),
  });
  const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
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
          <nav aria-label="Navegação administrativa">
            <button type="button" className="active" onClick={() => scrollToSection("visao-geral")}><BarChart3 size={17} /> Visão geral</button>
            <button type="button" onClick={() => scrollToSection("usuarios")}><Users size={17} /> Usuários</button>
            <button type="button" onClick={() => scrollToSection("anuncios")}><CheckCircle2 size={17} /> Anúncios</button>
            <button type="button" onClick={() => scrollToSection("seguranca")}><ShieldCheck size={17} /> Segurança</button>
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
                      <div className="admin-vehicle-actions"><Link href={`/veiculo/${vehicle.id}`} className="outline-button admin-action-button"><Eye size={14} /> Ver anúncio</Link><button type="button" className="outline-button admin-action-button" onClick={() => setSelectedAdvertiser(company ? { name: company.name, type: company.type, email: company.email, phone: company.phone, whatsapp: company.whatsapp, verified: company.verified } : { name: "Anunciante não informado" })}><Building2 size={14} /> Ver anunciante</button><button type="button" className="outline-button admin-status-button" disabled={statusMutation.isPending || deleteMutation.isPending} onClick={() => statusMutation.mutate({ vehicleId: vehicle.id, status: nextStatus })}>{statusMutation.isPending ? <Loader2 size={14} className="spin" /> : status === "active" ? <PauseCircle size={14} /> : <PlayCircle size={14} />}{status === "active" ? "Pausar" : "Ativar"}</button><button type="button" className="outline-button admin-delete-button" disabled={deleteMutation.isPending} onClick={() => { const confirmed = window.confirm(`Excluir o anúncio ${vehicle.brand} ${vehicle.model}? Esta ação remove o anúncio, fotos, favoritos e leads relacionados.`); if (confirmed) deleteMutation.mutate({ vehicleId: vehicle.id }); }}><Trash2 size={14} /> Excluir</button></div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
          {selectedAdvertiser && <div className="admin-advertiser-modal" role="dialog" aria-modal="true" aria-label="Detalhes do anunciante"><div className="admin-advertiser-card"><button type="button" className="modal-close" onClick={() => setSelectedAdvertiser(null)} aria-label="Fechar detalhes do anunciante">×</button><span className="eyebrow orange">ANUNCIANTE</span><h2>{selectedAdvertiser.name}</h2><p>{selectedAdvertiser.type === "locadora" ? "Locadora" : "Anunciante"}{selectedAdvertiser.verified ? " · Verificado" : ""}</p><dl>{selectedAdvertiser.email && <><dt>E-mail</dt><dd>{selectedAdvertiser.email}</dd></>}{selectedAdvertiser.phone && <><dt>Telefone</dt><dd>{selectedAdvertiser.phone}</dd></>}{selectedAdvertiser.whatsapp && <><dt>WhatsApp</dt><dd>{selectedAdvertiser.whatsapp}</dd></>}</dl><button type="button" className="primary-button" onClick={() => setSelectedAdvertiser(null)}>Fechar</button></div></div>}
        </section>
      </div>
    </main>
  );
}
