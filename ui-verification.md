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
