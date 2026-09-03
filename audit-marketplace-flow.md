# Auditoria técnica — fluxo Cliente e Locador

Data: 2026-09-03

## Fluxos aprovados no preview

Um Locador técnico criou uma empresa e um veículo. Um Cliente técnico salvou esse veículo nos favoritos e registrou interesse. O dashboard do Locador retornou o veículo criado, e a área do Cliente retornou um favorito e um interesse persistidos.

| Verificação | Resultado |
|---|---:|
| Empresa criada | 60001 |
| Veículo criado | 120001 |
| Veículos no dashboard do Locador | 1 |
| Favoritos na área do Cliente | 1 |
| Interesses na área do Cliente | 1 |

## Achado a validar

A consulta pública por Curitiba retornou zero veículos porque o anúncio recém-criado inicia como rascunho e ainda precisa de moderação/ativação administrativa. Esse comportamento é coerente com o modelo de marketplace, mas o próximo teste precisa confirmar a ativação por Admin e a passagem do anúncio ao catálogo público.

## Validação administrativa

A conta técnica promovida a Admin ativou e destacou o veículo de QA. Em seguida, o veículo apareceu na busca pública de Curitiba. Também foi registrado um lead público e uma visualização. O dashboard retornou um veículo ativo, uma visualização e um lead, confirmando o ciclo técnico de moderação e acompanhamento.
