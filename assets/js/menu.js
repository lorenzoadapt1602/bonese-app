/* =============================================================
   CARDÁPIO — preços e itens conforme o cardápio impresso.
   Para tirar um item do ar temporariamente: available: false
   ============================================================= */
(function () {
  const XIS_BASE = 'Maionese, ketchup, mostarda, tomate, milho, ervilha, alface, cebolinha';
  const xis = (rest) => `${XIS_BASE}, ${rest}.`;

  window.MENU = {
    comboLabel: 'Fritas + Fruki Guaraná 350ml',

    categories: [
      { id: 'burgers', name: 'Burgers', tag: '#hamburgueria', art: 'burger', removable: true,
        note: 'Burger artesanal de 130g. Todos podem virar combo com fritas + Fruki Guaraná 350ml.' },
      { id: 'xis', name: 'Xis', tag: '#clássicogaúcho', art: 'xis', removable: true,
        note: 'Todos levam maionese, ketchup, mostarda, tomate, milho, ervilha, alface e cebolinha.' },
      { id: 'premium', name: 'X Premium', tag: '#dobrodequeijo', art: 'xis', removable: true,
        note: 'Com dobro de queijo mussarela.' },
      { id: 'porcoes', name: 'Porções', tag: '#paracompartilhar', art: 'basket' },
      { id: 'sobremesas', name: 'Sobremesas', tag: '#docefinal', art: 'dessert' },
      { id: 'bebidas', name: 'Bebidas', tag: '#bemgelada', art: 'can' },
    ],

    addons: {
      xis: [
        { id: 'bacon', name: 'Bacon em tiras', price: 10 },
        { id: 'bife', name: 'Bife', price: 9 },
        { id: 'frango', name: 'Frango em cubos', price: 8 },
        { id: 'coracao', name: 'Coração', price: 10 },
        { id: 'catupiry', name: 'Catupiry', price: 7 },
        { id: 'cheddar', name: 'Cheddar', price: 7 },
        { id: 'mussarela', name: 'Mussarela', price: 6 },
        { id: 'provolone', name: 'Provolone', price: 7 },
        { id: 'coalho', name: 'Coalho', price: 10 },
        { id: 'rucula', name: 'Rúcula', price: 3 },
        { id: 'cebola-chapa', name: 'Cebola na chapa', price: 6 },
        { id: 'ovo', name: 'Ovo', price: 4 },
        { id: 'maionese', name: 'Maionese extra', price: 4 },
      ],
      burger: [
        { id: 'burger', name: 'Burger 130g', price: 9 },
        { id: 'burger-frango', name: 'Burger de frango', price: 9 },
        { id: 'bacon', name: 'Bacon em tiras', price: 9 },
        { id: 'farofa-bacon', name: 'Farofa de bacon', price: 9 },
        { id: 'geleia-abacaxi', name: 'Geleia de abacaxi com pimenta', price: 10 },
        { id: 'cheddar', name: 'Cheddar', price: 7 },
        { id: 'mussarela', name: 'Mussarela', price: 6 },
        { id: 'provolone', name: 'Provolone', price: 7 },
        { id: 'catupiry', name: 'Catupiry', price: 7 },
        { id: 'coalho', name: 'Coalho', price: 10 },
        { id: 'alface', name: 'Alface americana', price: 5 },
        { id: 'cebola-chapa', name: 'Cebola na chapa', price: 5 },
        { id: 'cebola-roxa', name: 'Cebola roxa', price: 5 },
        { id: 'tomate', name: 'Tomate', price: 3 },
        { id: 'rucula', name: 'Rúcula', price: 4 },
        { id: 'picles', name: 'Picles', price: 3 },
        { id: 'maionese', name: 'Maionese extra', price: 4 },
      ],
    },

    products: [
      /* ---------------- BURGERS ---------------- */
      { id: 'bbt', cat: 'burgers', code: 'BBT', name: 'Bonese Burger Tradicional', price: 33, combo: 46.90, addons: 'burger',
        desc: 'Burger de 130g, maionese, alface americana, tomate, cebola roxa e duplo cheddar.' },
      { id: 'bbb', cat: 'burgers', code: 'BBB', name: 'Bonese Burger Bacon', price: 44, combo: 57.90, addons: 'burger',
        desc: '2 burgers de 130g, maionese, alface americana, tomate, cebola na chapa, duplo cheddar e bacon em tiras.' },
      { id: 'bbq', cat: 'burgers', code: 'BBQ', name: 'Bonese Burger Queijos', price: 37, combo: 50.90, addons: 'burger',
        desc: 'Burger de 130g, maionese, alface americana, tomate, cebola roxa, queijo mussarela, provolone e cheddar.' },
      { id: 'bbc', cat: 'burgers', code: 'BBC', name: 'Bonese Burger Catupiry', price: 32, combo: 46.90, addons: 'burger',
        desc: 'Burger de 130g, maionese, catupiry e farofa de bacon.',
        options: [{ id: 'rucula', title: 'Quer com rúcula?', choices: [
          { label: 'Sem rúcula', delta: 0, silent: true },
          { label: 'Com rúcula', short: 'C/ rúcula', delta: 1 },
        ] }] },
      { id: 'bbp', cat: 'burgers', code: 'BBP', name: 'Bonese Burger Picles', price: 34, combo: 47.90, addons: 'burger',
        desc: 'Burger de 130g, maionese, ketchup, cebola brunoise, alface americana e triplo cheddar.' },
      { id: 'chicken', cat: 'burgers', name: 'Bonese Chicken Burger', price: 33, combo: 46.90, addons: 'burger',
        desc: 'Burger empanado de frango (100% filé de peito), maionese, alface americana, cebola brunoise, ketchup, mostarda e duplo cheddar.' },
      { id: 'prime', cat: 'burgers', name: 'Bonese PRIME Burger', price: 44, combo: 56.90, addons: 'burger',
        desc: 'Burger de 130g, maionese, cebola crisp, bacon em tiras, geleia de pimenta c/ abacaxi e queijo coalho.' },
      { id: 'supreme', cat: 'burgers', name: 'Bonese SUPREME Burger', price: 44, combo: 57.90, addons: 'burger',
        desc: 'Burger de 130g, maionese, queijo provolone, bacon em tiras e abacaxi caramelizado.' },
      { id: 'pesto', cat: 'burgers', name: 'Bonese Pesto Burger', price: 44, combo: 57.90, addons: 'burger',
        desc: 'Pão, burger 130g, maionese, queijo provolone, molho pesto, tomate cereja, cebola roxa e rúcula.' },
      { id: 'gorgonzola', cat: 'burgers', name: 'Bonese Burger Gorgonzola', price: 44, combo: 57.90, addons: 'burger',
        desc: 'Pão, burger de 130g, maionese, queijo gorgonzola, geleia de bacon, rúcula e cebola roxa.' },
      { id: 'mc', cat: 'burgers', name: 'Bonese MC Burger', price: 46, combo: 59.90, addons: 'burger',
        desc: 'Pão duplo corte, molho especial Bonese, 2 burgers 130g, duplo cheddar, alface americana, picles e cebola roxa.' },
      { id: 'big', cat: 'burgers', name: 'Bonese BIG Burger', price: 48, combo: 57.90, addons: 'burger',
        desc: '3 burgers de 130g, maionese, 4 fatias de cheddar e farofa de bacon.' },
      { id: 'veg', cat: 'burgers', name: 'Bonese Veg Burger', price: 46, combo: 59.90, addons: 'burger', veg: true,
        desc: 'Pão, burger de soja, maionese, alface americana, tomate, cebola roxa, queijo mussarela e geleia de abacaxi com pimenta.' },
      { id: 'bbk', cat: 'burgers', code: 'BBK', name: 'Bonese Burger Kids', price: 25, combo: 38.90, addons: 'burger', kids: true,
        desc: 'Burger de 130g, maionese e duplo cheddar.' },
      { id: 'chicken-kids', cat: 'burgers', name: 'Bonese Chicken Kids', price: 25, combo: 38.90, addons: 'burger', kids: true,
        desc: 'Burger empanado de frango (100% filé de peito), maionese e duplo cheddar.' },

      /* ---------------- XIS ---------------- */
      { id: 'x-salada', cat: 'xis', name: 'X-Salada', price: 36, addons: 'xis',
        short: 'Queijo mussarela, ovo, presunto e bife', desc: xis('queijo mussarela, ovo, presunto e bife') },
      { id: 'x-4queijos', cat: 'xis', name: 'X-4 Queijos', price: 44, addons: 'xis',
        short: 'Mussarela, cheddar, provolone, parmesão, ovo e bife', desc: xis('queijo mussarela, cheddar, provolone, ovo, parmesão e bife') },
      { id: 'x-portuguesa', cat: 'xis', name: 'X-Portuguesa c/ bife', price: 44, addons: 'xis',
        short: 'Mussarela, ovo, presunto, pimentão, cebola, azeitona, orégano e bife', desc: xis('queijo mussarela, ovo, presunto, pimentão, cebola, azeitona, orégano e bife') },
      { id: 'x-coracao', cat: 'xis', name: 'X-Coração', price: 41, addons: 'xis',
        short: 'Queijo mussarela, ovo e coração', desc: xis('queijo mussarela, ovo e coração') },
      { id: 'x-frango', cat: 'xis', name: 'X-Frango', price: 36, addons: 'xis',
        short: 'Queijo mussarela, ovo e frango em cubos', desc: xis('queijo mussarela, ovo e frango em cubos'),
        options: [{ id: 'bacon', title: 'Quer com bacon?', choices: [
          { label: 'Sem bacon', delta: 0, silent: true },
          { label: 'Com bacon', short: 'C/ bacon', delta: 3 },
        ] }] },
      { id: 'x-tomate-seco', cat: 'xis', name: 'X-Tomate seco c/ rúcula', price: 36, addons: 'xis', veg: true,
        short: 'Mussarela, provolone, ovo, tomate seco e rúcula', desc: xis('queijo mussarela, provolone, ovo, tomate seco e rúcula') },
      { id: 'x-brocolis', cat: 'xis', name: 'X-Brócolis', price: 32, addons: 'xis', veg: true,
        short: 'Mussarela, brócolis, catupiry e ovo', desc: xis('queijo mussarela, brócolis, catupiry e ovo') },

      /* ---------------- X PREMIUM ---------------- */
      { id: 'x-strogonoff', cat: 'premium', name: 'X-Strogonoff (alcatra)', price: 52, addons: 'xis',
        short: 'Dobro de queijo mussarela, ovo e strogonoff de alcatra', desc: xis('dobro de queijo mussarela, ovo e strogonoff') },
      { id: 'x-file', cat: 'premium', name: 'X-Filé mignon', price: 54, addons: 'xis',
        short: 'Dobro de queijo mussarela, ovo e filé mignon', desc: xis('dobro de queijo mussarela, ovo e filé mignon') },

      /* ---------------- PORÇÕES ---------------- */
      { id: 'batata-trad', cat: 'porcoes', name: 'Batata tradicional', price: 18, art: 'fries',
        options: [{ id: 'cobertura', title: 'Cobertura', choices: [
          { label: 'Sem cobertura', delta: 0, silent: true },
          { label: 'Com molho cheddar e farofa de bacon', short: 'C/ cheddar e bacon', delta: 8 },
        ] }] },
      { id: 'batata-crinkle', cat: 'porcoes', name: 'Batata crinkle', price: 18, art: 'fries',
        options: [{ id: 'cobertura', title: 'Cobertura', choices: [
          { label: 'Sem cobertura', delta: 0, silent: true },
          { label: 'Com molho cheddar e farofa de bacon', short: 'C/ cheddar e bacon', delta: 8 },
        ] }] },
      { id: 'aneis', cat: 'porcoes', name: 'Anéis de cebola', price: 25, art: 'rings' },
      { id: 'nuggets', cat: 'porcoes', name: 'Nuggets', price: 18 },
      { id: 'dadinho', cat: 'porcoes', name: 'Dadinho de tapioca', price: 28 },
      { id: 'almofadinha', cat: 'porcoes', name: 'Almofadinha de queijo gouda', price: 28 },
      { id: 'frango-fritas', cat: 'porcoes', name: 'Filé de frango em cubos + fritas', price: 39 },
      { id: 'tilapia', cat: 'porcoes', name: 'Tilápia empanada na panko + fritas', price: 52 },
      { id: 'frango-file', cat: 'porcoes', name: 'Filé de frango em cubos + filé mignon em cubos + fritas', price: 59 },
      { id: 'camarao', cat: 'porcoes', name: 'Camarão empanado na panko + fritas', price: 62 },
      { id: 'file-fritas', cat: 'porcoes', name: 'Filé mignon c/ fritas', price: 79 },

      /* ---------------- SOBREMESAS ---------------- */
      { id: 'brownie', cat: 'sobremesas', name: 'Brownie com sorvete', price: 25, desc: 'Brownie com sorvete e calda de chocolate.' },
      { id: 'mini-torta', cat: 'sobremesas', name: 'Mini torta de bolacha', price: 17 },
      { id: 'rings-brigadeiro', cat: 'sobremesas', name: 'Rings de brigadeiro recheado', price: 12, art: 'donut' },
      { id: 'cookie', cat: 'sobremesas', name: 'Cookie c/ gotas de chocolate', price: 9, art: 'cookie' },

      /* ---------------- BEBIDAS ---------------- */
      { id: 'refri', cat: 'bebidas', name: 'Refrigerante lata', price: 8, art: 'can',
        // ⚠️ ajuste os sabores disponíveis
        options: [{ id: 'sabor', title: 'Sabor', choices: [
          { label: 'Coca-Cola', delta: 0 }, { label: 'Coca-Cola Zero', delta: 0 },
          { label: 'Guaraná', delta: 0 }, { label: 'Laranja', delta: 0 }, { label: 'Limão', delta: 0 },
        ] }] },
      { id: 'suco', cat: 'bebidas', name: 'Suco Contem', price: 7, art: 'juice' },
      { id: 'agua', cat: 'bebidas', name: 'Água', price: 6, art: 'water' },
      { id: 'budweiser', cat: 'bebidas', name: 'Budweiser', price: 12, art: 'bottle', tint: '#8A3A12', longneck: true, desc: 'Long neck' },
      { id: 'heineken', cat: 'bebidas', name: 'Heineken', price: 15, art: 'bottle', tint: '#1F6B33', longneck: true, desc: 'Long neck' },
      { id: 'heineken-zero', cat: 'bebidas', name: 'Heineken 0.0', price: 15, art: 'bottle', tint: '#1F6B33', longneck: true, desc: 'Long neck · sem álcool' },
      { id: 'corona', cat: 'bebidas', name: 'Corona', price: 15, art: 'bottle', tint: '#E8B44A', longneck: true, desc: 'Long neck' },
      { id: 'stella', cat: 'bebidas', name: 'Stella Artois', price: 15, art: 'bottle', tint: '#9B5A16', longneck: true, desc: 'Long neck' },
    ],
  };

  /* -------------------------------------------------------------
     FOTOS — banco gratuito Unsplash (uso comercial liberado).
     Para trocar, cole o ID da foto (o trecho "photo-..." do link
     images.unsplash.com) ou o caminho de uma foto própria, ex.:
     'assets/img/fotos/bbt.jpg'
     ------------------------------------------------------------- */
  const PHOTOS = {
    bbt: 'photo-1603064752734-4c48eff53d05',
    bbb: 'photo-1625683257212-116d74981941',
    bbq: 'photo-1547584370-2cc98b8b8dc8',
    bbc: 'photo-1598182198871-d3f4ab4fd181',
    bbp: 'photo-1607013251379-e6eecfffe234',
    chicken: 'photo-1692737348416-0a4fa4cf1523',
    prime: 'photo-1596662951482-0c4ba74a6df6',
    supreme: 'photo-1549611016-3a70d82b5040',
    pesto: 'photo-1520072959219-c595dc870360',
    gorgonzola: 'photo-1520073201527-6b044ba2ca9f',
    mc: 'photo-1678110707289-ab14382a1625',
    big: 'photo-1564362411991-472954b39f56',
    veg: 'photo-1788601405384-c749fb2147f9',
    bbk: 'photo-1713330801172-03f8d1c0dde7',
    'chicken-kids': 'photo-1692737349870-e3bfc704ebf9',
    'x-salada': 'photo-1540981493580-8ea1113e9968',
    'x-4queijos': 'photo-1616174900332-1264408cf779',
    'x-portuguesa': 'photo-1559067933-0293effe6133',
    'x-coracao': 'photo-1772180374781-1e1c7c20427a',
    'x-frango': 'photo-1703219342329-fce8488cf443',
    'x-tomate-seco': 'photo-1596956470007-2bf6095e7e16',
    'x-brocolis': 'photo-1571091718767-18b5b1457add',
    'x-strogonoff': 'photo-1702119614788-bae35a7be313',
    'x-file': 'photo-1702119614711-cf930d2a647c',
    'batata-trad': 'photo-1606755456206-b25206cde27e',
    'batata-crinkle': 'photo-1688978181542-87a886a16fbe',
    aneis: 'photo-1612487439058-0564e17f761b',
    nuggets: 'photo-1627662168223-7df99068099a',
    dadinho: 'photo-1632811126382-228432b43576',
    almofadinha: 'photo-1734774924912-dcbb467f8599',
    'frango-fritas': 'photo-1652957392622-17e7c96f1369',
    tilapia: 'photo-1579208030886-b937da0925dc',
    'frango-file': 'photo-1720701247839-9b8433398385',
    camarao: 'photo-1553557202-e8e60357f061',
    'file-fritas': 'photo-1600891964092-4316c288032e',
    brownie: 'photo-1624353365286-3f8d62daad51',
    'mini-torta': 'photo-1597034722981-78baaef953d3',
    'rings-brigadeiro': 'photo-1657318415919-3beff167f849',
    cookie: 'photo-1634188023615-7e08901193b6',
    refri: 'photo-1629186235045-80d4147d90dc',
    suco: 'photo-1613478223719-2ab802602423',
    agua: 'photo-1523362628745-0c100150b504',
    budweiser: 'photo-1587669284207-e8ee0fc74144',
    heineken: 'photo-1599419685838-28e405ea05b9',
    'heineken-zero': 'photo-1618885472179-5e474019f2a9',
    corona: 'photo-1600213903598-25be92abde40',
    stella: 'photo-1506916278879-dc0a599e3885',
  };
  window.MENU.products.forEach((p) => { if (PHOTOS[p.id]) p.photo = PHOTOS[p.id]; });

  // fotos de destaque (topo e banners)
  window.MENU.heroPhoto = 'photo-1571091655789-405eb7a3a3a8';
  window.MENU.comboPhoto = 'photo-1767769354862-8ddb1fb77e96';
  window.MENU.bucketPhoto = 'photo-1726475148440-7def8a170cc1';
})();
