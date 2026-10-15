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
})();
