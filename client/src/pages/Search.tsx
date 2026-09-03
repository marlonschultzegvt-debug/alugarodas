// Aluga Rodas · Estrada Editorial
// Descoberta e filtro do inventário, preparada para rotas SEO por cidade, categoria e finalidade.
import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Check, Filter, MapPin, Search as SearchIcon, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { cities, categories, formatBRL, trackEvent, vehicles } from "@/lib/marketplace";
import { trpc } from "@/lib/trpc";

const normalizeCity = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLocaleLowerCase("pt-BR");

function Card({ vehicle }: { vehicle: typeof vehicles[number] }) {
  const wa = `https://wa.me/5541999990000?text=${encodeURIComponent(`Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model}.`)}`;
  return <article className="vehicle-card search-card"><Link href={`/veiculo/${vehicle.slug}`} className="vehicle-image-wrap"><img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} /><span className="availability"><span className="availability-dot" />{vehicle.availability}</span></Link><div className="vehicle-card-body"><div className="vehicle-card-top"><span className="eyebrow">{vehicle.category} · {vehicle.year}</span>{vehicle.verified && <span className="verified"><ShieldCheck size={13} /> Aluga Rodas verificado</span>}</div><Link href={`/veiculo/${vehicle.slug}`} className="vehicle-title">{vehicle.brand} <strong>{vehicle.model}</strong></Link><p className="vehicle-place"><MapPin size={14} /> {vehicle.city} · {vehicle.state}</p><div className="vehicle-specs"><span>{vehicle.fuel}</span><span>{vehicle.transmission}</span><span>{vehicle.kmLimit}</span></div><div className="vehicle-card-bottom"><div><small>A partir de</small><strong>{formatBRL(vehicle.priceWeekly)} <small>/ semana</small></strong><span>{vehicle.insurance}</span></div><a href={wa} target="_blank" rel="noreferrer" className="whatsapp-link" onClick={() => trackEvent("whatsapp_click", { vehicle: vehicle.id })}>WhatsApp <ArrowRight size={15} /></a></div></div></article>;
}

export default function Search() {
  const [location] = useLocation();
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : location.split("?")[1] || "");
  const [city, setCity] = useState(params.get("cidade") || "Todas as cidades");
  const [category, setCategory] = useState(params.get("categoria") || "Todos");
  const [purpose, setPurpose] = useState(params.get("finalidade") || "Todas as finalidades");
  const [term, setTerm] = useState("");
  const marketplaceApiEnabled = import.meta.env.VITE_MARKETPLACE_API_ENABLED === "true";
  const apiQuery = trpc.marketplace.vehicles.useQuery(
    {
      city: city === "Todas as cidades" ? undefined : city,
      category: category === "Todos" ? undefined : ({ Carro: "carro", Moto: "moto", Elétrico: "eletrico", Híbrido: "hibrido", Utilitário: "utilitario" } as const)[category as "Carro" | "Moto" | "Elétrico" | "Híbrido" | "Utilitário"],
      purpose: purpose === "Todas as finalidades" ? undefined : purpose,
      search: term || undefined,
    },
    { enabled: marketplaceApiEnabled },
  );
  const apiVehicles = useMemo(() => apiQuery.data ?? [], [apiQuery.data]);
  const useEditorialFallback = marketplaceApiEnabled && !apiQuery.isLoading && !apiQuery.isError && apiVehicles.length === 0;
  const result = useMemo(() => {
    const editorialMatches = vehicles.filter((vehicle) =>
      (city === "Todas as cidades" || normalizeCity(vehicle.city) === normalizeCity(city)) &&
      (category === "Todos" || vehicle.category === category) &&
      (purpose === "Todas as finalidades" || vehicle.purpose === purpose || vehicle.appClasses.includes(purpose)) &&
      `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(term.toLowerCase()),
    );
    if (useEditorialFallback) return editorialMatches;
    if (marketplaceApiEnabled) {
      return apiVehicles
        .filter((item) => city === "Todas as cidades" || normalizeCity(item.city) === normalizeCity(city))
        .map((item) => ({
        id: String(item.id),
        slug: String(item.id),
        brand: item.brand,
        model: item.model,
        year: item.year,
        category: ({ carro: "Carro", moto: "Moto", eletrico: "Elétrico", hibrido: "Híbrido", utilitario: "Utilitário", van: "Utilitário", caminhonete: "Utilitário" } as const)[item.category],
        city: item.city,
        state: item.state,
        fuel: item.fuel,
        transmission: item.transmission,
        kmLimit: item.kmLimitMonthly ? `${item.kmLimitMonthly.toLocaleString("pt-BR")} km/mês` : "Consulte o limite",
        priceWeekly: Number(item.weeklyPrice ?? item.monthlyPrice ?? 0),
        priceMonthly: Number(item.monthlyPrice ?? item.weeklyPrice ?? 0),
        insurance: item.insuranceIncluded ? "Seguro incluso" : "Seguro a consultar",
        availability: item.status === "active" ? "Disponível agora" : "Consulte disponibilidade",
        verified: false,
        image: item.coverImageUrl ?? "https://files.manuscdn.com/user_upload_by_module/session_file/310519663892022031/neLaCNtNcjpXFjlZ.jpg",
        purpose: item.acceptsApp ? "APP" : "Uso pessoal",
        appClasses: [
          ...(item.acceptsUberX ? ["UberX"] : []),
          ...(item.acceptsUberComfort ? ["Uber Comfort"] : []),
          ...(item.acceptsUberBlack ? ["Uber Black"] : []),
          ...(item.accepts99 ? ["99"] : []),
        ],
        deposit: Number(item.deposit ?? 0),
        provider: "Anunciante Aluga Rodas",
        accent: "",
      }));
    }
    return editorialMatches;
  }, [apiVehicles, category, city, marketplaceApiEnabled, purpose, term, useEditorialFallback]);
  return <main className="search-page"><div className="container breadcrumb"><Link href="/"><ArrowLeft size={15} /> Início</Link><span>/</span><strong>Buscar veículos</strong></div><section className="search-page-head container"><div><span className="eyebrow orange">CATÁLOGO ALUGA RODAS</span><h1>Encontre uma opção<br /><i>que combina com você.</i></h1><p>Explore carros, motos e utilitários com condições claras para trabalhar, viajar ou tocar seu negócio.</p></div><div className="search-quick"><SearchIcon size={17} /><input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Buscar por marca ou modelo" /></div></section><div className="container results-layout"><aside className="filters"><div className="filters-top"><strong>Filtre sua busca</strong><Filter size={18} /></div><label><span><MapPin size={15} /> Localização</span><select value={city} onChange={(e) => { setCity(e.target.value); trackEvent("search_city", { city: e.target.value }); }}><option>Todas as cidades</option>{cities.map((c) => <option key={c}>{c}</option>)}</select></label><label><span><SlidersHorizontal size={15} /> Categoria</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option>Todos</option>{categories.slice(1).map((c) => <option key={c.value}>{c.value}</option>)}</select></label><label><span>Finalidade</span><select value={purpose} onChange={(e) => setPurpose(e.target.value)}><option>Todas as finalidades</option><option>APP</option><option>Entregas</option><option>Uso pessoal</option><option>Viagem</option></select></label><div className="filter-note"><Check size={16} /><span>Mais de 80% dos anúncios exibem preço, cidade e condição de seguro.</span></div></aside><section className="results"><div className="results-toolbar"><div><strong>{result.length} veículos encontrados</strong><span>Atualizado hoje · ordenado por relevância</span></div><select aria-label="Ordenar resultados"><option>Mais relevantes</option><option>Menor preço</option><option>Mais recentes</option></select></div>{useEditorialFallback && <p className="catalog-fallback-note">Prévia editorial do Aluga Rodas. Novos anúncios verificados serão publicados nesta região.</p>}{marketplaceApiEnabled && apiQuery.isLoading ? <div className="empty-state"><span>⌁</span><h2>Carregando veículos…</h2><p>Estamos consultando as opções disponíveis na sua região.</p></div> : marketplaceApiEnabled && apiQuery.isError ? <div className="empty-state"><span>!</span><h2>Não foi possível carregar os veículos.</h2><p>Tente novamente em instantes ou ajuste os filtros.</p></div> : result.length ? <div className="inventory-grid">{result.map((v) => <Card key={v.id} vehicle={v} />)}</div> : <div className="empty-state"><span>⌁</span><h2>Não encontramos essa combinação.</h2><p>Tente ampliar a cidade ou remover um filtro para ver mais opções.</p><button className="outline-button" onClick={() => { setCity("Todas as cidades"); setCategory("Todos"); setPurpose("Todas as finalidades"); setTerm(""); }}>Limpar filtros</button></div>}</section></div></main>;
}
