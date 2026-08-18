// Aluga Rodas · Estrada Editorial
// Instalação PWA progressiva: Android/Chrome com prompt nativo e iPhone com instrução manual.
import { useEffect, useState } from "react";
import { Download, Share2, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallPrompt() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || ("standalone" in window.navigator && Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone));
    if (isStandalone) return;

    const isIosDevice = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    setIos(isIosDevice);
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    if (isIosDevice) setVisible(true);
    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  if (!visible) return null;

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    await installEvent.userChoice;
    setInstallEvent(null);
    setVisible(false);
  };

  return (
    <aside className="pwa-install-prompt" aria-label="Instalar Aluga Rodas">
      <button className="pwa-install-close" type="button" onClick={() => setVisible(false)} aria-label="Fechar aviso"><X size={16} /></button>
      <div className="pwa-install-icon"><Download size={18} /></div>
      <div className="pwa-install-copy">
        <strong>Leve o Aluga Rodas com você.</strong>
        {ios ? <span>Toque em <Share2 size={13} /> Compartilhar e depois em “Adicionar à Tela de Início”.</span> : <span>Instale para abrir mais rápido, como um aplicativo.</span>}
      </div>
      {!ios && <button className="pwa-install-action" type="button" onClick={install}>Instalar</button>}
    </aside>
  );
}
