# Matriz de QA — Aluga Rodas

A rodada cobre o subdomínio publicado `alugarodas-jp8f2bzz.manus.space` e o preview local quando um fluxo protegido exigir sessão controlada. Nenhuma senha será registrada, nenhum clique de WhatsApp será convertido em mensagem comercial enviada e nenhum dado de produção será alterado deliberadamente.

| Grupo | Cobertura | Evidência esperada | Estado |
|---|---|---|---|
| Rotas públicas | `/`, `/buscar`, `/veiculo/:slug`, `/entrar`, `/cadastre-se`, `/anunciar`, `/adm`, `/dashboard` | Resposta, conteúdo, guard e ausência de erro | Pendente |
| Navegação | Menu desktop/mobile, footer, breadcrumbs, links de retorno | Destino correto e sem dead-end | Pendente |
| Busca | Cidade, categoria, finalidade, ordenação, texto e empty state | Cards e URL/filtros coerentes | Pendente |
| Conversão | Interesse, WhatsApp, mailto, Instagram, favoritos | CTA funcional sem comunicação externa indevida | Pendente |
| Autenticação | Entrar, Cadastre-se, Cliente, Locador, Admin, OAuth social | Estados de loading/erro e proteção server-side | Pendente |
| Marketplace | Cadastro de veículo, FIPE assistida, estado/cidade, imagens, persistência | Validação, sucesso/erro, dashboard e moderação | Pendente |
| PWA | Manifest, service worker, cache público, offline e instalação | Escopo raiz, fallback e ausência de cache privado | Pendente |
| Qualidade | Console, rede, responsividade e links | Relatório reproduzível com correções | Pendente |

## Convenções de execução

Os testes externos serão passivos quando envolverem serviços de terceiros. O link de WhatsApp será inspecionado, mas não será enviada mensagem. O formulário de lead só será submetido com dados de teste em staging/preview se houver uma sessão e banco apropriados; caso contrário, será validado até a etapa anterior ao envio e o bloqueio será registrado.
