# Verificação visual — busca pública

Data: 2026-09-03

## Resultado

As rotas `/buscar`, `/buscar?cidade=Curitiba` e `/buscar?categoria=Moto` exibem cards em vez do estado vazio quando a API ainda não retorna anúncios persistentes. O fallback é identificado de forma explícita como **prévia editorial**, evitando apresentar a vitrine inicial como uma disponibilidade confirmada.

## Desktop

Os filtros, a contagem de resultados, o aviso editorial, os cards e o rodapé permanecem alinhados. A filtragem por Curitiba retorna apenas o Geely EX2; a filtragem por Moto retorna apenas a Honda CG 160 Start.

## Mobile

Em 390 × 844, o cabeçalho, campo de busca, filtros, aviso editorial, cards e rodapé permanecem legíveis, sem overflow horizontal ou cortes. Os filtros se reorganizam em uma faixa compacta e os cards ocupam uma coluna.
