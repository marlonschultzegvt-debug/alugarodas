// Aluga Rodas · Estrada Editorial
// Shell global: navegação pública, rotas de catálogo e atalhos de conversão.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Link, useLocation } from "wouter";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Search from "./pages/Search";
import VehicleDetails from "./pages/VehicleDetails";
import Advertise from "./pages/Advertise";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import PwaInstallPrompt from "./components/PwaInstallPrompt";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const nav = [
    ["Buscar veículos", "/buscar"],
    ["Carros para APP", "/buscar?finalidade=APP"],
    ["Elétricos", "/buscar?categoria=Elétrico"],
    ["Motos", "/buscar?categoria=Moto"],
    ["Como funciona", "/#como-funciona"],
  ];
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="Aluga Rodas, início">
          <img src="/manus-storage/aluga-rodas-mark-symbol_4da6fbec.png" alt="" className="brand-mark" />
          <span><strong>ALUGA</strong><em>RODAS</em><small>pra quem precisa rodar.</small></span>
        </Link>
        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Navegação principal">
          {nav.map(([label, href]) => <Link key={label} href={href} className={location === href ? "active" : ""} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link href="/dashboard" className="nav-login" onClick={() => setOpen(false)}>Entrar</Link>
          <Link href="/anunciar" className="nav-cta" onClick={() => setOpen(false)}>Anuncie seu veículo <ArrowRight size={16} /></Link>
        </nav>
        <button className="mobile-menu" onClick={() => setOpen((v) => !v)} aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}

function Router() {
  return <>
    <SiteHeader />
    <PwaInstallPrompt />
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/buscar" component={Search} />
      <Route path="/veiculo/:slug" component={VehicleDetails} />
      <Route path="/anunciar" component={Advertise} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    <footer className="site-footer"><div className="container footer-grid"><div><div className="footer-brand">ALUGA<span>RODAS</span></div><p>Pra quem precisa rodar.</p></div><div><strong>Para quem aluga</strong><a href="/buscar">Buscar veículos</a><a href="/buscar?finalidade=APP">Carros para APP</a><a href="/#como-funciona">Como funciona</a></div><div><strong>Para quem anuncia</strong><a href="/anunciar">Anuncie seu veículo</a><a href="/dashboard">Área do anunciante</a><a href="mailto:oi@alugarodas.com.br">Fale com a gente</a></div><div><strong>Aluga Rodas</strong><p className="footer-note">Um marketplace brasileiro para encontrar veículos disponíveis com mais clareza e contato direto.</p></div></div><div className="container footer-bottom"><span>© 2026 Aluga Rodas</span><span>Feito para quem precisa seguir em frente.</span></div></footer>
  </>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
