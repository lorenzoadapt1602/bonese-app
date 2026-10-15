/* =============================================================
   ENVIO DO PEDIDO PARA O PAINEL DA LOJA
   O pedido é criptografado com a chave pública da loja (ECDH P-256 +
   AES-GCM) e publicado no canal do ntfy. Só o painel, com a senha,
   consegue abrir. Formato: "BD1.<chave efêmera>.<iv>.<dados>"
   ============================================================= */
(function () {
  const CURVA = { name: 'ECDH', namedCurve: 'P-256' };
  const b64 = (buf) => {
    const a = new Uint8Array(buf);
    let s = '';
    for (let i = 0; i < a.length; i++) s += String.fromCharCode(a[i]);
    return btoa(s);
  };
  const espera = (ms) => new Promise((r) => setTimeout(r, ms));

  async function cifrar(texto, jwk) {
    const pub = await crypto.subtle.importKey('jwk', jwk, CURVA, false, []);
    const ef = await crypto.subtle.generateKey(CURVA, true, ['deriveKey']);
    const k = await crypto.subtle.deriveKey({ name: 'ECDH', public: pub }, ef.privateKey, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, k, new TextEncoder().encode(texto));
    return ['BD1', b64(await crypto.subtle.exportKey('raw', ef.publicKey)), b64(iv), b64(ct)].join('.');
  }

  async function enviar(pedido, tentativas = 4) {
    const cfg = window.CONFIG && window.CONFIG.pedidosOnline;
    if (!cfg || !cfg.canal || !cfg.chavePublica || !window.crypto || !crypto.subtle) return false;
    let corpo;
    try { corpo = await cifrar(JSON.stringify(pedido), cfg.chavePublica); } catch (e) { return false; }
    for (let i = 0; i < tentativas; i++) {
      try {
        // keepalive: o envio termina mesmo se a página for trocada pelo WhatsApp
        const r = await fetch(`${cfg.servidor}/${cfg.canal}`, { method: 'POST', body: corpo, keepalive: corpo.length < 60000 });
        if (r.ok) return true;
      } catch (e) { /* tenta de novo */ }
      await espera(1500 * (i + 1));
    }
    return false;
  }

  window.EnvioPedido = { enviar, cifrar };
})();
