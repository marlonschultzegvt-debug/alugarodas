# Auditoria de pré-lançamento — Aluga Rodas

## Resultado geral

A rodada de pré-lançamento foi executada no preview atual antes da conexão do domínio principal. O produto está tecnicamente estável para uma próxima etapa de publicação controlada, mas ainda depende de validação de login real com as contas do proprietário e da configuração final dos canais oficiais.

## Testes executados

| Área | Resultado | Evidência |
|---|---|---|
| TypeScript | Aprovado | `pnpm check` sem erros |
| Build de produção | Aprovado | `pnpm build` concluído |
| Testes automatizados | Aprovado | 2 arquivos, 3 testes Vitest aprovados |
| Banco | Aprovado | tabela `users` criada com papéis `admin`, `cliente`, `locador` e legado `user` |
| RBAC | Aprovado em testes automatizados | 6 testes Vitest aprovados; admin permitido, cliente/locador rejeitados no backend e regras de frontend cobrem cliente, locador e admin |
| Rotas públicas | Aprovado | `/`, `/buscar`, `/veiculo/geely-ex2` retornaram HTTP 200 |
| Rotas protegidas | Aprovado sem sessão e com regra por papel | `/dashboard` e `/anunciar` aceitam somente `locador`/`admin`; `/admin` aceita somente `admin`; usuário sem sessão redireciona para `/entrar` |
| Login | Parcial | tela `/entrar` renderiza; OAuth real requer acesso do proprietário no navegador |
| PWA | Aprovado no preview | manifest, service worker, offline, robots e sitemap retornaram HTTP 200 |
| SEO | Aprovado inicialmente | title, description e Open Graph presentes |
| Responsividade | Aprovado visualmente | capturas desktop 1280×720 e mobile 390×844 das rotas críticas |
| Console | Aprovado na sessão validada | nenhum erro novo de frontend após os redirecionamentos |

## Pontos ainda não considerados concluídos

O login real de Admin, Cliente e Locador não pode ser validado sem uma sessão autenticada do proprietário. A tela já inicia o OAuth seguro e o backend resolve a sessão pelo cookie; falta concluir o acesso no navegador e confirmar o papel retornado para cada conta. As regras finais estão implementadas: Cliente é enviado para busca; Locador para dashboard; Admin para `/admin`; Cliente não atravessa dashboard/anunciar; Locador não atravessa `/admin`. Não devem ser compartilhadas senhas ou códigos de autenticação no chat.

O domínio `alugarodas.com.br` ainda precisa ser conectado no painel de domínios do projeto. O e-mail de suporte ainda deve ser criado e confirmado antes de trocar os endereços provisórios, como `suporte@alugarodas.com.br`. O @ oficial do Instagram também deve ser informado antes de criar o link social no cabeçalho, rodapé e canais de suporte.

## Observações técnicas

O build exibe apenas dois avisos não bloqueantes: o bundle principal ultrapassa 500 kB após minificação, recomendando code splitting futuro, e a imagem do hero é mantida como referência de storage para resolução em runtime. Nenhum dos avisos impediu o build ou o carregamento das rotas testadas.

## Próxima validação necessária

Após o proprietário concluir um login no navegador, repetir com sessões reais: login de cada papel, redirecionamento `/admin` para Admin, `/dashboard` para Locador, busca para Cliente, logout, sessão expirada e tentativa de acesso cruzado. Os cenários de autorização já estão cobertos por 6 testes Vitest e pelas guards do frontend. Só depois disso configurar o domínio, e-mail, Instagram e contato de suporte definitivos.
