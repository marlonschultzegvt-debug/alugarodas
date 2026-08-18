// Aluga Rodas · Estrada Editorial
// Instalação PWA progressiva: prompt nativo quando disponível e orientação manual quando o navegador não o expõe.
import { useEffect, useState } from "react";
import { Download, MoreVertical, Share2, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type InstallPlatform = "ios" | "android" | "desktop";

export default function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [platform, setPlatform] = useState<InstallPlatform>("desktop");
  const [status, setStatus] = useState<"idle" | "installing" | "manual">("idle");

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || ("standalone" in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone));
    if (isStandalone) return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isAndroidDevice = /android/.test(userAgent);
    setPlatform(isIosDevice ? "ios" : isAndroidDevice ? "android" : "desktop");
    setVisible(true);

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setStatus("idle");
    };
    const onAppInstalled = () => setVisible(false);

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  if (!visible) return null;

  const install = async () => {
    if (!installEvent) {
      setStatus("manual");
      return;
    }
    try {
      setStatus("installing");
      const timeout = new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error("install-prompt-timeout")), 3000));
      await Promise.race([installEvent.prompt(), timeout]);
      const choice = await Promise.race([installEvent.userChoice, new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error("install-choice-timeout")), 5000))]);
      setInstallEvent(null);
      if (choice.outcome === "accepted") setVisible(false);
      else setStatus("manual");
    } catch {
      setStatus("manual");
    }
  };

  const copy = status === "manual"
    ? platform === "ios"
      ? <>Toque em <Share2 size={13} /> Compartilhar e depois em “Adicionar à Tela de Início”.</>
      : <>Abra o menu <MoreVertical size={13} /> do navegador e escolha “Instalar aplicativo” ou “Adicionar à tela inicial”.</>
    : platform === "ios"
      ? <>Use <Share2 size={13} /> Compartilhar e escolha “Adicionar à Tela de Início”.</>
      : <>Instale para abrir mais rápido, como um aplicativo.</>;

  return (
    <aside className="pwa-install-prompt" aria-label="Instalar Aluga Rodas">
      <button className="pwa-install-close" type="button" onClick={() => setVisible(false)} aria-label="Fechar aviso"><X size={16} /></button>
      <div className="pwa-install-icon"><Download size={18} /></div>
      <div className="pwa-install-copy">
        <strong>{status === "manual" ? "Como instalar o Aluga Rodas" : "Leve o Aluga Rodas com você."}</strong>
        <span>{copy}</span>
      </div>
      {platform !== "ios" && <button className="pwa-install-action" type="button" onClick={install} disabled={status === "installing"}>{status === "installing" ? "Abrindo…" : status === "manual" ? "Entendi" : "Instalar"}</button>}
    </aside>
  );
}
