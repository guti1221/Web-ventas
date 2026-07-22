/* =============================================================
   main.js — Aplica la config y activa todas las interacciones.
   No hace falta editar este archivo.
   ============================================================= */
(function () {
  "use strict";
  var S = window.SITE || {};
  var wa = (S.whatsapp || "").replace(/[^0-9]/g, "");

  function waLink(msg) {
    return "https://wa.me/" + wa + "?text=" + encodeURIComponent(msg || "");
  }

  // ---- 1) Aplicar configuración a la página ----
  function applyConfig() {
    // Links de WhatsApp: <a data-wa="mensaje opcional">
    document.querySelectorAll("[data-wa]").forEach(function (el) {
      el.setAttribute("href", waLink(el.getAttribute("data-wa")));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
    // Instagram
    document.querySelectorAll("[data-ig]").forEach(function (el) {
      el.setAttribute("href", "https://instagram.com/" + (S.instagram || ""));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener noreferrer");
    });
    // Email (mailto)
    document.querySelectorAll("[data-email]").forEach(function (el) {
      el.setAttribute("href", "mailto:" + (S.email || ""));
    });
    // Textos: <span data-field="nombre|marca|email|ciudad|ig">
    document.querySelectorAll("[data-field]").forEach(function (el) {
      var f = el.getAttribute("data-field");
      if (f === "ig") el.textContent = "@" + (S.instagram || "");
      else if (S[f] != null) el.textContent = S[f];
    });
    // Año actual en el footer
    document.querySelectorAll("[data-year]").forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  // ---- 2) Revelar al hacer scroll ----
  function initReveal() {
    var els = document.querySelectorAll(".reveal");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("revealVisible"); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var d = parseInt(e.target.getAttribute("data-delay") || "0", 10);
          setTimeout(function () { e.target.classList.add("revealVisible"); }, d);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });
    els.forEach(function (el) { obs.observe(el); });
  }

  // ---- 3) Contadores ----
  function initCounters() {
    var els = document.querySelectorAll("[data-count]");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || ""); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        obs.unobserve(e.target);
        var target = parseInt(e.target.getAttribute("data-count"), 10);
        var suffix = e.target.getAttribute("data-suffix") || "";
        var start = performance.now(), dur = 1400;
        function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          e.target.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { obs.observe(el); });
  }

  // ---- 4) Barra de progreso + volver arriba ----
  function initScrollChrome() {
    var bar = document.querySelector(".progressBar");
    var top = document.querySelector(".backTop");
    var nav = document.querySelector(".nav");
    function onScroll() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      if (bar) bar.style.width = p + "%";
      if (top) top.classList.toggle("backTopVisible", h.scrollTop > 600);
      if (nav) nav.classList.toggle("navScrolled", h.scrollTop > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    if (top) top.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // ---- 5) FAQ acordeón ----
  function initFaq() {
    document.querySelectorAll(".faqQ").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var item = btn.closest(".faqItem");
        var ans = item.querySelector(".faqA");
        var open = item.classList.toggle("faqItemOpen");
        ans.style.maxHeight = open ? ans.scrollHeight + "px" : "0";
        var icon = btn.querySelector(".faqIcon");
        if (icon) icon.textContent = open ? "−" : "+";
      });
    });
  }

  // ---- 6) Formulario de captación (Netlify Forms vía AJAX) ----
  function initNewsletter() {
    var form = document.querySelector("form[data-newsletter]");
    if (!form) return;
    var errBox = form.querySelector(".newsletterError");
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      if (errBox) errBox.textContent = "";
      var btn = form.querySelector("button[type=submit]");
      var nombre = form.querySelector("[name=nombre]").value.trim();
      var email = form.querySelector("[name=email]").value.trim();
      if (!nombre) { if (errBox) errBox.textContent = "Escribí tu nombre."; return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (errBox) errBox.textContent = "Ese correo no parece válido."; return;
      }
      if (btn) { btn.disabled = true; btn.textContent = "Enviando..."; }

      var data = new URLSearchParams(new FormData(form)).toString();
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: data,
      })
        .then(function (r) {
          if (!r.ok) throw new Error();
          showSuccess(nombre);
        })
        .catch(function () {
          if (errBox) errBox.textContent = "No se pudo enviar. Probá de nuevo.";
          if (btn) { btn.disabled = false; btn.textContent = "Quiero las ofertas"; }
        });
    });

    function showSuccess(nombre) {
      // Lleva a la página de gracias (sirve para medir conversiones
      // y para invitar a seguirte en Instagram). El nombre viaja por
      // sessionStorage para sobrevivir redirecciones del hosting.
      try { sessionStorage.setItem("vipNombre", nombre); } catch (e) {}
      window.location.href = "gracias.html?nombre=" + encodeURIComponent(nombre);
    }
  }

  // ---- 6b) WhatsApp flotante con horario inteligente ----
  // De día promete respuesta rápida; de noche avisa que contestás mañana.
  function initSmartWhatsApp() {
    var label = document.querySelector(".floatWhatsAppLabel");
    if (!label) return;
    var h = new Date().getHours();
    label.textContent = h >= 9 && h < 21 ? "Respondo en minutos" : "Te respondo a la mañana";
  }

  // ---- 8) Comparador Antes / Después ----
  function initCompare() {
    var box = document.querySelector("[data-compare]");
    if (!box) return;
    var after = box.querySelector(".compareAfter");
    var handle = box.querySelector(".compareHandle");
    var range = box.querySelector(".compareRange");
    function setPos(p) {
      p = Math.max(0, Math.min(100, p));
      after.style.clipPath = "inset(0 0 0 " + p + "%)";
      handle.style.left = p + "%";
    }
    range.addEventListener("input", function () { setPos(parseFloat(range.value)); });
    // arrastre directo con el dedo/mouse sobre el área
    function fromEvent(ev) {
      var r = box.getBoundingClientRect();
      var x = (ev.touches ? ev.touches[0].clientX : ev.clientX) - r.left;
      var p = (x / r.width) * 100;
      range.value = p;
      setPos(p);
    }
    var dragging = false;
    box.addEventListener("pointerdown", function (e) { dragging = true; fromEvent(e); });
    window.addEventListener("pointermove", function (e) { if (dragging) fromEvent(e); });
    window.addEventListener("pointerup", function () { dragging = false; });
    setPos(50);
  }

  // ---- 9) Calculadora de presupuesto ----
  function initCalculadora() {
    var calc = document.querySelector("[data-calc]");
    if (!calc) return;
    var base = parseInt(calc.getAttribute("data-base") || "150", 10);
    var checks = calc.querySelectorAll("input[type=checkbox]");
    var totalEl = calc.querySelector("[data-calc-total]");
    var btn = calc.querySelector("[data-calc-cta]");

    function update() {
      var total = base;
      var items = [];
      checks.forEach(function (c) {
        if (c.checked) {
          total += parseInt(c.getAttribute("data-precio"), 10);
          items.push(c.getAttribute("data-nombre"));
        }
      });
      totalEl.textContent = "USD " + total;
      var msg =
        "¡Hola! Armé mi presupuesto en tu web:\n" +
        "• Web base\n" +
        (items.length ? items.map(function (i) { return "• " + i; }).join("\n") + "\n" : "") +
        "Total estimado: USD " + total + "\n¿Cómo seguimos?";
      btn.setAttribute("href", waLink(msg));
      btn.setAttribute("target", "_blank");
      btn.setAttribute("rel", "noopener noreferrer");
    }
    checks.forEach(function (c) { c.addEventListener("change", update); });
    update();
  }

  // ---- 7) Miniaturas de demos: congelar animaciones adentro ----
  // Las vistas previas (.cardFrame) muestran la demo real escalada. Sin esto,
  // sus animaciones seguirían corriendo y gastarían CPU/batería al pedo.
  function initPreviewFrames() {
    document.querySelectorAll(".cardFrame").forEach(function (f) {
      function freeze() {
        try {
          var doc = f.contentDocument;
          if (!doc || !doc.head) return;
          var st = doc.createElement("style");
          st.textContent = "*,*::before,*::after{animation:none!important;transition:none!important}html{overflow:hidden!important}";
          doc.head.appendChild(st);
        } catch (e) { /* si fuera cross-origin, no se puede y no pasa nada */ }
      }
      if (f.contentDocument && f.contentDocument.readyState === "complete") freeze();
      f.addEventListener("load", freeze);
    });
  }

  // ---- Init ----
  function init() {
    applyConfig();
    initReveal();
    initCounters();
    initScrollChrome();
    initFaq();
    initNewsletter();
    initPreviewFrames();
    initSmartWhatsApp();
    initCompare();
    initCalculadora();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
