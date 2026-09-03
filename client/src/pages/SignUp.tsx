import { ArrowRight, Check, ShieldCheck, Store, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

type SignupIntent = "cliente" | "locador";

function getRegisterErrorMessage(message?: string) {
  if (message?.toLowerCase().includes("já existe")) return "Já existe uma conta com este email. Entre ou use outro endereço.";
  return "Não foi possível criar sua conta agora. Tente novamente em alguns instantes.";
}

export default function SignUp() {
  const [, navigate] = useLocation();
  const register = trpc.auth.register.useMutation();
  const [intent, setIntent] = useState<SignupIntent>("cliente");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess("");
    try {
      const result = await register.mutateAsync({ name, email, password, role: intent });
      setSuccess(result.message);
      setTimeout(() => navigate("/entrar"), 900);
    } catch {}
  };

  return <main className="auth-page"><section className="auth-card signup-card" aria-busy={register.isPending}><div className="auth-intro"><span className="eyebrow orange">COMECE A RODAR</span><h1>Cadastre-se no Aluga Rodas.</h1><p>Crie seu acesso para salvar veículos, acompanhar contatos ou anunciar sua frota.</p></div><div className="signup-intent" aria-label="Escolha como você vai usar o Aluga Rodas"><button type="button" className={intent === "cliente" ? "is-selected" : ""} onClick={() => setIntent("cliente")}><UserRound size={19} /><span><strong>Quero alugar</strong><small>Buscar e salvar veículos.</small></span>{intent === "cliente" && <Check size={17} />}</button><button type="button" className={intent === "locador" ? "is-selected" : ""} onClick={() => setIntent("locador")}><Store size={19} /><span><strong>Quero anunciar</strong><small>Receber contatos e leads.</small></span>{intent === "locador" && <Check size={17} />}</button></div><form className="auth-form" onSubmit={submit}><label>Nome completo<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required /></label><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><label>Senha<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required /><small>Use pelo menos 8 caracteres, com letras e números.</small></label>{register.error && <p className="auth-error" role="alert">{getRegisterErrorMessage(register.error.message)}</p>}{success && <p className="auth-success" role="status">{success}</p>}<button type="submit" className="primary-button auth-submit" disabled={register.isPending}>{register.isPending ? "Criando conta…" : "Criar conta"} {!register.isPending && <ArrowRight size={17} />}</button></form><p className="auth-security"><ShieldCheck size={15} /> Admin não pode ser criado publicamente; permissões são definidas no servidor.</p><p className="signup-footer">Já tem uma conta? <Link href="/entrar">Entrar agora</Link></p></section></main>;
}
