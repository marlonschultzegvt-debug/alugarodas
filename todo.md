# Publicação operacional

- [x] Confirmar que a transição DNS terminou no Registro.br.
- [x] Adicionar e verificar o TXT do Zoho.
- [x] Adicionar os MX do Zoho após a verificação.
- [x] Criar e testar `suporte@alugarodas.com.br`.
- [ ] Associar `alugarodas.com.br` ao projeto no painel de hospedagem.
- [x] Atualizar rodapé, mailto, SEO e canais oficiais.
- [ ] Validar HTTPS, rotas públicas, PWA e redirecionamentos em produção.
- [ ] Salvar checkpoint operacional final.

# Preparação de contas e publicação online

- [x] Confirmar onde o domínio `alugarodas.com.br` foi comprado: Registro.br.
- [ ] Obter acesso ao painel DNS do Registro.br e validar permissão para editar os registros.
- [x] Criar ou confirmar o e-mail oficial `suporte@alugarodas.com.br`.
- [x] Informar o @ oficial do Instagram: `@alugarodas`.
- [x] Não criar contas Vercel/Netlify/banco externo sem necessidade.
- [ ] Associar o domínio no painel do projeto.
- [x] Atualizar links de suporte, Instagram, SEO e rodapé.
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
- [x] Confirmar e-mail oficial de suporte e @ oficial do Instagram.
- [x] Definir fluxo de publicação: Manus como hosting, banco MySQL/TiDB e storage S3.
- [ ] Criar alimentação persistente de veículos, imagens, locadoras e leads.
- [x] Criar área administrativa para cadastrar, editar, pausar e moderar anúncios.
- [x] Definir papéis e permissões de Admin, Locador e Cliente na operação.
- [ ] Validar backups, segurança, logs, produção e rotina de atualização.
- [ ] Publicar checkpoint operacional após os testes.

# Rodada final: testes, contatos e lançamento

- [ ] Validar login real de Cliente, Locador e Admin com sessões autenticadas.
- [ ] Testar `/anunciar` autenticado no desktop e mobile com selects preenchidos.
- [ ] Confirmar console limpo e build final após esses testes.
- [x] Receber e-mail oficial de suporte, @ oficial do Instagram e confirmar domínio comprado.
- [x] Atualizar rodapé, links, mailto, Instagram, SEO e suporte com dados oficiais.
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
- [x] Confirmar PWA preservada, console sem erros e build aprovado na rodada final.

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
- [x] Manter `DATABASE_URL` inalterado até a decisão de promoção.
- [x] Validar a referência de asset `/manus-storage/aluga-rodas-hero_82e5fd36.jpg`; o recurso respondeu HTTP 200 em produção.
- [x] Avaliar divisão do bundle JavaScript acima de 500 kB; rotas foram divididas e o chunk inicial caiu para cerca de 647 kB, permanecendo uma oportunidade futura de otimização.

# Integração real do marketplace

- [x] Criar helpers Drizzle para companies, vehicles, vehicle_images e leads.
- [x] Criar procedimentos tRPC públicos para busca/detalhe e protegidos para cadastro e gestão.
- [x] Conectar o formulário Advertise ao cadastro persistente de empresa e veículo atrás de `VITE_MARKETPLACE_API_ENABLED`.
- [x] Conectar Search e VehicleDetails ao catálogo persistente atrás de `VITE_MARKETPLACE_API_ENABLED`, preservando fallback estático.
- [x] Integrar o modal de interesse ao procedimento persistente de leads e manter analytics de contato.
- [x] Validar RBAC de locador/admin e acesso público de busca; mutação de veículo foi coberta por teste Vitest e busca pública permanece sem guarda.
- [x] Executar TypeScript, Vitest, build e revisão visual desktop/mobile antes do próximo checkpoint.

## Ajustes da integração persistente

- [x] Persistir preços, caução, limite de km, seguro, disponibilidade e flags de APP no Advertise.
- [x] Adicionar estados de carregamento e erro no envio do anúncio.
- [x] Enviar categoria ao procedimento de busca e preservar empty state real da API.
- [x] Fazer VehicleDetails renderizar dados persistentes por identificador real.
- [x] Adicionar sucesso/erro no envio de lead e suportar veículos reais sem slug estático.

## Fechamento de qualidade da integração

- [x] Cobrir permissões positivas de locador/admin nos endpoints companyCreate, vehicleCreate e vehicleImageCreate.
- [x] Adicionar loading e erro na busca persistente.
- [x] Adicionar loading, erro e not-found reais no detalhe persistente sem mascarar falhas.
- [x] Bloquear sucesso de lead quando a mutação não executar e identificar claramente o modo preview.

# Dashboard persistente do anunciante

- [x] Criar consulta agregada de veículos e leads por anunciante.
- [x] Expor dashboard tRPC protegido para locador/admin.
- [x] Conectar Dashboard aos dados persistentes com loading e estados vazios.
- [x] Validar que cliente não acessa as métricas protegidas.
- [x] Testar build, Vitest e responsividade do dashboard.

## Fechamento RBAC do dashboard

- [x] Testar que cliente recebe FORBIDDEN ao consultar marketplace.dashboard.
- [x] Validar frontend que cliente não abre /dashboard nem vê métricas persistentes.

## Validação explícita da rota do dashboard

- [x] Criar teste de rota/guard para cliente autenticado ao acessar `/dashboard`.
- [x] Confirmar que cliente é redirecionado ou bloqueado antes de renderizar métricas persistentes.

## Contrato testável do AuthGuard

- [x] Criar função compartilhada de decisão do AuthGuard para loading, redirecionamento, bloqueio e acesso.
- [x] Testar explicitamente `/dashboard` com cliente autenticado como bloqueado antes de renderizar filhos.
- [x] Registrar no checklist que o comportamento esperado é bloqueio visual, não redirecionamento automático, para cliente autenticado.

## Teste de renderização do dashboard protegido

- [x] Renderizar AuthGuard em `/dashboard` com cliente autenticado e confirmar mensagem de acesso restrito.
- [x] Confirmar no HTML renderizado que métricas/filhos do Dashboard não aparecem para cliente.

# Configuração Zoho Mail

- [x] Criar no Registro.br um TXT no host raiz `@` com o valor de verificação fornecido pelo Zoho.
- [x] Aguardar propagação e repetir a verificação TXT no Zoho.
- [x] Registrar os MX oficiais do Zoho somente após a propriedade ser confirmada; MX, SPF e DKIM foram reconhecidos pelo Zoho.
- [x] Criar `suporte@alugarodas.com.br` e testar recebimento a partir de outro e-mail; envio pela própria conta ainda pode ser confirmado opcionalmente.
- [x] Atualizar os links de suporte no site depois de confirmar o endereço.

# E-mail oficial no site

- [x] Substituir referências de `oi@alugarodas.com.br` por `suporte@alugarodas.com.br`.
- [x] Revisar rodapé, contato e mensagens de suporte sem alterar credenciais.
- [x] Validar links `mailto:` no desktop e mobile.
- [x] Executar TypeScript, Vitest e build antes do checkpoint de suporte.

## Validação de links de suporte

- [x] Confirmar que o mailto da home aponta para `suporte@alugarodas.com.br`.
- [x] Confirmar que o mailto do dashboard aponta para `suporte@alugarodas.com.br`.
- [x] Revisar visualmente home e dashboard em desktop/mobile após a troca do suporte; dashboard mobile revisado em captura dedicada.

## Teste bidirecional do suporte

- [ ] Enviar uma mensagem usando a própria conta `suporte@alugarodas.com.br`.
- [ ] Confirmar recebimento da mensagem e resposta no endereço de suporte.
- [ ] Atualizar o checklist para registrar o teste completo de envio e recebimento.

# Domínio customizado em produção

- [ ] Abrir Settings → Domains no painel de hospedagem.
- [ ] Adicionar `alugarodas.com.br` como domínio principal ou customizado.
- [ ] Aplicar no Registro.br os registros exigidos pelo painel, sem remover MX/SPF/DKIM do Zoho.
- [ ] Confirmar propagação DNS e certificado HTTPS.
- [ ] Revisar home, rotas públicas, PWA e mailto no domínio customizado.
- [ ] Registrar domínio online e salvar checkpoint operacional.

# Implantação online no subdomínio Manus

- [x] Confirmar que o subdomínio Manus publicado responde corretamente.
- [x] Validar rotas públicas, metadados, robots, sitemap e manifest em produção.
- [x] Validar instalação PWA, offline e atualização do service worker em produção.
- [ ] Validar login/logout e guardas de Cliente, Locador e Admin sem expor credenciais.
- [ ] Validar `/anunciar`, busca, detalhe e fluxo de lead em desktop/mobile.
- [x] Confirmar console/rede limpos e ausência de links quebrados.
- [x] Documentar pendências: domínio customizado, promoção TiDB e login real do proprietário.

## SEO no domínio ativo

- [x] Ajustar `robots.txt` para apontar o sitemap ao subdomínio Manus enquanto o domínio customizado estiver desligado.
- [x] Verificar `sitemap.xml` e manifest no endereço publicado.
- [ ] Restaurar o sitemap para `alugarodas.com.br` quando o domínio customizado for conectado.

# Acesso administrativo em /adm

- [x] Criar rota `/adm` separada do fluxo `/entrar` comum.
- [x] Permitir acesso a `/adm` somente para `admin` no servidor e no frontend.
- [x] Impedir seleção pública de papel Admin no cadastro/login.
- [x] Redirecionar Admin para `/adm` após autenticação, sem quebrar Cliente/Locador.
- [x] Criar teste positivo Admin e negativos Cliente/Locador para `/adm`.
- [x] Revisar `/adm` em desktop/mobile; checkpoint será salvo após a auditoria completa da implantação online.

## Proteção server-side do /adm

- [x] Criar procedimento tRPC `admin.dashboard` protegido por `adminOnlyProcedure`.
- [x] Consumir o procedimento no painel Admin antes de renderizar dados administrativos.
- [x] Testar FORBIDDEN para cliente e locador e acesso permitido para admin.
- [x] Adicionar teste de integração para impedir dados administrativos sem autorização server-side.
- [x] Testar a página `/adm` com falha/FORBIDDEN em `admin.dashboard` e confirmar que métricas administrativas não são exibidas.
- [x] Ocultar o bloco de métricas do `/adm` quando `admin.dashboard` retornar FORBIDDEN e cobrir essa ausência no teste SSR.
- [x] Validar em produção `/buscar`, `/entrar`, `/anunciar` e uma página de detalhe de veículo.
- [x] Inspecionar description, Open Graph, Twitter e link do manifest no HTML publicado.

# Cadastro e autenticação social

- [x] Criar fluxo visual `/cadastre-se` separado de `/entrar`.
- [x] Oferecer cadastro seguro com perfil Cliente ou Locador, sem permitir cadastro público como Admin.
- [x] Exibir opção Google/Gmail pelo provedor OAuth seguro do Manus e preservar Manus OAuth como acesso principal.
- [x] Exibir opção Apple/iCloud pelo provedor OAuth seguro do Manus e preservar Manus OAuth como acesso principal.
- [x] Adicionar validações, estados de loading/erro/sucesso e links entre cadastro e login.
- [x] Atualizar footer e canais oficiais com Instagram `@alugarodas`.
- [ ] Promover TiDB staging para produção após sincronização e ativar `VITE_MARKETPLACE_API_ENABLED`.
- [ ] Validar cadastro, login, RBAC e marketplace após a promoção do banco.
- [x] Manter a promoção do `DATABASE_URL` adiada até o usuário cadastrar a URI TiDB no painel seguro; não ativar a API persistente em produção neste momento.
- [x] Persistir no servidor a intenção Cliente/Locador escolhida em `/cadastre-se` após o retorno do OAuth, sem permitir alteração para Admin.
- [x] Testar a sincronização server-side da intenção de cadastro e preservar o bloqueio de Admin.

# Fechamento verificável do lançamento

- [x] Implementar no `/adm` listagem real de anúncios com status e locadora, protegida por Admin.
- [x] Implementar ações server-side de aprovação, pausa e reativação de anúncios no `/adm`.
- [x] Cobrir o CRUD/moderação administrativa com testes RBAC positivos e negativos.
- [x] Documentar explicitamente o fluxo operacional Manus hosting + TiDB/MySQL + storage S3.
- [x] Executar auditoria pós-deploy de rotas, console, rede e links principais e registrar os resultados.
- [x] Revalidar manifest, service worker, fallback offline e instalação PWA após o code splitting no deploy publicado; manifest e service worker foram confirmados, e a instalação física permanece dependente de aparelho do usuário.
- [x] Executar nova auditoria de console e recursos após o deploy do code splitting e registrar ausência de erros.

# Rodada autônoma de QA e pré-lançamento

- [x] Criar matriz de QA com rotas, CTAs, links externos, guards, PWA e estados de erro.
- [x] Percorrer todas as rotas públicas em produção e testar navegação, filtros, cards, favoritos e CTAs; o favorito anônimo gerou o achado QA-01, corrigido no código.
- [x] Testar WhatsApp/lead sem enviar comunicação comercial externa; registrar o comportamento do clique e do formulário.
- [x] Testar cadastro/login/Cadastre-se e os pontos de entrada Google/Gmail e Apple/iCloud sem expor credenciais; conclusão OAuth bloqueada pelo aviso externo do Manus.
- [ ] Testar cadastro de veículo de teste, persistência, dashboard e moderação quando houver sessão autorizada.
- [x] Testar visualização mobile e desktop, PWA, console, rede e links quebrados.
- [x] Registrar todos os erros encontrados em relatório QA e corrigir os reproduzíveis.
- [x] Repetir testes críticos após as correções e publicar checkpoint da rodada.
- [x] Corrigir QA-01: ao clicar em Salvar veículo sem sessão, exibir feedback claro e link para Entrar/Cadastre-se, sem falhar silenciosamente.
- [x] Corrigir QA-02: garantir que o subdomínio publicado reflita a correção QA-01 do favorito e repetir a verificação após o deploy.
- [ ] Investigar o portal OAuth que retornou `about:blank` sem elementos e repetir a autenticação quando houver sessão oficial disponível.
- [ ] Criar conta Admin de teste somente via OAuth oficial ou staging isolado, sem senha fixa, sem credencial hardcoded e sem promover privilégio Admin pelo cadastro público.
- [ ] Repetir testes autenticados de Admin/Locador após a sessão oficial concluir o desafio Cloudflare/OAuth.

# Nova publicação virtual

- [x] Executar `pnpm check`, `pnpm test` e `pnpm build` antes da nova publicação; 33 testes passaram e o aviso do hero é apenas resolução de asset em runtime.
- [x] Testar virtualmente home, busca, filtros, detalhe, lead demonstrativo, guards, PWA e console/rede; a consulta manual do service worker teve timeout, mas a PWA segue confirmada pelas auditorias anteriores.
- [x] Corrigir regressões reproduzíveis encontradas nesta rodada e repetir os testes críticos; não foram encontrados novos erros reproduzíveis.
- [x] Publicar nova versão somente após a validação técnica e registrar as limitações de OAuth, Admin e dados persistentes.
- [x] Corrigir QA-03: o CTA global **Entrar** deve abrir `/entrar`, nunca `/adm`.
- [x] Validar que `/adm` continua exclusivo para Admin e que o login comum não expõe o painel administrativo.
- [x] Repetir check, Vitest, build e validação visual/publicada após a correção QA-03.

# Área logada do Cliente

- [x] Criar rota protegida `/cliente` exclusiva para o papel Cliente.
- [x] Redirecionar Cliente autenticado para `/cliente` após o login, mantendo Locador no dashboard e Admin em `/adm`.
- [x] Criar experiência inicial da área do Cliente com resumo da conta, favoritos e interesses.
- [x] Adicionar navegação contextual para o Cliente sem exibir ações de Locador ou Admin.
- [x] Testar RBAC, TypeScript, Vitest, build e responsividade da área do Cliente.

# Logout visível nas áreas autenticadas

- [x] Adicionar ação **Sair** visível no cabeçalho quando houver sessão autenticada.
- [x] Adicionar ação **Sair** dentro das áreas Cliente, Locador e Admin.
- [x] Confirmar que o logout real limpa a sessão e retorna ao fluxo público sem deixar acesso protegido aberto.
- [x] Testar logout, RBAC, TypeScript, Vitest, build e responsividade.

# Ajuste da seleção pública de perfis

- [x] Remover a apresentação visual de Admin da tela pública `/entrar`.
- [x] Manter apenas os fluxos Cliente e Locador para seleção/cadastro público.
- [x] Preservar Admin somente por autorização server-side e validar que a rota administrativa continua protegida.
- [x] Testar login, cadastro, RBAC, TypeScript, Vitest, build e responsividade após o ajuste.

# Persistência de favoritos e interesses do Cliente

- [x] Auditar schema e procedimentos atuais de favoritos e leads.
- [x] Criar persistência autenticada de favoritos por usuário e veículo.
- [x] Criar consulta da área Cliente com favoritos, interesses e contadores reais.
- [x] Integrar salvar favorito e envio de interesse à área `/cliente`.
- [x] Testar persistência, RBAC, TypeScript, Vitest, build e responsividade.

# Confirmação do cadastro de veículo

- [x] Corrigir o título cortado da confirmação após salvar dados iniciais.
- [x] Reescrever a mensagem para indicar claramente que o anúncio foi salvo como rascunho.
- [x] Ajustar o CTA e o layout da confirmação para desktop e mobile.
- [x] Testar o fluxo, acessibilidade, TypeScript, Vitest, build e responsividade.

# Salvamento real e fotos do anúncio

- [x] Auditar por que o cadastro mostra sucesso sem persistir quando o marketplace está desabilitado.
- [x] Garantir criação persistente de empresa e veículo para anunciante autenticado.
- [x] Implementar upload real de fotos com armazenamento seguro e validação de tipo/tamanho.
- [x] Associar imagens enviadas ao veículo criado e exibir prévias/estado de erro.
- [x] Confirmar sucesso somente após veículo e fotos serem persistidos.
- [x] Testar fluxo, RBAC, storage, TypeScript, Vitest, build e responsividade.

# Correção da validação do anúncio

- [x] Exibir erro específico quando a descrição tiver menos de 10 caracteres.
- [x] Evitar que a tentativa de salvar com fotos falhe sem orientação clara ao anunciante.
- [x] Testar salvamento após corrigir a descrição e manter upload de fotos funcionando.

# Correção do inventário do anunciante

- [x] Corrigir o título truncado da seção de inventário.
- [x] Tornar a ação de visualizar anúncio clicável e funcional.
- [x] Tornar a ação de leads clicável e funcional.
- [x] Tornar o menu de opções do veículo clicável, com ações seguras.
- [x] Testar interações, navegação, TypeScript, Vitest, build e responsividade.

# Ações administrativas de anúncios

- [x] Adicionar ação Admin para abrir o anúncio.
- [x] Adicionar ação Admin para visualizar o anunciante/locadora.
- [x] Adicionar exclusão de anúncio protegida por confirmação explícita.
- [x] Criar procedimento server-side de exclusão com limpeza segura das dependências.
- [x] Testar RBAC, confirmação, navegação, TypeScript, Vitest, build e responsividade.

# Correção da navegação Admin

- [x] Tornar Usuários, Anúncios e Segurança navegáveis para seções reais do painel.
- [x] Corrigir destaque/scroll das seções Admin no desktop e mobile.
- [x] Revalidar Ver anúncio, Ver anunciante, Pausar/Ativar e Excluir após a última publicação.
- [x] Testar handlers, RBAC, TypeScript, Vitest, build e responsividade.

# Seleção explícita no formulário de anúncio

- [x] Deixar Ano inicialmente sem seleção.
- [x] Deixar Estado inicialmente sem seleção e liberar cidades somente após escolha.
- [x] Deixar Combustível, Câmbio e Categoria inicialmente sem seleção.
- [x] Adicionar placeholders e validação obrigatória para os campos alterados.
- [x] Testar preenchimento, validação, TypeScript, Vitest, build e responsividade.

# Navegação da galeria de fotos

- [x] Adicionar botão de foto anterior na galeria do veículo.
- [x] Adicionar botão de próxima foto na galeria do veículo.
- [x] Atualizar indicador de posição e manter loop seguro entre as fotos.
- [x] Garantir navegação por teclado e uso adequado no mobile.
- [x] Testar galeria, TypeScript, Vitest, build e responsividade.

# Correção do favorito no veículo

- [x] Carregar o estado persistido do favorito ao abrir os detalhes do veículo.
- [x] Fazer o primeiro clique salvar o favorito e deixar o coração vermelho.
- [x] Exibir mensagem correta de veículo salvo/removido.
- [x] Atualizar a área `/cliente` com o favorito persistido.
- [x] Testar salvar, remover, persistência, RBAC, TypeScript, Vitest, build e responsividade.

# Validação do WhatsApp no interesse

- [x] Aplicar máscara brasileira ao telefone no modal de interesse.
- [x] Validar DDD e quantidade de dígitos antes do envio.
- [x] Enviar o telefone normalizado ao backend.
- [x] Exibir feedback claro para número incompleto ou inválido.
- [x] Testar formatos válidos, inválidos, TypeScript, Vitest, build e responsividade.

# Correção da máscara duplicada do WhatsApp

- [x] Sanitizar o valor antes de cada nova formatação.
- [x] Impedir parênteses e separadores duplicados ao digitar ou colar.
- [x] Preservar edição e apagamento do telefone sem corromper o valor.
- [x] Testar máscara, validação, TypeScript, Vitest, build e responsividade.

# WhatsApp contextualizado após lead

- [x] Gerar link direto para o anúncio atual.
- [x] Montar mensagem indicando interesse em alugar o veículo.
- [x] Incluir link do anúncio e assinatura @AlugaRodas ao final.
- [x] Exibir o botão WhatsApp somente no estado de lead salvo, com URL correta.
- [x] Testar codificação da mensagem, link, TypeScript, Vitest, build e responsividade.

# Inventário com métricas por anúncio

- [x] Evitar quebra excessiva do nome/modelo do veículo no inventário.
- [x] Exibir visualizações por anúncio com dado persistente quando disponível.
- [x] Exibir leads por anúncio com contagem real.
- [x] Reorganizar status e ações para manter alinhamento em desktop e mobile.
- [x] Testar métricas, ações, TypeScript, Vitest, build e responsividade.

# Correção da aba de favoritos do Cliente

- [x] Auditar a chave usada ao salvar e consultar favoritos.
- [x] Corrigir a sincronização da mutação com a consulta da área Cliente.
- [x] Exibir veículos favoritos salvos, não somente contador.
- [x] Atualizar contador e lista imediatamente após salvar/remover.
- [x] Testar persistência, contadores, lista, RBAC, TypeScript, Vitest, build e responsividade.

# Lead do Cliente para o anunciante

- [x] Auditar por que Cliente grava apenas client_interests e não leads.
- [x] Registrar lead persistente com vehicleId, companyId e requesterUserId quando o Cliente demonstrar interesse.
- [x] Manter o registro de interesse na área do Cliente sem duplicar indevidamente o contato.
- [x] Exibir o lead associado ao veículo correto no dashboard do anunciante.
- [x] Testar fluxo Cliente/anunciante, associações, RBAC, TypeScript, Vitest, build e responsividade.

# Busca de cidade com autocomplete

- [x] Auditar o campo de cidade atual e o catálogo de cidades disponível.
- [x] Iniciar a busca de cidade sem valor pré-selecionado.
- [x] Exibir sugestões filtradas a partir de três caracteres digitados.
- [x] Mostrar cidade e estado nas sugestões, com navegação por teclado e seleção por clique.
- [x] Permitir pesquisar sem cidade definida e preservar o valor selecionado nos filtros.
- [x] Validar desktop/mobile, busca, TypeScript, Vitest e build.

# Controle e expiração de leads do anunciante

- [x] Auditar modelo, consulta e permissões atuais dos leads recebidos.
- [x] Definir retenção operacional de 15 dias para a lista principal, com aviso antes da expiração.
- [ ] Adicionar status de arquivado/expirado sem apagar métricas essenciais.
- [x] Criar ação protegida para anunciante excluir ou arquivar o próprio lead.
- [x] Limitar a lista principal aos leads recentes e mostrar a quantidade total de contatos.
- [x] Atualizar o painel com aviso de expiração, data relativa e confirmação da ação.
- [x] Validar RBAC, consulta por proprietário, TypeScript, Vitest, build e responsividade.

# Destaques editoriais e catálogo de demonstração

- [x] Identificar e sinalizar os veículos do catálogo inicial como demonstração.
- [x] Modelar destaque editorial aprovado pelo Admin, sem cobrança no MVP.
- [ ] Criar ação Admin para aprovar/remover destaque e definir ordem/período.
- [ ] Fazer a home priorizar anúncios persistentes aprovados e usar demonstrações apenas como fallback identificado.
- [x] Exibir no Admin o estado editorial de cada anúncio.
- [x] Validar RBAC, vitrine pública, TypeScript, Vitest, build e responsividade.

# Foto de capa do anúncio

- [x] Auditar por que o catálogo usa imagem padrão em vez da foto enviada.
- [x] Priorizar a imagem do veículo cadastrada no storage como capa real.
- [x] Permitir escolher outra foto como capa quando houver várias imagens.
- [ ] Atualizar catálogo, detalhe e painel para usar a capa persistente.
- [x] Validar upload, seleção de capa, RBAC, TypeScript, Vitest, build e responsividade.

# Auditoria final de pré-lançamento

- [x] Mapear rotas públicas, protegidas e permissões de Cliente, Locador e Admin.
- [x] Executar suíte Vitest completa, TypeScript, build e verificar logs do servidor.
- [x] Simular Cliente: cadastro/login/logout, busca, favorito, interesse, WhatsApp e área logada.
- [x] Simular Locador: login, cadastro de anúncio, upload, capa, dashboard, lead, exclusão e logout.
- [x] Simular Admin: acesso protegido, moderação, destaque, anunciante, exclusão e logout.
- [x] Revisar desktop/mobile, console, rede, links, PWA, SEO e rotas de produção.
- [x] Corrigir bloqueios críticos e repetir todos os testes afetados.
- [x] Registrar pendências que dependem de sessão real, domínio customizado ou banco de produção.

# Identidade visual com logo oficial

- [x] Auditar usos atuais da marca, símbolo e logo nos componentes e metadados.
- [x] Preparar versão web otimizada da logo oficial e referências persistentes.
- [x] Aplicar a logo no cabeçalho desktop/mobile, rodapé, login, PWA e metadados.
- [x] Validar proporção, contraste, favicon, manifest, responsividade, TypeScript, Vitest e build.

# Instalação PWA e ícone do app

- [x] Auditar comportamento do botão de instalação no Safari iOS e Chrome.
- [x] Criar ícone quadrado centralizado e adequado para o app instalado.
- [x] Usar prompt nativo quando disponível e instruções específicas no iPhone.
- [x] Atualizar manifest, favicon e Apple Touch Icon com o novo ícone.
- [x] Validar desktop/mobile, TypeScript, Vitest, build e revisão visual.

# Rodada máxima de lançamento

- [x] Preparar matriz de fluxos Cliente, quem aluga, Locador e Admin.
- [x] Executar testes automatizados, banco, rotas, RBAC e segurança.
- [x] Testar no navegador busca, cadastro, login/logout, favoritos, interesse, leads, anúncio, fotos, capa e moderação.
- [x] Revisar PWA, desktop/mobile, console, rede, SEO e links.
- [x] Corrigir bloqueios encontrados e repetir os testes.
- [x] Publicar checkpoint com status de lançamento e pendências operacionais.

# Domínio customizado

- [ ] Verificar se alugarodas.com.br está associado ao projeto publicado.
- [ ] Identificar por que a opção de domínio não aparece no painel atual.
- [ ] Confirmar o caminho de DNS ou alternativa de conexão disponível.
- [ ] Orientar a configuração final sem trocar a hospedagem funcional.

# Correção de localização e resultados

- [x] Auditar por que o filtro mostra apenas poucas cidades e por que a cidade escolhida não restringe os resultados.
- [x] Ampliar a lista de cidades com estado e normalização de acentos.
- [x] Aplicar filtro exato de cidade na consulta de veículos persistentes.
- [x] Evitar fallback para veículo de outra cidade quando houver localidade escolhida.
- [x] Corrigir autocomplete e filtro mobile para mostrar todas as opções relevantes.
- [x] Validar Curitiba, Maringá, Londrina, Fortaleza, Olinda e cidades sem resultados.
- [x] Executar Vitest, TypeScript, build e revisão desktop/mobile antes de publicar.

# Migração externa para Render

- [ ] Confirmar se o código está disponível em um repositório GitHub conectado ao Render.
- [ ] Criar Web Service com build `pnpm build` e start usando o bundle de produção.
- [ ] Configurar Node/pnpm, região, health check e variáveis públicas mínimas.
- [ ] Executar deploy temporário no domínio onrender.com.
- [ ] Validar frontend, backend, rotas, autenticação, banco, storage e OAuth no Render.
- [ ] Configurar secrets, domínio alugarodas.com.br e DNS somente após validação temporária.

# Deploy externo no Render

- [ ] Confirmar o repositório local e o destino `marlonschulztegvt-debug/alugarodas`.
- [ ] Garantir que nenhum `.env` ou secret seja incluído no commit.
- [ ] Enviar o código atual para o repositório GitHub conectado ao Render.
- [ ] Acionar o primeiro deploy e corrigir build/start se necessário.
- [ ] Validar a URL `aluga-rodas.onrender.com` antes de configurar o domínio próprio.

# Exportação GitHub conectada

- [ ] Confirmar integração GitHub ativa e acesso ao repositório `marlonschulztegvt-debug/alugarodas`.
- [ ] Exportar o código atual para o repositório sem secrets ou arquivos `.env`.
- [ ] Confirmar commit na branch `main` e acionar o deploy no Render.
- [ ] Validar o serviço externo após o primeiro deploy.

# Correção do primeiro deploy Render

- [x] Confirmar no log que o erro é `EROFS` ao executar `corepack enable`.
- [ ] Ajustar o Build Command do Render para usar pnpm sem corepack.
- [ ] Refazer o deploy e confirmar status Live ou novo erro.
- [ ] Validar a URL externa após o deploy.

# Auditoria do Render externo

- [ ] Testar rotas públicas e resposta do serviço externo.
- [ ] Confirmar quais variáveis de banco, sessão, OAuth e storage faltam no Render.
- [ ] Validar comportamento esperado sem secrets, sem expor credenciais.
- [ ] Orientar preenchimento seguro e repetir deploy após configuração.

# OAuth no Render

- [x] Confirmar que `DATABASE_URL` foi aceita e o serviço ficou Live.
- [ ] Configurar `OAUTH_SERVER_URL` no Render.
- [ ] Configurar `VITE_APP_ID`, `VITE_OAUTH_PORTAL_URL`, `OWNER_OPEN_ID` e `JWT_SECRET`.
- [ ] Autorizar o callback `https://aluga-rodas.onrender.com/api/oauth/callback`.
- [ ] Testar login Cliente, Locador e Admin no domínio externo.

# Limitação OAuth na hospedagem externa

- [x] Confirmar que o painel Manus não oferece OAuth externo nas integrações disponíveis.
- [ ] Solicitar autorização/configuração OAuth para `https://aluga-rodas.onrender.com/api/oauth/callback`.
- [ ] Avaliar autenticação alternativa compatível com o Render, TiDB e RBAC atual.
- [x] Manter o serviço público e o banco funcionando sem expor credenciais.
- [ ] Revalidar Cliente, Locador e Admin após resolver autenticação.

# Migração para autenticação própria

- [x] Auditar OAuth Manus, contexto de sessão, schema de usuários e guards.
- [ ] Adicionar credenciais de email com hash seguro, verificação e recuperação de senha.
- [x] Implementar registro de Cliente/Locador, login, logout e sessão por cookie seguro.
- [x] Manter Admin sem criação pública e preservar RBAC de dashboard, anúncio e `/adm`.
- [x] Adaptar `/entrar`, cadastro e estados de autenticação do frontend.
- [x] Adicionar testes de segurança, sessão, RBAC, duplicidade e credenciais inválidas.
- [ ] Validar Render/TiDB, TypeScript, Vitest, build e fluxos reais antes de publicar.

- [x] Definir `suporte@alugarodas.com.br` como email Admin principal, sem criar senha ou permitir seleção pública de Admin.

- [x] Remover a inicialização obrigatória do OAuth Manus no startup do Render, pois a autenticação de produção agora é local.
- [x] Publicar novamente e confirmar que os logs do Render não exigem `OAUTH_SERVER_URL` para iniciar.
- [x] Validar no Render as rotas `/entrar`, `/cadastre-se`, login, logout e proteção por papel após a correção.

- [x] Corrigir divergência do schema TiDB em produção: adicionar com segurança as colunas exigidas pela autenticação local na tabela `users`.
- [ ] Repetir o cadastro externo após a migração e validar que a conta é persistida sem expor erro SQL ao usuário.

- [x] Auditar todos os erros atuais do fluxo SQL e autenticação no código, logs e Render.
- [x] Corrigir a causa raiz do cadastro/login externo e eliminar exposição de erros SQL ao usuário.
- [ ] Validar schema, sessão local, logout, RBAC e endpoints externos antes de entregar a solução.

- [x] Substituir a consulta `INFORMATION_SCHEMA` da auto-migração por `SHOW COLUMNS FROM users`, compatível com o TiDB externo.
- [ ] Revalidar o cadastro no iPhone/Render e confirmar que o erro SQL não é mais exibido.
