# Aluga Rodas — Direção visual e decisões de produto

## Três direções possíveis

### Theme Name: Estrada Editorial
Very Brief Intro: Um marketplace com linguagem editorial brasileira, combinando verde profundo, areia e laranja queimado para transmitir confiança, movimento e curadoria. A interface usa grandes blocos de conteúdo, fotos de veículos e uma navegação de produto, não de locadora.
Probability: 0.07

### Theme Name: Radar Urbano
Very Brief Intro: Uma estética de mobilidade urbana com azul petróleo, branco mineral e amarelo sinalização, inspirada em mapas, placas e serviços digitais de alta disponibilidade. Mais funcional e tecnológica, com foco em busca, filtros e densidade de inventário.
Probability: 0.04

### Theme Name: Noite de Asfalto
Very Brief Intro: Uma direção escura e sofisticada, com grafite, verde elétrico e pequenos acentos luminosos para um marketplace premium de veículos. A experiência enfatiza contraste, status e sensação de plataforma nacional.
Probability: 0.02

## Direção escolhida: Estrada Editorial

### Design Movement
Editorial digital brasileiro contemporâneo, com referências de publicação de negócios, classificados premium e produtos de mobilidade. A direção combina a clareza de um marketplace de alta escala com a presença calorosa de uma marca que entende a rotina de quem precisa rodar.

### Core Principles
1. A busca é o protagonista: toda decisão visual deve reduzir o tempo até um veículo adequado.
2. Inventário com contexto: cards e detalhes devem mostrar preço, cidade, uso, condição e confiança sem esconder informação.
3. Editorial, não promocional: composições assimétricas, respiros generosos e hierarquia tipográfica substituem blocos genéricos de landing page.
4. Confiança verificável: selos, status, dados de locação e contato direto aparecem como sinais de produto, não como slogans vazios.

### Color Philosophy
A base usa **azul petróleo quase preto** para transmitir tecnologia, estabilidade e autoridade sem cair em um visual corporativo frio. O fundo mineral claro preserva leitura e sensação de espaço. O **laranja estrada** é a cor própria da marca: calorosa, memorável e usada para ações de movimento — buscar, anunciar, falar, seguir. Verde sálvia entra apenas em estados positivos e disponibilidade, enquanto areia e névoa organizam superfícies secundárias.

### Layout Paradigm
A home trabalha como uma página de descoberta: navegação limpa, hero assimétrico com mensagem à esquerda e imagem de veículo à direita, busca encaixada na transição entre hero e inventário, atalhos horizontais e seções com colunas quebradas. O inventário usa uma coluna de filtros e uma grade de cards em desktop; no mobile, filtros viram barra contextual e cards mantêm imagem grande e leitura em camadas.

### Signature Elements
- Linha de rota: pequenos traços, pontos e microetiquetas que conectam cidade, categoria e disponibilidade.
- Tarja laranja de ação: destaque consistente para CTAs que fazem o usuário avançar.
- Selo “Aluga Rodas verificado”: badge discreto com ícone de escudo, reservado para sinais de confiança.

### Interaction Philosophy
A interface responde como um serviço de mobilidade: feedback imediato, estados claros e pouca fricção. Botões têm resposta tátil curta; filtros atualizam a leitura sem saltos; salvar e compartilhar mantêm o contexto; ações futuras mostram claramente quando são preparatórias, sem fingir que há backend ativo.

### Animation
Entradas de seção usam opacidade e deslocamento vertical leve, escalonadas em 40–60ms. Cards elevam 2px e revelam sombra quente no hover. A busca expande seus campos com transição de 180ms e easing `cubic-bezier(0.23, 1, 0.32, 1)`. Nenhuma animação altera layout de modo brusco, e tudo respeita `prefers-reduced-motion`.

### Typography System
- Display: **DM Serif Display**, para headlines com autoridade editorial e personalidade brasileira.
- Interface: **Manrope**, para busca, preços, labels e leitura rápida.
- Hierarquia: H1 entre 52–72px no desktop e 38–44px no mobile; H2 entre 32–44px; títulos de card em 20–22px; labels sempre em caixa alta pequena com tracking de 0.12em; preço com peso 800 e números tabulares.

### Brand Essence
**Um marketplace nacional que conecta quem precisa rodar a veículos disponíveis, com contexto claro e contato direto.**
Personalidade: confiável, ágil, próximo.

### Brand Voice
Headlines são diretas e orientadas a movimento. CTAs usam verbos claros. Microcopy explica condições sem juridiquês e sem prometer o que o MVP ainda não oferece.

Exemplo 1: “Seu próximo turno começa com o veículo certo.”
Exemplo 2: “Compare condições. Fale com quem anuncia. Siga em frente.”

### Wordmark & Logo
O símbolo é uma forma abstrata de duas rodas conectadas por uma linha de rota, formando um “A” aberto quando visto de frente. O wordmark usa “ALUGA” em peso 800 e “RODAS” em peso 500, com espaçamento controlado e o símbolo substituindo o contraponto do A em aplicações maiores.

### Signature Brand Color
**Laranja Estrada — #F26A3D**. Uma cor de movimento e proximidade, proprietária o bastante para ser lembrada e contida o suficiente para não cansar em uma plataforma com muito inventário.

## Decisões de produto para o MVP

- Rotas públicas: `/`, `/buscar`, `/veiculo/:slug`, `/anunciar`, `/dashboard`, além de rotas SEO preparadas por cidade e intenção.
- Dados mockados somente como catálogo demonstrativo de interface; nenhum depoimento ou avaliação fictícia será apresentado como prova social.
- Ações sem backend, como favoritar, interesse e WhatsApp, terão feedback explícito e registro local/analytics de interface quando possível.
- O modelo de dados será documentado em `docs/marketplace-model.md` para preparar a futura evolução full-stack sem tornar o MVP pesado.

## Checklist de decisão

Antes de aceitar qualquer componente, perguntar: **isso faz o Aluga Rodas parecer uma plataforma nacional ou um site pequeno de uma locadora?**
