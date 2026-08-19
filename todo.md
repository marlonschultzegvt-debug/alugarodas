# Publicação operacional

- [ ] Confirmar que a transição DNS terminou no Registro.br.
- [ ] Adicionar e verificar o TXT do Zoho.
- [ ] Adicionar os MX do Zoho após a verificação.
- [ ] Criar e testar `suporte@alugarodas.com.br`.
- [ ] Associar `alugarodas.com.br` ao projeto no painel de hospedagem.
- [ ] Atualizar rodapé, mailto, SEO e canais oficiais.
- [ ] Validar HTTPS, rotas públicas, PWA e redirecionamentos em produção.
- [ ] Salvar checkpoint operacional final.

# Preparação de contas e publicação online

- [x] Confirmar onde o domínio `alugarodas.com.br` foi comprado: Registro.br.
- [ ] Obter acesso ao painel DNS do Registro.br e validar permissão para editar os registros.
- [ ] Criar ou confirmar o e-mail oficial `suporte@alugarodas.com.br`.
- [ ] Informar o @ oficial do Instagram.
- [ ] Não criar contas Vercel/Netlify/banco externo sem necessidade.
- [ ] Associar o domínio no painel do projeto.
- [ ] Atualizar links de suporte, Instagram, SEO e rodapé.
- [ ] Validar domínio, e-mail e canais no site publicado.

# Conexão TiDB Cloud

- [x] Criar um recurso TiDB Cloud Starter gratuito.
- [x] Escolher região próxima e habilitar TLS.
- [ ] Confirmar operacionalmente no TiDB Cloud a revogação da credencial exposta no chat; o proprietário informou que realizou a ação, mas o projeto não audita esse evento externo.
- [x] Cadastrar uma nova URI TiDB somente no segredo seguro `TIDB_DATABASE_URL` para staging.
- [x] Validar a nova credencial com teste Vitest somente leitura; conexão aprovada após a rotação informada.
- [ ] Registrar a conexão final no segredo `DATABASE_URL` somente após aprovação da migração.
- [x] Migrar o schema inicial `users` e validar as colunas no staging; veículos e leads ainda não foram migrados porque não existem no schema Drizzle atual.
- [x] Validar escrita/leitura de usuário compatível com autenticação em transação com rollback; nenhum usuário de teste permaneceu no staging.

# Escolha do banco de dados

- [ ] Comparar banco integrado Manus/TiDB com Supabase, Neon e outras opções gratuitas.
- [ ] Escolher a opção de menor risco para o MVP.
- [x] Confirmar que a produção continua no banco integrado atual durante o staging.
- [ ] Confirmar se haverá migração ou manutenção definitiva do banco atual.
- [ ] Definir e migrar schema persistente de veículos, locadoras, imagens e leads; o staging atual contém somente users.
- [x] Criar conexão de staging e variável `TIDB_DATABASE_URL` somente após decisão do proprietário.

# Preparação para operação online

- [ ] Confirmar domínio final e registrar a configuração de DNS necessária.
- [ ] Confirmar e-mail oficial de suporte e @ oficial do Instagram.
- [ ] Definir fluxo de publicação: Manus como hosting, banco MySQL/TiDB e storage S3.
- [ ] Criar alimentação persistente de veículos, imagens, locadoras e leads.
- [ ] Criar área administrativa para cadastrar, editar, pausar e moderar anúncios.
- [ ] Definir papéis e permissões de Admin, Locador e Cliente na operação.
- [ ] Validar backups, segurança, logs, produção e rotina de atualização.
- [ ] Publicar checkpoint operacional após os testes.

# Rodada final: testes, contatos e lançamento

- [ ] Validar login real de Cliente, Locador e Admin com sessões autenticadas.
- [ ] Testar `/anunciar` autenticado no desktop e mobile com selects preenchidos.
- [ ] Confirmar console limpo e build final após esses testes.
- [ ] Receber e-mail oficial de suporte, @ oficial do Instagram e domínio comprado.
- [ ] Atualizar rodapé, links, mailto, Instagram, SEO e suporte com dados oficiais.
- [ ] Verificar configuração do domínio customizado no painel.
- [ ] Salvar checkpoint final de lançamento.

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

- [x] Reproduzir no Safari iPhone a ausência do botão de ação de instalação.
- [x] Adicionar botão “Como instalar” no iPhone, sem prometer download automático.
- [x] Manter prompt nativo no Android/desktop quando disponível e fallback manual quando não estiver.
- [ ] Confirmar alinhamento dos valores dentro dos selects no formulário após teste autenticado final.
- [ ] Testar mobile/desktop, console e build do formulário antes do checkpoint final.

## Correção de alinhamento do formulário

- [x] Reproduzir o valor selecionado aparecendo abaixo do select.
- [x] Remover ou corrigir o espelho visual duplicado sem perder contraste.
- [ ] Validar ano, estado, cidade, combustível, câmbio e categoria dentro dos controles após login.
- [ ] Testar desktop e mobile com todos os selects preenchidos após login.
- [ ] Confirmar PWA preservada, console sem erros e build aprovado na rodada final.

## Nova rodada

- [x] Corrigir o estado travado “Abrindo…” com timeout e fallback manual.
- [x] Validar o fallback do botão no preview: instrução de menu do navegador e botão “Entendi”.
- [x] Executar `pnpm check` e `pnpm build` sem erros.
- [x] Registrar auditoria dos acessos em `login-audit.md`.
- [x] Implementar autenticação backend e papéis reais em próxima etapa.

# Evolução do staging marketplace

- [x] Corrigir e validar o parser do `PwaInstallPrompt` e confirmar build sem erro.
- [x] Modelar `companies`, `vehicles`, `vehicle_images` e `leads` no Drizzle.
- [x] Gerar e revisar a migração SQL do schema marketplace.
- [x] Aplicar as tabelas no TiDB staging sem apagar dados existentes.
- [x] Validar chaves estrangeiras, índices e leitura das tabelas.
- [x] Executar Vitest completo e confirmar produção ainda apontando para o banco atual.
- [x] Salvar checkpoint somente após build e testes aprovados.

# Pendências de produção

- [ ] Promover o TiDB staging para produção somente após aprovação explícita.
- [ ] Manter `DATABASE_URL` inalterado até a decisão de promoção.
- [ ] Corrigir a referência de asset `/manus-storage/aluga-rodas-hero_82e5fd36.jpg` se necessário.
- [ ] Avaliar divisão do bundle JavaScript acima de 500 kB.
