import React, { useState } from "react";
import { Apple, ArrowRight, Check, Chrome, ShieldCheck, Store, UserRound } from "lucide-react";
import { Link } from "wouter";
import { startLogin } from "@/const";

type SignupIntent = "cliente" | "locador";

export default function SignUp() {
  const [intent, setIntent] = useState<SignupIntent>("cliente");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const continueWithSecureAccess = () => {
    setStarting(true);
    setError("");
    if (typeof window !== "undefined") window.localStorage.setItem("aluga_signup_intent", intent);
    try {
      startLogin();
    } catch {
      setStarting(false);
      setError("Não foi possível abrir o acesso seguro. Tente novamente.");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card signup-card" aria-busy={starting}>
        <div className="auth-intro">
          <span className="eyebrow orange">COMECE A RODAR</span>
          <h1>Cadastre-se no Aluga Rodas.</h1>
          <p>Crie seu acesso seguro para salvar veículos, acompanhar contatos ou anunciar sua frota.</p>
        </div>

        <div className="signup-intent" aria-label="Escolha como você vai usar o Aluga Rodas">
          <button type="button" className={intent === "cliente" ? "is-selected" : ""} onClick={() => setIntent("cliente")}>
            <UserRound size={19} />
            <span><strong>Quero alugar</strong><small>Buscar e salvar veículos.</small></span>
            {intent === "cliente" && <Check size={17} />}
          </button>
          <button type="button" className={intent === "locador" ? "is-selected" : ""} onClick={() => setIntent("locador")}>
            <Store size={19} />
            <span><strong>Quero anunciar</strong><small>Receber contatos e leads.</small></span>
            {intent === "locador" && <Check size={17} />}
          </button>
        </div>

        <div className="signup-providers" aria-label="Provedores de acesso">
          <p className="signup-label">Escolha como continuar</p>
          <button type="button" className="provider-button" onClick={continueWithSecureAccess} disabled={starting}>
            <Chrome size={18} />
            <span><strong>{starting ? "Abrindo acesso seguro…" : "Continuar com Google"}</strong><small>Use sua conta Gmail no acesso seguro.</small></span>
            <ArrowRight size={16} />
          </button>
          <button type="button" className="provider-button" onClick={continueWithSecureAccess} disabled={starting}>
            <Apple size={18} />
            <span><strong>{starting ? "Abrindo acesso seguro…" : "Continuar com Apple"}</strong><small>Use sua conta iCloud no acesso seguro.</small></span>
            <ArrowRight size={16} />
          </button>
        </div>

        <button type="button" className="primary-button auth-submit" onClick={continueWithSecureAccess} disabled={starting}>
          {starting ? "Abrindo acesso seguro…" : "Continuar com acesso seguro"} {!starting && <ArrowRight size={17} />}
        </button>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <p className="auth-security"><ShieldCheck size={15} /> Seu perfil administrativo nunca pode ser criado publicamente. A plataforma define permissões no servidor.</p>
        <p className="signup-footer">Já tem uma conta? <Link href="/entrar">Entrar agora</Link></p>
      </section>
    </main>
  );
}
