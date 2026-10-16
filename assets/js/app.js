/* =============================================================
   BONESE — app de pedidos (cardápio, sacola, checkout, Pix, WhatsApp)
   ============================================================= */
'use strict';
(function () {
  const C = window.CONFIG;
  const M = window.MENU;

  /* ---------------- utilidades ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const brl = (v) => money.format(v);
  const r2 = (v) => Math.round(v * 100) / 100;
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const uid = () => Math.random().toString(36).slice(2, 10);
  const digits = (s) => String(s || '').replace(/\D/g, '');
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* sem storage */ } },
  };
  const DAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  const OTHER = '__outro__';

  const P = {}; M.products.forEach((p) => { P[p.id] = p; });
  const CAT = {}; M.categories.forEach((c) => { CAT[c.id] = c; });

  /* ---------------- estado ---------------- */
  const state = {
    mode: store.get('bn_mode', 'delivery'),
    cart: store.get('bn_cart', []).filter((i) => P[i.pid]),
    gifts: store.get('bn_gifts', []),
    customer: Object.assign(
      { name: '', phone: '', bairro: '', otherBairro: '', street: '', number: '', complement: '', reference: '' },
      store.get('bn_customer', {})
    ),
    payment: store.get('bn_payment', 'pix'),
    change: '',
    noChange: false,
    search: '',
    orderCode: null,
    lastOrder: null,
  };
  if (!C.delivery.enabled) state.mode = 'pickup';
  if (!C.payments[state.payment]) state.payment = Object.keys(C.payments).find((k) => C.payments[k]);

  function save() {
    store.set('bn_cart', state.cart);
    store.set('bn_gifts', state.gifts);
    store.set('bn_mode', state.mode);
    store.set('bn_customer', state.customer);
    store.set('bn_payment', state.payment);
  }

  /* ---------------- ícones ---------------- */
  const sv = (p, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${p}</svg>`;
  const ICON = {
    close: sv('<path d="M18 6 6 18M6 6l12 12"/>', 'stroke-width="2.4"'),
    back: sv('<path d="M15 18l-6-6 6-6"/>', 'stroke-width="2.4"'),
    plus: sv('<path d="M12 5v14M5 12h14"/>', 'stroke-width="2.8"'),
    minus: sv('<path d="M5 12h14"/>', 'stroke-width="2.8"'),
    search: sv('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>', 'stroke-width="2.4"'),
    bag: sv('<path d="M5.5 8h13l-1 12.5h-11z"/><path d="M9 8V7a3 3 0 0 1 6 0v1"/>'),
    moto: sv('<circle cx="5.5" cy="16.5" r="3"/><circle cx="18.5" cy="16.5" r="3"/><path d="M8.5 16.5h6.5l2.5-5.5h-4L11.5 7H9"/><path d="M5.5 16.5 8 11h5.5"/>'),
    walk: sv('<circle cx="13" cy="4.5" r="2"/><path d="m9 21 2.5-6.5L14 17v4"/><path d="M7 11.5 10 8l3.5 1 2 3.5H18"/><path d="m10 8-1.5 6.5"/>'),
    pin: sv('<path d="M12 21s-7-6.2-7-11.2a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.5"/>'),
    clock: sv('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    card: sv('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6.5 15h3"/>'),
    cash: sv('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M5.5 9.5v5M18.5 9.5v5"/>'),
    copy: sv('<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>'),
    check: sv('<path d="M20 6 9 17l-5-5"/>', 'stroke-width="3"'),
    alert: sv('<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5M12 16.5v.01"/>', 'stroke-width="2.4"'),
    insta: sv('<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>'),
    gift: sv('<rect x="3" y="8" width="18" height="4.5" rx="1"/><path d="M12 8v13M5 12.5V21h14v-8.5"/><path d="M12 8S10.3 3.7 7.9 4.6C6 5.3 7.4 8 12 8zm0 0s1.7-4.3 4.1-3.4C18 5.3 16.6 8 12 8z"/>'),
    glass: sv('<path d="M6 3h12l-1.5 8.5a4.5 4.5 0 0 1-9 0z"/><path d="M12 16v5M8 21h8M6.5 7h11"/>'),
    whats: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M12 3.2a8.8 8.8 0 0 0-7.6 13.2L3.2 20.8l4.5-1.2A8.8 8.8 0 1 0 12 3.2z"/><path fill="currentColor" d="M9.3 7.4c-.5 0-1 .4-1.1 1-.2 1.5.6 3.3 2.1 4.8s3.3 2.3 4.8 2.1c.6-.1 1-.6 1-1.1v-.9l-2.1-.9-.9 1a5.2 5.2 0 0 1-2.9-2.9l1-.9-.9-2.1z"/></svg>',
    pix: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.6 16.9a2.9 2.9 0 0 1-2-.8l-2.9-2.9a.6.6 0 0 0-.8 0l-2.9 2.9a2.9 2.9 0 0 1-2 .8h-.6l3.7 3.7a2.9 2.9 0 0 0 4.1 0l3.7-3.7zM7 7.1c.8 0 1.5.3 2 .8l2.9 2.9c.2.2.6.2.8 0l2.9-2.9c.5-.5 1.3-.8 2-.8h.4l-3.7-3.7a2.9 2.9 0 0 0-4.1 0L6.6 7.1zm13.6 2.8-2.2-2.2h-.8c-.5 0-1 .2-1.4.6L13.3 11a1.8 1.8 0 0 1-2.6 0L7.8 8.3c-.4-.4-.9-.6-1.4-.6h-1L3.4 9.9a2.9 2.9 0 0 0 0 4.1l2.1 2.1h1c.5 0 1-.2 1.4-.6l2.9-2.9c.7-.7 1.9-.7 2.6 0l2.9 2.9c.4.4.9.6 1.4.6h.8l2.2-2.2a2.9 2.9 0 0 0-.1-4z"/></svg>',
  };

  /* ---------------- ilustrações ---------------- */
  const SHADOW = (rx = 42) => `<ellipse cx="60" cy="105" rx="${rx}" ry="6" fill="#000" opacity=".32"/>`;
  const ART = {
    burger: () => `${SHADOW(44)}
      <path d="M20 86h80v5c0 6.6-5.4 12-12 12H32c-6.6 0-12-5.4-12-12z" fill="#D88A2B"/>
      <rect x="15" y="70" width="90" height="17" rx="8.5" fill="#5A2C18"/>
      <path d="M24 77h72" stroke="#3B1C0E" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="4 7"/>
      <path d="M14 65h92l-3 7-6-3-4 9-6-6-5 8-6-7-6 9-6-8-6 8-6-8-5 7-6-8-5 6-6-9z" fill="#FFC52B"/>
      <path d="M12 58Q17 68 22 60Q27 68 32 60Q37 68 42 60Q47 68 52 60Q57 68 62 60Q67 68 72 60Q77 68 82 60Q87 68 92 60Q97 68 102 60Q105 66 108 58Z" fill="#74C044"/>
      <path d="M17 60C17 35 36 19 60 19s43 16 43 41z" fill="#EEA738"/>
      <path d="M17.6 54h84.8c.4 2 .6 4 .6 6H17c0-2 .2-4 .6-6z" fill="#D58E27"/>
      <path d="M31 41c6-9 15-14 27-15" stroke="#FFD27A" stroke-width="4" stroke-linecap="round" fill="none" opacity=".75"/>
      <g fill="#FFF3D9"><ellipse cx="47" cy="33" rx="2.8" ry="1.6" transform="rotate(-25 47 33)"/><ellipse cx="62" cy="28" rx="2.8" ry="1.6"/><ellipse cx="77" cy="34" rx="2.8" ry="1.6" transform="rotate(25 77 34)"/><ellipse cx="54" cy="43" rx="2.8" ry="1.6" transform="rotate(-10 54 43)"/><ellipse cx="70" cy="44" rx="2.8" ry="1.6" transform="rotate(15 70 44)"/><ellipse cx="86" cy="47" rx="2.6" ry="1.5" transform="rotate(35 86 47)"/><ellipse cx="37" cy="48" rx="2.6" ry="1.5" transform="rotate(-35 37 48)"/></g>`,
    xis: () => `${SHADOW(50)}
      <path d="M7 84h106v4c0 6.6-5.4 12-12 12H19c-6.6 0-12-5.4-12-12z" fill="#D9963A"/>
      <rect x="7" y="76" width="106" height="10" rx="5" fill="#6B3420"/>
      <rect x="9" y="69" width="102" height="8" rx="4" fill="#FFD33D"/>
      <ellipse cx="40" cy="70" rx="17" ry="5" fill="#FFF8EC"/><ellipse cx="40" cy="69" rx="6.5" ry="3.6" fill="#FFB21E"/>
      <rect x="10" y="63" width="100" height="7" rx="3.5" fill="#E8483A"/>
      <g fill="#F2CF3A"><circle cx="70" cy="66" r="2.4"/><circle cx="82" cy="65" r="2.4"/><circle cx="92" cy="67" r="2.4"/></g>
      <g fill="#86C04A"><circle cx="64" cy="67" r="2.3"/><circle cx="76" cy="68" r="2.3"/><circle cx="100" cy="66" r="2.3"/></g>
      <path d="M8 58Q13 66 18 60Q23 66 28 60Q33 66 38 60Q43 66 48 60Q53 66 58 60Q63 66 68 60Q73 66 78 60Q83 66 88 60Q93 66 98 60Q103 66 108 60Q110 64 112 58Z" fill="#74C044"/>
      <path d="M7 60c0-13 22-22 53-22s53 9 53 22z" fill="#EEAA45"/>
      <path d="M26 50l18-6M50 47l20-4M76 47l18 3" stroke="#C47A25" stroke-width="3" stroke-linecap="round"/>
      <path d="M60 39V18" stroke="#EADBB9" stroke-width="2.5" stroke-linecap="round"/>
      <path d="M60 17h17l-4 5 4 5H60z" fill="#EE5B4B"/>`,
    basket: () => `${SHADOW(40)}
      <g fill="#E39A35" stroke="#B9731E" stroke-width="2"><ellipse cx="42" cy="56" rx="15" ry="12" transform="rotate(-15 42 56)"/><ellipse cx="78" cy="55" rx="15" ry="12" transform="rotate(18 78 55)"/><ellipse cx="60" cy="47" rx="16" ry="13"/><ellipse cx="50" cy="65" rx="14" ry="11"/><ellipse cx="72" cy="66" rx="14" ry="11"/></g>
      <g fill="#F7CB78"><circle cx="55" cy="42" r="2"/><circle cx="66" cy="49" r="1.6"/><circle cx="38" cy="52" r="1.7"/><circle cx="81" cy="50" r="1.8"/><circle cx="47" cy="60" r="1.5"/></g>
      <path d="M16 68h88l-9 31a8 8 0 0 1-7.7 6H32.7a8 8 0 0 1-7.7-6z" fill="#2E2520"/>
      <path d="M13 63h94l-2 9H15z" fill="#EE5B4B"/>
      <g fill="#FFF3E0"><rect x="19" y="63" width="8" height="9"/><rect x="35" y="63" width="8" height="9"/><rect x="51" y="63" width="8" height="9"/><rect x="67" y="63" width="8" height="9"/><rect x="83" y="63" width="8" height="9"/><rect x="99" y="63" width="6" height="9"/></g>
      <path d="M27 83h66M31 94h58" stroke="#463A31" stroke-width="3" stroke-linecap="round"/>`,
    fries: () => `${SHADOW(32)}
      <g fill="#FFC83D" stroke="#DDA021" stroke-width="1.4"><rect x="35" y="32" width="9" height="42" rx="2" transform="rotate(-14 39 53)"/><rect x="46" y="20" width="9" height="52" rx="2" transform="rotate(-6 50 46)"/><rect x="57" y="14" width="9" height="56" rx="2"/><rect x="67" y="22" width="9" height="50" rx="2" transform="rotate(7 71 47)"/><rect x="76" y="31" width="9" height="42" rx="2" transform="rotate(15 80 52)"/><rect x="51" y="30" width="9" height="42" rx="2" transform="rotate(12 55 51)"/></g>
      <path d="M28 54h64l-9 50H37z" fill="#EE5B4B"/>
      <path d="M28 54q32 16 64 0l-1.6 9q-30.4 14-60.8 0z" fill="#D2402F"/>
      <circle cx="60" cy="83" r="10" fill="#EDB43C"/>
      <path d="M56 79v8M60 79v8M64 79v8" stroke="#1A1208" stroke-width="2" stroke-linecap="round"/>`,
    rings: () => `${SHADOW(42)}
      <g fill="none" stroke-width="12" stroke-linecap="round"><circle cx="42" cy="72" r="20" stroke="#D2862A"/><circle cx="76" cy="68" r="21" stroke="#E5A03A"/><circle cx="58" cy="44" r="19" stroke="#F2B650"/></g>
      <g fill="#FFDB94" opacity=".8"><circle cx="50" cy="30" r="1.8"/><circle cx="70" cy="40" r="1.6"/><circle cx="40" cy="48" r="1.6"/><circle cx="92" cy="62" r="1.8"/><circle cx="62" cy="80" r="1.7"/><circle cx="26" cy="74" r="1.6"/><circle cx="80" cy="88" r="1.6"/></g>`,
    dessert: () => `<ellipse cx="60" cy="98" rx="48" ry="10" fill="#EFE3D0"/><ellipse cx="60" cy="96" rx="39" ry="7" fill="#DDCBB0"/>
      <path d="M26 66l58-6 12 12-58 7z" fill="#6E3D24"/>
      <path d="M38 79l58-7v17l-58 7z" fill="#46220F"/>
      <path d="M26 66l12 13v17L26 84z" fill="#34180A"/>
      <path d="M45 61c-4-14 6-24 17-24s21 9 17 22c-2 6-30 8-34 2z" fill="#FFF6E4"/>
      <path d="M45 60q4 5 8 1t8 1 8-1 8 1 7-2" stroke="#EADBC0" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M50 45c4 4 8-2 12 2s6 8 10 2 6 2 6 7" stroke="#3A1A0A" stroke-width="4" fill="none" stroke-linecap="round"/>
      <circle cx="66" cy="34" r="5" fill="#EE5B4B"/><path d="M66 29q2-6 7-7" stroke="#5B8E2E" stroke-width="2" fill="none" stroke-linecap="round"/>`,
    donut: () => `${SHADOW(36)}
      <circle cx="60" cy="62" r="38" fill="#C98A47"/>
      <path d="M60 27c19 0 34 14 34 33 0 4-3 6-6 4s-5 2-8 0-5 3-8 1-6 3-9 1-6 2-9 0-5 2-8 0-6 1-8-2c-2-3 0-3 0-4 0-19 16-33 22-33z" fill="#4A2312"/>
      <circle cx="60" cy="60" r="11" fill="#211b17"/>
      <g stroke-width="3.2" stroke-linecap="round"><path d="M42 44l4 3" stroke="#EDB43C"/><path d="M74 40l-3 4" stroke="#fff"/><path d="M80 56l4-1" stroke="#EE5B4B"/><path d="M48 70l-4 2" stroke="#7BC86C"/><path d="M58 38l4 0" stroke="#EE5B4B"/><path d="M70 72l3 3" stroke="#EDB43C"/><path d="M38 58l1 4" stroke="#fff"/></g>`,
    cookie: () => `${SHADOW(36)}
      <circle cx="60" cy="60" r="38" fill="#D9A15A"/>
      <circle cx="60" cy="60" r="35" fill="none" stroke="#C48A43" stroke-width="3" stroke-dasharray="2 5"/>
      <g fill="#3A1A0A"><path d="M42 42l7-2 2 7-7 2z"/><path d="M66 36l6 1-1 6-6-1z"/><path d="M78 56l7 1-2 7-6-2z"/><path d="M52 62l7-1 1 7-7 1z"/><path d="M38 70l6 2-2 6-6-2z"/><path d="M68 76l7-1 1 6-7 1z"/><path d="M60 48l4 0 0 4-4 0z"/></g>`,
    can: (p) => `${SHADOW(28)}
      <rect x="38" y="20" width="44" height="84" rx="9" fill="${(p && p.tint) || '#EE5B4B'}"/>
      <rect x="40" y="15" width="40" height="9" rx="3.5" fill="#D6CFC6"/>
      <rect x="38" y="50" width="44" height="24" fill="#EDB43C"/>
      <path d="M38 50q22 8 44 0M38 74q22 8 44 0" stroke="#1A1208" stroke-width="1.5" fill="none" opacity=".25"/>
      <rect x="44" y="26" width="5" height="72" rx="2.5" fill="#fff" opacity=".25"/>
      <rect x="40" y="98" width="40" height="5" rx="2.5" fill="#D6CFC6"/>`,
    juice: () => `${SHADOW(26)}
      <path d="M66 22V8h10" stroke="#EE5B4B" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M40 34l8-12h24l8 12z" fill="#E39A2E"/>
      <rect x="40" y="34" width="40" height="70" rx="3" fill="#F6C95F"/>
      <circle cx="60" cy="68" r="14" fill="#F07B2B"/><circle cx="60" cy="68" r="9" fill="#FFA24C"/>
      <path d="M60 54q6-8 13-6-4 7-13 6z" fill="#74C044"/>
      <rect x="45" y="40" width="4" height="58" rx="2" fill="#fff" opacity=".3"/>`,
    water: () => `${SHADOW(24)}
      <rect x="51" y="9" width="18" height="10" rx="2.5" fill="#3C8DDE"/>
      <path d="M50 19h20v8c8 4 12 10 12 18v53a7 7 0 0 1-7 7H45a7 7 0 0 1-7-7V45c0-8 4-14 12-18z" fill="#CFEAFF" opacity=".9"/>
      <rect x="38" y="58" width="44" height="24" fill="#3C8DDE"/>
      <path d="M48 66q6-5 12 0t12 0" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <rect x="44" y="34" width="4" height="66" rx="2" fill="#fff" opacity=".55"/>`,
    bottle: (p) => `${SHADOW(24)}
      <path d="M53 12h14v12c0 7 11 12 11 27v49a6 6 0 0 1-6 6H48a6 6 0 0 1-6-6V51c0-15 11-20 11-27z" fill="${(p && p.tint) || '#1F6B33'}"/>
      <rect x="51.5" y="7" width="17" height="7" rx="2" fill="#D9D2C5"/>
      <rect x="53" y="26" width="14" height="8" rx="1.5" fill="#F1E3C4"/>
      <rect x="42" y="60" width="36" height="29" rx="2" fill="#F1E3C4"/>
      <rect x="42" y="66" width="36" height="5" fill="#EE5B4B"/>
      <path d="M50 76h20M52 82h16" stroke="#1A1208" stroke-width="2" stroke-linecap="round" opacity=".5"/>
      <path d="M47.5 50v42" stroke="#fff" stroke-opacity=".3" stroke-width="4" stroke-linecap="round"/>`,
    bucket: () => `${SHADOW(40)}
      <g><path d="M38 52V22c0-4 3-6 3-10h8c0 4 3 6 3 10v30z" fill="#1F6B33"/><rect x="40.5" y="8" width="9" height="5" rx="1.5" fill="#D9D2C5"/></g>
      <g><path d="M53 50V16c0-4 3-6 3-10h8c0 4 3 6 3 10v34z" fill="#E8B44A"/><rect x="55.5" y="3" width="9" height="5" rx="1.5" fill="#D9D2C5"/></g>
      <g><path d="M68 52V24c0-4 3-6 3-10h8c0 4 3 6 3 10v28z" fill="#9B5A16"/><rect x="70.5" y="10" width="9" height="5" rx="1.5" fill="#D9D2C5"/></g>
      <path d="M22 52h76l-8 52H30z" fill="#C9CED6"/>
      <rect x="17" y="47" width="86" height="10" rx="5" fill="#EEF1F5"/>
      <path d="M26 72h68M28 90h64" stroke="#A3AAB4" stroke-width="3"/>
      <rect x="32" y="60" width="5" height="38" rx="2.5" fill="#fff" opacity=".45"/>`,
  };
  const svgWrap = (inner) => `<svg viewBox="0 0 120 120" aria-hidden="true">${inner}</svg>`;
  const art = (p) => svgWrap((ART[p.art || CAT[p.cat].art] || ART.burger)(p));
  // fotos: ID do Unsplash ("photo-...") ou caminho/URL de uma foto própria
  const photoUrl = (ref, w, h) => (/^(https?:|\.{0,2}\/|assets\/)/.test(ref)
    ? ref
    : `https://images.unsplash.com/${ref}?auto=format&fit=crop&w=${w}&h=${h}&q=70`);
  const photo = (ref, w, h, eager) => (ref
    ? `<span class="ph-box"><img class="ph" src="${photoUrl(ref, w, h)}" srcset="${photoUrl(ref, w * 2, h * 2)} 2x" alt="" ${eager ? '' : 'loading="lazy"'} decoding="async" onload="this.classList.add('on')" onerror="this.parentNode.remove()"></span>`
    : '');
  const comboArt = () => svgWrap(`<g transform="translate(-6 14) scale(.78)">${ART.burger()}</g><g transform="translate(54 30) scale(.6)">${ART.fries()}</g>`);

  /* ---------------- preços ---------------- */
  function choiceOf(p, it, g) { return g.choices[(it.choices && it.choices[g.id]) ?? 0] || g.choices[0]; }

  function unitPrice(it) {
    const p = P[it.pid];
    if (!p) return 0;
    let v = it.combo && p.combo ? p.combo : p.price;
    (p.options || []).forEach((g) => { v += choiceOf(p, it, g).delta || 0; });
    const adds = M.addons[p.addons] || [];
    Object.entries(it.addons || {}).forEach(([aid, q]) => {
      const a = adds.find((x) => x.id === aid);
      if (a) v += a.price * q;
    });
    return r2(v);
  }

  function itemDetails(it) {
    const p = P[it.pid];
    const out = [];
    (p.options || []).forEach((g) => {
      const ch = choiceOf(p, it, g);
      if (!ch.silent) out.push({ cls: '', text: g.id === 'sabor' ? `Sabor: ${ch.label}` : ch.label });
    });
    if (it.combo && p.combo) out.push({ cls: 'combo', text: `Combo: + ${M.comboLabel}` });
    const adds = M.addons[p.addons] || [];
    Object.entries(it.addons || {}).forEach(([aid, q]) => {
      const a = adds.find((x) => x.id === aid);
      if (a && q > 0) out.push({ cls: '', text: `+ ${q > 1 ? q + 'x ' : ''}${a.name}` });
    });
    if (it.removed && it.removed.length) out.push({ cls: 'rm', text: `Sem: ${it.removed.join(', ').toLowerCase()}` });
    if (it.note) out.push({ cls: '', text: `Obs.: ${it.note}` });
    return out;
  }

  const signature = (it) => JSON.stringify([
    it.pid, it.choices || {}, !!it.combo,
    Object.entries(it.addons || {}).filter(([, q]) => q > 0).sort(), [...(it.removed || [])].sort(), (it.note || '').trim(),
  ]);

  function promoInfo() {
    const pr = C.promoLongNeck;
    if (!pr || !pr.enabled) return null;
    const n = state.cart.reduce((s, i) => s + (P[i.pid] && P[i.pid].longneck ? i.qty : 0), 0);
    return { n, earned: Math.floor(n / pr.every), missing: pr.every - (n % pr.every), every: pr.every };
  }
  function syncGifts() {
    const info = promoInfo();
    const earned = info ? info.earned : 0;
    while (state.gifts.length < earned) state.gifts.push(0);
    state.gifts.length = earned;
  }

  function currentBairro() {
    if (state.customer.bairro === OTHER) return state.customer.otherBairro.trim() || 'Outro bairro';
    return state.customer.bairro;
  }

  function totals() {
    const subtotal = r2(state.cart.reduce((s, i) => s + unitPrice(i) * i.qty, 0));
    let fee = 0;
    let feeStatus = 'pickup';
    if (state.mode === 'delivery') {
      const b = C.delivery.neighborhoods.find((n) => n.name === state.customer.bairro);
      if (b) {
        feeStatus = 'ok';
        fee = C.delivery.freeAbove && subtotal >= C.delivery.freeAbove ? 0 : b.fee;
      } else feeStatus = state.customer.bairro === OTHER ? 'other' : 'pending';
    }
    const pct = state.payment === 'pix' ? Number(C.pix.discountPercent) || 0 : 0;
    const discount = r2((subtotal * pct) / 100);
    const total = r2(subtotal + fee - discount);
    const count = state.cart.reduce((s, i) => s + i.qty, 0);
    return { subtotal, fee, feeStatus, discount, pct, total, count };
  }

  function totalsHTML(t) {
    let feeRow = '';
    if (t.feeStatus === 'pickup') feeRow = '<div class="row"><span>Retirada no local</span><span>Grátis</span></div>';
    else if (t.feeStatus === 'ok') feeRow = `<div class="row"><span>Entrega · ${esc(state.customer.bairro)}</span><span>${t.fee ? brl(t.fee) : 'Grátis'}</span></div>`;
    else if (t.feeStatus === 'other') feeRow = '<div class="row"><span>Entrega</span><span>a combinar</span></div>';
    else feeRow = '<div class="row"><span>Entrega</span><span>conforme o bairro</span></div>';
    return `<div class="totals">
      <div class="row"><span>Subtotal</span><span>${brl(t.subtotal)}</span></div>
      ${feeRow}
      ${t.discount ? `<div class="row discount"><span>Desconto Pix (${t.pct}%)</span><span>− ${brl(t.discount)}</span></div>` : ''}
      <div class="row total"><span>Total</span><span>${brl(t.total)}</span></div>
    </div>`;
  }

  /* ---------------- horário ---------------- */
  const toMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + (m || 0); };
  const ranges = (d) => (C.hours[d] || []).map((r) => { const [a, b] = r.split('-'); return { o: toMin(a), c: toMin(b), os: a, cs: b }; });
  function storeStatus() {
    const now = new Date();
    const d = now.getDay();
    const m = now.getHours() * 60 + now.getMinutes();
    for (const r of ranges(d)) if (r.c > r.o ? m >= r.o && m < r.c : m >= r.o) return { open: true, until: r.cs };
    for (const r of ranges((d + 6) % 7)) if (r.c <= r.o && m < r.c) return { open: true, until: r.cs };
    for (let k = 0; k < 7; k++) {
      const dd = (d + k) % 7;
      for (const r of ranges(dd)) {
        if (k > 0 || r.o > m) return { open: false, next: k === 0 ? `hoje às ${r.os}` : k === 1 ? `amanhã às ${r.os}` : `${DAYS[dd].toLowerCase()} às ${r.os}` };
      }
    }
    return { open: false, next: '' };
  }
  function renderStatus() {
    const s = storeStatus();
    const el = $('#status');
    el.className = 'status' + (s.open ? '' : ' closed');
    el.innerHTML = s.open
      ? `<span class="dot"></span>Aberto <small>até ${s.until}</small>`
      : `<span class="dot"></span>Fechado${s.next ? ` <small>abre ${s.next}</small>` : ''}`;
  }

  /* ---------------- cabeçalho ---------------- */
  function renderModeSwitch() {
    const fees = C.delivery.neighborhoods.map((n) => n.fee);
    const minFee = fees.length ? Math.min(...fees) : 0;
    let html = '';
    if (C.delivery.enabled) {
      html += `<button type="button" data-mode="delivery" aria-pressed="${state.mode === 'delivery'}">${ICON.moto}<span><b>Delivery</b><small>${C.delivery.estimate} · a partir de ${brl(minFee)}</small></span></button>`;
    }
    html += `<button type="button" data-mode="pickup" aria-pressed="${state.mode === 'pickup'}">${ICON.walk}<span><b>Retirada</b><small>${C.pickup.estimate} · sem taxa</small></span></button>`;
    $('#modeSwitch').innerHTML = html;
  }
  function setMode(mode) {
    if (mode === state.mode) return;
    state.mode = mode;
    save();
    $$('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
    if (isOpen('checkoutView')) { renderDeliveryArea(); renderPayPanel(); renderSummary(); }
    if (isOpen('cartSheet')) renderCart();
  }

  /* ---------------- cardápio ---------------- */
  function renderCats() {
    $('#cats').innerHTML = M.categories
      .map((c, i) => `<button type="button" class="cat-chip${i === 0 ? ' active' : ''}" data-cat="${c.id}">${esc(c.name)}</button>`)
      .join('');
  }

  function renderHighlights() {
    const parts = [];
    const ex = M.products.find((p) => p.combo);
    if (ex) {
      parts.push(`<button type="button" class="promo mustard${M.comboPhoto ? ' photo' : ''}" style="--img:url('${M.comboPhoto ? photoUrl(M.comboPhoto, 900, 400) : ''}')" data-goto="burgers"><span class="p-art">${comboArt()}</span><span><h4>Vira combo?</h4><p>Qualquer burger + ${esc(M.comboLabel)}. A partir de ${brl(Math.min(...M.products.filter((p) => p.combo).map((p) => p.combo)))}.</p></span></button>`);
    }
    if (C.promoLongNeck && C.promoLongNeck.enabled) {
      parts.push(`<button type="button" class="promo coral${M.bucketPhoto ? ' photo' : ''}" style="--img:url('${M.bucketPhoto ? photoUrl(M.bucketPhoto, 900, 400) : ''}')" data-goto="bebidas"><span class="p-art">${svgWrap(ART.bucket())}</span><span><h4>Se liga!</h4><p>Baldinho com ${C.promoLongNeck.every} long necks ganha uma porção de fritas (tradicional ou crinkle) ou onion rings.</p></span></button>`);
    }
    $('#highlights').innerHTML = parts.join('');
  }

  function metaHTML(p) {
    const t = [];
    if (p.code) t.push(`<span class="code">${esc(p.code)}</span>`);
    if (p.veg) t.push('<span class="tag veg">Vegetariano</span>');
    if (p.kids) t.push('<span class="tag kids">Kids</span>');
    if (p.longneck) t.push('<span class="tag beer">Long neck</span>');
    return t.length ? `<div class="card-meta">${t.join('')}</div>` : '';
  }

  function altPrice(p) {
    const g = (p.options || [])[0];
    if (!g || g.choices.length !== 2 || !g.choices[1].short) return '';
    return `${g.choices[1].short} ${brl(p.price + g.choices[1].delta)}`;
  }

  function cardHTML(p) {
    const soldout = p.available === false;
    const desc = p.short || (p.longneck ? '' : p.desc) || '';
    const alt = altPrice(p);
    return `<article class="card${soldout ? ' soldout' : ''}" data-pid="${p.id}" role="button" tabindex="0" aria-label="${esc(p.name)}, ${brl(p.price)}${soldout ? ', esgotado' : ''}">
      <div class="card-body">
        ${metaHTML(p)}
        <h3>${esc(p.name)}</h3>
        ${desc ? `<p class="desc">${esc(desc)}</p>` : ''}
        <div class="card-foot">
          <span class="price">${soldout ? 'Esgotado' : brl(p.price)}</span>
          ${p.combo && !soldout ? `<span class="mini">Combo ${brl(p.combo)}</span>` : ''}
          ${alt && !soldout ? `<span class="mini">${esc(alt)}</span>` : ''}
        </div>
      </div>
      <div class="card-art">${art(p)}${photo(p.photo, 116, 116)}<span class="card-qty"></span>${soldout ? '' : `<span class="card-add">${ICON.plus}</span>`}</div>
    </article>`;
  }

  let spy = null;
  function renderMenu() {
    const q = norm(state.search.trim());
    const html = M.categories.map((cat) => {
      const items = M.products.filter((p) => p.cat === cat.id && (!q || norm(`${p.name} ${p.code || ''} ${p.desc || ''} ${cat.name}`).includes(q)));
      if (!items.length) return '';
      let extra = '';
      if (cat.id === 'bebidas' && !q) {
        extra = `<div class="info-card"><span class="ic">${ICON.glass}</span><span><b>Drinks, caipiras e chopp</b>Consulte valores e sabores.</span><a href="${waLink('Olá! Quais drinks, caipiras e chopps vocês têm hoje?')}" target="_blank" rel="noopener">Perguntar</a></div>`;
      }
      return `<section class="menu-section" id="cat-${cat.id}" data-cat="${cat.id}">
        <header class="section-head">
          <span class="section-tag">${esc(cat.tag || '')}</span>
          <h2>${esc(cat.name)}</h2>
          ${cat.note && !q ? `<p>${esc(cat.note)}</p>` : ''}
        </header>
        <div class="grid">${items.map(cardHTML).join('')}</div>
        ${extra}
      </section>`;
    }).join('');
    $('#menu').innerHTML = html || `<div class="empty"><b>Nada por aqui</b>Não achamos “${esc(state.search)}”. Tente outro nome.</div>`;
    $('#highlights').style.display = q ? 'none' : '';
    updateBadges();

    if (spy) spy.disconnect();
    if ('IntersectionObserver' in window) {
      spy = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveCat(e.target.dataset.cat); });
      }, { rootMargin: '-40% 0px -55% 0px' });
      $$('.menu-section').forEach((s) => spy.observe(s));
    }
  }

  function setActiveCat(id) {
    const row = $('#cats');
    $$('.cat-chip', row).forEach((c) => {
      const on = c.dataset.cat === id;
      c.classList.toggle('active', on);
      if (on) row.scrollTo({ left: c.offsetLeft - row.clientWidth / 2 + c.clientWidth / 2, behavior: 'smooth' });
    });
  }

  function updateBadges() {
    const qty = {};
    state.cart.forEach((i) => { qty[i.pid] = (qty[i.pid] || 0) + i.qty; });
    $$('.card[data-pid]').forEach((card) => {
      const b = $('.card-qty', card);
      const n = qty[card.dataset.pid] || 0;
      b.textContent = n ? `${n}×` : '';
      b.classList.toggle('on', n > 0);
    });
  }

  function renderFooter() {
    const today = new Date().getDay();
    const order = [1, 2, 3, 4, 5, 6, 0];
    const hours = order.map((d) => {
      const r = C.hours[d] || [];
      return `<li class="${d === today ? 'today' : ''}"><span>${DAYS[d]}</span><span>${r.length ? r.map((x) => x.replace('-', ' – ')).join(', ') : 'Fechado'}</span></li>`;
    }).join('');
    $('#footer').innerHTML = `<div class="wrap foot-grid">
      <div>
        <div class="brand"><img class="logo-img" src="assets/img/logo-full.png" alt="Bonese food truck" loading="lazy"><div><div class="brand-name">${esc(C.storeName)}</div><div class="brand-sub">${esc(C.city)} · ${esc(C.state)}</div></div></div>
        <p>${esc(C.address)}</p>
        <div class="foot-links">
          <a href="https://www.instagram.com/${C.instagram}/" target="_blank" rel="noopener">${ICON.insta}@${esc(C.instagram)}</a>
          <a href="${C.mapsUrl}" target="_blank" rel="noopener">${ICON.pin}Como chegar</a>
          <a href="${waLink('Olá! Tenho uma dúvida.')}" target="_blank" rel="noopener">${ICON.whats}WhatsApp</a>
        </div>
      </div>
      <div><h4>Horários</h4><ul class="hours">${hours}</ul></div>
      <div><h4>Pagamento</h4><p>Pix (QR Code com o valor exato), cartão de crédito e débito ou dinheiro.</p><p>Delivery em ${esc(C.delivery.estimate)} · Retirada em ${esc(C.pickup.estimate)}.</p><div class="made">Made ♥ in Lajeado</div><p class="photo-credit"><a href="admin/">${sv('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>', 'style="width:12px;height:12px;display:inline;vertical-align:-1px"')} Área da loja</a></p><p class="photo-credit">Fotos ilustrativas: <a href="https://unsplash.com" target="_blank" rel="noopener">Unsplash</a></p></div>
    </div>`;
  }

  /* ---------------- camadas (sheets / telas) ---------------- */
  const layers = [];
  let skipPop = 0;
  const isOpen = (id) => layers.includes(id);

  function syncLayers() {
    layers.forEach((id, i) => { document.getElementById(id).style.zIndex = 100 + i * 2; });
    const top = layers[layers.length - 1];
    const overlay = $('#overlay');
    const showOverlay = top && document.getElementById(top).classList.contains('sheet');
    overlay.classList.toggle('show', !!showOverlay);
    if (showOverlay) overlay.style.zIndex = 100 + (layers.length - 1) * 2 - 1;
    document.body.classList.toggle('locked', layers.length > 0);
    updateCartBar();
  }
  function showLayer(id, on) {
    const el = document.getElementById(id);
    el.classList.toggle('open', on);
    el.setAttribute('aria-hidden', String(!on));
    if (on) {
      const scroller = $('.sheet-scroll, .view-scroll', el);
      if (scroller) scroller.scrollTop = 0;
    }
  }
  function openLayer(id) {
    layers.push(id);
    showLayer(id, true);
    history.pushState({ bn: id }, '');
    syncLayers();
    focusLayer(id);
  }
  function swapTop(id) {
    const old = layers.pop();
    if (old) showLayer(old, false);
    layers.push(id);
    showLayer(id, true);
    history.replaceState({ bn: id }, '');
    syncLayers();
    focusLayer(id);
  }
  function popLayer() {
    const id = layers.pop();
    if (!id) return;
    showLayer(id, false);
    syncLayers();
    if (id === 'productSheet') draft = null;
  }
  function closeTop() {
    if (!layers.length) return;
    skipPop++;
    history.back();
    popLayer();
  }
  function focusLayer(id) {
    const el = document.getElementById(id);
    el.tabIndex = -1;
    setTimeout(() => el.focus({ preventScroll: true }), 60);
  }
  window.addEventListener('popstate', () => {
    if (skipPop > 0) { skipPop--; return; }
    if (layers.length) popLayer();
  });

  /* ---------------- barra da sacola / toast ---------------- */
  function updateCartBar() {
    const bar = $('#cartBar');
    const t = totals();
    bar.hidden = !t.count || layers.length > 0;
    bar.innerHTML = `<span class="cb-count">${ICON.bag}<i>${t.count}</i></span>
      <span class="cb-label"><b>Ver sacola</b><small>${plural(t.count, 'item', 'itens')} · ${state.mode === 'delivery' ? 'Delivery' : 'Retirada'}</small></span>
      <span class="cb-total">${brl(t.subtotal)}</span>`;
    bar.setAttribute('aria-label', `Ver sacola, ${plural(t.count, 'item', 'itens')}, ${brl(t.subtotal)}`);
  }
  let toastTimer;
  function toast(msg, error) {
    const el = $('#toast');
    el.className = 'toast' + (error ? ' error' : '');
    el.innerHTML = `${error ? ICON.alert : ICON.check}<span>${esc(msg)}</span>`;
    requestAnimationFrame(() => el.classList.add('show'));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  function refresh() {
    syncGifts();
    save();
    updateCartBar();
    updateBadges();
    if (isOpen('cartSheet')) renderCart();
    if (isOpen('checkoutView')) { renderPayPanel(); renderSummary(); }
  }

  /* ---------------- produto ---------------- */
  let draft = null;

  function ingredientsOf(p) {
    if (p.ingredients) return p.ingredients;
    if (!p.desc) return [];
    return p.desc.replace(/\.$/, '')
      .split(/,\s*|\s+e\s+/)
      .map((s) => s.trim())
      .filter((s) => s && !/^(p[aã]o|\d+\s*burg|burg)/i.test(s))
      .map(cap);
  }

  function openProduct(pid, editKey) {
    const p = P[pid];
    if (!p || p.available === false) return;
    const existing = editKey && state.cart.find((i) => i.key === editKey);
    draft = existing
      ? JSON.parse(JSON.stringify(existing))
      : { pid, qty: 1, choices: {}, combo: false, addons: {}, removed: [], note: '' };
    (p.options || []).forEach((g) => { if (draft.choices[g.id] == null) draft.choices[g.id] = 0; });
    draft.editKey = existing ? editKey : null;
    renderProductSheet();
    openLayer('productSheet');
  }

  function renderProductSheet() {
    const p = P[draft.pid];
    const cat = CAT[p.cat];
    const adds = M.addons[p.addons] || [];
    const removable = cat.removable ? ingredientsOf(p) : [];
    const SHOW = 6;
    const hasExtraSelected = adds.slice(SHOW).some((a) => draft.addons[a.id] > 0);

    const comboBlock = p.combo ? `<div class="block">
        <div class="block-head"><div><h3>Quer em combo?</h3><p>+ ${esc(M.comboLabel)}</p></div><span class="pill req">Escolha 1</span></div>
        <label class="choice"><input type="radio" name="combo" value="0" ${!draft.combo ? 'checked' : ''}><span class="choice-ui"></span><span class="choice-text"><b>Só o lanche</b></span><span class="choice-price">${brl(p.price)}</span></label>
        <label class="choice"><input type="radio" name="combo" value="1" ${draft.combo ? 'checked' : ''}><span class="choice-ui"></span><span class="choice-text"><b>Combo</b><small>Lanche + ${esc(M.comboLabel)}</small></span><span class="choice-price plus">${brl(p.combo)}</span></label>
      </div>` : '';

    const optionBlocks = (p.options || []).map((g) => `<div class="block">
        <div class="block-head"><div><h3>${esc(g.title)}</h3></div><span class="pill req">Escolha 1</span></div>
        ${g.choices.map((ch, i) => `<label class="choice"><input type="radio" name="opt-${g.id}" data-group="${g.id}" value="${i}" ${draft.choices[g.id] === i ? 'checked' : ''}><span class="choice-ui"></span><span class="choice-text"><b>${esc(ch.label)}</b></span>${ch.delta ? `<span class="choice-price plus">+ ${brl(ch.delta)}</span>` : ''}</label>`).join('')}
      </div>`).join('');

    const removeBlock = removable.length ? `<div class="block">
        <div class="block-head"><div><h3>Quer tirar algo?</h3><p>Toque no que você não quer no lanche</p></div><span class="pill">Opcional</span></div>
        <div class="chips">${removable.map((ing) => `<label class="chip-check"><input type="checkbox" data-remove="${esc(ing)}" ${draft.removed.includes(ing) ? 'checked' : ''}><span>${esc(ing)}</span></label>`).join('')}</div>
      </div>` : '';

    const addonBlock = adds.length ? `<div class="block addons-block${hasExtraSelected ? ' expanded' : ''}">
        <div class="block-head"><div><h3>Adicionais</h3><p>Deixe do seu jeito</p></div><span class="pill">Opcional</span></div>
        <div>${adds.map((a, i) => {
          const q = draft.addons[a.id] || 0;
          return `<div class="addon${q ? ' on' : ''}${i >= SHOW ? ' extra' : ''}" data-aid="${a.id}"><div><b>${esc(a.name)}</b><small>+ ${brl(a.price)}</small></div>
            <div class="stepper sm"><button type="button" data-addon="-1" aria-label="Remover ${esc(a.name)}" ${q ? '' : 'disabled'}>${ICON.minus}</button><span>${q}</span><button type="button" data-addon="1" aria-label="Adicionar ${esc(a.name)}">${ICON.plus}</button></div></div>`;
        }).join('')}</div>
        ${adds.length > SHOW ? `<button type="button" class="more-btn" data-more>${hasExtraSelected ? 'Mostrar menos' : `Ver todos os adicionais (${adds.length})`}</button>` : ''}
      </div>` : '';

    const promo = p.longneck && C.promoLongNeck && C.promoLongNeck.enabled
      ? `<div class="hint">${ICON.gift}<span>A cada ${C.promoLongNeck.every} long necks você ganha uma porção de fritas ou onion rings!</span></div>` : '';

    $('#productSheet').innerHTML = `
      <div class="sheet-grab"></div>
      <button type="button" class="icon-btn sheet-close" data-close aria-label="Fechar">${ICON.close}</button>
      <div class="sheet-scroll">
        <div class="pd-hero${p.photo ? ' has-photo' : ''}" data-word="${esc(cat.name.toUpperCase())}">${art(p)}${photo(p.photo, 580, 270, true)}</div>
        <div class="pd-info">
          ${metaHTML(p)}
          <h2 class="pd-name">${esc(p.name)}</h2>
          ${p.desc ? `<p class="pd-desc">${esc(p.desc)}</p>` : ''}
          <div class="pd-price">${brl(p.price)}${p.combo ? `<small>ou ${brl(p.combo)} no combo</small>` : ''}</div>
        </div>
        ${promo}
        ${comboBlock}
        ${optionBlocks}
        ${removeBlock}
        ${addonBlock}
        <div class="block">
          <div class="block-head"><div><h3>Alguma observação?</h3></div><span class="pill">Opcional</span></div>
          <textarea class="input" id="pdNote" maxlength="140" rows="2" placeholder="Ex.: cortar ao meio, molho à parte…">${esc(draft.note)}</textarea>
        </div>
      </div>
      <div class="sheet-foot">
        <div class="stepper"><button type="button" data-qty="-1" aria-label="Diminuir quantidade">${ICON.minus}</button><span id="pdQty">${draft.qty}</span><button type="button" data-qty="1" aria-label="Aumentar quantidade">${ICON.plus}</button></div>
        <button type="button" class="btn btn-primary grow split" id="pdAdd"><span>${draft.editKey ? 'Atualizar' : 'Adicionar'}</span><span class="amt" id="pdTotal"></span></button>
      </div>`;
    updateDraftUI();
  }

  function updateDraftUI() {
    if (!draft) return;
    const sheet = $('#productSheet');
    $('#pdQty', sheet).textContent = draft.qty;
    $('[data-qty="-1"]', sheet).disabled = draft.qty <= 1;
    $('#pdTotal', sheet).textContent = brl(unitPrice(draft) * draft.qty);
    $$('.addon', sheet).forEach((row) => {
      const q = draft.addons[row.dataset.aid] || 0;
      row.classList.toggle('on', q > 0);
      $('span', $('.stepper', row)).textContent = q;
      $('[data-addon="-1"]', row).disabled = q <= 0;
      $('[data-addon="1"]', row).disabled = q >= 5;
    });
  }

  function commitDraft() {
    if (!draft) return;
    const p = P[draft.pid];
    const item = {
      pid: draft.pid,
      qty: draft.qty,
      choices: Object.assign({}, draft.choices),
      combo: !!(draft.combo && p.combo),
      addons: Object.fromEntries(Object.entries(draft.addons).filter(([, q]) => q > 0)),
      removed: [...draft.removed],
      note: draft.note.trim(),
    };
    if (draft.editKey) {
      const idx = state.cart.findIndex((i) => i.key === draft.editKey);
      if (idx > -1) state.cart[idx] = Object.assign(item, { key: draft.editKey });
      toast('Item atualizado');
    } else {
      const sig = signature(item);
      const same = state.cart.find((i) => signature(i) === sig);
      if (same) same.qty = Math.min(99, same.qty + item.qty);
      else state.cart.push(Object.assign(item, { key: uid() }));
      toast(`${item.qty}× ${p.name} na sacola`);
      const bar = $('#cartBar');
      bar.classList.remove('bump');
      setTimeout(() => bar.classList.add('bump'), 380);
    }
    closeTop();
    refresh();
  }

  function bindProductSheet() {
    const sheet = $('#productSheet');
    sheet.addEventListener('click', (e) => {
      if (!draft) return;
      const t = e.target;
      if (t.closest('[data-close]')) return closeTop();
      const q = t.closest('[data-qty]');
      if (q) { draft.qty = Math.max(1, Math.min(30, draft.qty + Number(q.dataset.qty))); return updateDraftUI(); }
      const a = t.closest('[data-addon]');
      if (a) {
        const id = a.closest('.addon').dataset.aid;
        draft.addons[id] = Math.max(0, Math.min(5, (draft.addons[id] || 0) + Number(a.dataset.addon)));
        return updateDraftUI();
      }
      const more = t.closest('[data-more]');
      if (more) {
        const block = more.closest('.addons-block');
        const exp = block.classList.toggle('expanded');
        more.textContent = exp ? 'Mostrar menos' : `Ver todos os adicionais (${$$('.addon', block).length})`;
        return;
      }
      if (t.closest('#pdAdd')) commitDraft();
    });
    sheet.addEventListener('change', (e) => {
      if (!draft) return;
      const t = e.target;
      if (t.name === 'combo') draft.combo = t.value === '1';
      else if (t.dataset.group) draft.choices[t.dataset.group] = Number(t.value);
      else if (t.dataset.remove != null) {
        const v = t.dataset.remove;
        draft.removed = t.checked ? [...draft.removed, v] : draft.removed.filter((x) => x !== v);
      }
      updateDraftUI();
    });
    sheet.addEventListener('input', (e) => { if (draft && e.target.id === 'pdNote') draft.note = e.target.value; });
  }

  /* ---------------- sacola ---------------- */
  function openCart() {
    renderCart();
    openLayer('cartSheet');
  }

  function bucketHTML() {
    const info = promoInfo();
    if (!info || !info.n) return '';
    const gifts = C.promoLongNeck.gifts;
    const selects = state.gifts.map((g, i) => `<label class="gift-row">Brinde ${state.gifts.length > 1 ? i + 1 : ''} — escolha sua porção
        <select class="input" data-gift="${i}">${gifts.map((name, gi) => `<option value="${gi}" ${gi === g ? 'selected' : ''}>${esc(name)}</option>`).join('')}</select></label>`).join('');
    const pct = ((info.n % info.every) / info.every) * 100;
    return `<div class="bucket">
      <div class="bucket-head"><span class="ic">${ICON.gift}</span><div><b>${info.earned ? `Baldinho! Você ganhou ${plural(info.earned, 'porção', 'porções')}` : 'Promo baldinho'}</b><small>A cada ${info.every} long necks, uma porção de presente</small></div></div>
      ${selects}
      ${info.n % info.every ? `<p>Faltam <b>${plural(info.missing, 'long neck', 'long necks')}</b> para ganhar ${info.earned ? 'mais uma' : 'uma'} porção.</p><div class="bar"><i style="width:${pct}%"></i></div>` : ''}
    </div>`;
  }

  function renderCart() {
    const el = $('#cartSheet');
    const t = totals();
    if (!state.cart.length) {
      el.innerHTML = `<div class="sheet-grab"></div>
        <button type="button" class="icon-btn sheet-close" data-close aria-label="Fechar">${ICON.close}</button>
        <div class="sheet-scroll"><div class="cart-empty">${svgWrap(ART.burger())}<b>Sacola vazia</b>Bora escolher um lanche?</div></div>
        <div class="sheet-foot"><button type="button" class="btn btn-primary grow" data-close>Ver cardápio</button></div>`;
      return;
    }
    const items = state.cart.map((it) => {
      const p = P[it.pid];
      const det = itemDetails(it);
      return `<div class="cart-item" data-key="${it.key}">
        <div class="ci-art">${art(p)}${photo(p.photo, 58, 58, true)}</div>
        <div>
          <div class="ci-top"><b>${esc(p.name)}</b><span>${brl(unitPrice(it) * it.qty)}</span></div>
          ${det.length ? `<ul class="ci-details">${det.map((d) => `<li class="${d.cls}">${esc(d.text)}</li>`).join('')}</ul>` : '<div style="height:6px"></div>'}
          <div class="ci-actions">
            <button type="button" class="link-btn" data-edit>Editar</button>
            <button type="button" class="link-btn danger" data-del>Remover</button>
            <div class="stepper sm"><button type="button" data-step="-1" aria-label="Diminuir">${ICON.minus}</button><span>${it.qty}</span><button type="button" data-step="1" aria-label="Aumentar">${ICON.plus}</button></div>
          </div>
        </div>
      </div>`;
    }).join('');
    const inCheckout = isOpen('checkoutView');
    el.innerHTML = `<div class="sheet-grab"></div>
      <button type="button" class="icon-btn sheet-close" data-close aria-label="Fechar">${ICON.close}</button>
      <div class="sheet-scroll">
        <div class="sheet-title"><h2>Sua sacola</h2><p>${plural(t.count, 'item', 'itens')} · ${state.mode === 'delivery' ? 'Delivery' : 'Retirada no local'}</p></div>
        <div class="cart-list">${items}</div>
        ${bucketHTML()}
        ${totalsHTML(t)}
      </div>
      <div class="sheet-foot">
        ${inCheckout ? '' : '<button type="button" class="btn btn-ghost" data-close>+ Itens</button>'}
        <button type="button" class="btn btn-primary grow split" id="cartContinue"><span>${inCheckout ? 'Voltar ao pedido' : 'Continuar'}</span><span class="amt">${brl(t.total)}</span></button>
      </div>`;
  }

  function bindCart() {
    const el = $('#cartSheet');
    el.addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest('[data-close]')) return closeTop();
      if (t.closest('#cartContinue')) {
        if (isOpen('checkoutView')) return closeTop();
        renderCheckout();
        return swapTop('checkoutView');
      }
      const row = t.closest('.cart-item');
      if (!row) return;
      const it = state.cart.find((i) => i.key === row.dataset.key);
      if (!it) return;
      if (t.closest('[data-edit]')) return openProduct(it.pid, it.key);
      if (t.closest('[data-del]')) {
        state.cart = state.cart.filter((i) => i !== it);
        toast('Item removido');
        return refresh();
      }
      const s = t.closest('[data-step]');
      if (s) {
        it.qty += Number(s.dataset.step);
        if (it.qty <= 0) state.cart = state.cart.filter((i) => i !== it);
        refresh();
      }
    });
    el.addEventListener('change', (e) => {
      const g = e.target.dataset.gift;
      if (g != null) { state.gifts[Number(g)] = Number(e.target.value); save(); if (isOpen('checkoutView')) renderSummary(); }
    });
  }

  /* ---------------- checkout ---------------- */
  const PAY = {
    pix: { label: 'Pix', sub: 'QR Code com o valor exato', icon: ICON.pix },
    credit: { label: 'Crédito', sub: 'Na maquininha', icon: ICON.card },
    debit: { label: 'Débito', sub: 'Na maquininha', icon: ICON.card },
    cash: { label: 'Dinheiro', sub: 'Informe o troco', icon: ICON.cash },
  };

  const makeCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let s = '';
    for (let i = 0; i < 4; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s;
  };

  function field({ id, label, value = '', placeholder = '', half, type = 'text', attrs = '', err = '' }) {
    return `<div class="field${half ? ' half' : ''}" data-f="${id}">
      <label for="f-${id}">${label}</label>
      <input class="input" id="f-${id}" data-field="${id}" type="${type}" value="${esc(value)}" placeholder="${esc(placeholder)}" ${attrs}>
      <span class="err">${err}</span>
    </div>`;
  }

  function renderCheckout() {
    if (!state.orderCode) state.orderCode = makeCode();
    const c = state.customer;
    const st = storeStatus();
    const modeBtns = (C.delivery.enabled ? [['delivery', 'Delivery', ICON.moto, C.delivery.estimate]] : [])
      .concat([['pickup', 'Retirada', ICON.walk, C.pickup.estimate]])
      .map(([m, l, ic, eta]) => `<button type="button" class="opt" data-mode="${m}" aria-pressed="${state.mode === m}">${ic}<b>${l}</b><small>${eta}</small></button>`).join('');
    const payBtns = Object.keys(PAY).filter((k) => C.payments[k])
      .map((k) => `<button type="button" class="opt${k === 'pix' ? ' pix' : ''}" data-pay="${k}" aria-pressed="${state.payment === k}">${PAY[k].icon}<b>${PAY[k].label}</b><small>${PAY[k].sub}</small>${k === 'pix' && C.pix.discountPercent ? `<span class="badge">−${C.pix.discountPercent}%</span>` : ''}</button>`).join('');

    $('#checkoutView').innerHTML = `
      <header class="view-head"><button type="button" class="icon-btn" data-back aria-label="Voltar">${ICON.back}</button><h2>Finalizar pedido</h2></header>
      <div class="view-scroll"><div class="view-body">
        ${st.open ? '' : `<div class="notice">${ICON.alert}<span>Estamos fechados agora${st.next ? ` e abrimos ${st.next}` : ''}. ${C.acceptOrdersWhenClosed ? 'Você pode enviar o pedido e confirmamos assim que abrirmos.' : 'Volte no nosso horário para pedir.'}</span></div>`}
        <section class="panel">
          <h3 class="panel-title"><span class="step">1</span>Como você quer receber?</h3>
          <div class="seg">${modeBtns}</div>
          <div id="coDelivery"></div>
        </section>
        <section class="panel">
          <h3 class="panel-title"><span class="step">2</span>Seus dados</h3>
          <div class="fields">
            ${field({ id: 'name', label: 'Nome', value: c.name, placeholder: 'Como podemos te chamar?', attrs: 'autocomplete="name" maxlength="60"', err: 'Informe seu nome' })}
            ${field({ id: 'phone', label: 'WhatsApp', value: c.phone, placeholder: '(51) 99999-9999', type: 'tel', attrs: 'autocomplete="tel" inputmode="tel" maxlength="16"', err: 'Informe um telefone válido com DDD' })}
          </div>
        </section>
        <section class="panel">
          <h3 class="panel-title"><span class="step">3</span>Pagamento</h3>
          <div class="pay-grid">${payBtns}</div>
          <div class="pay-panel" id="coPay"></div>
        </section>
        <section class="panel">
          <div class="panel-title spread"><span><span class="step">4</span>Resumo</span><button type="button" class="link-btn" id="editCart">Editar sacola</button></div>
          <div id="coSummary"></div>
        </section>
      </div></div>
      <footer class="view-foot"><div class="inner">
        <button type="button" class="btn btn-whats block split" id="sendOrder"><span style="display:flex;gap:10px;align-items:center">${ICON.whats}Enviar pedido</span><span class="amt" id="coCta"></span></button>
        <p class="foot-note">O pedido é enviado pelo WhatsApp da loja para confirmação.</p>
      </div></footer>`;
    renderDeliveryArea();
    renderPayPanel();
    renderSummary();
  }

  function renderDeliveryArea() {
    const el = $('#coDelivery');
    if (!el) return;
    const c = state.customer;
    if (state.mode === 'delivery') {
      const opts = C.delivery.neighborhoods.map((n) => `<option value="${esc(n.name)}" ${c.bairro === n.name ? 'selected' : ''}>${esc(n.name)} — ${n.fee ? brl(n.fee) : 'grátis'}</option>`).join('');
      const other = C.delivery.allowOtherNeighborhood ? `<option value="${OTHER}" ${c.bairro === OTHER ? 'selected' : ''}>Meu bairro não está na lista</option>` : '';
      const extras = [];
      if (C.delivery.minOrder) extras.push(`pedido mínimo ${brl(C.delivery.minOrder)}`);
      if (C.delivery.freeAbove) extras.push(`grátis acima de ${brl(C.delivery.freeAbove)}`);
      el.innerHTML = `<div class="fields">
          <div class="field" data-f="bairro"><label for="f-bairro">Bairro</label>
            <select class="input" id="f-bairro" data-field="bairro"><option value="">Selecione seu bairro</option>${opts}${other}</select>
            <span class="err">Selecione o bairro</span></div>
          ${c.bairro === OTHER ? field({ id: 'otherBairro', label: 'Qual bairro? <em>(taxa combinada no WhatsApp)</em>', value: c.otherBairro, placeholder: 'Nome do bairro', err: 'Informe o bairro' }) : ''}
          ${field({ id: 'street', label: 'Rua / Avenida', value: c.street, placeholder: 'Ex.: Rua Júlio de Castilhos', attrs: 'autocomplete="address-line1" maxlength="90"', err: 'Informe a rua' })}
          ${field({ id: 'number', label: 'Número', value: c.number, placeholder: 'Nº', half: true, attrs: 'inputmode="numeric" maxlength="10"', err: 'Informe o número' })}
          ${field({ id: 'complement', label: 'Complemento <em>(opcional)</em>', value: c.complement, placeholder: 'Apto, bloco…', half: true, attrs: 'maxlength="40"' })}
          ${field({ id: 'reference', label: 'Ponto de referência <em>(opcional)</em>', value: c.reference, placeholder: 'Ex.: em frente à praça', attrs: 'maxlength="80"' })}
        </div>
        <div class="eta">${ICON.clock}Entrega em ${esc(C.delivery.estimate)}${extras.length ? ' · ' + extras.join(' · ') : ''}</div>`;
    } else {
      el.innerHTML = `<div class="pickup-card"><span class="ic">${ICON.pin}</span><div><b>Retire no ${esc(C.storeName)}</b><p>${esc(C.address)}</p><a href="${C.mapsUrl}" target="_blank" rel="noopener">Ver no mapa →</a></div></div>
        <div class="eta">${ICON.clock}Fica pronto em ${esc(C.pickup.estimate)}</div>`;
    }
    $$('#checkoutView .seg [data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === state.mode)));
  }

  function pixCode(amount) {
    return window.Pix.payload({
      key: C.pix.key, name: C.pix.merchantName, city: C.pix.merchantCity,
      amount, txid: `BONESE${state.orderCode || ''}`,
    });
  }

  function pixBoxHTML(amount, code, note) {
    return `<div class="pix-box">
      <div class="qr" data-qr></div>
      <div class="pix-amount"><small>Valor do Pix</small><strong>${brl(amount)}</strong><p>${note}</p></div>
      <div class="copy-row"><input class="input" readonly value="${esc(code)}" aria-label="Código Pix copia e cola"><button type="button" class="btn" data-copy>${ICON.copy}Copiar</button></div>
      <ol class="pix-steps"><li>No app do banco, escolha <b>Pix › Ler QR Code</b> ou <b>Pix copia e cola</b>.</li><li>Confira o valor de <b>${brl(amount)}</b> e pague.</li><li>Mande o comprovante na conversa do WhatsApp.</li></ol>
    </div>`;
  }

  function renderPayPanel() {
    const el = $('#coPay');
    if (!el) return;
    const t = totals();
    $$('#checkoutView [data-pay]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pay === state.payment)));
    if (state.payment === 'pix') {
      if (!state.cart.length) { el.innerHTML = ''; return; }
      if (t.feeStatus === 'pending') {
        el.innerHTML = `<div class="pix-wait">${ICON.pix}<span>Selecione seu bairro para gerar o Pix com o valor exato do pedido (já com a entrega).</span></div>`;
        return;
      }
      const note = t.feeStatus === 'other'
        ? 'Valor dos itens. A taxa de entrega será combinada pelo WhatsApp.'
        : `Valor exato do pedido${t.feeStatus === 'ok' ? ', já com a entrega' : ''}${t.discount ? ` e ${t.pct}% de desconto` : ''}.`;
      const code = pixCode(t.total);
      el.innerHTML = pixBoxHTML(t.total, code, note);
      window.Pix.renderQR($('[data-qr]', el), code);
    } else if (state.payment === 'cash') {
      el.innerHTML = `<div class="fields">
          <div class="field" data-f="change"><label for="f-change">Troco para quanto?</label>
          <input class="input" id="f-change" inputmode="decimal" placeholder="Ex.: 100,00" value="${esc(state.change)}" ${state.noChange ? 'disabled' : ''}>
          <span class="err">Informe um valor maior que o total ou marque “não preciso de troco”</span></div>
        </div>
        <label class="check-line"><input type="checkbox" id="noChange" ${state.noChange ? 'checked' : ''}>Não preciso de troco</label>
        <p class="change-hint" id="changeHint"></p>`;
      updateChangeHint();
    } else {
      el.innerHTML = `<div class="card-note">${state.mode === 'delivery'
        ? 'O entregador leva a maquininha. Você paga na entrega.'
        : 'Você paga no balcão, na hora da retirada.'}</div>`;
    }
  }

  const parseMoney = (s) => {
    const v = parseFloat(String(s || '').replace(/[^\d,.]/g, '').replace(/\.(?=\d{3}(\D|$))/g, '').replace(',', '.'));
    return isNaN(v) ? 0 : v;
  };
  function updateChangeHint() {
    const h = $('#changeHint');
    if (!h) return;
    const t = totals();
    const v = parseMoney(state.change);
    h.textContent = !state.noChange && v > t.total && t.feeStatus !== 'other' ? `Seu troco: ${brl(r2(v - t.total))}` : '';
  }

  function renderSummary() {
    const el = $('#coSummary');
    if (!el) return;
    const t = totals();
    const items = state.cart.map((it) => {
      const det = itemDetails(it).map((d) => d.text).join(' · ');
      return `<li><span>${it.qty}× ${esc(P[it.pid].name)}${det ? `<small>${esc(det)}</small>` : ''}</span><span>${brl(unitPrice(it) * it.qty)}</span></li>`;
    }).join('');
    const gifts = state.gifts.map((g) => `<li class="gift"><span>🎁 Brinde baldinho<small>${esc(C.promoLongNeck.gifts[g])}</small></span><span>Grátis</span></li>`).join('');
    el.innerHTML = state.cart.length
      ? `<ul class="sum-items">${items}${gifts}</ul>${totalsHTML(t)}`
      : '<p class="card-note">Sua sacola está vazia.</p>';
    const cta = $('#coCta');
    if (cta) cta.textContent = state.cart.length ? brl(t.total) : '';
  }

  function setInvalid(id, on) {
    const f = $(`#checkoutView [data-f="${id}"]`);
    if (f) f.classList.toggle('invalid', on);
    return on ? f : null;
  }

  function validate() {
    const c = state.customer;
    const t = totals();
    const bad = [];
    const check = (id, cond) => { const f = setInvalid(id, !cond); if (f) bad.push(f); };
    if (state.mode === 'delivery') {
      check('bairro', !!c.bairro);
      if (c.bairro === OTHER) check('otherBairro', c.otherBairro.trim().length > 1);
      check('street', c.street.trim().length > 2);
      check('number', c.number.trim().length > 0);
    }
    check('name', c.name.trim().length > 1);
    const ph = digits(c.phone);
    check('phone', ph.length >= 10 && ph.length <= 11);
    if (state.payment === 'cash' && !state.noChange) {
      const v = parseMoney(state.change);
      check('change', v > 0 && (t.feeStatus === 'other' || v >= t.total));
    }
    return bad;
  }

  function maskPhone(v) {
    const d = digits(v).slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : '';
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function waLink(text) {
    return `https://wa.me/${digits(C.whatsapp)}?text=${encodeURIComponent(text)}`;
  }

  function buildMessage(code, t) {
    const c = state.customer;
    const L = [];
    L.push(`*🍔 NOVO PEDIDO #${code}*`);
    L.push(`_${C.storeName}_`);
    L.push('');
    L.push(`*Cliente:* ${c.name.trim()}`);
    L.push(`*WhatsApp:* ${c.phone}`);
    L.push(`*Tipo:* ${state.mode === 'delivery' ? '🛵 Delivery' : '🏃 Retirada no local'}`);
    L.push('');
    L.push('*— ITENS —*');
    state.cart.forEach((it) => {
      const p = P[it.pid];
      L.push(`*${it.qty}x ${p.code ? p.code + ' · ' : ''}${p.name}* — ${brl(unitPrice(it) * it.qty)}`);
      itemDetails(it).forEach((d) => L.push(`   ▸ ${d.text}`));
    });
    state.gifts.forEach((g) => L.push(`🎁 *Brinde baldinho:* ${C.promoLongNeck.gifts[g]}`));
    L.push('');
    L.push(`Subtotal: ${brl(t.subtotal)}`);
    if (state.mode === 'delivery') {
      L.push(`Entrega (${currentBairro()}): ${t.feeStatus === 'other' ? 'a combinar' : t.fee ? brl(t.fee) : 'grátis'}`);
    }
    if (t.discount) L.push(`Desconto Pix (${t.pct}%): − ${brl(t.discount)}`);
    L.push(`*TOTAL: ${brl(t.total)}*${t.feeStatus === 'other' ? ' + entrega' : ''}`);
    L.push('');
    if (state.payment === 'pix') L.push(`*Pagamento:* Pix — ${brl(t.total)} (envio o comprovante aqui)`);
    else if (state.payment === 'cash') {
      if (state.noChange) L.push('*Pagamento:* Dinheiro — não preciso de troco');
      else {
        const v = parseMoney(state.change);
        L.push(`*Pagamento:* Dinheiro — troco para ${brl(v)}${t.feeStatus !== 'other' ? ` (troco: ${brl(r2(v - t.total))})` : ''}`);
      }
    } else L.push(`*Pagamento:* Cartão de ${state.payment === 'credit' ? 'crédito' : 'débito'} (maquininha)`);
    if (state.mode === 'delivery') {
      L.push(`*Endereço:* ${c.street.trim()}, ${c.number.trim()}${c.complement.trim() ? ' — ' + c.complement.trim() : ''}`);
      L.push(`*Bairro:* ${currentBairro()}`);
      if (c.reference.trim()) L.push(`*Referência:* ${c.reference.trim()}`);
    } else {
      L.push(`*Retirada:* ${C.address}`);
    }
    L.push('');
    L.push('_Pedido feito pelo app Bonese_');
    return L.join('\n');
  }

  function submitOrder() {
    if (!state.cart.length) return toast('Sua sacola está vazia', true);
    const st = storeStatus();
    if (!st.open && !C.acceptOrdersWhenClosed) return toast(`Estamos fechados. Abrimos ${st.next}.`, true);
    const bad = validate();
    if (bad.length) {
      bad[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
      const inp = $('input, select', bad[0]);
      if (inp) setTimeout(() => inp.focus({ preventScroll: true }), 350);
      return toast('Confira os campos destacados', true);
    }
    const t = totals();
    const code = state.orderCode || makeCode();
    const url = waLink(buildMessage(code, t));
    state.lastOrder = {
      code, url, t,
      payment: state.payment, mode: state.mode,
      pix: state.payment === 'pix' ? { amount: t.total, code: pixCode(t.total), other: t.feeStatus === 'other' } : null,
      sent: 'sending',
    };
    // envia para o painel da loja (criptografado) antes de limpar a sacola
    const order = state.lastOrder;
    const sending = window.EnvioPedido
      ? window.EnvioPedido.enviar(orderPayload(code, t))
      : Promise.resolve(false);
    sending.then((ok) => { order.sent = ok ? 'ok' : 'fail'; updateSendStatus(); });
    const w = window.open(url, '_blank');
    if (!w) {
      // sem pop-up: espera o envio terminar (até 3 s) antes de ir para o WhatsApp
      Promise.race([sending, new Promise((r) => setTimeout(r, 3000))]).then(() => { location.href = url; });
    }
    state.cart = [];
    state.gifts = [];
    state.change = '';
    state.noChange = false;
    state.orderCode = null;
    save();
    renderSuccess();
    swapTop('successView');
    updateBadges();
  }

  // pedido compacto que vai para o painel da loja (admin/)
  function orderPayload(code, t) {
    const c = state.customer;
    const ent = state.mode === 'delivery';
    return {
      v: 1,
      n: code,
      t: Date.now(),
      m: ent ? 'entrega' : 'retirada',
      c: {
        nome: c.name.trim(),
        fone: c.phone,
        rua: ent ? c.street.trim() : '',
        num: ent ? c.number.trim() : '',
        bairro: ent ? currentBairro() : '',
        comp: ent ? c.complement.trim() : '',
        ref: ent ? c.reference.trim() : '',
      },
      // [nome, qtd, total, sem, obs, detalhes]
      i: state.cart.map((it) => {
        const p = P[it.pid];
        const det = itemDetails(it).filter((d) => d.cls !== 'rm' && !d.text.startsWith('Obs.')).map((d) => d.text);
        return [(p.code ? p.code + ' · ' : '') + p.name, it.qty, r2(unitPrice(it) * it.qty), it.removed || [], it.note || '', det];
      }),
      g: state.gifts.map((g) => C.promoLongNeck.gifts[g]),
      s: t.subtotal,
      tx: ent ? (t.feeStatus === 'other' ? null : t.fee) : 0,
      d: t.discount,
      tot: t.total,
      p: state.payment,
      tr: state.payment === 'cash' && !state.noChange ? parseMoney(state.change) : 0,
      o: 'app',
    };
  }

  function updateSendStatus() {
    const el = $('#sendStatus');
    const o = state.lastOrder;
    if (!el || !o) return;
    el.className = 'send-status ' + o.sent;
    el.textContent = o.sent === 'ok'
      ? '✓ A loja já recebeu seu pedido'
      : o.sent === 'fail'
        ? 'Não conseguimos avisar a loja pela internet. Envie a mensagem no WhatsApp para confirmar.'
        : 'Enviando para a loja…';
  }

  function renderSuccess() {
    const o = state.lastOrder;
    if (!o) return;
    const payLabel = o.payment === 'pix' ? 'Pix' : o.payment === 'cash' ? 'Dinheiro' : o.payment === 'credit' ? 'Cartão de crédito' : 'Cartão de débito';
    $('#successView').innerHTML = `<div class="view-scroll"><div class="view-body success">
      <div class="big-check">${ICON.check}</div>
      <h2>Pedido feito!</h2>
      <div class="order-code">#${o.code}</div>
      <div id="sendStatus" class="send-status"></div>
      <p>Abrimos o WhatsApp com seu pedido pronto. <b>Toque em enviar</b> na conversa para a gente confirmar.</p>
      ${o.pix ? `<section class="panel"><h3 class="panel-title">${ICON.pix.replace('<svg', '<svg style="width:22px;height:22px;color:var(--pix)"')}Pague agora com Pix</h3>${pixBoxHTML(o.pix.amount, o.pix.code, o.pix.other ? 'Valor dos itens. A entrega será combinada.' : 'Valor exato do pedido.')}</section>` : ''}
      <section class="panel">
        <div class="row"><span>Recebimento</span><span>${o.mode === 'delivery' ? `Delivery · ${esc(C.delivery.estimate)}` : `Retirada · ${esc(C.pickup.estimate)}`}</span></div>
        <div class="row"><span>Pagamento</span><span>${payLabel}</span></div>
        <div class="row total"><span>Total</span><span>${brl(o.t.total)}</span></div>
      </section>
      <div class="actions">
        <a class="btn btn-whats block" href="${o.url}" target="_blank" rel="noopener">${ICON.whats}Abrir WhatsApp de novo</a>
        <button type="button" class="btn btn-ghost block" data-new>Fazer novo pedido</button>
      </div>
    </div></div>`;
    if (o.pix) window.Pix.renderQR($('#successView [data-qr]'), o.pix.code);
    updateSendStatus();
  }

  async function copyText(text, btn) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (err) { /* ignora */ }
      ta.remove();
    }
    toast('Código Pix copiado!');
    if (btn) {
      const old = btn.innerHTML;
      btn.innerHTML = `${ICON.check}Copiado`;
      setTimeout(() => { btn.innerHTML = old; }, 1800);
    }
  }

  function bindCheckout() {
    const v = $('#checkoutView');
    v.addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest('[data-back]')) return closeTop();
      const m = t.closest('[data-mode]');
      if (m) return setMode(m.dataset.mode);
      const pay = t.closest('[data-pay]');
      if (pay) {
        state.payment = pay.dataset.pay;
        save();
        renderPayPanel();
        renderSummary();
        return;
      }
      const cp = t.closest('[data-copy]');
      if (cp) return copyText($('.copy-row input', cp.closest('.pix-box')).value, cp);
      if (t.closest('#editCart')) { renderCart(); return openLayer('cartSheet'); }
      if (t.closest('#sendOrder')) submitOrder();
    });
    v.addEventListener('input', (e) => {
      const t = e.target;
      if (t.id === 'f-change') { state.change = t.value; setInvalid('change', false); return updateChangeHint(); }
      const key = t.dataset.field;
      if (!key || t.tagName === 'SELECT') return;
      if (key === 'phone') {
        const masked = maskPhone(t.value);
        if (masked !== t.value) t.value = masked;
      }
      state.customer[key] = t.value;
      setInvalid(key, false);
      save();
    });
    v.addEventListener('change', (e) => {
      const t = e.target;
      if (t.id === 'noChange') {
        state.noChange = t.checked;
        const inp = $('#f-change');
        inp.disabled = t.checked;
        setInvalid('change', false);
        return updateChangeHint();
      }
      if (t.dataset.field === 'bairro') {
        const wasOther = state.customer.bairro === OTHER;
        state.customer.bairro = t.value;
        save();
        if (wasOther !== (t.value === OTHER)) renderDeliveryArea();
        setInvalid('bairro', false);
        renderPayPanel();
        renderSummary();
      }
    });
    $('#successView').addEventListener('click', (e) => {
      const t = e.target;
      if (t.closest('[data-copy]')) return copyText(state.lastOrder.pix.code, t.closest('[data-copy]'));
      if (t.closest('[data-new]')) {
        closeTop();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ---------------- eventos gerais ---------------- */
  function bindGlobal() {
    $('#searchIco').innerHTML = ICON.search;
    $('#modeSwitch').addEventListener('click', (e) => {
      const b = e.target.closest('[data-mode]');
      if (b) setMode(b.dataset.mode);
    });
    let searchTimer;
    $('#search').addEventListener('input', (e) => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        state.search = e.target.value;
        renderMenu();
      }, 120);
    });
    $('#cats').addEventListener('click', (e) => {
      const b = e.target.closest('[data-cat]');
      if (!b) return;
      if (state.search) { state.search = ''; $('#search').value = ''; renderMenu(); }
      const sec = document.getElementById('cat-' + b.dataset.cat);
      if (sec) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveCat(b.dataset.cat);
    });
    $('#highlights').addEventListener('click', (e) => {
      const b = e.target.closest('[data-goto]');
      if (b) document.getElementById('cat-' + b.dataset.goto).scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    const menu = $('#menu');
    menu.addEventListener('click', (e) => {
      const card = e.target.closest('.card[data-pid]');
      if (card) openProduct(card.dataset.pid);
    });
    menu.addEventListener('keydown', (e) => {
      const card = e.target.closest('.card[data-pid]');
      if (card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openProduct(card.dataset.pid); }
    });
    $('#cartBar').addEventListener('click', openCart);
    $('#overlay').addEventListener('click', closeTop);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && layers.length) closeTop(); });
  }

  /* ---------------- início ---------------- */
  function init() {
    // relê a sacola agora que os produtos novos/removidos da loja já foram aplicados
    state.cart = store.get('bn_cart', []).filter((i) => P[i.pid] && !P[i.pid].hidden);
    if (history.state && history.state.bn) history.replaceState(null, '');
    $('#brandSub').innerHTML = `${esc(C.city)} · ${esc(C.state)} <a href="https://www.instagram.com/${C.instagram}/" target="_blank" rel="noopener">${ICON.insta}@${esc(C.instagram)}</a>`;
    if (M.heroPhoto) $('#heroBg').style.setProperty('--hero-img', `url("${photoUrl(M.heroPhoto, 1400, 900)}")`);
    renderStatus();
    setInterval(renderStatus, 60000);
    renderModeSwitch();
    renderCats();
    renderHighlights();
    renderMenu();
    renderFooter();
    bindGlobal();
    bindProductSheet();
    bindCart();
    bindCheckout();
    syncGifts();
    updateCartBar();
  }

  // Alterações feitas pela loja no painel (aba Cardápio) ficam em assets/data/cardapio.json
  const EDITAVEIS = ['name', 'desc', 'short', 'price', 'combo', 'photo', 'available', 'hidden'];
  async function carregarAlteracoes() {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 3000);
      const r = await fetch(`assets/data/cardapio.json?v=${Date.now()}`, { cache: 'no-store', signal: ctrl.signal });
      clearTimeout(timer);
      if (!r.ok) return;
      const dados = await r.json();
      Object.entries((dados && dados.produtos) || {}).forEach(([id, mud]) => {
        const p = P[id];
        if (!p || !mud) return;
        EDITAVEIS.forEach((k) => { if (mud[k] !== undefined && mud[k] !== null && mud[k] !== '') p[k] = mud[k]; });
      });
      // produtos adicionados pela loja
      ((dados && dados.novos) || []).forEach((n) => {
        if (!n || !n.id || P[n.id] || !CAT[n.cat] || !String(n.name || '').trim() || !(Number(n.price) > 0)) return;
        const p = {
          id: n.id, cat: n.cat, name: String(n.name).trim(), desc: n.desc || '', price: Number(n.price),
          combo: Number(n.combo) > 0 ? Number(n.combo) : undefined,
          photo: n.photo || undefined, available: n.available !== false, hidden: !!n.hidden,
          addons: M.addons[n.addons] ? n.addons : undefined,
        };
        M.products.push(p);
        P[p.id] = p;
      });
      // itens removidos do cardápio pela loja
      M.products = M.products.filter((p) => !p.hidden);
    } catch (e) { /* sem alterações publicadas: usa o cardápio padrão */ }
  }

  carregarAlteracoes().then(init, init);
})();
