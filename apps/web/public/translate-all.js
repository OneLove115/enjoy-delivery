// EnJoy Auto-Translation — uses server-side DeepLX API
// Detects browser language, translates all visible text seamlessly
(function() {
  'use strict';

  var SKIP_TAGS = { SCRIPT:1, STYLE:1, NOSCRIPT:1, SVG:1, CANVAS:1, IFRAME:1, INPUT:1, TEXTAREA:1, SELECT:1 };
  var translated = new WeakSet();
  var targetLang = '';
  var translating = false;
  var queue = [];
  var localCache = {};

  function detectLang() {
    var match = document.cookie.match(/locale=([^;]+)/);
    if (match) {
      var loc = match[1].split('-')[0].toUpperCase();
      if (loc !== 'EN') return loc;
    }
    var bl = (navigator.language || '').split('-')[0].toUpperCase();
    return bl || 'EN';
  }

  function collectTextNodes(root) {
    var nodes = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function(node) {
        var p = node.parentElement;
        if (!p) return NodeFilter.FILTER_REJECT;
        if (SKIP_TAGS[p.tagName]) return NodeFilter.FILTER_REJECT;
        if (p.closest('[translate="no"],.notranslate,code,pre')) return NodeFilter.FILTER_REJECT;
        if (p.hasAttribute('data-translated')) return NodeFilter.FILTER_REJECT;
        var t = (node.textContent || '').trim();
        if (!t || t.length < 2) return NodeFilter.FILTER_REJECT;
        if (/^[\d\s\-.,;:!?€$@#%&*()+=/\\'"]+$/.test(t)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while (n = walker.nextNode()) {
      if (!translated.has(n)) nodes.push(n);
    }
    return nodes;
  }

  function translateBatch(nodes) {
    if (!nodes.length || translating) {
      if (nodes.length) queue.push.apply(queue, nodes);
      return;
    }
    translating = true;

    var texts = nodes.map(function(n) { return (n.textContent || '').trim(); });

    var uncached = [];
    var uncachedIdx = [];
    var results = new Array(texts.length);
    for (var i = 0; i < texts.length; i++) {
      var key = texts[i] + '::' + targetLang;
      if (localCache[key]) {
        results[i] = localCache[key];
      } else {
        uncached.push(texts[i]);
        uncachedIdx.push(i);
      }
    }

    if (uncached.length === 0) {
      applyResults(nodes, results);
      translating = false;
      processQueue();
      return;
    }

    fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texts: uncached, targetLang: targetLang })
    })
    .then(function(r) { return r.ok ? r.json() : null; })
    .then(function(data) {
      if (data && data.translations) {
        for (var j = 0; j < data.translations.length; j++) {
          var idx = uncachedIdx[j];
          results[idx] = data.translations[j];
          localCache[uncached[j] + '::' + targetLang] = data.translations[j];
        }
      }
      applyResults(nodes, results);
    })
    .catch(function() {})
    .finally(function() {
      translating = false;
      processQueue();
    });
  }

  function applyResults(nodes, results) {
    for (var i = 0; i < nodes.length; i++) {
      if (results[i] && results[i] !== (nodes[i].textContent || '').trim()) {
        nodes[i].textContent = results[i];
        translated.add(nodes[i]);
        if (nodes[i].parentElement) {
          nodes[i].parentElement.setAttribute('data-translated', '1');
        }
      }
    }
  }

  function processQueue() {
    if (queue.length > 0) {
      var batch = queue.splice(0, 30);
      setTimeout(function() { translateBatch(batch); }, 50);
    }
  }

  function translatePage() {
    var nodes = collectTextNodes(document.body);
    if (!nodes.length) return;
    for (var i = 0; i < nodes.length; i += 30) {
      var batch = nodes.slice(i, i + 30);
      if (i === 0) {
        translateBatch(batch);
      } else {
        (function(b, delay) {
          setTimeout(function() { translateBatch(b); }, delay);
        })(batch, Math.floor(i / 30) * 200);
      }
    }
  }

  function observeChanges() {
    if (typeof MutationObserver === 'undefined') return;
    var debounce = null;
    var observer = new MutationObserver(function(mutations) {
      var hasNew = false;
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length > 0) { hasNew = true; break; }
      }
      if (hasNew) {
        clearTimeout(debounce);
        debounce = setTimeout(translatePage, 300);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    targetLang = detectLang();
    if (targetLang === 'EN') return;
    setTimeout(translatePage, 500);
    window.addEventListener('load', function() { setTimeout(translatePage, 1000); });
    observeChanges();
    var lastUrl = location.href;
    setInterval(function() {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        setTimeout(translatePage, 500);
      }
    }, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
