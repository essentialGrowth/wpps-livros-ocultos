/* =====================================================================
   CONFIGURACAO CENTRAL DOS NUMEROS DE WHATSAPP
   ---------------------------------------------------------------------
   Este arquivo fica hospedado UMA VEZ no GitHub e e carregado por TODOS
   os seus dominios. Para adicionar, remover ou trocar numeros, edite
   APENAS a lista abaixo aqui no GitHub. Todos os sites passam a usar a
   lista nova automaticamente. Nao precisa mexer em nenhum index.html.

   >>> IMPORTANTE (leia RANDOMIZADOR-WHATSAPP.md) <<<
   1. A cada edicao, ATUALIZE o WA_CONFIG_VERSION abaixo. Isso permite
      confirmar, no navegador, qual versao esta sendo servida (ver se o
      cache da CDN ja propagou) ANTES de desativar qualquer numero.
   2. So desative um numero no WhatsApp DEPOIS de confirmar pelo teste
      que a producao ja nao o serve mais.

   Formato do numero: internacional, so digitos.
   55 (Brasil) + DDD + numero.  Ex.: 5575988484131
   ===================================================================== */

/* Carimbo de versao. Formato: AAAA-MM-DD-NN (NN = edicao do dia).
   BUMP este valor a cada alteracao da lista de numeros. */
window.WA_CONFIG_VERSION = '2026-07-19-02';

window.WA_NUMEROS = [
  '5575998297815'
];

/* Mensagem que ja vem preenchida ao abrir o WhatsApp */
window.WA_MENSAGEM = 'Eu quero os Livros Ocultos';

/* ---------------------------------------------------------------------
   Daqui para baixo nao precisa mexer.

   Sorteia um numero da lista e aplica em todos os botoes de WhatsApp
   da pagina. Como os links no HTML ja apontam para um numero real e
   valido, o Google enxerga o mesmo destino que o usuario -> nao e
   cloaking, e apenas balanceamento de contato.

   Preserva os demais parametros do link (text, utm_*, gclid, fbclid...)
   trocando SOMENTE o parametro phone. Assim funciona junto com o
   utm-whatsapp.js sem apagar a atribuicao de campanha, independente da
   ordem em que os dois scripts rodem (ambos reaplicam quando o outro
   altera o link).
   --------------------------------------------------------------------- */
(function () {
  'use strict';

  var numeros = window.WA_NUMEROS || [];
  if (!numeros.length) return;

  // Sorteia UMA vez por carregamento de pagina, para que TODOS os botoes
  // apontem para o MESMO numero na mesma visita.
  var numeroSorteado = numeros[Math.floor(Math.random() * numeros.length)];

  function isWhatsappLink(href) {
    if (!href) return false;
    return href.indexOf('api.whatsapp.com') !== -1 || href.indexOf('wa.me') !== -1;
  }

  function aplicarEmLink(link) {
    var href = link.getAttribute('href');
    if (!isWhatsappLink(href)) return;

    try {
      var url = new URL(link.href);

      // wa.me/<numero>?... usa o numero no caminho; api.whatsapp.com usa ?phone=
      if (url.hostname.indexOf('wa.me') !== -1) {
        url.pathname = '/' + numeroSorteado;
      } else {
        url.searchParams.set('phone', numeroSorteado);
      }

      // Garante a mensagem quando ainda nao houver uma no link.
      if (window.WA_MENSAGEM && !url.searchParams.get('text')) {
        url.searchParams.set('text', window.WA_MENSAGEM);
      }

      var novo = url.toString();
      if (link.href !== novo) {
        link.setAttribute('href', novo);
      }
    } catch (e) {
      // Fallback bem conservador se URL() falhar: troca so o phone via regex,
      // sem tocar no resto da query (preserva utm_*, text etc.).
      var trocado = href.replace(/([?&]phone=)\d+/, '$1' + numeroSorteado);
      if (trocado !== href) link.setAttribute('href', trocado);
    }
  }

  function aplicar() {
    var links = document.querySelectorAll(
      'a[href*="api.whatsapp.com"], a[href*="wa.me"]'
    );
    for (var i = 0; i < links.length; i++) {
      aplicarEmLink(links[i]);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aplicar);
  } else {
    aplicar();
  }

  // Reaplica caso outro script (ex.: utm-whatsapp.js) reescreva os links
  // depois. Como so trocamos o phone, isso nunca apaga os UTMs.
  var observer = new MutationObserver(aplicar);
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['href']
  });
})();
