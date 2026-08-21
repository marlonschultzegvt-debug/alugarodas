# Opções de hospedagem externa — Aluga Rodas

## Recomendação

Render Web Service é a opção recomendada para a primeira migração externa, porque hospeda aplicações Node/Express, aceita repositório Git, variáveis secretas, domínio customizado, TLS gerenciado e health checks. A aplicação deve escutar `process.env.PORT` em `0.0.0.0`.

## Alternativa

Railway também é compatível com Node.js e cobra por uso, com plano Hobby de US$ 5/mês incluindo US$ 5 de créditos, conforme a página oficial consultada em 20/08/2026. É tecnicamente viável, mas o controle de custos depende do consumo.

## Fontes oficiais

- Render Web Services: https://render.com/docs/web-services
- Render Custom Domains: https://render.com/docs/custom-domains
- Railway Pricing: https://railway.com/pricing

## Arquitetura recomendada

Um único Render Web Service para o bundle Express/tRPC e frontend compilado; TiDB Cloud como banco externo; S3/Manus Storage ou outro storage compatível para fotos; Registro.br para DNS; secrets configurados no provedor. Não separar frontend e backend no primeiro deploy, pois o projeto atual entrega os dois pelo mesmo servidor.

## Cuidados

Antes da troca, fazer checkpoint e backup lógico dos dados. Configurar `DATABASE_URL`, `JWT_SECRET`, OAuth, URLs Forge, chaves de storage e variáveis públicas. Validar callback OAuth no domínio final, cookies Secure/SameSite, upload S3, rotas SPA, `/api/trpc`, leads e webhook/WhatsApp. Não publicar secrets no Git.
