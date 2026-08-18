import { ReactNode, useEffect } from "react";
import { ArrowRight, Loader2, ShieldAlert } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { canAccess, type UserRole } from "@/lib/access";

interface AuthGuardProps {
  children: ReactNode;
  roles?: UserRole[];
}

export default function AuthGuard({ children, roles }: AuthGuardProps) {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) setLocation("/entrar");
  }, [loading, setLocation, user]);

  if (loading) return <main className="auth-page"><div className="auth-card auth-loading"><Loader2 className="auth-spinner" size={22} /><h1>Verificando seu acesso.</h1><p>Estamos carregando sua sessão com segurança.</p></div></main>;
  if (!user) return null;

  if (!canAccess(user.role as UserRole, roles)) {
    return <main className="auth-page"><div className="auth-card auth-loading"><ShieldAlert size={28} /><h1>Acesso restrito.</h1><p>Este espaço está disponível para outro perfil do Aluga Rodas.</p><button type="button" className="primary-button" onClick={() => setLocation("/")}>Voltar ao início <ArrowRight size={16} /></button></div></main>;
  }

  return <>{children}</>;
}
