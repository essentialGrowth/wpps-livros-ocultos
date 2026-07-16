/**
 * UTM Passthrough para botões de WhatsApp
 * -----------------------------------------
 * O que faz:
 * 1. Captura os parâmetros utm_source, utm_medium, utm_campaign, utm_content,
 *    utm_term (+ gclid, fbclid, fbc, fbp) da URL atual.
 * 2. Salva no sessionStorage, para não perder os UTMs se o usuário navegar
 *    entre páginas do mesmo funil sem eles estarem na URL de novo.
 * 3. Encontra TODOS os links de WhatsApp na página (api.whatsapp.com e wa.me)
 *    e adiciona os UTMs como parâmetros extras na query string do link,
 *    preservando o que já existir (ex: phone, text).
 *
 * Como usar:
 * Basta incluir esse arquivo antes do fechamento do </body>:
 * <script src="utm-whatsapp.js"></script>
 *
 * Funciona automaticamente em qualquer quantidade de botões/links,
 * mesmo que sejam adicionados dinamicamente depois (via MutationObserver).
 */

(function () {
  "use strict";

  var UTM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "gclid",
    "fbclid",
    "fbc",
    "fbp",
    "src",
    "sck"
  ];

  var STORAGE_KEY = "eg_utm_params";

  function getParamsFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var found = {};
    UTM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) {
        found[key] = value;
      }
    });
    return found;
  }

  function getStoredParams() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function saveParams(params) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(params));
    } catch (e) {
      /* sessionStorage indisponível, segue sem persistir */
    }
  }

  function getUtmParams() {
    var fromUrl = getParamsFromUrl();
    var stored = getStoredParams();
    // Params novos na URL sempre têm prioridade sobre os armazenados
    var merged = Object.assign({}, stored, fromUrl);
    if (Object.keys(fromUrl).length > 0) {
      saveParams(merged);
    }
    return merged;
  }

  function isWhatsappLink(href) {
    if (!href) return false;
    return (
      href.indexOf("api.whatsapp.com") !== -1 ||
      href.indexOf("wa.me") !== -1
    );
  }

  function appendUtmsToLink(link, utms) {
    if (!isWhatsappLink(link.getAttribute("href"))) return;
    if (link.dataset.utmApplied === "1") return; // evita reaplicar

    try {
      var url = new URL(link.href);
      Object.keys(utms).forEach(function (key) {
        // não sobrescreve se o link já tiver esse parâmetro definido manualmente
        if (!url.searchParams.has(key)) {
          url.searchParams.set(key, utms[key]);
        }
      });
      link.href = url.toString();
      link.dataset.utmApplied = "1";
    } catch (e) {
      console.warn("Falha ao aplicar UTMs no link:", link, e);
    }
  }

  function applyToAllLinks() {
    var utms = getUtmParams();
    if (Object.keys(utms).length === 0) return;

    var links = document.querySelectorAll('a[href*="api.whatsapp.com"], a[href*="wa.me"]');
    links.forEach(function (link) {
      appendUtmsToLink(link, utms);
    });
  }

  // Aplica assim que o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyToAllLinks);
  } else {
    applyToAllLinks();
  }

  // Reaplica caso botões sejam inseridos dinamicamente depois (ex: via JS de terceiros)
  var observer = new MutationObserver(function () {
    applyToAllLinks();
  });
  observer.observe(document.body || document.documentElement, {
    childList: true,
    subtree: true
  });
})();
