/* =====================================================================
   CONFIGURACAO CENTRAL DOS NUMEROS DE WHATSAPP
   ---------------------------------------------------------------------
   Este arquivo fica hospedado UMA VEZ no GitHub (via jsDelivr) e e
   carregado por TODOS os seus dominios. Para adicionar, remover ou
   trocar numeros, edite APENAS a lista abaixo aqui no GitHub. Todos
   os sites passam a usar a lista nova automaticamente. Nao precisa
   mexer em nenhum index.html.

   Formato do numero: internacional, so digitos.
   55 (Brasil) + DDD + numero.  Ex.: 557588484131
   ===================================================================== */

window.WA_NUMEROS = [
  '557588484131',
  '557598882166'
];

/* Mensagem que ja vem preenchida ao abrir o WhatsApp */
window.WA_MENSAGEM = 'Eu quero os Livros Ocultos';

/* ---------------------------------------------------------------------
   Daqui para baixo nao precisa mexer.
   Sorteia um numero da lista e aplica em todos os botoes de WhatsApp
   da pagina. Como os links no HTML ja apontam para um numero real e
   valido, o Google enxerga o mesmo destino que o usuario -> nao e
   cloaking, e apenas balanceamento de contato.
   --------------------------------------------------------------------- */
(function () {
  'use strict';

  var numeros = window.WA_NUMEROS || [];
  if (!numeros.length) return;

  function escolher() {
    return numeros[Math.floor(Math.random() * numeros.length)];
  }

  function aplicar() {
    var numero = escolher();
    var texto = encodeURIComponent(window.WA_MENSAGEM || '');
    var url = 'https://api.whatsapp.com/send?phone=' + numero + '&text=' + texto;

    var links = document.querySelectorAll(
      'a[href*="api.whatsapp.com"], a[href*="wa.me"]'
    );

    for (var i = 0; i < links.length; i++) {
      links[i].setAttribute('href', url);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', aplicar);
  } else {
    aplicar();
  }
})();
