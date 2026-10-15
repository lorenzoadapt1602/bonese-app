/* =============================================================
   CONFIGURAÇÕES DA LOJA — edite os valores marcados com  ⚠️
   ============================================================= */
window.CONFIG = {
  storeName: 'Bonese Food Park',
  city: 'Lajeado',
  state: 'RS',
  instagram: 'bonesefoodpark',

  // ⚠️ WhatsApp que recebe os pedidos: 55 + DDD + número, só números
  whatsapp: '5551999999999',

  // ⚠️ Endereço mostrado para quem escolhe "Retirada"
  address: 'Endereço da loja, 000 – Bairro, Lajeado/RS',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Bonese+Food+Park+Lajeado',

  pix: {
    // ⚠️ Chave Pix da loja. Formatos aceitos:
    //    CPF/CNPJ (só números) · e-mail · celular com +55 (ex.: +5551999999999) · chave aleatória
    key: 'SUA-CHAVE-PIX',
    merchantName: 'BONESE FOOD PARK', // até 25 caracteres (nome do recebedor)
    merchantCity: 'LAJEADO',          // até 15 caracteres
    discountPercent: 0,               // ex.: 5 = 5% de desconto nos itens pagando no Pix
  },

  // Formas de pagamento disponíveis (true = aparece no app)
  payments: { pix: true, credit: true, debit: true, cash: true },

  delivery: {
    enabled: true,
    estimate: '40–60 min',
    minOrder: 0,          // pedido mínimo para delivery (0 = sem mínimo)
    freeAbove: null,      // ex.: 150 = entrega grátis acima de R$ 150
    allowOtherNeighborhood: true, // mostra "Meu bairro não está na lista (taxa a combinar)"
    // ⚠️ Bairros atendidos e taxa de entrega de cada um
    neighborhoods: [
      { name: 'Centro', fee: 5 },
      { name: 'Americano', fee: 6 },
      { name: 'Hidráulica', fee: 6 },
      { name: 'Moinhos', fee: 6 },
      { name: 'São Cristóvão', fee: 6 },
      { name: 'Universitário', fee: 6 },
      { name: 'Florestal', fee: 7 },
      { name: 'Montanha', fee: 7 },
      { name: 'Olarias', fee: 7 },
      { name: 'Alto do Parque', fee: 7 },
      { name: 'Santo Antônio', fee: 7 },
      { name: 'Carneiros', fee: 8 },
      { name: 'Moinhos d\'Água', fee: 8 },
      { name: 'Jardim do Cedro', fee: 8 },
      { name: 'Igrejinha', fee: 8 },
      { name: 'Planalto', fee: 8 },
      { name: 'Bom Pastor', fee: 8 },
      { name: 'Conventos', fee: 9 },
      { name: 'São Bento', fee: 9 },
      { name: 'Campestre', fee: 9 },
    ],
  },

  pickup: { estimate: '20–30 min' },

  // ⚠️ Horário de funcionamento — 0 = domingo … 6 = sábado. [] = fechado.
  //    Pode passar da meia-noite: '18:30-00:30'
  hours: {
    0: ['18:30-23:30'],
    1: [],
    2: ['18:30-23:30'],
    3: ['18:30-23:30'],
    4: ['18:30-23:30'],
    5: ['18:30-00:30'],
    6: ['18:30-00:30'],
  },
  // true = aceita pedido fora do horário (mostra aviso); false = bloqueia o envio
  acceptOrdersWhenClosed: true,

  // Painel da loja (admin/): cada pedido vai criptografado por este canal até a tela da loja.
  // Só quem tem a senha da loja consegue abrir os pedidos. Não altere sem gerar chaves novas.
  pedidosOnline: {
    servidor: 'https://ntfy.sh',
    canal: 'bonese-enc-441afd9cea175148f8dc9dbb',
    chavePublica: { kty: 'EC', crv: 'P-256', x: '4TcsfJe4BVPGcdXeDfmzbYj8GDcr8UmSRk6uhLVmJWQ', y: 'WwnDb263dwNKz3TIm-Lydo-ni5WC3WaipBN6-LnlbD0' },
  },

  // Promo "Se liga!": baldinho com 6 long necks ganha uma porção
  promoLongNeck: {
    enabled: true,
    every: 6,
    gifts: ['Batata tradicional', 'Batata crinkle', 'Onion rings (anéis de cebola)'],
  },
};
