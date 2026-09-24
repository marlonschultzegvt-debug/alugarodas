import { ArrowLeft, ArrowRight, Check, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

export default function ResetPassword() {
  const [, navigate] = useLocation();
  const token = useMemo(() => new URLSearchParams(typeof window === "undefined" ? "" : window.location.search).get("token") ?? "", []);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [done, setDone] = useState(false);
  const resetPassword = trpc.auth.resetPassword.useMutation({ onSuccess: () => setDone(true) });
  const mismatch = confirmation.length > 0 && password !== confirmation;

  if (done) return <main className="auth-page"><section className="auth-card"><div className="success-icon"><Check /></div><div className="auth-intro"><span className="eyebrow orange">SENHA ATUALIZADA</span><h1>Pronto para seguir.</h1><p>Sua senha foi alterada e as sessões anteriores foram invalidadas. Entre novamente para continuar.</p></div><Link href="/entrar" className="primary-button auth-submit">Entrar agora <ArrowRight size={17} /></Link></section></main>;

  return <main className="auth-page"><section className="auth-card"><Link href="/entrar" className="text-link"><ArrowLeft size={15} /> Voltar para entrar</Link><div className="auth-intro"><span className="eyebrow orange">NOVA SENHA</span><h1>Crie uma senha nova.</h1><p>Use pelo menos 8 caracteres, com maiúscula, minúscula, número e símbolo.</p></div>{!token && <p className="auth-error" role="alert">O link de recuperação está incompleto. Solicite um novo link.</p>}<form className="auth-form" onSubmit={(event) => { event.preventDefault(); if (!token || mismatch) return; resetPassword.mutate({ token, newPassword: password }); }}><label>Nova senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required minLength={8} /></label><label>Repita a nova senha<input type="password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} autoComplete="new-password" required minLength={8} /></label>{mismatch && <p className="auth-error" role="alert">As senhas não conferem.</p>}{resetPassword.error && <p className="auth-error" role="alert">{resetPassword.error.message}</p>}<button type="submit" className="primary-button auth-submit" disabled={!token || mismatch || resetPassword.isPending}>{resetPassword.isPending ? "Salvando…" : "Salvar nova senha"} {!resetPassword.isPending && <ArrowRight size={17} />}</button></form><p className="auth-security"><ShieldCheck size={15} /> O link é de uso único e expira em 30 minutos.</p></section></main>;
}
