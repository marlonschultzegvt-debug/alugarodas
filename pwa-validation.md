# Validação PWA

A prévia de produção foi aberta em HTTPS e o manifest respondeu em `/manifest.webmanifest` com `name: Aluga Rodas`, `short_name: AlugaRodas`, descrição, `start_url: /`, `scope: /`, `display: standalone`, `theme_color: #10252b`, `background_color: #f4f1ea` e quatro ícones, incluindo versões maskable.

O service worker ficou ativo em escopo raiz: `/sw.js`, estado `activated`. O cache `aluga-rodas-static-v1` contém apenas `offline.html`, manifest, scripts, CSS e imagens públicas. Não há `/dashboard`, `/login`, `/anunciar`, leads ou dados de sessão no cache.

A página `/offline.html` abriu corretamente, com mensagem amigável, identidade visual Aluga Rodas, ícone da marca e botão “Tentar novamente”. O bundle final passou em `pnpm check` e `pnpm build`.

A revisão visual final em desktop e mobile preservou a home, a página de anúncio, a navegação e a responsividade. O aviso de instalação apareceu sem cobrir os controles principais, com CTA “Instalar” no desktop/mobile e fechamento acessível.

No build de produção, o service worker foi confirmado como `activated` com escopo `/`. O cache foi inspecionado e não contém rotas privadas nem dados de login, dashboard ou leads. A aplicação continuou carregando normalmente.
