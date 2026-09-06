import { ArrowRight, Check, CircleAlert, Eye, EyeOff, Facebook, ShieldCheck, Store, UserRound } from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";

type SignupIntent = "cliente" | "locador";
type AccountType = "pf" | "pj";

function getRegisterErrorMessage(message?: string) {
  if (message?.toLowerCase().includes("já existe")) return "Já existe uma conta com este email. Entre ou use outro endereço.";
  if (message?.toLowerCase().includes("cpf") || message?.toLowerCase().includes("cnpj") || message?.toLowerCase().includes("nascimento") || message?.toLowerCase().includes("razão")) return message;
  if (message?.toLowerCase().includes("senha")) return "Sua senha ainda não atende a todos os critérios de segurança.";
  return "Não foi possível criar sua conta agora. Tente novamente em alguns instantes.";
}

function maskDocument(value: string, accountType: AccountType) {
  const digits = value.replace(/\D/g, "").slice(0, accountType === "pf" ? 11 : 14);
  if (accountType === "pf") return digits.replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return digits.replace(/(\d{2})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1/$2").replace(/(\d{4})(\d{1,2})$/, "$1-$2");
}

export default function SignUp() {
  const [, navigate] = useLocation();
  const register = trpc.auth.register.useMutation();
  const [intent, setIntent] = useState<SignupIntent>("cliente");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState<AccountType>("pf");
  const [document, setDocument] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [legalName, setLegalName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [providerNotice, setProviderNotice] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSuccess("");
    try {
      const result = await register.mutateAsync({ name, email, password, role: intent, accountType, document, displayName, birthDate: accountType === "pf" ? birthDate : undefined, legalName: accountType === "pj" ? legalName : undefined });
      setSuccess(result.message);
      setTimeout(() => navigate("/entrar"), 900);
    } catch {}
  };

  const passwordChecks = [
    [password.length >= 8, "8 ou mais caracteres"], [/[A-Z]/.test(password), "Uma letra maiúscula"], [/[a-z]/.test(password), "Uma letra minúscula"], [/\d/.test(password), "Um número"], [/[^A-Za-z0-9]/.test(password), "Um caractere especial"],
  ] as const;
  const accountLabel = accountType === "pf" ? "Pessoa Física" : "Pessoa Jurídica";

  return <main className="auth-page"><section className="auth-card signup-card auth-card-expanded" aria-busy={register.isPending}><div className="auth-intro"><span className="eyebrow orange">COMECE A RODAR</span><h1>Crie sua conta. É grátis.</h1><p>Use seu e-mail para criar um perfil confiável. Seu WhatsApp só será solicitado antes de um contato ou lead.</p></div><div className="signup-providers" aria-label="Outras formas de cadastro"><button type="button" className="provider-button" onClick={() => setProviderNotice("Login com Google será liberado após a configuração segura do provedor.")}><span className="provider-google">G</span> Continuar com Google</button><button type="button" className="provider-button" onClick={() => setProviderNotice("Login com Facebook será liberado após a configuração segura do provedor.")}><Facebook size={18} /> Continuar com Facebook</button></div>{providerNotice && <p className="auth-provider-notice"><CircleAlert size={15} /> {providerNotice}</p>}<div className="auth-divider"><span>ou cadastre-se com e-mail</span></div><div className="signup-intent" aria-label="Escolha como você vai usar o Aluga Rodas"><button type="button" className={intent === "cliente" ? "is-selected" : ""} onClick={() => setIntent("cliente")}><UserRound size={19} /><span><strong>Quero alugar</strong><small>Buscar e salvar veículos.</small></span>{intent === "cliente" && <Check size={17} />}</button><button type="button" className={intent === "locador" ? "is-selected" : ""} onClick={() => setIntent("locador")}><Store size={19} /><span><strong>Quero anunciar</strong><small>Receber contatos e leads.</small></span>{intent === "locador" && <Check size={17} />}</button></div><form className="auth-form" onSubmit={submit}><fieldset className="account-type-fieldset"><legend>Tipo de conta</legend><div className="account-type-options"><label className={accountType === "pf" ? "is-selected" : ""}><input type="radio" checked={accountType === "pf"} onChange={() => { setAccountType("pf"); setDocument(""); }} /> Pessoa Física</label><label className={accountType === "pj" ? "is-selected" : ""}><input type="radio" checked={accountType === "pj"} onChange={() => { setAccountType("pj"); setDocument(""); }} /> Pessoa Jurídica</label></div></fieldset><label>{accountType === "pf" ? "CPF" : "CNPJ"}<input value={document} onChange={(event) => setDocument(maskDocument(event.target.value, accountType))} inputMode="numeric" placeholder={accountType === "pf" ? "000.000.000-00" : "00.000.000/0000-00"} required /></label>{accountType === "pj" && <label>Razão social<input value={legalName} onChange={(event) => setLegalName(event.target.value)} autoComplete="organization" placeholder="Nome registrado da empresa" required /></label>}<label>{accountType === "pf" ? "Nome completo" : "Nome do responsável"}<input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required /></label><label>Como você quer ser chamado(a)?<input value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Ex.: João S." required /><small>Este nome aparecerá no seu perfil e nos contatos.</small></label>{accountType === "pf" && <label>Data de nascimento<input type="date" value={birthDate} onChange={(event) => setBirthDate(event.target.value)} autoComplete="bday" required /></label>}<label>E-mail<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" placeholder="voce@email.com" required /><small>Enviaremos comunicações de acesso e segurança para este endereço.</small></label><label>Senha<span className="password-input"><input type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required /><button type="button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span><ul className="password-checklist">{passwordChecks.map(([passed, label]) => <li className={passed ? "passed" : ""} key={label}>{passed ? <Check size={14} /> : <span>×</span>}{label}</li>)}</ul></label>{register.error && <p className="auth-error" role="alert">{getRegisterErrorMessage(register.error.message)}</p>}{success && <p className="auth-success" role="status">{success}</p>}<button type="submit" className="primary-button auth-submit" disabled={register.isPending}>{register.isPending ? "Criando conta…" : `Criar conta ${accountLabel}`} {!register.isPending && <ArrowRight size={17} />}</button></form><p className="auth-security"><ShieldCheck size={15} /> Seus dados de identificação não aparecem no catálogo. Admin não pode ser criado publicamente.</p><p className="signup-footer">Já tem uma conta? <Link href="/entrar">Entrar agora</Link></p></section></main>;
}
