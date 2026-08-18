# Auditoria de acessos

## Resultado atual

A rota `/dashboard` abre diretamente uma área demonstrativa do anunciante “Rodas Sul”, sem exigir autenticação, sessão, senha ou perfil. Os indicadores, veículos e leads exibidos são dados estáticos do frontend.

A rota `/entrar` não existe e retorna a página 404. O item “Entrar” do menu aponta atualmente para `/dashboard`, portanto não representa um login real.

Não foram encontrados fluxos reais separados para Administrador, Cliente e Locador. O formulário `/anunciar` diferencia apenas os caminhos de “Quero anunciar” e “Sou locadora” no estado local do formulário; isso ainda não cria contas, permissões ou sessões.

## Próxima implementação segura

A próxima etapa deve criar autenticação persistente no backend, papéis `admin`, `cliente` e `locador`, controle de sessão, proteção de rotas, recuperação de senha e redirecionamento por papel. Não serão usados logins fictícios ou credenciais expostas no frontend.
