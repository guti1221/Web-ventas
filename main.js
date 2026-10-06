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
          '<div class="plan-price">' + (/[–-]/.test(String(p.amount)) ? '' : '<span class="from">desde</span>') + '<span class="cur">' + escHTML(p.cur || "USD") + '</span><span class="amount">' + escHTML(p.amount) + '</span></div>' +
          '<ul>' + feats + '</ul>' +
          '<button type="button" class="' + btnClass + '" data-plan-buy="' + escHTML(p.name) + '" data-plan-price="' + escHTML(p.amount) + '" data-plan-cur="' + escHTML(p.cur || "USD") + '" data-plan-pay="' + escHTML(p.payUrl || "") + '">Lo quiero</button>' +
        '</article>';
    }).join("");
  }

  function mountMaintenance() {
    var root = $("[data-maintenance]");
    if (!root || !data.maintenance || root.dataset.mounted) return;
    root.dataset.mounted = "1";
    var check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M20 6L9 17l-5-5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    var card = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>';
    root.innerHTML = data.maintenance.map(function (p) {
      var feats = (p.features || []).map(function (f) { return "<li>" + check + "<span>" + escHTML(f) + "</span></li>"; }).join("");
      var per = p.period ? ('<span class="per">/' + escHTML(p.period) + '</span>') : "";
      return '' +
        '<article class="plan reveal' + (p.featured ? ' is-featured' : '') + '">' +
          (p.featured ? '<span class="plan-badge">Recomendado</span>' : '') +
          '<h3 class="plan-name">' + escHTML(p.name) + '</h3>' +
          '<p class="plan-desc">' + escHTML(p.desc) + '</p>' +
          '<div class="plan-price"><span class="cur">' + escHTML(p.cur || "USD") + '</span><span class="amount">' + escHTML(p.amount) + '</span>' + per + '</div>' +
          '<ul>' + feats + '</ul>' +
          '<div class="plan-actions">' +
            '<button type="button" class="btn btn-primary" data-plan-buy="Mantenimiento ' + escHTML(p.name) + '" data-plan-price="' + escHTML(p.amount) + '" data-plan-cur="' + escHTML(p.cur || "USD") + '">Lo quiero</button>' +
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
      if (priceEl) priceEl.textContent = price ? ((/[–-]/.test(price) ? "" : "desde ") + price) : "";
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

  // Container Scroll (21st.dev): la tarjeta arranca inclinada y se endereza al scrollear
  function initContainerScroll() {
    var root = $("[data-cs]");
    var card = $("[data-cs-card]");
    var head = $("[data-cs-head]");
    if (!root || !card || reduced) return;
    function update() {
      var r = root.getBoundingClientRect();
      var vh = window.innerHeight;
      // 0 cuando la sección entra por abajo, 1 cuando su centro llega al centro de la pantalla
      var p = (vh - r.top) / (vh + r.height * 0.35);
      p = Math.max(0, Math.min(1, p * 1.5));
      var mobile = window.innerWidth <= 768;
      var s0 = mobile ? 0.7 : 1.05, s1 = mobile ? 0.9 : 1;
      card.style.transform = "rotateX(" + (20 * (1 - p)).toFixed(2) + "deg) scale(" + (s0 + (s1 - s0) * p).toFixed(3) + ")";
      if (head) head.style.transform = "translateY(" + (-100 * p).toFixed(1) + "px)";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  // Glyph Portal: la cámara atraviesa una letra de la palabra y revela la sección siguiente
  function initGlyphPortal() {
    var sec = $("[data-gp]");
    if (!sec || reduced) return;
    var pin = sec.querySelector("[data-gp-pin]"), field = sec.querySelector("[data-gp-field]"), art = sec.querySelector("[data-gp-art]");
    var clip = art.querySelector("clipPath"), glyph = sec.querySelector("[data-gp-glyph]");
    var text = (sec.getAttribute("data-word") || "NEGOCIO").trim();
    var focusChar = sec.getAttribute("data-focus") || "";
    var length = Math.min(8, Math.max(1, parseFloat(sec.getAttribute("data-length")) || 2.4));
    if (window.innerWidth < 720) length = Math.min(length, 1.6);   // celular: menos scroll
    var family = '"Space Grotesk", "Arial Black", Arial, sans-serif';
    var cv = document.createElement("canvas"), ctx = cv.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    var W = 1, H = 1, bounds, center, target, startScale = 1, endScale = 1, ready = false;
    function clamp(n, a, b) { return Math.min(b, Math.max(a, n)); }
    function smooth(a, b, n) { var t = clamp((n - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

    // Mayor cuadrado opaco dentro de una letra (funciona en O, S, Ø…)
    function interior(ch, font) {
      ctx.font = font;
      var m = ctx.measureText(ch), pad = 8;
      var left = Math.ceil(m.actualBoundingBoxLeft), ascent = Math.ceil(m.actualBoundingBoxAscent);
      cv.width = Math.max(1, Math.ceil(m.actualBoundingBoxLeft + m.actualBoundingBoxRight) + pad * 2);
      cv.height = Math.max(1, Math.ceil(m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) + pad * 2);
      ctx.font = font; ctx.fillText(ch, pad + left, pad + ascent);
      var w = cv.width, h = cv.height, px = ctx.getImageData(0, 0, w, h).data;
      var rows = new Uint16Array(w + 1), size = 0, bx = 0, by = 0;
      for (var y = 0; y < h; y++) {
        var diag = 0;
        for (var x = 0; x < w; x++) {
          var above = rows[x + 1];
          rows[x + 1] = px[(y * w + x) * 4 + 3] > 245 ? Math.min(above, rows[x], diag) + 1 : 0;
          diag = above;
          if (rows[x + 1] > size) { size = rows[x + 1]; bx = x; by = y; }
        }
      }
      if (size < 3) return null;
      return { x: (bx + 1 - size / 2 - pad - left) / 3, y: (by + 1 - size / 2 - pad - ascent) / 3, radius: (size / 2 - 1) / 3 };
    }

    function readInk() {
      var fam = getComputedStyle(glyph).fontFamily;
      ctx.font = "700 100px " + fam;
      var m = ctx.measureText(text);
      bounds = { x: -m.actualBoundingBoxLeft, y: -m.actualBoundingBoxAscent,
        width: m.actualBoundingBoxLeft + m.actualBoundingBoxRight, height: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent };
      if (!bounds.width || !bounds.height) return false;
      center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
      var req = focusChar ? text.indexOf(focusChar) : -1, cands = [];
      for (var i = 0; i < text.length; i++) {
        ctx.font = "700 100px " + fam;
        var adv = ctx.measureText(text.slice(0, i)).width;
        var f = interior(text[i], "700 300px " + fam);
        if (f) cands.push({ x: f.x + adv, y: f.y, radius: f.radius, index: i });
      }
      target = cands.filter(function (c) { return c.index === req; })[0] ||
        cands.sort(function (a, b) { return b.radius - a.radius; })[0] || null;
      return !!target;
    }

    function layout() {
      W = pin.clientWidth || window.innerWidth; H = window.innerHeight;
      sec.style.setProperty("--gp-height", H + "px");
      sec.style.setProperty("--gp-length", length);
      art.setAttribute("viewBox", "0 0 " + W + " " + H);
      startScale = Math.min(W * 0.84 / bounds.width, H * 0.38 / bounds.height);
      endScale = Math.max(startScale, Math.hypot(W, H) / (target.radius * 1.35));
      sec.style.setProperty("--gp-word-top", (H * .46 - bounds.height * startScale / 2) + "px");
      sec.style.setProperty("--gp-word-bottom", (H * .46 + bounds.height * startScale / 2) + "px");
    }

    function paint() {
      var p = clamp(-sec.getBoundingClientRect().top / (H * length), 0, 1), t = clamp(p / 0.78, 0, 1);
      var eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      var scale = Math.exp(Math.log(startScale) + Math.log(endScale / startScale) * eased);
      var blend = endScale === startScale ? 0 : (1 / scale - 1 / startScale) / (1 / endScale - 1 / startScale);
      var cx = center.x + (target.x - center.x) * blend, cy = center.y + (target.y - center.y) * blend;
      var roll = -4 * smooth(0.06, 0.5, t) * (1 - smooth(0.62, 0.92, t));
      var rad = roll * Math.PI / 180;
      var dx = W / 2 / scale, dy = (H * .46 + H * .04 * eased) / scale;
      clip.setAttribute("transform", "scale(" + scale + ") rotate(" + roll + ")");
      glyph.setAttribute("transform", "translate(" + (Math.cos(rad) * dx + Math.sin(rad) * dy - cx) + " " + (-Math.sin(rad) * dx + Math.cos(rad) * dy - cy) + ")");
      field.style.clipPath = t >= 1 ? "none" : "url(#gp-clip)";
      sec.style.setProperty("--gp-caption", 1 - smooth(0.01, 0.16, p));
      sec.style.setProperty("--gp-reveal", smooth(0.78, 0.9, p));
      sec.style.setProperty("--gp-field-scale", 1 + .16 * smooth(0, .82, p));
      sec.classList.toggle("is-entered", p >= 0.9);
    }

    function schedule() { paint(); }   // barato (sólo atributos SVG + variables CSS), sin depender de rAF
    function relayout() { layout(); paint(); }

    function start() {
      if (ready) return;
      if (!window.innerWidth || !window.innerHeight) { setTimeout(start, 400); return; }   // pestaña oculta/sin tamaño: reintenta
      glyph.style.fontFamily = family;
      if (!readInk()) return;       // si algo falla, la sección queda estática y legible
      ready = true;
      sec.classList.add("is-ready", "is-motion");   // antes de medir: el pin está oculto sin esta clase
      layout();
      paint();
      window.addEventListener("scroll", schedule, { passive: true });
      window.addEventListener("resize", relayout, { passive: true });
    }
    if (document.fonts && document.fonts.load) {
      document.fonts.load("700 100px 'Space Grotesk'", text).then(start, start);
      setTimeout(start, 1500);
    } else start();
  }

  // Zoom Parallax: las capas crecen a distinta velocidad con el scroll (tarjetas = webs de works[])
  function initZoomParallax() {
    var sec = $("[data-zp]"), track = $("[data-zp-track]"), stage = $("[data-zp-stage]");
    if (!sec || !track || !stage) return;
    var items = (data.works || []).map(function (w) { return { src: w.img, name: w.brand, tag: w.tag }; });
    items.push({ src: "assets/img/hero-code.jpg", name: "Diseño Web", tag: "Tu negocio, acá" });
    items = items.slice(0, 7);
    if (!items.length) return;
    stage.innerHTML = items.map(function (it) {
      return '<div class="zp-layer"><figure class="zp-tile"><img src="' + escHTML(it.src) + '" alt="Web de ' + escHTML(it.name) + '" loading="lazy" />' +
        '<figcaption>' + escHTML(it.name) + '<span>' + escHTML(it.tag) + '</span></figcaption></figure></div>';
    }).join("");
    if (reduced) return;     // sin movimiento: queda como grilla
    var ks = [4, 5, 6, 5, 6, 8, 9];
    var layers = $$(".zp-layer", stage);
    sec.classList.add("is-on");
    function update() {
      var r = track.getBoundingClientRect();
      var span = track.offsetHeight - window.innerHeight;
      var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
      for (var i = 0; i < layers.length; i++) layers[i].style.setProperty("--zs", (1 + (ks[i % ks.length] - 1) * p).toFixed(3));
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  // Pestañas (servicios / planes). Los links a #ideas, #proceso, #mantenimiento abren su pestaña.
  function initTabs() {
    function activate(box, id) {
      $$("[data-tab]", box).forEach(function (b) { b.classList.toggle("is-active", b.getAttribute("data-tab") === id); });
      $$("[data-tab-panel]", box).forEach(function (p) {
        p.classList.toggle("is-active", (p.getAttribute("data-tab-id") || p.id) === id);
      });
    }
    $$("[data-tabs]").forEach(function (box) {
      box.addEventListener("click", function (e) {
        var b = e.target.closest("[data-tab]");
        if (b && box.contains(b)) activate(box, b.getAttribute("data-tab"));
      });
    });
    document.addEventListener("click", function (e) {
      var a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a) return;
      var panel = document.getElementById(a.getAttribute("href").slice(1));
      if (!panel || !panel.hasAttribute("data-tab-panel")) return;
      var box = panel.closest("[data-tabs]");
      activate(box, panel.getAttribute("data-tab-id") || panel.id);
      e.preventDefault();
      box.scrollIntoView({ behavior: "smooth", block: "start" });
      var m = $("[data-mobile-menu]"), t = $("[data-nav-toggle]"); if (m && t && m.classList.contains("is-open")) t.click();
    }, true);
  }

  // Cinta de tiendas: se duplica el contenido para que el loop sea continuo
  function initStores() {
    var track = $("[data-stores-track]"), rail = $("[data-stores]");
    if (!track || !rail || reduced) return;
    var kids = Array.prototype.slice.call(track.children);
    kids.forEach(function (k) {
      var c = k.cloneNode(true);
      c.setAttribute("aria-hidden", "true"); c.setAttribute("tabindex", "-1");   // la copia no se anuncia ni se enfoca
      track.appendChild(c);
    });
    function size() {
      var half = track.scrollWidth / 2;
      track.style.setProperty("--st-shift", half + "px");
      track.style.setProperty("--st-dur", Math.max(20, half / 45) + "s");   // ~45 px/s
    }
    size();
    window.addEventListener("resize", size, { passive: true });
    window.addEventListener("load", size);
    rail.addEventListener("touchstart", function () { rail.classList.add("is-paused"); }, { passive: true });
    rail.addEventListener("touchend", function () { setTimeout(function () { rail.classList.remove("is-paused"); }, 1500); }, { passive: true });
  }

  // Spotlight: guarda la posición del mouse dentro de cada tarjeta
  function initSpotlight() {
    if (!fineHover) return;
    document.addEventListener("mousemove", function (e) {
      var card = e.target.closest && e.target.closest(".idea-card, .plan");
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty("--sx", (e.clientX - r.left) + "px");
      card.style.setProperty("--sy", (e.clientY - r.top) + "px");
    }, { passive: true });
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
    safe(initContainerScroll, "initContainerScroll");
    safe(initTabs, "initTabs");
    safe(initStores, "initStores");
    safe(initGlyphPortal, "initGlyphPortal");
    safe(initZoomParallax, "initZoomParallax");
    safe(initSpotlight, "initSpotlight");

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
