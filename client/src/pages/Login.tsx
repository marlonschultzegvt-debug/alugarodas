import { ArrowRight, ShieldCheck, UserRound, Store, Settings2 } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { startLogin } from "@/const";
import { useAuth } from "@/_core/hooks/useAuth";
import { rolePath, type UserRole } from "@/lib/access";

export default function Login() {
  const [, setLocation] = useLocation();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) setLocation(rolePath(user.role as UserRole));
  }, [loading, setLocation, user]);

  if (loading) {
    return <main className="auth-page"><div className="auth-card auth-loading"><span className="eyebrow orange">ALUGA RODAS</span><h1>Verificando seu acesso.</h1><p>Aguarde enquanto confirmamos sua sessão.</p></div></main>;
  }

  if (user) return null;

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-intro">
          <span className="eyebrow orange">ENTRE PARA CONTINUAR</span>
          <h1>Seu próximo passo começa aqui.</h1>
          <p>Use o acesso seguro do Aluga Rodas para acompanhar anúncios, receber contatos e encontrar veículos na sua cidade.</p>
        </div>
        <div className="auth-role-grid" aria-label="Perfis do Aluga Rodas">
          <div><UserRound size={18} /><strong>Cliente</strong><span>Busca e salva veículos.</span></div>
          <div><Store size={18} /><strong>Locador</strong><span>Anuncia e acompanha leads.</span></div>
          <div><Settings2 size={18} /><strong>Admin</strong><span>Administra a plataforma.</span></div>
        </div>
        <button type="button" className="primary-button auth-submit" onClick={startLogin}>Entrar com acesso seguro <ArrowRight size={17} /></button>
        <p className="auth-security"><ShieldCheck size={15} /> Seu perfil e suas permissões são definidos no servidor, nunca pelo navegador.</p>
        <p className="signup-footer">Ainda não tem uma conta? <Link href="/cadastre-se">Cadastre-se</Link></p>
      </section>
    </main>
  );
}
