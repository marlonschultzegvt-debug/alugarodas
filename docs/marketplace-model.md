# Aluga Rodas — modelo de marketplace e SEO

## Escopo do MVP frontend

O frontend já separa as responsabilidades de descoberta (`vehicles`, `categories`, `cities`), detalhe de anúncio, geração de interesse, dashboard de anunciante e eventos de analytics. Os dados atuais são de apresentação da interface e devem ser substituídos por uma API quando a camada full-stack for ativada.

## Entidades preparadas

| Entidade | Responsabilidade | Campos essenciais |
|---|---|---|
| `users` | Identidade e papel | `id`, `role`, `name`, `email`, `phone`, `status` |
| `companies` | Locadora ou anunciante empresarial | `id`, `owner_id`, `name`, `verification_status`, `locations` |
| `vehicles` | Anúncio principal | `id`, `owner_id`, `company_id`, `category_id`, `location_id`, `status`, `pricing`, `conditions` |
| `vehicle_images` | Galeria e ordenação | `id`, `vehicle_id`, `url`, `sort_order`, `alt_text` |
| `locations` | Estado, cidade e slugs | `id`, `state`, `city`, `slug`, `lat`, `lng` |
| `categories` | Carro, moto, elétrico, utilitário | `id`, `slug`, `label`, `parent_id` |
| `availability` | Janelas de disponibilidade | `id`, `vehicle_id`, `start_at`, `end_at`, `status` |
| `leads` | Interesse e origem | `id`, `vehicle_id`, `owner_id`, `name`, `phone`, `message`, `source`, `utm` |
| `favorites` | Veículos salvos | `id`, `user_id`, `vehicle_id`, `created_at` |
| `vehicle_views` | Visualização de anúncio | `id`, `vehicle_id`, `session_id`, `source`, `utm`, `created_at` |
| `whatsapp_clicks` | Clique de contato | `id`, `vehicle_id`, `session_id`, `source`, `utm`, `created_at` |
| `plans` | Planos de anúncio | `id`, `name`, `limits`, `price`, `features` |
| `subscriptions` | Adesão de anunciante | `id`, `company_id`, `plan_id`, `status`, `period` |

## Eventos de produto

Os eventos de busca, cidade pesquisada, clique em WhatsApp, início de lead, envio de lead e cadastro de anúncio devem aceitar `source`, `medium`, `campaign`, `content`, `term`, `session_id` e `referrer`. O componente atual dispara `CustomEvent` com namespace `aluga-rodas:analytics`, o que permite conectar Umami, uma API própria ou um data layer sem reescrever a interface.

## Rotas públicas e SEO local

| Rota | Intenção |
|---|---|
| `/` | Marketplace nacional e descoberta |
| `/buscar` | Catálogo com filtros |
| `/veiculo/:slug` | Página individual do veículo |
| `/carros/:cidade` | Inventário de carros por cidade |
| `/carros-para-uber/:cidade` | Intenção de motoristas de aplicativo |
| `/aluguel-carro-eletrico/:cidade` | Intenção de veículos elétricos |
| `/motos/:cidade` | Inventário de motos |

Cada rota de cidade deve gerar title, description, canonical e JSON-LD específicos. A arquitetura de conteúdo evita limitar a marca a Uber/99 e permite expansão para motos, utilitários, vans e caminhonetes.

## Próxima evolução full-stack

Quando o MVP de interface estiver aprovado, o próximo passo é trocar `vehicles` por consulta paginada, persistir leads e favoritos, adicionar autenticação do anunciante e criar moderação de anúncios. Pagamentos, contrato digital, score, proteção e validações de identidade devem permanecer como módulos posteriores.
