# Plano de autenticação social e código por e-mail

**Projeto:** Aluga Rodas  
**Data:** 03 de setembro de 2026  
**Estado atual:** cadastro por e-mail e senha, sessão por cookie HTTP-only, papéis Cliente/Locador/Admin e revogação no logout já foram implementados e validados. Esta proposta não habilita provedores sociais sem as credenciais e URLs autorizadas do proprietário.

## Decisão recomendada

O próximo incremento deve priorizar **Google** e **código de uso único por e-mail**. O acesso via Facebook deve entrar como terceira opção, depois que os dois primeiros fluxos estiverem estáveis. Essa sequência atende ao padrão de entrada rápida visto em marketplaces, reduz o atrito para usuários com conta Google e mantém uma alternativa universal para quem prefere informar apenas e-mail.

| Opção | Prioridade | Motivo | Dependência do proprietário |
|---|---:|---|---|
| E-mail e senha atual | Manter | Já funciona e não exige terceiros | Nenhuma nova |
| Google | 1 | Menor atrito para grande parte do público e implementação web madura | Projeto Google Cloud + Client ID/Secret |
| Código de 6 dígitos por e-mail | 2 | Funciona para qualquer e-mail e evita depender de senha no primeiro acesso | Serviço de envio de e-mail transacional e domínio remetente |
| Facebook | 3 | Complementa aquisição, mas requer app Meta, revisão/configuração e maior cuidado em webviews | App Meta + App ID/Secret |

> Não criar botões sociais meramente visuais. Um botão só deve aparecer após o callback de servidor, a validação do token e a configuração de credenciais estarem prontos.

## Arquitetura proposta

Os provedores não devem gravar senhas artificiais na tabela `users`. A aplicação deve manter o usuário como identidade de negócio e criar uma tabela de identidades vinculadas:

| Tabela | Campos essenciais | Regras de segurança |
|---|---|---|
| `auth_identities` | `id`, `userId`, `provider`, `providerSubject`, `emailAtLinkTime`, `createdAt` | `UNIQUE(provider, providerSubject)`; não confiar apenas no e-mail retornado pelo provedor |
| `email_login_codes` | `id`, `email`, `codeHash`, `purpose`, `expiresAt`, `attempts`, `consumedAt`, `createdAt` | Armazenar somente hash do código; expirar em 10 minutos; limite de tentativas e reenvio |
| `users` | manter campos atuais | E-mail normalizado; criar usuário somente após verificar o provedor/código |

O callback social e a confirmação de código devem gerar a mesma sessão HTTP-only usada hoje. O backend deve verificar identidade, papel permitido, rate limit e estado da transação antes de criar o cookie. Nunca expor segredo de provedor, hashes, código de e-mail ou token de acesso no frontend.

## Google: configuração e fluxo

O Google Identity Services separa autenticação de autorização: o login entrega um **ID token** para autenticar no site, enquanto tokens de acesso devem ser solicitados apenas quando houver necessidade de acessar dados Google. O Aluga Rodas precisa apenas de autenticação; portanto, não deve solicitar permissões de Drive, Gmail ou outros dados. [1]

1. Criar ou selecionar um projeto no Google Cloud Console.
2. Configurar a tela de consentimento com o nome **Aluga Rodas**, domínio `alugarodas.com.br`, e-mail de suporte e política de privacidade.
3. Criar um cliente OAuth Web Application.
4. Autorizar a origem `https://alugarodas.com.br` e, se necessário, `https://www.alugarodas.com.br`.
5. Autorizar o callback exato, por exemplo `https://alugarodas.com.br/api/auth/google/callback`.
6. Salvar no Render somente `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET`.
7. No backend, validar assinatura, emissor, audiência, expiração e `sub` do ID token ou trocar o authorization code no servidor. O `sub`, e não o e-mail, é a chave de identidade do Google.

## Facebook: configuração e fluxo

O Facebook Login requer um app registrado no painel Meta, com domínio permitido, HTTPS e URLs de retorno exatas. A Meta alerta que o `redirect_uri` deve coincidir exatamente com a lista autorizada; `state` deve ser usado contra CSRF; e o App Secret nunca pode ir para código de navegador. [2]

1. Criar um app de consumidor na Meta for Developers e adicionar o produto Facebook Login para web.
2. Adicionar `alugarodas.com.br` em Allowed Domains.
3. Registrar `https://alugarodas.com.br/api/auth/facebook/callback` em Valid OAuth Redirect URIs.
4. Guardar no Render apenas `FACEBOOK_APP_ID` e `FACEBOOK_APP_SECRET`.
5. Usar Authorization Code Flow com `state` criptograficamente aleatório e verificação no backend.
6. No callback, validar token e identidade do provedor antes de vincular ou criar usuário.

O uso em navegadores internos de Instagram/Facebook merece teste adicional: pop-ups podem ser bloqueados e o fluxo pode cair em redirecionamento. A URL de login deve constar entre as URLs válidas do app Meta. [2]

## Código de acesso por e-mail

Para reproduzir a experiência “informar e-mail → receber código”, a tela inicial deve ter apenas o campo e-mail e o botão **Continuar**. Depois, apresentar uma tela de código de seis dígitos e oferecer **Usar senha** como alternativa. É preferível implementar OTP de seis dígitos a um magic link como fluxo principal, porque links podem abrir em outro navegador no iPhone e invalidar a transação. [3]

| Regra | Implementação recomendada |
|---|---|
| Validade | 10 minutos |
| Reenvio | máximo 1 a cada 60 segundos |
| Tentativas | máximo 5 por código |
| Armazenamento | hash do código com sal; jamais texto puro |
| Antiabuso | limite por IP e por e-mail; respostas que não revelem se o e-mail existe |
| Remetente | `acesso@alugarodas.com.br` ou `suporte@alugarodas.com.br`, após validar o domínio |
| Conteúdo | assunto claro, código, validade, alerta para ignorar caso não tenha solicitado |

O Zoho Mail pode continuar como caixa postal do domínio, mas o envio transacional deve ser feito por um provedor com API/SMTP adequado, monitoramento de entrega e limites próprios. Entre as alternativas que podem ser avaliadas estão Resend, Amazon SES, Postmark ou SMTP transacional do provedor escolhido. A seleção final depende de custo, limite mensal, domínio remetente e disponibilidade da conta do proprietário.

## Variáveis que serão necessárias no Render

| Variável | Uso | Quando criar |
|---|---|---|
| `GOOGLE_CLIENT_ID` | Identificar o cliente web Google | Após criar app Google |
| `GOOGLE_CLIENT_SECRET` | Troca/verificação server-side Google | Após criar app Google |
| `FACEBOOK_APP_ID` | Identificar app Meta | Após criar app Meta |
| `FACEBOOK_APP_SECRET` | Troca/verificação server-side Meta | Após criar app Meta |
| `EMAIL_PROVIDER_API_KEY` ou SMTP equivalente | Envio de OTP | Após decidir o provedor de e-mail |
| `EMAIL_FROM` | Remetente verificado | Após validar domínio remetente |
| `AUTH_ENCRYPTION_SECRET` | Proteger estado/códigos quando aplicável | Gerar uma chave longa independente de `JWT_SECRET` |

## Critérios de aceite

Antes de exibir qualquer novo método no site, os seguintes cenários devem passar em produção: criação de conta Google, login Google em nova aba e webview, login Facebook em nova aba e webview, solicitação e confirmação de OTP, expiração e reenvio de código, associação de conta existente, logout com revogação, troca de papel permitida, bloqueio de Admin no cadastro público e ausência de segredos/hashes no browser.

## Referências

[1] [Google Identity Services — Sign in with Google for Web](https://developers.google.com/identity/gsi/web/guides/overview)  
[2] [Meta for Developers — Facebook Login Security](https://developers.facebook.com/documentation/facebook-login/security)  
[3] [Auth0 — Passwordless Authentication with Magic Links](https://auth0.com/docs/authenticate/passwordless/authentication-methods/email-magic-link)
