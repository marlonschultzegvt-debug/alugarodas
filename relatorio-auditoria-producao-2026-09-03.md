# Relatório de auditoria de produção — Aluga Rodas

**Data:** 03 de setembro de 2026  
**Domínio auditado:** `https://alugarodas.com.br`  
**Escopo:** domínio e HTTPS, Render, TiDB, cadastro e sessão, perfis, marketplace, imagens, PWA, SEO técnico, segurança, responsividade e plano de autenticação social.

## Resumo executivo

O Aluga Rodas está **online**, com domínio próprio, HTTPS, imagens públicas, cadastro por e-mail e senha, controle de papéis e marketplace validado em ambiente de preview. Durante a auditoria foram encontrados e corrigidos problemas relevantes: URL de imagens interna, schema de banco incompleto, sessão nula após login, logout sem revogação efetiva, exposição de hash de senha na resposta de sessão, busca vazia, source maps públicos, metadados apontando para host Manus, ausência de cabeçalhos defensivos e incompatibilidade do comando de desenvolvimento em Windows.

O teste externo mais recente passou: cadastro, login, `auth.me` e logout retornaram HTTP 200. Após login, o endpoint de sessão devolveu somente `id`, `name`, `email` e `role`; após logout, devolveu `null`. Isso confirma o contrato de sessão público e a revogação no servidor.

> **Decisão de lançamento:** a plataforma pode permanecer acessível para validação e captação inicial, mas a divulgação comercial ampla deve começar somente depois de publicar anúncios reais e configurar o método de recuperação de conta. A vitrine atual identifica explicitamente veículos editoriais como prévia; ela não deve ser apresentada como inventário real de locação.

## Resultado por área

| Área | Situação | Evidência e conclusão |
|---|---|---|
| Domínio e HTTPS | Aprovado | `alugarodas.com.br` respondeu com HTTPS, HSTS e o domínio `www` foi configurado como redirecionamento. |
| Imagens e identidade | Aprovado | Logo, hero, fotos de catálogo e ícones PWA passaram a usar URLs públicas, em vez de caminhos internos do ambiente de desenvolvimento. |
| Banco TiDB | Aprovado com operação contínua | Foi criado e migrado o banco dedicado `alugarodas`. O schema deixou de depender do banco `sys`. |
| Cadastro e login | Aprovado | O fluxo técnico externo retornou sucesso no cadastro e login por e-mail/senha. |
| Sessão e logout | Aprovado | `auth.me` retorna usuário após login; sessão é revogada após logout. Hashes e tokens não são enviados ao navegador. |
| Cliente e Locador | Aprovado no preview | Favoritos, interesse, empresa, veículo e dashboard foram testados tecnicamente. |
| Admin e moderação | Aprovado no preview | Ativação, destaque, visualização, lead e publicação no catálogo passaram no teste técnico. |
| Busca pública | Aprovado com ressalva | O catálogo exibe prévia editorial clara quando ainda não existem anúncios persistentes ativos. |
| SEO técnico básico | Aprovado | `robots.txt`, sitemap, canonical e Open Graph foram ajustados para `alugarodas.com.br`. |
| PWA | Aprovado tecnicamente | Manifest, worker, ícones e offline responderam; o navegador confirmou worker registrado no escopo do domínio. |
| Segurança HTTP | Aprovado com ressalva | HSTS, `nosniff`, proteção de frame, referrer e permissions policy estão ativos. Não foi aplicada CSP estrita para evitar bloquear carregamentos até validação report-only. |
| Testes automatizados | Aprovado | 52 testes locais passaram; TypeScript e build passaram. Seis testes de integração TiDB ficaram corretamente opt-in, pois requerem credencial e CA externos válidos. |

## Correções implementadas

| Problema encontrado | Correção aplicada | Verificação |
|---|---|---|
| Fotos quebradas no Render | Migração das referências internas para URLs públicas | Home e catálogo exibiram imagens no domínio oficial. |
| Hero com URL legada | Substituição por URL pública | Primeira dobra renderizada no preview; publicação incluída nos pacotes de sincronização. |
| Cadastro sem schema no banco | Banco dedicado `alugarodas` criado e migrações aplicadas | Servidor local e teste técnico externo concluíram cadastro. |
| Sessão nula após login | Normalização do timestamp de revogação do TiDB | Preview e produção retornaram sessão ativa após login. |
| Token aceito após logout | Revogação persistida baseada no horário de login | Token de teste foi rejeitado após logout. |
| `passwordHash` exposto em `auth.me` | Serialização pública por lista permitida de campos | Teste automatizado e prova externa confirmaram ausência de campos sensíveis. |
| Busca vazia | Fallback com prévia editorial claramente sinalizada | Busca oficial passou a mostrar quatro cards com aviso de prévia. |
| SEO em host Manus | Sitemap, robots, canonical e OG para domínio oficial | `robots.txt` e sitemap responderam com host oficial. |
| Source maps públicos | Source maps desabilitados no build de produção | URL de `.map` passou a receber o fallback HTML, sem entregar mapa de fontes. |
| `pnpm dev` quebrado no Windows | Uso de `cross-env` nos scripts | O servidor local iniciou em Windows após a correção. |

## Pendências que não devem ser disfarçadas

| Prioridade | Pendência | Impacto | Próxima ação objetiva |
|---:|---|---|---|
| Alta | **Anúncios reais** | A vitrine é editorial enquanto não houver oferta persistente e ativa. | Criar conta Locador real, cadastrar empresa, veículos, fotos e ativar os anúncios com Admin. |
| Alta | **Admin operacional** | O email `suporte@alugarodas.com.br` ainda precisa de promoção controlada. | Cadastrar esse e-mail e promover a role diretamente no banco `alugarodas`, mantendo Admin fora do cadastro público. |
| Alta | **Recuperação de senha / código por e-mail** | Sem esse fluxo, usuário que esquecer a senha dependerá de suporte. | Implementar OTP de seis dígitos com envio transacional e rate limit. |
| Média | Metadados específicos por rota SEO | As páginas de cidade/categoria ainda usam shell SPA; o SEO local ficará mais forte com conteúdo e metadata específicos no HTML. | Implementar prerender/SSR das rotas de cidade e categoria após estabilizar inventário real. |
| Média | Política de Segurança de Conteúdo (CSP) | Cabeçalhos existentes reduzem risco, mas CSP acrescentará defesa contra injeção. | Começar com `Content-Security-Policy-Report-Only`, observar violações e aplicar depois. |
| Média | Testes em dispositivos físicos | PWA e responsividade foram validados tecnicamente e no preview, não em toda combinação de aparelho/browser. | Fazer smoke test em Android Chrome, iPhone Safari e desktop antes da campanha. |
| Média | Registro/limpeza de dados de QA | Testes técnicos criaram contas de QA no banco de produção. | Remover os registros de QA de modo controlado depois de documentar os IDs e dependências. |

## Autenticação comparável a marketplaces modernos

O padrão mostrado na referência da OLX é adequado: uma tela inicial simples com e-mail e botões sociais, seguida de escolha entre código por e-mail e senha quando aplicável. A proposta para o Aluga Rodas é manter a senha atual como alternativa e implantar gradualmente métodos com menor atrito.

| Fase | Experiência para o usuário | Implementação | Dependência externa |
|---:|---|---|---|
| 1 | **Continuar com Google** | OAuth/OpenID Connect com validação no backend e vínculo por `provider + subject` | Projeto Google Cloud, Client ID e Client Secret |
| 2 | **Entrar com e-mail** → código de 6 dígitos | Código hashado, expiração de 10 min., 5 tentativas, reenvio em 60 s e limite por IP/e-mail | Provedor transacional, remetente validado e chave de API/SMTP |
| 3 | **Continuar com Facebook** | Authorization Code Flow, `state`, callback exato e validação server-side | App Meta, App ID e App Secret |

O Google Identity Services deve ser usado apenas para autenticação, sem solicitar permissões de Gmail, Drive ou outros dados. O serviço retorna um ID token para login, e a validação precisa ocorrer no servidor. [1] O Facebook exige domínio permitido, HTTPS, callback com correspondência exata e proteção `state`; o App Secret não pode aparecer em código de navegador. [2]

Para e-mail, recomenda-se **OTP de seis dígitos**, em vez de magic link como caminho principal. Links mágicos podem falhar no iPhone quando a solicitação é iniciada no Chrome e o e-mail abre no Safari. [3] O Zoho pode continuar como caixa postal do domínio; o envio transacional deve ser feito por um serviço próprio com monitoramento de entregabilidade.

### Dados e segredos necessários antes de desenvolver login social

| Item | Onde criar | Dados que o Aluga Rodas precisará receber/configurar |
|---|---|---|
| Google OAuth | Google Cloud Console | `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, origens e callback `https://alugarodas.com.br/api/auth/google/callback` |
| Facebook Login | Meta for Developers | `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET`, domínio permitido e callback `https://alugarodas.com.br/api/auth/facebook/callback` |
| E-mail OTP | Serviço transacional escolhido | Chave de API/SMTP, remetente `acesso@alugarodas.com.br`, domínio verificado |
| Banco | TiDB `alugarodas` | Migração para `auth_identities` e `email_login_codes`, com índices e hashes de código |

Essas credenciais devem ser cadastradas somente no ambiente seguro do Render. Elas não devem ser enviadas no chat, commitadas no GitHub ou colocadas no frontend.

## Próxima sequência recomendada

Primeiro, criar as contas reais de Locador e de suporte. Em seguida, cadastrar os primeiros veículos com fotos, revisar dados e ativar pelo Admin. Depois, executar um teste real de ponta a ponta: busca por cidade, favorito, interesse, lead, WhatsApp e dashboard. Somente após haver inventário real deve começar investimento em tráfego pago.

Em paralelo, a próxima melhoria de autenticação deve ser Google + OTP por e-mail. O Facebook entra depois, quando houver conta Meta Developer, callbacks configurados e tempo para testar webviews de Instagram e Facebook. Essa ordem reduz trabalho e evita repetir ajustes de banco ou interface.

## Referências

[1] [Google Identity Services — Sign in with Google for Web](https://developers.google.com/identity/gsi/web/guides/overview)  
[2] [Meta for Developers — Facebook Login Security](https://developers.facebook.com/documentation/facebook-login/security)  
[3] [Auth0 — Passwordless Authentication with Magic Links](https://auth0.com/docs/authenticate/passwordless/authentication-methods/email-magic-link)
