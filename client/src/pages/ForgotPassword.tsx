import { ArrowLeft, ArrowRight, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const requestReset = trpc.auth.requestPasswordReset.useMutation({ onSuccess: () => setSent(true) });

  return <main className="auth-page"><section className="auth-card"><Link href="/entrar" className="text-link"><ArrowLeft size={15} /> Voltar para entrar</Link><div className="auth-intro"><span className="eyebrow orange">RECUPERE SEU ACESSO</span><h1>Esqueceu sua senha?</h1><p>Informe o e-mail usado no Aluga Rodas. Se houver uma conta, enviaremos um link seguro para criar uma nova senha.</p></div>{sent ? <div className="auth-success" role="status"><Mail size={17} /> Verifique sua caixa de entrada e também a pasta de spam. O link é válido por 30 minutos.</div> : <form className="auth-form" onSubmit={(event) => { event.preventDefault(); requestReset.mutate({ email }); }}><label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="voce@email.com" required /></label>{requestReset.error && <p className="auth-error" role="alert">Não foi possível solicitar a recuperação agora. Tente novamente.</p>}<button type="submit" className="primary-button auth-submit" disabled={requestReset.isPending}>{requestReset.isPending ? "Enviando…" : "Enviar link de recuperação"} {!requestReset.isPending && <ArrowRight size={17} />}</button></form>}<p className="auth-security"><ShieldCheck size={15} /> Nunca exibimos senhas e não confirmamos se um e-mail está cadastrado.</p></section></main>;
}
