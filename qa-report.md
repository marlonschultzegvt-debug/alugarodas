# Relatório QA — Aluga Rodas

## Execução inicial em 19/08/2026

A rota pública `/cadastre-se` carregou corretamente em produção, exibindo os perfis Cliente e Locador, as opções Google/Gmail e Apple/iCloud, o acesso seguro e o link para `/entrar`. O clique em **Continuar com Google** abriu o portal OAuth real do Manus, com opções Google, Apple, Microsoft, Facebook, e-mail e passkey.

O fluxo OAuth apresentou um aviso obrigatório informando uma janela de exclusão de contas/dados para contas criadas na região. Como esse aviso envolve aceitação explícita e criação/uso de conta, o teste foi interrompido sem marcar o aceite, sem inserir e-mail e sem concluir autenticação em nome do proprietário. Esse é um bloqueio de validação externa, não um erro reproduzível no frontend do Aluga Rodas.

| Caso | Resultado | Observação |
|---|---|---|
| `/cadastre-se` | Aprovado | Conteúdo, perfis e links carregaram. |
| Google/Gmail | Bloqueado externamente | Portal Manus abriu; exige aceite do aviso e sessão. |
| Apple/iCloud | Ainda não concluído | Mesmo fluxo depende do portal e de sessão. |

## Busca pública

A rota `/buscar` carregou quatro veículos no estado inicial. A seleção sequencial de **Curitiba**, **Elétrico** e **APP** reduziu o catálogo a um único resultado, Geely EX2, com cidade Curitiba/PR, preço semanal de R$ 1.350, limite de 7.000 km/mês, seguro incluso e CTA de WhatsApp. Nenhum erro visual ou de navegação foi observado nesta combinação.

## Detalhe do veículo

O clique no card Geely EX2 abriu `/veiculo/geely-ex2-curitiba`. Houve um estado transitório de `Carregando Aluga Rodas…` enquanto o chunk lazy era carregado; após a espera, a página renderizou completamente com galeria, preço semanal/mensal, caução, seguro, quilometragem, disponibilidade, compatibilidade APP, botão Tenho interesse, WhatsApp e favorito. Não foi identificado erro após o carregamento.

## Lead e chat interno

O modal **Tenho interesse** abriu corretamente. Após corrigir a indexação dos campos durante o teste, o nome `QA Aluga Rodas` e o número fictício `41999990000` foram aceitos. O clique em **Enviar interesse** exibiu `INTERESSE ENVIADO` e informou explicitamente que se tratava de modo demonstração, sem enviar mensagem externa. Esse comportamento está coerente com a flag de persistência desativada em produção; a ativação real do lead depende da promoção do banco e da flag do marketplace.

## Favoritos

O botão **Salvar veículo** foi clicado no detalhe do Geely EX2 sem sessão autenticada. Não houve mudança visual, toast, redirecionamento ou solicitação de login aparente. Esse comportamento deve ser corrigido ou explicitado: o CTA precisa informar que é necessário entrar/cadastrar-se ou confirmar visualmente o salvamento.

- **Achado QA-01 — Favorito sem feedback:** reproduzido em produção no visitante anônimo; prioridade média de UX.

## Entrada e guard de anunciante

A rota `/entrar` exibiu os perfis Cliente, Locador e Admin, o acesso seguro e o link `/cadastre-se`. O clique em **Anuncie seu veículo** sem sessão não expôs o formulário; o fluxo permaneceu na tela de entrada, comportamento esperado do guard público.

## PWA e instalação

O CTA **Instalar** foi acionado na rota `/entrar`. Inicialmente exibiu `Abrindo…`, e após o timeout retornou corretamente para as instruções manuais **Como instalar o Aluga Rodas**, com orientação de menu do navegador e botão **Entendi**. Não ficou preso no estado de carregamento.

## Guards protegidos

As tentativas de abrir `/adm` e `/dashboard` sem sessão em produção redirecionaram para `/entrar`. Não foram exibidas métricas, listagens administrativas, leads ou controles de moderação. O bloqueio público está funcionando; a validação positiva de Admin/Locador continua dependente de sessão autenticada.

## Empty state da busca

A consulta `Modelo QA inexistente` retornou `0 veículos encontrados` com a mensagem **Não encontramos essa combinação** e a ação **Limpar filtros**. O clique em Limpar filtros restaurou os quatro cards do catálogo. Fluxo aprovado.

## Auditoria visual mobile

Capturas em viewport 390x844 cobriram `/`, `/buscar`, `/cadastre-se`, `/veiculo/geely-ex2-curitiba`, `/entrar` e `/adm`. Home, busca, cadastro e detalhe mantiveram tipografia, cards, botões e imagens dentro da largura; o CTA PWA permaneceu fixo sem cobrir o conteúdo principal de forma impeditiva. O `/adm` exibiu navegação horizontal e cards de métricas legíveis no preview autenticado. Não foram observados elementos cortados ou desalinhamentos críticos nesta amostra.

## Correção QA-01

No preview atualizado, o clique em **Salvar veículo** passou a exibir `Entre para salvar este veículo. Entrar ou cadastre-se.` com links funcionais. A falha silenciosa foi corrigida e o detalhe continua visualmente estável.
