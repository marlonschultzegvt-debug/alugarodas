import React from "react";
import { BarChart3, CarFront, CheckCircle2, ShieldCheck, Users } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function Admin() {
  const dashboardQuery = trpc.admin.dashboard.useQuery();
  const serverAuthorized = dashboardQuery.data?.canManage === true;
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
            <div>
              <strong>Aluga Rodas</strong>
              <span> administração</span>
            </div>
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
            <Link href="/" className="outline-button">Ver site público</Link>
          </div>

          {!dashboardQuery.error && (
            <div className="metric-grid">
              <div><span><Users size={17} /> Usuários</span><strong>—</strong><em className="neutral">Aguardando dados reais</em></div>
              <div><span><CarFront size={17} /> Anúncios</span><strong>—</strong><em className="neutral">Aguardando dados reais</em></div>
              <div><span><BarChart3 size={17} /> Leads</span><strong>—</strong><em className="neutral">Aguardando dados reais</em></div>
              <div id="seguranca"><span><ShieldCheck size={17} /> Segurança</span><strong>{securityLabel}</strong><em className={serverAuthorized ? "" : "neutral"}><CheckCircle2 size={14} /> {securityNote}</em></div>
            </div>
          )}

          <div className="dashboard-panel" id="usuarios">
            <div className="panel-heading">
              <div>
                <span className="eyebrow orange">PRÓXIMA CAMADA</span>
                <h2>Moderação e operações</h2>
              </div>
            </div>
            <p className="admin-placeholder">
              {dashboardQuery.isLoading
                ? "Confirmando a autorização administrativa antes de carregar operações."
                : dashboardQuery.error
                  ? "A sessão não foi autorizada pelo servidor. Nenhum dado administrativo foi carregado."
                  : "A estrutura de acesso administrativo está protegida. A próxima etapa conecta os usuários, veículos e leads reais ao painel, sem dados demonstrativos."}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
