// Aluga Rodas · Estrada Editorial
// Shell global: navegação pública, rotas de catálogo e atalhos de conversão.
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Link, useLocation } from "wouter";
import { ArrowRight, Menu, X } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
const Home = lazy(() => import("./pages/Home"));
const Search = lazy(() => import("./pages/Search"));
const VehicleDetails = lazy(() => import("./pages/VehicleDetails"));
const Advertise = lazy(() => import("./pages/Advertise"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Admin = lazy(() => import("./pages/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const ClientArea = lazy(() => import("./pages/ClientArea"));
import AuthGuard from "./components/AuthGuard";
import PwaInstallPrompt from "./components/PwaInstallPrompt";
import { dashboardRouteRoles, rolePath, type UserRole } from "./lib/access";
import { SUPPORT_MAILTO } from "./lib/contact";
import { PUBLIC_LOGIN_PATH } from "./lib/navigation";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  const { user } = useAuth();
  const accountPath = rolePath(user?.role as UserRole | undefined);
  const nav = [
    ["Buscar veículos", "/buscar"],
    ["Carros para APP", "/buscar?finalidade=APP"],
    ["Elétricos", "/buscar?categoria=Elétrico"],
    ["Motos", "/buscar?categoria=Moto"],
    ["Como funciona", "/#como-funciona"],
  ];
  // make sure to consider if you need authentication for certain routes
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" onClick={() => setOpen(false)} aria-label="Aluga Rodas, início">
          <img src="/manus-storage/aluga-rodas-mark-symbol_4da6fbec.png" alt="" className="brand-mark" />
          <span><strong>ALUGA</strong><em>RODAS</em><small>pra quem precisa rodar.</small></span>
        </Link>
        <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Navegação principal">
          {nav.map(([label, href]) => <Link key={label} href={href} className={location === href ? "active" : ""} onClick={() => setOpen(false)}>{label}</Link>)}
          <a href={user ? accountPath : PUBLIC_LOGIN_PATH} className="nav-login" onClick={() => setOpen(false)}>{user ? "Minha área" : "Entrar"}</a>
          <Link href="/anunciar" className="nav-cta" onClick={() => setOpen(false)}>Anuncie seu veículo <ArrowRight size={16} /></Link>
        </nav>
        <button className="mobile-menu" onClick={() => setOpen((v) => !v)} aria-label={open ? "Fechar menu" : "Abrir menu"}>{open ? <X /> : <Menu />}</button>
      </div>
    </header>
  );
}

function SignupRoleSync() {
  const { user } = useAuth();
  const syncRole = trpc.auth.setSignupRole.useMutation();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (!user || typeof window === "undefined") return;
    const intent = window.localStorage.getItem("aluga_signup_intent");
    if (intent !== "cliente" && intent !== "locador") return;
    if (user.role === "admin") {
      window.localStorage.removeItem("aluga_signup_intent");
      return;
    }
    syncRole.mutate({ role: intent }, {
      onSuccess: () => {
        window.localStorage.removeItem("aluga_signup_intent");
        void utils.auth.me.invalidate();
      },
    });
  }, [syncRole, user, utils]);

  return null;
}

function Router() {
  return <>
    <Suspense fallback={<main className="route-loading" aria-live="polite">Carregando Aluga Rodas…</main>}>
    <SiteHeader />
    <SignupRoleSync />
    <PwaInstallPrompt />
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/buscar" component={Search} />
      <Route path="/veiculo/:slug" component={VehicleDetails} />
      <Route path="/anunciar"><AuthGuard roles={["admin", "locador"]}><Advertise /></AuthGuard></Route>
      <Route path="/entrar" component={Login} />
      <Route path="/cadastre-se" component={SignUp} />
      <Route path="/cliente"><AuthGuard roles={["cliente", "user"]}><ClientArea /></AuthGuard></Route>
      <Route path="/adm"><AuthGuard roles={["admin"]}><Admin /></AuthGuard></Route>
      <Route path="/admin"><AuthGuard roles={["admin"]}><Admin /></AuthGuard></Route>
      <Route path="/dashboard"><AuthGuard roles={dashboardRouteRoles}><Dashboard /></AuthGuard></Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
    </Suspense>
    <footer className="site-footer"><div className="container footer-grid"><div><div className="footer-brand">ALUGA<span>RODAS</span></div><p>Pra quem precisa rodar.</p></div><div><strong>Para quem aluga</strong><a href="/buscar">Buscar veículos</a><a href="/buscar?finalidade=APP">Carros para APP</a><a href="/#como-funciona">Como funciona</a></div><div><strong>Para quem anuncia</strong><a href="/anunciar">Anuncie seu veículo</a><a href="/entrar">Área do anunciante</a><a href={SUPPORT_MAILTO}>Fale com a gente</a></div><div><strong>Aluga Rodas</strong><p className="footer-note">Um marketplace brasileiro para encontrar veículos disponíveis com mais clareza e contato direto.</p><a href="https://www.instagram.com/alugarodas" target="_blank" rel="noreferrer">Instagram @alugarodas</a></div></div><div className="container footer-bottom"><span>© 2026 Aluga Rodas</span><span>Feito para quem precisa seguir em frente.</span></div></footer>
  </>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
