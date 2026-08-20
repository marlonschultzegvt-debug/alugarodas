import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, FileText, Heart, MapPin, MessageCircle, ShieldCheck, Wrench } from "lucide-react";
import { formatBRL, trackEvent, vehicles, type Vehicle } from "@/lib/marketplace";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

const validBrazilianAreaCodes = new Set([11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99]);

function formatBrazilianPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (!digits) return "";
  if (digits.length <= 2) return `(${digits}`;
  const area = digits.slice(0, 2);
  const subscriber = digits.slice(2);
  if (subscriber.length <= 4) return `(${area}) ${subscriber}`;
  const split = digits.length === 11 ? 5 : 4;
  return `(${area}) ${subscriber.slice(0, split)}-${subscriber.slice(split)}`;
}

function normalizeAndValidateBrazilianPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  const areaCode = Number(digits.slice(0, 2));
  const validLength = digits.length === 10 || digits.length === 11;
  return validLength && validBrazilianAreaCodes.has(areaCode) ? digits : null;
}

type PersistentVehicle = {
  id: number;
  companyId: number;
  brand: string;
  model: string;
  year: number;
  category: "carro" | "moto" | "eletrico" | "hibrido" | "utilitario" | "van" | "caminhonete";
  fuel: string;
  transmission: string;
  state: string;
  city: string;
  weeklyPrice: string | null;
  monthlyPrice: string | null;
  deposit: string | null;
  kmLimitMonthly: number | null;
  insuranceIncluded: boolean;
  acceptsApp: boolean;
  acceptsUberX: boolean;
  acceptsUberComfort: boolean;
  acceptsUberBlack: boolean;
  accepts99: boolean;
  status: string;
  images: Array<{ url: string; isCover: boolean }>;
  company?: { name: string; verified: boolean } | null;
};

function mapPersistentVehicle(item: PersistentVehicle): Vehicle & { companyId: number; imageUrls: string[] } {
  const category = ({ carro: "Carro", moto: "Moto", eletrico: "Elétrico", hibrido: "Híbrido", utilitario: "Utilitário", van: "Utilitário", caminhonete: "Utilitário" } as const)[item.category];
  return {
    id: String(item.id),
    slug: String(item.id),
    brand: item.brand,
    model: item.model,
    year: item.year,
    city: item.city,
    state: item.state,
    category,
    purpose: item.acceptsApp ? "APP" : "Uso pessoal",
    priceWeekly: Number(item.weeklyPrice ?? item.monthlyPrice ?? 0),
    priceMonthly: Number(item.monthlyPrice ?? item.weeklyPrice ?? 0),
    deposit: Number(item.deposit ?? 0),
    fuel: item.fuel,
    transmission: item.transmission,
    kmLimit: item.kmLimitMonthly ? `${item.kmLimitMonthly.toLocaleString("pt-BR")} km/mês` : "Consulte o limite",
    insurance: item.insuranceIncluded ? "Seguro incluso" : "Seguro a consultar",
    availability: item.status === "active" ? "Disponível agora" : "Consulte disponibilidade",
    appClasses: [
      ...(item.acceptsUberX ? ["UberX"] : []),
      ...(item.acceptsUberComfort ? ["Uber Comfort"] : []),
      ...(item.acceptsUberBlack ? ["Uber Black"] : []),
      ...(item.accepts99 ? ["99"] : []),
    ],
    image: item.images.find((image) => image.isCover)?.url ?? item.images[0]?.url ?? "/manus-storage/aluga-rodas-hero_82e5fd36.jpg",
    imageUrls: item.images.map((image) => image.url),
    accent: "",
    verified: Boolean(item.company?.verified),
    provider: item.company?.name ?? "Anunciante Aluga Rodas",
    companyId: item.companyId,
  };
}

export default function VehicleDetails() {
  const [, params] = useRoute("/veiculo/:slug");
  const staticVehicle = vehicles.find((item) => item.slug === params?.slug) || vehicles[0];
  const marketplaceApiEnabled = import.meta.env.VITE_MARKETPLACE_API_ENABLED === "true";
  const apiVehicleId = Number(params?.slug);
  const apiVehicleQuery = trpc.marketplace.vehicle.useQuery({ id: apiVehicleId }, { enabled: marketplaceApiEnabled && Number.isInteger(apiVehicleId) && apiVehicleId > 0 });
  const persistentVehicle = apiVehicleQuery.data ? mapPersistentVehicle(apiVehicleQuery.data) : undefined;
  const usingPersistentRoute = marketplaceApiEnabled && Number.isInteger(apiVehicleId) && apiVehicleId > 0;
  const vehicle = persistentVehicle ?? staticVehicle;
  const sourceId = persistentVehicle ? Number(persistentVehicle.id) : undefined;
  const [interestOpen, setInterestOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadError, setLeadError] = useState("");
  const [leadSent, setLeadSent] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState(false);
  const [favoriteSaved, setFavoriteSaved] = useState(false);
  const { user } = useAuth();
  const isClient = user?.role === "cliente" || user?.role === "user";
  const clientAreaQuery = trpc.auth.clientArea.useQuery(undefined, { enabled: Boolean(isClient) });
  const leadMutation = trpc.marketplace.leadCreate.useMutation();
  const interestMutation = trpc.auth.interestCreate.useMutation();
  const favoriteSaveMutation = trpc.auth.favoriteSave.useMutation();
  const favoriteRemoveMutation = trpc.auth.favoriteRemove.useMutation();
  const vehicleViewMutation = trpc.marketplace.vehicleViewCreate.useMutation();
  const trackedViewId = useRef<number | null>(null);
  const announcementUrl = typeof window !== "undefined" ? new URL(`/veiculo/${vehicle.slug}`, window.location.origin).toString() : `/veiculo/${vehicle.slug}`;
  const whatsappText = `Olá! Demonstrei interesse em alugar o veículo ${vehicle.brand} ${vehicle.model}.

Link do anúncio: ${announcementUrl}

@AlugaRodas`;
  const whatsapp = `https://wa.me/5541999990000?text=${encodeURIComponent(whatsappText)}`;
  const gallery = useMemo(() => persistentVehicle?.imageUrls.length ? persistentVehicle.imageUrls : [vehicle.image], [persistentVehicle, vehicle.image]);
  const [photoIndex, setPhotoIndex] = useState(0);
  useEffect(() => { setPhotoIndex(0); }, [vehicle.id, gallery.length]);
  useEffect(() => {
    if (!sourceId || trackedViewId.current === sourceId) return;
    trackedViewId.current = sourceId;
    void vehicleViewMutation.mutateAsync({ vehicleId: sourceId, source: "vehicle_details" }).catch((error) => console.error("[VehicleDetails] failed to record view", error));
  }, [sourceId, vehicleViewMutation]);
  useEffect(() => {
    if (!isClient || !clientAreaQuery.data) return;
    setFavoriteSaved(clientAreaQuery.data.favorites.some((favorite) => favorite.vehicleKey === String(vehicle.id)));
  }, [clientAreaQuery.data, isClient, vehicle.id]);
  const previousPhoto = () => setPhotoIndex((current) => (current - 1 + gallery.length) % gallery.length);
  const nextPhoto = () => setPhotoIndex((current) => (current + 1) % gallery.length);

  const submitLead = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLeadError("");
    const normalizedPhone = normalizeAndValidateBrazilianPhone(leadPhone);
    if (!normalizedPhone) {
      setLeadError("Informe um WhatsApp válido com DDD. Exemplo: (41) 99999-9999.");
      return;
    }
    try {
        if (user?.role === "cliente" || user?.role === "user") {
          await interestMutation.mutateAsync({ vehicleKey: String(vehicle.id), vehicleLabel: `${vehicle.brand} ${vehicle.model}`, message: `Interesse registrado pelo veículo ${vehicle.brand} ${vehicle.model}.` });
        } else if (marketplaceApiEnabled) {
          if (!sourceId || !persistentVehicle?.companyId) {
            setLeadError("Este veículo ainda não está disponível para receber leads persistentes.");
            return;
          }
          await leadMutation.mutateAsync({ vehicleId: sourceId, companyId: persistentVehicle.companyId, name: leadName, phone: normalizedPhone, source: "vehicle_details" });
        }
      setLeadSent(true);
      trackEvent("lead_sent", { vehicle: vehicle.id });
    } catch (error) {
      console.error("[VehicleDetails] failed to submit lead", error);
      setLeadError("Não foi possível enviar seu interesse agora. Tente novamente.");
    }
  };

  if (usingPersistentRoute && apiVehicleQuery.isLoading) return <main className="detail-page"><div className="container empty-state"><h1>Carregando veículo…</h1><p>Buscando condições e disponibilidade atuais.</p></div></main>;
  if (usingPersistentRoute && apiVehicleQuery.isError) return <main className="detail-page"><div className="container empty-state"><h1>Não foi possível carregar este veículo.</h1><p>Tente novamente ou volte para a busca.</p><Link href="/buscar" className="primary-button">Voltar para busca</Link></div></main>;
  if (usingPersistentRoute && !persistentVehicle) return <main className="detail-page"><div className="container empty-state"><h1>Veículo não encontrado.</h1><p>Este anúncio pode ter sido pausado ou removido.</p><Link href="/buscar" className="primary-button">Voltar para busca</Link></div></main>;

  return <main className="detail-page">
    <div className="container breadcrumb"><Link href="/buscar"><ArrowLeft size={15} /> Voltar para busca</Link><span>/</span><strong>{vehicle.brand} {vehicle.model}</strong></div>
    <section className="container detail-hero">
      <div className="detail-gallery"><img src={gallery[photoIndex]} alt={`${vehicle.brand} ${vehicle.model} — foto ${photoIndex + 1}`} />{gallery.length > 1 && <><button type="button" className="gallery-control gallery-control-prev" onClick={previousPhoto} aria-label="Ver foto anterior"><ChevronLeft size={22} /></button><button type="button" className="gallery-control gallery-control-next" onClick={nextPhoto} aria-label="Ver próxima foto"><ChevronRight size={22} /></button></>}<div className="gallery-caption"><span>Fotos do veículo</span><span>{String(photoIndex + 1).padStart(2, "0")} / {String(gallery.length).padStart(2, "0")}</span></div></div>
      <div className="detail-summary"><div className="vehicle-card-top"><span className="eyebrow">{vehicle.category} · {vehicle.year}</span>{vehicle.verified && <span className="verified"><ShieldCheck size={13} /> Aluga Rodas verificado</span>}</div><h1>{vehicle.brand} <strong>{vehicle.model}</strong></h1><p className="vehicle-place"><MapPin size={16} /> {vehicle.city} · {vehicle.state}</p><p className="detail-description">Uma opção pronta para acompanhar sua rotina, com condições transparentes para você entender o custo antes de conversar com o anunciante.</p><div className="detail-price"><small>A partir de</small><strong>{formatBRL(vehicle.priceWeekly)} <span>/ semana</span></strong><em>ou {formatBRL(vehicle.priceMonthly)} no plano mensal</em></div><div className="detail-actions"><button className="primary-button" onClick={() => { setInterestOpen(true); setLeadSent(false); trackEvent("lead_start", { vehicle: vehicle.id }); }}>Tenho interesse <ArrowRight size={17} /></button><a href={whatsapp} target="_blank" rel="noreferrer" className="outline-button" onClick={() => trackEvent("whatsapp_click", { vehicle: vehicle.id })}><MessageCircle size={17} /> WhatsApp</a><button className={`icon-button ${favoriteSaved ? "is-saved" : ""}`} aria-label={favoriteSaved ? "Remover veículo dos favoritos" : "Salvar veículo"} aria-pressed={favoriteSaved} disabled={favoriteSaveMutation.isPending || favoriteRemoveMutation.isPending} onClick={async () => { if (!isClient) { setFavoriteMessage(true); return; } try { if (favoriteSaved) { await favoriteRemoveMutation.mutateAsync({ vehicleKey: String(vehicle.id) }); setFavoriteSaved(false); setFavoriteMessage(true); } else { await favoriteSaveMutation.mutateAsync({ vehicleKey: String(vehicle.id) }); setFavoriteSaved(true); setFavoriteMessage(true); } } catch (error) { console.error("[VehicleDetails] failed to update favorite", error); setFavoriteMessage(true); } }}><Heart size={19} fill={favoriteSaved ? "currentColor" : "none"} /></button></div>{favoriteMessage && <p className="favorite-note" role="status">{favoriteSaved ? "Veículo salvo na sua área." : user ? "Veículo removido dos favoritos." : <>Entre para salvar este veículo. <Link href="/entrar">Entrar</Link> ou <Link href="/cadastre-se">cadastre-se</Link>.</>}</p>}<p className="response-note"><span className="availability-dot" /> {vehicle.availability}</p></div>
    </section>
    <section className="container detail-content"><div className="detail-main"><div className="detail-section"><span className="eyebrow orange">CARACTERÍSTICAS</span><h2>O que você precisa saber.</h2><div className="spec-grid"><div><span>Combustível</span><strong>{vehicle.fuel}</strong></div><div><span>Câmbio</span><strong>{vehicle.transmission}</strong></div><div><span>Quilometragem</span><strong>{vehicle.kmLimit}</strong></div><div><span>Disponibilidade</span><strong>{vehicle.availability}</strong></div><div><span>Categoria</span><strong>{vehicle.category}</strong></div><div><span>Uso indicado</span><strong>{vehicle.purpose}</strong></div></div></div><div className="detail-section conditions"><span className="eyebrow orange">CONDIÇÕES DE LOCAÇÃO</span><h2>Transparência antes do contato.</h2><div className="condition-list"><div><ShieldCheck /><div><strong>Seguro</strong><span>{vehicle.insurance}. Confirme franquia e cobertura com o anunciante.</span></div></div><div><FileText /><div><strong>Caução</strong><span>{formatBRL(vehicle.deposit)} de caução estimada. A condição pode variar.</span></div></div><div><Wrench /><div><strong>Manutenção</strong><span>Manutenções preventivas sob responsabilidade do anunciante.</span></div></div></div></div><div className="detail-section"><span className="eyebrow orange">SOBRE O ANUNCIANTE</span><h2>{vehicle.provider}</h2><p>Este perfil apresenta as informações essenciais para você comparar e iniciar uma conversa. O Aluga Rodas conecta as pontas; a combinação final é feita diretamente com o anunciante.</p><div className="info-strip"><ShieldCheck size={19} /><span>Informações transparentes e contato direto.</span></div></div></div><aside className="detail-aside"><div className="aside-card"><span className="eyebrow orange">PARA TRABALHAR COM APP</span><h3>Compatível com:</h3><div className="app-tags">{vehicle.appClasses.length ? vehicle.appClasses.map((app) => <span key={app}><Check size={14} /> {app}</span>) : <span><Check size={14} /> Consulte o anunciante</span>}</div><p>Confira os requisitos de cada plataforma e a disponibilidade com o anunciante.</p><button className="primary-button full" onClick={() => { setInterestOpen(true); setLeadSent(false); }}>Quero falar sobre este veículo</button></div></aside></section>
    {interestOpen && <div className="modal-backdrop" onClick={() => setInterestOpen(false)}><div className="interest-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setInterestOpen(false)}>×</button>{leadSent ? <><span className="eyebrow orange">INTERESSE ENVIADO</span><h2>O anunciante recebeu seus dados.</h2><p>{marketplaceApiEnabled ? "Agora você pode continuar a conversa diretamente pelo WhatsApp." : "Este é um modo de demonstração; a persistência será ativada quando o catálogo estiver conectado em produção."}</p><a href={whatsapp} target="_blank" rel="noreferrer" className="primary-button full" onClick={() => trackEvent("whatsapp_click", { vehicle: vehicle.id, source: "lead_success" })}><MessageCircle size={17} /> Continuar pelo WhatsApp</a><button className="secondary-button full" onClick={() => setInterestOpen(false)}>Fechar</button></> : <><span className="eyebrow orange">PRÓXIMO PASSO</span><h2>Vamos conectar você ao anunciante.</h2><p>Deixe seus dados para registrar seu interesse no <strong>{vehicle.brand} {vehicle.model}</strong>.</p>{leadError && <p className="form-error" role="alert">{leadError}</p>}<form onSubmit={submitLead}><label>Seu nome<input required value={leadName} onChange={(event) => setLeadName(event.target.value)} placeholder="Como podemos te chamar?" /></label><label>WhatsApp<input required inputMode="tel" autoComplete="tel" maxLength={15} value={formatBrazilianPhone(leadPhone)} onChange={(event) => { setLeadPhone(formatBrazilianPhone(event.target.value)); setLeadError(""); }} placeholder="(41) 99999-9999" /><span className="field-hint">Informe um número com DDD.</span></label><button className="primary-button full" type="submit" disabled={leadMutation.isPending || interestMutation.isPending}>{leadMutation.isPending ? "Enviando…" : "Enviar interesse"} {!leadMutation.isPending && <ArrowRight size={16} />}</button></form></>}</div></div>}
  </main>;
}
