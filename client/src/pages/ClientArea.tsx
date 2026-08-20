import { ArrowRight, Bookmark, Heart, LogOut, MapPin, Search, ShieldCheck, UserRound } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { vehicles } from "@/lib/marketplace";

export default function ClientArea() {
  const { user, logout } = useAuth();
  const displayName = user?.name?.split(" ")[0] || "motorista";
  const clientAreaQuery = trpc.auth.clientArea.useQuery(undefined, { enabled: Boolean(user) });
  const favorites = clientAreaQuery.data?.favorites ?? [];
  const interests = clientAreaQuery.data?.interests ?? [];
  const favoriteVehicles = favorites.map((favorite) => vehicles.find((vehicle) => vehicle.id === favorite.vehicleKey)).filter(Boolean);

  return (
    <main className="client-area-page">
      <section className="client-area-hero">
        <div className="container client-area-hero-inner">
          <div>
            <span className="eyebrow orange">ÁREA DO CLIENTE</span>
            <h1>Olá, {displayName}.</h1>
            <p>Encontre opções para seguir em frente, salve seus favoritos e acompanhe os contatos que você iniciou.</p>
          </div>
          <div className="client-hero-actions"><div className="client-trust-card"><ShieldCheck size={20} /><span>Conta protegida pelo acesso seguro do Aluga Rodas.</span></div><button type="button" className="client-logout-button" onClick={() => void logout()}><LogOut size={16} /> Sair da conta</button></div>
        </div>
      </section>

      <section className="container client-area-content">
        {clientAreaQuery.isError && <div className="auth-error" role="alert">Não foi possível carregar seus dados agora. Tente atualizar a página.</div>}
        <div className="client-stats-grid">
          <article><span><Heart size={17} /> Favoritos</span><strong>{clientAreaQuery.isLoading ? "—" : favorites.length}</strong><small>Veículos salvos para comparar depois</small></article>
          <article><span><Bookmark size={17} /> Interesses</span><strong>{clientAreaQuery.isLoading ? "—" : interests.length}</strong><small>Conversas iniciadas com anunciantes</small></article>
          <article><span><MapPin size={17} /> Sua busca</span><strong>PR</strong><small>Explore ofertas por cidade e categoria</small></article>
        </div>

        <div className="client-area-grid">
          <section className="client-panel client-data-panel">
            <div className="client-panel-heading"><div><span className="eyebrow orange">SEUS FAVORITOS</span><h2>{favoriteVehicles.length ? "O que você guardou." : "Guarde o que faz sentido."}</h2></div><Heart size={22} /></div>
            {favoriteVehicles.length ? <div className="client-saved-list">{favoriteVehicles.map((vehicle) => vehicle && <Link key={vehicle.id} href={`/veiculo/${vehicle.slug}`} className="client-saved-item"><span className="client-saved-image"><img src={vehicle.image} alt="" /></span><span><strong>{vehicle.brand} {vehicle.model}</strong><small>{vehicle.city} · {vehicle.state} · R$ {vehicle.priceWeekly.toLocaleString("pt-BR")}/semana</small></span><ArrowRight size={16} /></Link>)}</div> : <><p>Quando você salvar um veículo, ele aparecerá aqui para facilitar a comparação de preço, caução, quilometragem e condições.</p><Link href="/buscar" className="primary-button">Buscar veículos <ArrowRight size={16} /></Link></>}
          </section>
          <section className="client-panel client-data-panel">
            <div className="client-panel-heading"><div><span className="eyebrow orange">MEUS INTERESSES</span><h2>{interests.length ? "Seus contatos recentes." : "Seus contatos ficam organizados."}</h2></div><UserRound size={22} /></div>
            {interests.length ? <div className="client-interest-list">{interests.map((interest) => <article key={interest.id}><strong>{interest.vehicleLabel}</strong><span>Interesse registrado em {new Date(interest.createdAt).toLocaleDateString("pt-BR")}</span></article>)}</div> : <><p>Depois de falar com um anunciante, você poderá acompanhar os veículos e os próximos passos nesta área.</p><Link href="/buscar" className="outline-button">Explorar ofertas <Search size={16} /></Link></>}
          </section>
        </div>

        <section className="client-next-step">
          <div><span className="eyebrow orange">PRÓXIMO PASSO</span><h2>Encontre um veículo na sua cidade.</h2><p>Compare opções para APP, uso pessoal, entregas, viagens e muito mais.</p></div>
          <Link href="/buscar" className="primary-button">Começar busca <ArrowRight size={16} /></Link>
        </section>
      </section>
    </main>
  );
}
