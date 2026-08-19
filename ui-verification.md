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

## Auditoria de produção após checkpoint c080307f

A home publicada em `https://alugarodas-jp8f2bzz.manus.space/` respondeu corretamente. O título exibido é `Aluguel de carros para Uber e APP | Aluga Rodas`; a página apresenta busca por cidade, categoria e finalidade, atalhos de APP, elétricos, motos, utilitários e mensal, cards de Geely EX2, Honda CG 160 Start e Fiat Fiorino, CTA de WhatsApp, fluxo Como funciona, anúncio e `mailto:suporte@alugarodas.com.br`. O subdomínio está acessível e a identidade visual Estrada Editorial está presente.

## Divergência encontrada em produção

A URL pública `https://alugarodas-jp8f2bzz.manus.space/adm` retornou a página 404, enquanto o preview local renderiza o painel `/adm`. Isso indica que a publicação acessada ainda não está refletindo a rota administrativa ou que o subdomínio está servindo uma versão anterior; a divergência precisa ser corrigida antes de considerar a rota administrativa validada em produção.

A tentativa de consultar `https://alugarodas-jp8f2bzz.manus.space/__manus__/version.json` também exibiu a página 404 da aplicação, em vez do JSON de versão. A home continua acessível, mas rotas/arquivos internos do build não estão refletindo o estado do preview; a publicação deve ser revalidada pelo painel após o checkpoint.

## Artefatos HTTP em produção

No subdomínio publicado, `robots.txt`, `sitemap.xml`, `manifest.webmanifest` e `sw.js` responderam HTTP 200 com content-types corretos. O robots aponta temporariamente para o sitemap do subdomínio Manus; o manifest preserva nome, short name, descrição, start URL, scope e display standalone; o service worker público está acessível.

## Rotas públicas adicionais em produção

`/buscar` respondeu com catálogo público de quatro veículos, filtros de cidade/categoria/finalidade, ordenação, detalhes e WhatsApp. `/entrar` respondeu com Cliente, Locador e Admin apenas como descrições de perfis, botão único de acesso seguro e aviso de que permissões são definidas no servidor; não há seleção pública de papel.

`/anunciar` em produção redirecionou corretamente visitantes sem sessão para `/entrar`, sem expor o formulário protegido. O detalhe `/veiculo/geely-ex2-curitiba` respondeu com galeria, preço semanal/mensal, caução, seguro, manutenção, quilometragem, disponibilidade, compatibilidade APP, botão Tenho interesse, WhatsApp e favoritos.

## Metadados publicados

A home pública contém `link rel="manifest"` para `/manifest.webmanifest`, meta description, `og:type`, `og:site_name`, `og:title`, `og:description`, `og:image` e `twitter:card`, todos acessíveis no HTML publicado.

## PWA em produção

No navegador em produção, `navigator.serviceWorker` está disponível e há um registro ativo com escopo `https://alugarodas-jp8f2bzz.manus.space/` e script `https://alugarodas-jp8f2bzz.manus.space/sw.js`; não há registro waiting. A verificação confirma o service worker ativo no domínio publicado, embora a validação de instalação/offline real em dispositivos ainda dependa de teste manual.

A produção também respondeu `offline.html` com HTTP 200 e content-type HTML, e o navegador expôs apenas o cache público `aluga-rodas-static-v1`. Isso confirma a presença do fallback e a estratégia de cache restrito; a instalação em Android/iOS continua exigindo teste manual em dispositivo.

## Cadastro e Instagram

A revisão mobile do `/cadastre-se` mostrou os dois perfis permitidos, botões Google/Gmail e Apple/iCloud, CTA seguro, mensagem de proteção administrativa e retorno para Entrar, sem cortes em 375px. O footer exibe `Instagram @alugarodas` em coluna legível. A captura de `/entrar` no preview manteve uma sessão administrativa persistida do navegador e por isso exibiu o painel protegido; isso não altera os testes de visitante sem sessão nem o guard server-side.

## Logs do cadastro

Os logs recentes do preview registraram carregamento das rotas `/cadastre-se` e `/entrar` e eventos de analytics HTTP 200, sem erro de console ou falha de rede visível na auditoria. Dados identificáveis de sessão foram tratados como privados e não serão incluídos no relatório.

## Divergência pós-publicação do cadastro

Após o checkpoint `4e8beba0`, o preview local contém `/cadastre-se`, mas `https://alugarodas-jp8f2bzz.manus.space/cadastre-se` ainda retorna a página 404. A home pública permanece acessível. É necessário aguardar ou disparar uma nova publicação para que a rota recém-criada seja refletida no subdomínio.
