# Revisão visual da integração marketplace

## Desktop

A página `/buscar` manteve o cabeçalho, breadcrumb, hero editorial, filtros e grid de veículos sem quebras visíveis. A página `/anunciar` manteve o hero, callout e início do formulário alinhados. O prompt de instalação PWA aparece no canto inferior direito.

## Mobile

A página `/buscar` apresenta navegação compacta, título responsivo, campo de busca e filtros em uma única linha compacta; os cards começam abaixo da dobra. A página `/anunciar` apresenta hero empilhado e callout em largura adequada. O prompt PWA sobrepõe a parte inferior da viewport, conforme o comportamento já existente, sem cortar o conteúdo principal.

## Observações

A API marketplace permanece atrás de `VITE_MARKETPLACE_API_ENABLED`, portanto a visualização atual continua usando o fallback estático enquanto a produção não for promovida ao schema externo. O build e os testes automatizados foram aprovados após a integração.

## Revisão após fechamento dos gaps

A busca continua visualmente íntegra com o fallback estático ativo. O detalhe `/veiculo/geely-ex2-curitiba` permanece compatível com o catálogo legado, enquanto rotas numéricas passam a usar loading, erro e not-found reais quando a API é habilitada. O prompt PWA permanece visível no canto inferior direito e não há elementos principais cortados no desktop.

## Dashboard persistente

No desktop, métricas, inventário vazio e CTA de cadastro aparecem alinhados e legíveis. No mobile, o cabeçalho colapsa corretamente e os cards de métricas formam uma grade de duas colunas. A navegação horizontal de atalhos do dashboard permanece acessível, embora o usuário precise deslizar para ver todos os itens; não há sobreposição estrutural além do prompt PWA fixo esperado.

## E-mail oficial no site

O rodapé foi revisado em desktop e mobile. O link de contato agora aponta para `mailto:suporte@alugarodas.com.br`; a composição do rodapé permanece legível, sem quebra de colunas ou corte no mobile. A home mantém a hierarquia visual e os CTAs responsivos após a alteração.

## Validação explícita dos links de suporte

A home foi revisada em desktop e mobile após a centralização de `SUPPORT_MAILTO`; o rodapé permanece legível e o link usa `mailto:suporte@alugarodas.com.br`. O dashboard foi revisado em desktop; sem sessão persistente no preview, o AuthGuard exibe o estado de verificação de acesso, portanto as métricas não aparecem antes da autenticação. O link de suporte do dashboard usa a mesma constante oficial e foi coberto pelo teste `server/contact.links.test.ts`.

A revisão do dashboard em mobile confirmou que o rodapé, a navegação horizontal, os cards de métricas, o inventário vazio e o bloco de leads permanecem dentro da largura da tela após a centralização do contato. Não há cortes ou sobreposição; o contato de suporte permanece acessível no bloco de ajuda quando a sessão do anunciante está ativa.

## Acesso administrativo /adm

O preview desktop confirmou que `/adm` renderiza o painel administrativo com a identidade visual existente, sidebar, métricas de estrutura e estado protegido. A rota continua sob `AuthGuard` de `admin`; a tela pública `/entrar` mantém os perfis Cliente, Locador e Admin sem seleção de papel pelo navegador.

A revisão mobile do `/adm` mostrou header compacto, navegação horizontal dos módulos, cards em duas colunas e painel de moderação sem cortes. O conteúdo administrativo permanece legível em 375px; a navegação horizontal é intencional para acomodar as seções da sidebar.
