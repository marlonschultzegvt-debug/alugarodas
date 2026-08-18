import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

function registerPwa() {
  const isProductionBuild = Array.from(document.scripts).some((script) => script.src.includes("/assets/"));
  if (!isProductionBuild || !("serviceWorker" in navigator)) return;

  let refreshing = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });

  const start = () => {
    navigator.serviceWorker.register("/sw.js", { scope: "/" }).then((registration) => {
      registration.update();
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;
        if (!worker) return;
        worker.addEventListener("statechange", () => {
          if (worker.state === "installed" && navigator.serviceWorker.controller) {
            worker.postMessage({ type: "SKIP_WAITING" });
          }
        });
      });
    }).catch(() => {
      // A PWA is progressive enhancement; the web app remains fully usable if registration fails.
    });
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}

createRoot(document.getElementById("root")!).render(<App />);
registerPwa();
