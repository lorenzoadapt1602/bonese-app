# Bonese Food Park — App de pedidos

Web app de pedidos (funciona no celular e no computador, pode ser "instalado" na tela inicial).
Não precisa de servidor nem banco de dados: é só HTML, CSS e JavaScript.

## O que o app faz

- **Cardápio completo** (Burgers, Xis, X Premium, Porções, Sobremesas, Bebidas) com busca e categorias fixas no topo
- **Personalização**: combo (fritas + Fruki Guaraná), adicionais com quantidade, "quer tirar algo?" (ex.: sem tomate), variações (X-Frango c/ bacon, BBC c/ rúcula, batata c/ cheddar e bacon, sabor do refri) e observação
- **Sacola** com edição de itens, quantidade e total salvo no aparelho
- **Delivery ou Retirada** — taxa de entrega por bairro, endereço, ponto de referência
- **Pagamento**: Pix, crédito, débito ou dinheiro (com cálculo do troco)
- **Pix com valor exato**: ao escolher Pix, o app gera na hora o QR Code e o "copia e cola" com o valor do pedido (itens + entrega − desconto), no padrão oficial do Banco Central
- **Promo "Se liga!"**: a cada 6 long necks o cliente ganha uma porção e escolhe qual (fritas tradicional, crinkle ou onion rings)
- **Envio pelo WhatsApp** da loja com o pedido formatado (itens, adicionais, endereço, pagamento, troco, nº do pedido)
- Status **Aberto/Fechado** pelo horário de funcionamento

## ⚠️ Antes de entregar ao cliente — edite `assets/js/config.js`

| Campo | O que colocar |
|---|---|
| `whatsapp` | Número que recebe os pedidos: `55` + DDD + número (ex.: `5551999999999`) |
| `address` | Endereço da loja (aparece na Retirada) |
| `pix.key` | Chave Pix. CPF/CNPJ só números · e-mail · celular **com +55** (ex.: `+5551999999999`) · chave aleatória |
| `pix.merchantName` / `merchantCity` | Nome do recebedor (até 25 letras) e cidade (até 15) |
| `pix.discountPercent` | Desconto para quem paga no Pix (0 = sem desconto) |
| `delivery.neighborhoods` | Bairros atendidos e a taxa de cada um (os valores atuais são exemplos) |
| `delivery.minOrder` / `freeAbove` | Pedido mínimo e entrega grátis acima de X |
| `hours` | Horário de funcionamento por dia (os atuais são exemplos) |
| `acceptOrdersWhenClosed` | `false` bloqueia pedidos fora do horário |

Os sabores do refrigerante ficam em `assets/js/menu.js` (procure "ajuste os sabores").

## Cardápio — `assets/js/menu.js`

Preços copiados do cardápio impresso. Para mudar um preço, edite `price` (ou `combo`).
Para tirar um item do ar: adicione `available: false` no item (ele aparece como "Esgotado").

**Pontos para confirmar com o cliente** (copiados como estavam no cardápio):
- Combo do **BIG Burger** custa R$ 57,90 (só R$ 9,90 a mais; nos outros a diferença é R$ 13,90)
- Combo do **PRIME** R$ 56,90 e do **BBC** R$ 46,90 (diferenças de R$ 12,90 e R$ 14,90)
- **BBP "Burger Picles"** não lista picles nos ingredientes
- "Suco contem" foi mantido como "Suco Contem"

## Identidade visual

Segue o Manual de Identidade Visual da Bonese:
- **Cores**: `#E9B94F` (P142C), `#C24E3F` (P7417C) e `#7C3331` (P7623C), definidas no topo do `assets/css/style.css`
- **Fontes**: Aleo (primária, do Google Fonts). A secundária, Flicker, não está no Google Fonts; o app usa a
  Londrina Solid no lugar. Se o cliente tiver o arquivo da Flicker, coloque-o em `assets/fonts/` e declare
  um `@font-face { font-family: 'Flicker'; src: url(../fonts/flicker.woff2); }` no CSS. Ela passa a ser usada sozinha.
- **Logo**: `assets/img/logo.png` (topo) e `assets/img/logo-full.png` (rodapé, com "food truck"), extraídos do manual

## Fotos

As fotos vêm do banco gratuito **Unsplash** (uso comercial liberado). A lista fica no fim do
`assets/js/menu.js` (bloco `PHOTOS`). Para trocar a foto de um item, cole outro ID do Unsplash ou o
caminho de uma foto própria do lanche (ex.: `'assets/img/fotos/bbt.jpg'`). O ideal é usar fotos reais
dos lanches da Bonese.

## Como colocar no ar (grátis)

Qualquer hospedagem de site estático serve. A mais rápida:
1. Acesse **app.netlify.com/drop**
2. Arraste a pasta inteira do projeto
3. Pronto — o link sai na hora (dá para ligar um domínio próprio depois)

Também funciona em GitHub Pages, Vercel ou Cloudflare Pages.

## Testar no computador

Abra `index.html` direto no navegador, ou rode um servidor local na pasta:

```bash
npx serve .
```

## Arquivos

```
index.html               estrutura da página
assets/css/style.css     visual (cores da marca no topo do arquivo)
assets/js/config.js      ⚠️ dados da loja
assets/js/menu.js        cardápio e adicionais
assets/js/pix.js         gerador do Pix (BR Code + QR)
assets/js/app.js         lógica do app
manifest.json            instalação na tela inicial
```
