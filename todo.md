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

## Nova rodada

- [x] Corrigir o estado travado “Abrindo…” com timeout e fallback manual.
- [x] Validar o fallback do botão no preview: instrução de menu do navegador e botão “Entendi”.
- [x] Executar `pnpm check` e `pnpm build` sem erros.
- [x] Registrar auditoria dos acessos em `login-audit.md`.
- [ ] Implementar autenticação backend e papéis reais em próxima etapa.
