// Aluga Rodas · Estrada Editorial
// Home de descoberta: busca em primeiro plano, inventário com contexto e entrada clara para anunciantes.
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, ChevronRight, MapPin, Search as SearchIcon, ShieldCheck, SlidersHorizontal, Sparkles, Users, Zap } from "lucide-react";
import { categories, cityOptions, formatBRL, trackEvent, vehicles } from "@/lib/marketplace";

function VehicleCard({ vehicle }: { vehicle: typeof vehicles[number] }) {
  const whatsapp = `https://wa.me/5541999990000?text=${encodeURIComponent(`Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model} anunciado no Aluga Rodas.`)}`;
  return <article className="vehicle-card">
    <Link href={`/veiculo/${vehicle.slug}`} className="vehicle-image-wrap"><img src={vehicle.image} alt={`${vehicle.brand} ${vehicle.model}`} /><span className="availability"><span className="availability-dot" />{vehicle.availability}</span><span className="heart">♡</span></Link>
    <div className="vehicle-card-body">
      <div className="vehicle-card-top"><span className="eyebrow">{vehicle.category} · {vehicle.year}</span>{vehicle.verified && <span className="verified"><ShieldCheck size={13} /> Aluga Rodas verificado</span>}</div>
      <Link href={`/veiculo/${vehicle.slug}`} className="vehicle-title">{vehicle.brand} <strong>{vehicle.model}</strong></Link>
      <p className="vehicle-place"><MapPin size={14} /> {vehicle.city} · {vehicle.state}</p>
      <div className="vehicle-specs"><span>{vehicle.fuel}</span><span>{vehicle.transmission}</span><span>{vehicle.kmLimit}</span></div>
      <div className="vehicle-card-bottom"><div><small>A partir de</small><strong>{formatBRL(vehicle.priceWeekly)} <small>/ semana</small></strong><span>{vehicle.insurance}</span></div><a href={whatsapp} target="_blank" rel="noreferrer" onClick={() => trackEvent("whatsapp_click", { vehicle: vehicle.id })} className="whatsapp-link">WhatsApp <ArrowRight size={15} /></a></div>
    </div>
  </article>;
}

export default function Home() {
  const [city, setCity] = useState("");
  const [purpose, setPurpose] = useState("APP");
  const [category, setCategory] = useState("Todos");
  const [cityOpen, setCityOpen] = useState(false);
  const citySuggestions = useMemo(() => {
    const query = city.trim().toLocaleLowerCase("pt-BR");
    if (query.length < 3) return cityOptions;
    return cityOptions.filter((item) => `${item.city} ${item.state}`.toLocaleLowerCase("pt-BR").includes(query));
  }, [city]);
  const searchHref = useMemo(() => {
    const params = new URLSearchParams();
    if (city) params.set("cidade", city);
    params.set("finalidade", purpose);
    params.set("categoria", category);
    return `/buscar?${params.toString()}`;
  }, [city, purpose, category]);
  return <main>
    <section className="hero"><div className="hero-image" /><div className="hero-overlay" /><div className="container hero-inner"><div className="hero-copy"><div className="kicker"><span /> MARKETPLACE DE MOBILIDADE</div><h1>Encontre o veículo certo para <i>seguir em frente.</i></h1><p>Compare opções disponíveis na sua cidade, entenda as condições e fale direto com quem anuncia.</p><div className="hero-signals"><span><Check size={15} /> Informações transparentes</span><span><Check size={15} /> Contato direto</span></div></div><div className="hero-stamp"><Sparkles size={17} /><span>Pra quem<br /><strong>precisa rodar.</strong></span></div></div></section>
    <section className="search-panel-section"><div className="container"><div className="search-panel"><div className="search-intro"><span className="step-label">ENCONTRE SEM COMPLICAÇÃO</span><h2>O que você precisa<br className="desktop-only" /> para rodar?</h2></div><div className="search-fields"><div className="destination-field"><label htmlFor="home-city"><span><MapPin size={16} /> Cidade</span><input id="home-city" value={city} onChange={(e) => { setCity(e.target.value); setCityOpen(true); }} onFocus={() => setCityOpen(true)} onBlur={() => window.setTimeout(() => setCityOpen(false), 150)} placeholder="Para onde você vai?" autoComplete="off" aria-autocomplete="list" aria-controls="home-city-suggestions" aria-expanded={cityOpen} /></label>{cityOpen && <div id="home-city-suggestions" className="destination-suggestions" role="listbox">{city.trim().length > 0 && city.trim().length < 3 ? <p className="destination-hint">Digite pelo menos 3 letras para buscar uma cidade.</p> : citySuggestions.length ? citySuggestions.map((item) => <button type="button" role="option" key={`${item.city}-${item.state}`} onMouseDown={(event) => event.preventDefault()} onClick={() => { setCity(item.city); setCityOpen(false); }}><MapPin size={19} /><span><strong>{item.city}</strong><small>{item.state} · {item.country}</small></span></button>) : <p className="destination-hint">Nenhuma cidade encontrada. Você ainda pode pesquisar sem cidade.</p>}</div>}</div><label><span><SlidersHorizontal size={16} /> Tipo de veículo</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option>Todos</option><option>Carro</option><option>Moto</option><option>Elétrico</option><option>Utilitário</option></select></label><label><span><Users size={16} /> Finalidade</span><select value={purpose} onChange={(e) => setPurpose(e.target.value)}><option>APP</option><option>Entregas</option><option>Uso pessoal</option><option>Viagem</option><option>Empresarial</option></select></label><Link href={searchHref} className="primary-button search-button" onClick={() => trackEvent("search", { city, purpose, category })}><SearchIcon size={18} /> Buscar veículos</Link></div></div></div></section>
    <section className="container shortcut-section"><div className="section-heading compact"><div><span className="eyebrow orange">NAVEGUE POR INTENÇÃO</span><h2>Encontre do seu jeito.</h2></div><Link href="/buscar" className="text-link">Ver todas <ArrowRight size={16} /></Link></div><div className="shortcut-grid">{[{ label: "Carros para APP", icon: "▱", query: "finalidade=APP" }, { label: "Carros elétricos", icon: "ϟ", query: "categoria=Elétrico" }, { label: "Motos", icon: "◒", query: "categoria=Moto" }, { label: "Utilitários", icon: "▰", query: "categoria=Utilitário" }, { label: "Planos mensais", icon: "↻", query: "periodo=mensal" }].map((item) => <Link key={item.label} href={`/buscar?${item.query}`} className="shortcut-card"><span className="shortcut-icon">{item.icon}</span><span>{item.label}</span><ChevronRight size={17} /></Link>)}</div></section>
    <section className="inventory-section"><div className="container"><div className="section-heading"><div><span className="eyebrow orange">OFERTAS EM DESTAQUE</span><h2>Veículos prontos para rodar.</h2><p>Opções selecionadas com preço, cidade e condições visíveis desde o primeiro olhar.</p></div><Link href="/buscar" className="outline-button">Explorar todos <ArrowRight size={16} /></Link></div><div className="inventory-grid">{vehicles.slice(0, 3).map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} />)}</div></div></section>
    <section className="trust-section"><div className="route-line route-line-trust"><i /><span>confiança em cada etapa</span><i /></div><div className="container trust-grid"><div className="trust-lead"><span className="eyebrow orange">DECIDA COM MAIS CLAREZA</span><h2>Alugue com mais segurança.</h2><p>Um marketplace feito para você comparar o que importa antes de entrar em contato.</p><Link href="/#como-funciona" className="text-link">Como funciona <ArrowRight size={16} /></Link></div><div className="trust-items"><div><ShieldCheck size={25} /><strong>Veículos verificados</strong><span>Fotos reais e status de disponibilidade.</span></div><div><Users size={25} /><strong>Anunciantes identificados</strong><span>Saiba com quem você está falando.</span></div><div><Zap size={25} /><strong>Contato sem ruído</strong><span>Converse direto pelo canal que preferir.</span></div></div></div></section>
    <section id="como-funciona" className="how-section container"><div className="section-heading"><div><span className="eyebrow orange">COMO FUNCIONA</span><h2>Encontre. Converse. Combine.</h2></div><span className="route-mark">01 <i /> 03</span></div><div className="steps"><div><span>01</span><h3>Escolha seu veículo</h3><p>Pesquise por cidade, categoria e finalidade. Compare o que faz sentido para a sua rotina.</p></div><div><span>02</span><h3>Fale com o anunciante</h3><p>Tire dúvidas e confira caução, seguro, quilometragem e retirada antes de decidir.</p></div><div><span>03</span><h3>Faça sua locação</h3><p>Combine documentação, condições e próximos passos diretamente com o anunciante.</p></div></div></section>
    <section className="announce-banner"><div className="container announce-inner"><div><span className="eyebrow">PARA QUEM TEM UM VEÍCULO</span><h2>Seu veículo pode fazer<br /><i>alguém seguir em frente.</i></h2></div><div><p>Receba contatos de pessoas procurando veículos na sua região.</p><Link href="/anunciar" className="light-button">Anuncie seu veículo <ArrowRight size={16} /></Link></div></div></section>
  </main>;
}
