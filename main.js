/* =============================================================
   Diseño Web — main.js (IIFE, classic script, no modules)
   ============================================================= */
(function () {
  "use strict";

  var data = window.__BRAND__ || {};
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $  = function (sel, scope) { return (scope || document).querySelector(sel); };
  var $$ = function (sel, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
  var escHTML = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c];
    });
  };
  function safe(fn, name) { try { fn(); } catch (e) { console.warn("[" + name + "]", e); } }

  /* ---------- Mounts (idempotent — only fill if empty) ---------- */

  function mountContact() {
    var c = data.contact || {};
    var mail = $("[data-email]");
    if (mail && c.email) { mail.textContent = c.email; mail.setAttribute("href", "mailto:" + c.email); }

    var wa = $("[data-wa-link]");
    if (wa && c.whatsapp) {
      wa.textContent = c.whatsappLabel || c.whatsapp;
      wa.setAttribute("href", "https://wa.me/" + c.whatsapp);
      wa.setAttribute("target", "_blank");
      wa.setAttribute("rel", "noopener");
    }
    var city = $("[data-city]"); if (city && c.city) city.textContent = c.city;
    var ig = $("[data-ig]"); if (ig && c.instagram) ig.textContent = c.instagram;
  }

  function mountServices() {
    var root = $("[data-services]");
    if (!root || !data.services || root.dataset.mounted) return;
    root.dataset.mounted = "1";
    root.innerHTML = data.services.map(function (s, i) {
      var num = ("0" + (i + 1)).slice(-2);
      var tags = (s.tags || []).map(function (t) { return "<span>" + escHTML(t) + "</span>"; }).join("");
      return '' +
        '<article class="service-row">' +
          '<span class="service-num">' + num + '</span>' +
          '<h3 class="service-name">' + escHTML(s.name) + '</h3>' +
          '<span class="service-plus" aria-hidden="true">+</span>' +
          '<div class="service-detail"><p>' + escHTML(s.detail) + '</p>' +
            (tags ? '<div class="service-tags">' + tags + '</div>' : '') +
          '</div>' +
        '</article>';
    }).join("");
  }

  function mountPlans() {
    var root = $("[data-plans]");
    if (!root || !data.plans || root.dataset.mounted) return;
    root.dataset.mounted = "1";
    var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    root.innerHTML = data.plans.map(function (p) {
      var feats = (p.features || []).map(function (f) { return "<li>" + check + "<span>" + escHTML(f) + "</span></li>"; }).join("");
      var btnClass = p.featured ? "btn btn-primary" : "btn btn-ghost";
      return '' +
        '<article class="plan reveal' + (p.featured ? ' is-featured' : '') + '">' +
          (p.featured ? '<span class="plan-badge">Más elegido</span>' : '') +
          '<h3 class="plan-name">' + escHTML(p.name) + '</h3>' +
          '<p class="plan-desc">' + escHTML(p.desc) + '</p>' +
          '<div class="plan-price"><span class="from">desde</span><span class="cur">' + escHTML(p.cur || "USD") + '</span><span class="amount">' + escHTML(p.amount) + '</span></div>' +
          '<ul>' + feats + '</ul>' +
          '<button type="button" class="' + btnClass + '" data-plan-buy="' + escHTML(p.name) + '" data-plan-price="' + escHTML(p.amount) + '" data-plan-cur="' + escHTML(p.cur || "USD") + '" data-plan-pay="' + escHTML(p.payUrl || "") + '">Lo quiero</button>' +
        '</article>';
    }).join("");
  }

  function mountMaintenance() {
    var root = $("[data-maintenance]");
    if (!root || !data.maintenance || root.dataset.mounted) return;
    root.dataset.mounted = "1";
    var payFallback = (data.payment || {}).mercadoPago || "";
    var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var card = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>';
    root.innerHTML = data.maintenance.map(function (p) {
      var feats = (p.features || []).map(function (f) { return "<li>" + check + "<span>" + escHTML(f) + "</span></li>"; }).join("");
      var per = p.period ? ('<span class="per">/' + escHTML(p.period) + '</span>') : "";
      var payUrl = p.payUrl || payFallback;
      var payBtn = payUrl
        ? ('<a class="btn btn-mp" href="' + escHTML(payUrl) + '" target="_blank" rel="noopener">' + card + 'Pagar</a>')
        : ('<button type="button" class="btn btn-mp" data-plan-buy="Mantenimiento ' + escHTML(p.name) + '" data-plan-price="' + escHTML(p.amount) + '" data-plan-cur="' + escHTML(p.cur || "USD") + '">' + card + 'Pagar</button>');
      return '' +
        '<article class="plan reveal' + (p.featured ? ' is-featured' : '') + '">' +
          (p.featured ? '<span class="plan-badge">Recomendado</span>' : '') +
          '<h3 class="plan-name">' + escHTML(p.name) + '</h3>' +
          '<p class="plan-desc">' + escHTML(p.desc) + '</p>' +
          '<div class="plan-price"><span class="cur">' + escHTML(p.cur || "USD") + '</span><span class="amount">' + escHTML(p.amount) + '</span>' + per + '</div>' +
          '<ul>' + feats + '</ul>' +
          '<div class="plan-actions">' +
            payBtn +
            '<button type="button" class="btn btn-ghost" data-plan-buy="Mantenimiento ' + escHTML(p.name) + '" data-plan-price="' + escHTML(p.amount) + '" data-plan-cur="' + escHTML(p.cur || "USD") + '">Consultar</button>' +
          '</div>' +
        '</article>';
    }).join("");
  }

  function mountInstagram() {
    var screen = $("[data-ig-screen]");
    if (!screen || screen.dataset.mounted) return;
    var c = data.contact || {};
    var p = data.instagramProfile || {};
    var handle = (c.instagram || "@disenoweb").replace(/^@/, "");
    var initial = escHTML(handle.charAt(0).toUpperCase());
    var avatarTxt = escHTML(p.fullName ? initials(p.fullName) : handle.charAt(0).toUpperCase());
    var open = $("[data-ig-open]");
    if (open && c.instagramUrl) open.setAttribute("href", c.instagramUrl);

    var grads = [
      "linear-gradient(135deg,#f58529,#dd2a7b)",
      "linear-gradient(135deg,#8134af,#515bd4)",
      "linear-gradient(135deg,#2a2c30,#0b0c0e)",
      "linear-gradient(135deg,#dd2a7b,#515bd4)",
      "linear-gradient(135deg,#feda75,#d62976)",
      "linear-gradient(135deg,#4f5bd5,#962fbf)",
      "linear-gradient(135deg,#0b0c0e,#3a3f47)",
      "linear-gradient(135deg,#d62976,#fa7e1e)",
      "linear-gradient(135deg,#515bd4,#8134af)"
    ];
    var tiles = (p.tiles && p.tiles.length) ? p.tiles : [];
    var count = tiles.length ? tiles.length : 9; // solo tantas casillas como posts reales
    var tilesHtml = "";
    for (var i = 0; i < count; i++) {
      if (tiles[i]) {
        tilesHtml += '<div class="ig-tile" style="background-image:url(\'' + encodeURI(tiles[i]) + '\')"></div>';
      } else {
        tilesHtml += '<div class="ig-tile ig-tile-ph" style="background:' + grads[i % grads.length] + '"><span>' + initial + '</span></div>';
      }
    }
    var gridIc = '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
    var tagIc = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3l9 5-9 5-9-5 9-5zM3 8v8l9 5 9-5V8"/></svg>';

    screen.dataset.mounted = "1";
    screen.innerHTML = '' +
      '<div class="ig-app">' +
        '<div class="ig-topbar"><span class="ig-topname">' + escHTML(handle) + '</span><span class="ig-topdots">•••</span></div>' +
        '<div class="ig-head">' +
          '<div class="ig-avatar"><span>' + avatarTxt + '</span></div>' +
          '<div class="ig-stats">' +
            '<div><b>' + escHTML(p.posts || "0") + '</b><span>posts</span></div>' +
            '<div><b>' + escHTML(p.followers || "0") + '</b><span>seguidores</span></div>' +
            '<div><b>' + escHTML(p.following || "0") + '</b><span>siguiendo</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="ig-meta">' +
          '<div class="ig-fullname">' + escHTML(p.fullName || "") + '</div>' +
          '<div class="ig-bio">' + escHTML(p.bio || "") + '</div>' +
        '</div>' +
        '<div class="ig-actions"><span class="ig-follow">Seguir</span><span class="ig-msg">Mensaje</span></div>' +
        '<div class="ig-tabs"><span class="on">' + gridIc + '</span><span>' + tagIc + '</span></div>' +
        '<div class="ig-grid">' + tilesHtml + '</div>' +
      '</div>';
  }

  function mountWorks() {
    var root = $("[data-works]");
    if (!root || !data.works || root.dataset.mounted) return;
    root.dataset.mounted = "1";
    root.innerHTML = data.works.map(function (w) {
      var accent = escHTML(w.accent || "#2a2c30");
      // Si ponés "img" (ruta local, ej. "assets/img/resto.jpg") se usa esa;
      // si no, se usa una foto de ejemplo de Lorem Picsum según el "seed".
      var img = w.img ? encodeURI(w.img) : ("https://picsum.photos/seed/" + encodeURIComponent(w.seed || "web") + "/800/450");
      return '' +
        '<article class="work-card reveal">' +
          '<div class="work-window">' +
            '<div class="work-bar"><span class="work-dots"><i></i><i></i><i></i></span><span class="work-url">' + escHTML(w.url || "") + '</span></div>' +
            '<div class="work-screen">' +
              '<div class="mini">' +
                '<div class="mini-nav"><span class="mini-logo" style="color:' + accent + '">' + escHTML(w.brand || "") + '</span><span class="mini-menu"><i></i><i></i><i></i></span></div>' +
                '<div class="mini-hero" style="background-color:' + accent + ';background-image:linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.55)),url(\'' + img + '\')">' +
                  '<div class="mini-hero-in">' +
                    '<span class="mini-eyebrow">' + escHTML(w.tag || "") + '</span>' +
                    '<h4>' + escHTML(w.title || "") + '</h4>' +
                    '<p>' + escHTML(w.sub || "") + '</p>' +
                    '<span class="mini-btn" style="background:' + accent + '">' + escHTML(w.cta || "Ver más") + '</span>' +
                  '</div>' +
                '</div>' +
                '<div class="mini-cards"><span></span><span></span><span></span></div>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div class="work-cap"><b>' + escHTML(w.brand || "") + '</b> · ' + escHTML(w.tag || "") + '</div>' +
        '</article>';
    }).join("");
  }

  function initWorkSlider() {
    var slider = $("[data-works]");
    if (!slider) return;
    var prev = $("[data-work-prev]");
    var next = $("[data-work-next]");
    var step = function () {
      var card = slider.querySelector(".work-card");
      return card ? (card.getBoundingClientRect().width + 22) : (slider.clientWidth * 0.85);
    };
    var go = function (dir) { slider.scrollBy({ left: dir * step(), behavior: reduced ? "auto" : "smooth" }); };
    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });
    // Estado de las flechas según posición
    var sync = function () {
      var max = slider.scrollWidth - slider.clientWidth - 2;
      if (prev) prev.disabled = slider.scrollLeft <= 2;
      if (next) next.disabled = slider.scrollLeft >= max;
    };
    slider.addEventListener("scroll", function () {
      requestAnimationFrame(sync);
    }, { passive: true });
    sync();
  }

  function initIgDevice() {
    var sw = $("[data-ig-switch]");
    var frame = $("[data-ig-frame]");
    if (!sw || !frame) return;
    sw.addEventListener("click", function (e) {
      var b = e.target.closest("[data-device]");
      if (!b) return;
      $$("[data-device]", sw).forEach(function (x) {
        var on = x === b;
        x.classList.toggle("is-active", on);
        x.setAttribute("aria-selected", on ? "true" : "false");
      });
      frame.setAttribute("data-device", b.getAttribute("data-device"));
    });
  }

  function initials(name) {
    return String(name || "").trim().split(/\s+/).slice(0, 2).map(function (w) { return w.charAt(0); }).join("").toUpperCase();
  }

  function msgCard(m) {
    return '' +
      '<article class="msg-card">' +
        '<div class="msg-stars" aria-hidden="true">★★★★★</div>' +
        '<p class="msg-text">' + escHTML(m.text) + '</p>' +
        '<div class="msg-meta">' +
          '<span class="msg-avatar" aria-hidden="true">' + escHTML(initials(m.name)) + '</span>' +
          '<div><div class="msg-name">' + escHTML(m.name) + '</div>' +
          '<div class="msg-role">' + escHTML(m.role) + '</div></div>' +
        '</div>' +
      '</article>';
  }

  function mountMessages() {
    var tracks = $$("[data-marquee]");
    if (!tracks.length || !data.messages || !data.messages.length) return;
    var rowA = data.messages;
    var rowB = data.messages.slice().reverse();
    tracks.forEach(function (track) {
      if (track.dataset.mounted) return;
      track.dataset.mounted = "1";
      var set = (track.getAttribute("data-marquee") === "1") ? rowB : rowA;
      var html = set.map(msgCard).join("");
      // Duplicado para loop continuo (translateX -50%)
      track.innerHTML = html + html;
    });
  }

  /* ---------- Inits ---------- */

  function initYear() {
    var y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();
  }

  function initNav() {
    var nav = $("[data-nav]");
    var toggle = $("[data-nav-toggle]");
    var menu = $("[data-mobile-menu]");
    if (nav) {
      var onScroll = function () { nav.classList.toggle("is-scrolled", window.scrollY > 20); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    if (toggle && menu) {
      var setOpen = function (open) {
        toggle.classList.toggle("is-open", open);
        menu.classList.toggle("is-open", open);
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
        toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
        document.body.style.overflow = open ? "hidden" : "";
      };
      toggle.addEventListener("click", function () { setOpen(!menu.classList.contains("is-open")); });
      $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setOpen(false); }); });
    }
  }

  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute("href");
      if (!id || id === "#") return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      var navOffset = 76;
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - navOffset,
        behavior: reduced ? "auto" : "smooth"
      });
    });
  }

  function initMouseGradient() {
    if (!fineHover) return;
    var target = $("[data-mouse-gradient]");
    if (!target) return;
    var raf = null, mx = 30, my = 35;
    window.addEventListener("mousemove", function (e) {
      mx = (e.clientX / window.innerWidth) * 100;
      my = (e.clientY / window.innerHeight) * 100;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        document.documentElement.style.setProperty("--mx", mx.toFixed(1) + "%");
        document.documentElement.style.setProperty("--my", my.toFixed(1) + "%");
        raf = null;
      });
    }, { passive: true });
  }

  function initServicesAccordion() {
    var root = $("[data-services]");
    if (!root) return;
    root.addEventListener("click", function (e) {
      var row = e.target.closest(".service-row");
      if (!row) return;
      var wasOpen = row.classList.contains("is-open");
      $$(".service-row", root).forEach(function (r) { r.classList.remove("is-open"); });
      if (!wasOpen) row.classList.add("is-open");
    });
  }

  function initReveals() {
    var els = $$(".reveal");
    if (!els.length) return;

    var reveal = function (el) { el.classList.add("is-visible"); };

    // Reveal everything already at/near the viewport right now (no wait).
    var revealInView = function () {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      $$(".reveal:not(.is-visible)").forEach(function (el) {
        if (el.getBoundingClientRect().top < vh * 0.95) reveal(el);
      });
    };

    if (!("IntersectionObserver" in window)) {
      els.forEach(reveal);
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { reveal(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.04, rootMargin: "0px 0px -4% 0px" });
    els.forEach(function (el) { io.observe(el); });

    // Fallback #1: reveal on scroll (in case IO callbacks don't fire).
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { revealInView(); ticking = false; });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    revealInView();

    // Fallback #2 (bulletproof): nothing stays invisible past 2.5s.
    setTimeout(function () { $$(".reveal:not(.is-visible)").forEach(reveal); }, 2500);
  }

  function initCountUp() {
    var nums = $$("[data-count-to]");
    if (!nums.length) return;
    var run = function (el) {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      var to = parseFloat(el.getAttribute("data-count-to")) || 0;
      var prefix = el.getAttribute("data-prefix") || "";
      var suffix = el.getAttribute("data-suffix") || "";
      if (reduced || to === 0) { el.textContent = prefix + to + suffix; return; }
      var dur = 1400, start = performance.now();
      var tick = function (now) {
        var t = Math.min((now - start) / dur, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = prefix + Math.round(to * eased) + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.3 });
    nums.forEach(function (el) { io.observe(el); });
  }

  // Contact form -> compose WhatsApp message (no backend needed)
  function initForm() {
    var form = $("[data-form]");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var c = data.contact || {};
      var name = (form.querySelector('[name="name"]') || {}).value || "";
      var biz  = (form.querySelector('[name="biz"]') || {}).value || "";
      var msg  = (form.querySelector('[name="msg"]') || {}).value || "";
      var text = "Hola Diseño Web! Soy " + name +
        (biz ? " (" + biz + ")" : "") + ".\n\n" + msg;
      var encoded = encodeURIComponent(text);
      if (c.whatsapp) {
        window.open("https://wa.me/" + c.whatsapp + "?text=" + encoded, "_blank", "noopener");
      } else if (c.email) {
        window.location.href = "mailto:" + c.email + "?subject=" +
          encodeURIComponent("Consulta web") + "&body=" + encoded;
      }
    });
  }

  function waLink(text) {
    var c = data.contact || {};
    var base = c.whatsapp ? ("https://wa.me/" + c.whatsapp) : "";
    if (!base) return "#";
    return text ? (base + "?text=" + encodeURIComponent(text)) : base;
  }

  // Botones flotantes: WhatsApp, Instagram, Mercado Pago
  function initFabs() {
    var c = data.contact || {};
    var wa = $("[data-wa-fab]");
    if (wa) wa.setAttribute("href", waLink("Hola Diseño Web! Quiero más información."));
    var ig = $("[data-ig-fab]");
    if (ig) {
      if (c.instagramUrl) ig.setAttribute("href", c.instagramUrl);
      else ig.style.display = "none";
    }
    var mp = $("[data-mp-link]");
    var mpUrl = (data.payment || {}).mercadoPago;
    if (mp) {
      if (mpUrl) mp.setAttribute("href", mpUrl);
      else mp.closest(".pay-box") && (mp.closest(".pay-box").style.display = "none");
    }
  }

  // Chat bot con respuestas automáticas (sin backend)
  function initChatbot() {
    var panel = $("[data-chat-panel]");
    var toggle = $("[data-chat-toggle]");
    var closeBtn = $("[data-chat-close]");
    var body = $("[data-chat-body]");
    var quick = $("[data-chat-quick]");
    var waBtn = $("[data-chat-wa]");
    if (!panel || !toggle || !body) return;

    if (waBtn) waBtn.setAttribute("href", waLink("Hola Diseño Web! Quiero hacer una consulta."));

    var started = false;
    function addMsg(text, who) {
      var el = document.createElement("div");
      el.className = "chat-msg " + who;
      el.textContent = text;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }
    function renderQuick() {
      if (!quick || !data.botQA) return;
      quick.innerHTML = "";
      data.botQA.forEach(function (item) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = item.q;
        b.addEventListener("click", function () {
          addMsg(item.q, "user");
          setTimeout(function () { addMsg(item.a, "bot"); }, 400);
        });
        quick.appendChild(b);
      });
    }
    function start() {
      if (started) return;
      started = true;
      addMsg(data.botGreeting || "¡Hola! ¿En qué te ayudo?", "bot");
      renderQuick();
    }
    function setOpen(open) {
      panel.classList.toggle("is-open", open);
      toggle.setAttribute("aria-label", open ? "Cerrar chat" : "Abrir chat");
      if (open) start();
    }
    toggle.addEventListener("click", function () { setOpen(!panel.classList.contains("is-open")); });
    if (closeBtn) closeBtn.addEventListener("click", function () { setOpen(false); });
  }

  // "Lo quiero": ventana de pedido → llega a tu WhatsApp
  function initPlanModal() {
    var modal = $("[data-plan-modal]");
    if (!modal) return;
    var nameEl = $("[data-pm-name]", modal);
    var priceEl = $("[data-pm-price]", modal);
    var form = $("[data-pm-form]", modal);
    var mpBtn = $("[data-pm-mp]", modal);
    var current = { name: "", price: "" };

    var mpUrl = (data.payment || {}).mercadoPago;

    function open(name, price, payUrl) {
      current.name = name; current.price = price;
      if (nameEl) nameEl.textContent = "Plan " + name;
      if (priceEl) priceEl.textContent = price ? ("desde " + price) : "";
      if (mpBtn) {
        var link = payUrl || mpUrl || "";
        if (link) { mpBtn.setAttribute("href", link); mpBtn.style.display = ""; }
        else mpBtn.style.display = "none";
      }
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
      var first = form && form.querySelector("input");
      if (first) setTimeout(function () { first.focus(); }, 100);
    }
    function close() {
      modal.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    // Abrir al tocar "Lo quiero" (delegado, sirve para tarjetas montadas por JS)
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-plan-buy]");
      if (!btn) return;
      e.preventDefault();
      var cur = btn.getAttribute("data-plan-cur") || "USD";
      var amt = btn.getAttribute("data-plan-price") || "";
      var price = amt ? (cur + " " + amt) : "";
      open(btn.getAttribute("data-plan-buy"), price, btn.getAttribute("data-plan-pay") || "");
    });

    $$("[data-pm-close]", modal).forEach(function (b) { b.addEventListener("click", close); });
    modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!form.reportValidity()) return;
        var g = function (n) { var el = form.querySelector('[name="' + n + '"]'); return el ? el.value.trim() : ""; };
        var name = g("name"), biz = g("biz"), phone = g("phone"), msg = g("msg");
        var text = "¡Hola Diseño Web! Quiero contratar el *plan " + current.name + "*" +
          (current.price ? " (" + current.price + ")" : "") + ".\n\n" +
          "Nombre: " + name +
          (biz ? "\nNegocio: " + biz : "") +
          (phone ? "\nTeléfono: " + phone : "") +
          (msg ? "\n\n" + msg : "");
        var c = data.contact || {};
        if (c.whatsapp) {
          window.open("https://wa.me/" + c.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
          close();
        } else if (c.email) {
          window.location.href = "mailto:" + c.email + "?subject=" + encodeURIComponent("Pedido: plan " + current.name) + "&body=" + encodeURIComponent(text);
        }
      });
    }
  }

  // Track which plan the user clicked, prefill the message
  function initPlanCta() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("[data-plan-cta]");
      if (!a) return;
      var plan = a.getAttribute("data-plan-cta");
      var msg = document.querySelector('[name="msg"]');
      if (msg && !msg.value) {
        msg.value = "Me interesa el plan " + plan + ". ";
      }
    });
  }

  function boot() {
    safe(mountContact, "mountContact");
    safe(mountServices, "mountServices");
    safe(mountPlans, "mountPlans");
    safe(mountMaintenance, "mountMaintenance");
    safe(mountWorks, "mountWorks");
    safe(mountInstagram, "mountInstagram");
    safe(mountMessages, "mountMessages");

    safe(initYear, "initYear");
    safe(initNav, "initNav");
    safe(initSmoothScroll, "initSmoothScroll");
    safe(initMouseGradient, "initMouseGradient");
    safe(initServicesAccordion, "initServicesAccordion");
    safe(initReveals, "initReveals");
    safe(initCountUp, "initCountUp");
    safe(initForm, "initForm");
    safe(initPlanCta, "initPlanCta");
    safe(initFabs, "initFabs");
    safe(initWorkSlider, "initWorkSlider");
    safe(initIgDevice, "initIgDevice");
    safe(initChatbot, "initChatbot");
    safe(initPlanModal, "initPlanModal");

    if (window.gsap && window.ScrollTrigger) {
      try { gsap.registerPlugin(ScrollTrigger); } catch (_) {}
    }
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
