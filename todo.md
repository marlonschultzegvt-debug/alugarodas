# Auditoria de pré-lançamento

- [x] Rodar `pnpm check`, `pnpm build` e `pnpm test`.
- [x] Validar servidor, banco e migração de usuários.
- [x] Testar redirecionamento e proteção de rotas sem sessão; login/logout real dependem de sessão do proprietário.
- [x] Testar todas as rotas públicas; cadastro protegido validado até a entrada.
- [x] Validar PWA, manifest, service worker, offline e instalação manual.
- [x] Revisar desktop/mobile, console, links, metadados e SEO.
- [x] Corrigir bloqueios encontrados e repetir testes críticos.
- [x] Documentar dados pendentes: domínio, e-mail oficial, Instagram e suporte.

# Próxima etapa: autenticação real e acessos

## Escopo atual

- [x] Corrigir a guarda de `/dashboard` e `/anunciar` para aceitar apenas `locador` e `admin`.
- [x] Adicionar teste de negação para cliente em dashboard/anunciar e locador em admin.
- [x] Repetir auditoria de rotas protegidas e atualizar o relatório.
- [x] Migrar o projeto estático para full-stack com backend, banco e usuários.
- [x] Modelar papéis `admin`, `cliente` e `locador`.
- [x] Criar rota `/entrar` com sessão segura e redirecionamento por perfil.
- [x] Corrigir proteção por papel do dashboard, área do anunciante e área administrativa.
- [x] Proteger dashboard, área do anunciante e futuras áreas administrativas.
- [x] Testar acesso sem permissão por papel no backend e frontend; login/logout com contas reais pendente.
- [x] Testar acesso sem permissão e RBAC no backend; login/logout com contas reais pendente.

# Próxima etapa: instalação mobile e acessos

## Escopo atual

- [x] Reproduzir por que o botão “Instalar” não conclui o download no celular.
- [x] Diferenciar prompt nativo Android, instalação manual no iPhone e navegador incompatível.
- [x] Corrigir o CTA para oferecer instrução útil quando o prompt nativo não estiver disponível.
- [x] Auditar se existem autenticação e rotas reais para Administrador, Cliente e Locador.
- [x] Testar cada caminho de acesso sem usar credenciais reais ou expor dados privados.

# Evolução PWA do Aluga Rodas

## Requisitos

- [x] Mapear HTML, entrypoint e assets atuais.
- [x] Criar `manifest.webmanifest` com nome, short name, start URL, scope, display, cores e ícones.
- [x] Criar ícones 192x192, 512x512 e versões maskable.
- [x] Configurar `apple-touch-icon` e metatags mobile.
- [x] Criar service worker com cache somente de assets públicos estáticos.
- [x] Evitar cache de login, dashboard, leads, formulários e dados sensíveis.
- [x] Criar fallback offline amigável.
- [x] Implementar atualização automática e limpeza de caches antigos.
- [x] Registrar o service worker no frontend.
- [x] Validar manifest, build, service worker, offline e responsividade.
- [x] Salvar checkpoint final após os testes.

## Correção de alinhamento e instalação mobile

- [ ] Reproduzir no Safari iPhone a ausência do botão de ação de instalação.
- [ ] Adicionar botão “Como instalar” no iPhone, sem prometer download automático.
- [ ] Manter prompt nativo no Android/desktop quando disponível e fallback manual quando não estiver.
- [ ] Confirmar alinhamento dos valores dentro dos selects no formulário.
- [ ] Testar mobile/desktop, console e build antes do checkpoint.

## Correção de alinhamento do formulário

- [ ] Reproduzir o valor selecionado aparecendo abaixo do select.
- [ ] Remover ou corrigir o espelho visual duplicado sem perder contraste.
- [ ] Alinhar ano, estado, cidade, combustível, câmbio e categoria dentro dos controles.
- [ ] Testar desktop e mobile com todos os selects preenchidos.
- [ ] Confirmar PWA preservada, console sem erros e build aprovado.

## Nova rodada

- [x] Corrigir o estado travado “Abrindo…” com timeout e fallback manual.
- [x] Validar o fallback do botão no preview: instrução de menu do navegador e botão “Entendi”.
- [x] Executar `pnpm check` e `pnpm build` sem erros.
- [x] Registrar auditoria dos acessos em `login-audit.md`.
- [x] Implementar autenticação backend e papéis reais em próxima etapa.
