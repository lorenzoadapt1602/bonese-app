/* =============================================================
   PIX — gera o "copia e cola" (BR Code / EMV) com o valor exato
   e desenha o QR Code. Padrão do Banco Central (Pix estático).
   ============================================================= */
(function () {
  const field = (id, value) => {
    const v = String(value);
    return id + String(v.length).padStart(2, '0') + v;
  };

  const clean = (s, max) => String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^A-Za-z0-9 .-]/g, '')
    .toUpperCase().trim().slice(0, max);

  function crc16(str) {
    let crc = 0xffff;
    for (let i = 0; i < str.length; i++) {
      crc ^= str.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
        crc &= 0xffff;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  }

  function normalizeKey(key) {
    const k = String(key || '').trim();
    if (k.startsWith('+')) return '+' + k.replace(/\D/g, '');               // celular
    if (k.includes('@')) return k.toLowerCase();                             // e-mail
    if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(k)) return k.toLowerCase(); // aleatória
    if (/^[\d.\-/ ]+$/.test(k)) return k.replace(/\D/g, '');                 // CPF / CNPJ
    return k;
  }

  function payload({ key, name, city, amount, txid }) {
    const account = field('00', 'br.gov.bcb.pix') + field('01', normalizeKey(key));
    let p = field('00', '01') + field('26', account) + field('52', '0000') + field('53', '986');
    if (amount > 0) p += field('54', Number(amount).toFixed(2));
    p += field('58', 'BR');
    p += field('59', clean(name, 25) || 'LOJA');
    p += field('60', clean(city, 15) || 'CIDADE');
    const tx = String(txid || '').replace(/[^A-Za-z0-9]/g, '').slice(0, 25) || '***';
    p += field('62', field('05', tx));
    p += '6304';
    return p + crc16(p);
  }

  function renderQR(container, text) {
    if (!container) return;
    if (typeof window.qrcode !== 'function') {
      container.innerHTML = '<span class="qr-fallback">Use o código<br>copia e cola</span>';
      return;
    }
    const qr = window.qrcode(0, 'M');
    qr.addData(text);
    qr.make();
    const n = qr.getModuleCount();
    const scale = 8, margin = 2;
    const size = (n + margin * 2) * scale;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#111';
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (qr.isDark(r, c)) ctx.fillRect((c + margin) * scale, (r + margin) * scale, scale, scale);
      }
    }
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', 'QR Code Pix');
    container.innerHTML = '';
    container.appendChild(canvas);
  }

  window.Pix = { payload, renderQR, crc16 };
})();
