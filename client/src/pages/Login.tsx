import { ArrowRight, LogOut, ShieldCheck, UserRound, Store } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { rolePath, type UserRole } from "@/lib/access";

export default function Login() {
  const [, navigate] = useLocation();
  const { user, loading, logout } = useAuth();
  const login = trpc.auth.login.useMutation({
    onSuccess: async () => {
      await trpcUtils.auth.me.invalidate();
    },
  });
  const trpcUtils = trpc.useUtils();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (loading) return <main className="auth-page"><div className="auth-card auth-loading"><span className="eyebrow orange">ALUGA RODAS</span><h1>Verificando seu acesso.</h1><p>Aguarde enquanto confirmamos sua sessão.</p></div></main>;

  if (user) {
    const destination = rolePath(user.role as UserRole);
    const roleLabel = user.role === "admin" ? "Admin" : user.role === "locador" ? "Locador" : "Cliente";
    return <main className="auth-page"><section className="auth-card"><div className="auth-intro"><span className="eyebrow orange">SESSÃO ATIVA</span><h1>Você já está conectado.</h1><p>Seu acesso atual é de <strong>{roleLabel}</strong>. Escolha se deseja continuar na sua área ou sair para entrar com outra conta.</p></div><div className="auth-actions"><a className="primary-button auth-submit" href={destination}>Ir para minha área <ArrowRight size={17} /></a><button type="button" className="outline-button auth-submit" onClick={() => void logout()}><LogOut size={17} /> Sair e entrar com outra conta</button></div><p className="auth-security"><ShieldCheck size={15} /> O perfil e as permissões são definidos no servidor.</p></section></main>;
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const result = await login.mutateAsync({ email, password });
      await trpcUtils.auth.me.invalidate();
      navigate(rolePath(result.user.role as UserRole));
    } catch {}
  };

  return <main className="auth-page"><section className="auth-card"><div className="auth-intro"><span className="eyebrow orange">ENTRE PARA CONTINUAR</span><h1>Seu próximo passo começa aqui.</h1><p>Entre com email e senha para acompanhar anúncios, receber contatos ou encontrar veículos na sua cidade.</p></div><div className="auth-role-grid" aria-label="Perfis do Aluga Rodas"><div><UserRound size={18} /><strong>Cliente</strong><span>Busca e salva veículos.</span></div><div><Store size={18} /><strong>Locador</strong><span>Anuncia e acompanha leads.</span></div></div><form className="auth-form" onSubmit={submit}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><label>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>{login.error && <p className="auth-error" role="alert">{login.error.message}</p>}<button type="submit" className="primary-button auth-submit" disabled={login.isPending}>{login.isPending ? "Entrando…" : "Entrar"} {!login.isPending && <ArrowRight size={17} />}</button></form><p className="auth-security"><ShieldCheck size={15} /> O perfil e as permissões são definidos no servidor, nunca pelo navegador.</p><p className="signup-footer">Ainda não tem uma conta? <Link href="/cadastre-se">Cadastre-se</Link></p></section></main>;
}
