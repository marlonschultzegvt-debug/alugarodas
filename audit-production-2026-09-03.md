# Evidências de produção — 03 de setembro de 2026

## Autenticação externa

O fluxo técnico no domínio oficial retornou HTTP 200 para cadastro, login, leitura de sessão e logout. A resposta de `auth.me` após a última publicação continha somente `id`, `name`, `email` e `role`; após logout, retornou `null`.

## Cliente e Locador externos

Um fluxo técnico autorizado no domínio oficial criou uma conta de Locador, empresa e veículo em estado de rascunho; o dashboard retornou o veículo criado. Uma conta de Cliente salvou o veículo em favoritos e registrou interesse; a área do Cliente retornou um favorito e um interesse. O veículo não apareceu na busca pública porque, corretamente, ainda não havia sido ativado por Admin.

## Busca pública

A rota `https://alugarodas.com.br/buscar` concluiu o carregamento e exibiu quatro veículos na prévia editorial: Geely EX2, Honda CG 160 Start, Fiat Fiorino Endurance e Renault Kwid Zen. A interface apresentou o aviso explícito de prévia editorial enquanto não há anúncios persistentes publicados, evitando que a busca pareça vazia.

## Detalhe público

A rota `https://alugarodas.com.br/veiculo/geely-ex2-curitiba` exibiu a imagem pública, cidade, preço, condições, seguro, caução, quilometragem, botão de interesse, favorito e link de WhatsApp com URL canônica do anúncio. Não houve travamento de carregamento, imagem quebrada ou erro de catálogo nessa rota editorial.

## Cabeçalhos, SEO e PWA

O domínio respondeu com HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` e `Permissions-Policy`. `robots.txt` e `sitemap.xml` apontaram para `https://alugarodas.com.br`; manifest, service worker e página offline responderam com os tipos de conteúdo esperados. A URL de source map respondeu com HTML da SPA, não com o artefato do mapa.
