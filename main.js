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

  // ---- 10) Fondo animado de código/binario (lluvia dorada tipo "Matrix") ----
  function initCodeRain() {
    var c = document.getElementById("codeRain");
    if (!c) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { c.style.display = "none"; return; }
    var ctx = c.getContext("2d");
    var glyphs = "01 01 </> {} [] () ; = + * $ # 01 function const let 10 01 => 0 1".replace(/ /g, "");
    var font = 15, cols, drops;
    function resize() {
      c.width = window.innerWidth;
      c.height = document.documentElement.clientHeight;
      cols = Math.floor(c.width / font);
      drops = [];
      for (var i = 0; i < cols; i++) drops[i] = Math.random() * -60;
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });
    function draw() {
      ctx.fillStyle = "rgba(11,11,13,0.10)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.font = font + "px monospace";
      for (var i = 0; i < drops.length; i++) {
        var ch = glyphs.charAt(Math.floor(Math.random() * glyphs.length));
        var y = drops[i] * font;
        ctx.fillStyle = "rgba(212,168,87," + (0.14 + Math.random() * 0.26) + ")";
        ctx.fillText(ch, i * font, y);
        if (y > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.55;
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ---- 11) Dispositivos: rotar demos reales (barbería, uñas, etc.) ----
  function initDeviceRotator() {
    var frames = document.querySelectorAll(".deviceFrame");
    if (!frames.length) return;
    var demos = ["barberia.html", "unas.html", "pizzeria.html", "entrenador.html"];
    var i = 0;
    setInterval(function () {
      i = (i + 1) % demos.length;
      frames.forEach(function (f) {
        var screen = f.parentElement;
        screen.style.opacity = "0";
        setTimeout(function () { f.src = demos[i]; screen.style.opacity = ""; }, 320);
      });
    }, 4200);
  }

  // ---- 12) Efecto máquina de escribir en el título del hero ----
  function initTypewriter() {
    var el = document.querySelector("[data-type]");
    if (!el) return;
    function words() {
      return (el.getAttribute("data-type-active") || el.getAttribute("data-type")).split("|");
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = words()[0];
      return;
    }
    var w = 0, c = 0, del = false;
    function tick() {
      var arr = words();
      if (w >= arr.length) w = 0;
      var word = arr[w];
      c += del ? -1 : 1;
      if (c < 0) c = 0;
      if (c > word.length) c = word.length;
      el.textContent = word.slice(0, c);
      var wait = del ? 45 : 90;
      if (!del && c === word.length) { del = true; wait = 1500; }
      else if (del && c === 0) { del = false; w = (w + 1) % arr.length; wait = 260; }
      setTimeout(tick, wait);
    }
    tick();
  }

  // ---- 13) Cuenta regresiva de la oferta (termina a fin de mes) ----
  function initCountdown() {
    if (!document.querySelector("[data-cd]")) return;
    function pad(n) { return (n < 10 ? "0" : "") + n; }
    function target() {
      var n = new Date();
      return new Date(n.getFullYear(), n.getMonth() + 1, 0, 23, 59, 59);
    }
    var end = target();
    function set(k, v) {
      var e = document.querySelector("[data-cd=" + k + "]");
      if (e) e.textContent = pad(v);
    }
    function up() {
      var diff = end - new Date();
      if (diff <= 0) { end = target(); diff = end - new Date(); } // se renueva solo
      set("d", Math.floor(diff / 86400000));
      set("h", Math.floor(diff / 3600000) % 24);
      set("m", Math.floor(diff / 60000) % 60);
      set("s", Math.floor(diff / 1000) % 60);
    }
    up();
    setInterval(up, 1000);
  }

  // ---- 14) Barra de cupos del mes ----
  function initCupos() {
    var fill = document.querySelector(".cuposFill");
    var txt = document.querySelector(".cuposText");
    if (!fill) return;
    // EDITABLE: cuántos cupos tenés en total y cuántos ya tomaste este mes
    var TOTAL = 3, TOMADOS = 2;
    var libres = Math.max(0, TOTAL - TOMADOS);
    fill.style.width = (TOMADOS / TOTAL) * 100 + "%";
    var en = document.documentElement.getAttribute("lang") === "en";
    if (txt) txt.textContent = en
      ? libres + " of " + TOTAL + " spots left"
      : "Quedan " + libres + " de " + TOTAL + " cupos";
  }

  // ---- 15) Cambio de idioma ES / EN ----
  function initLang() {
    var btn = document.getElementById("langBtn");
    if (!btn) return;
    var lang = "es";
    try { lang = localStorage.getItem("lang") || "es"; } catch (e) {}
    function apply(l) {
      document.querySelectorAll("[data-en]").forEach(function (el) {
        if (!el.hasAttribute("data-es")) el.setAttribute("data-es", el.innerHTML);
        el.innerHTML = l === "en" ? el.getAttribute("data-en") : el.getAttribute("data-es");
      });
      document.querySelectorAll("[data-suffix-en]").forEach(function (el) {
        if (!el.hasAttribute("data-suffix-es")) el.setAttribute("data-suffix-es", el.getAttribute("data-suffix"));
        el.setAttribute("data-suffix", l === "en" ? el.getAttribute("data-suffix-en") : el.getAttribute("data-suffix-es"));
        if (el.textContent && el.textContent !== "0") el.textContent = el.getAttribute("data-count") + el.getAttribute("data-suffix");
      });
      var tw = document.querySelector("[data-type]");
      if (tw && tw.getAttribute("data-type-en")) {
        tw.setAttribute("data-type-active", l === "en" ? tw.getAttribute("data-type-en") : tw.getAttribute("data-type"));
      }
      document.documentElement.setAttribute("lang", l);
      btn.textContent = l === "en" ? "ES" : "EN";
      lang = l;
      try { localStorage.setItem("lang", l); } catch (e) {}
      initCupos(); // refresca el texto de cupos en el idioma actual
    }
    btn.addEventListener("click", function () { apply(lang === "en" ? "es" : "en"); });
    apply(lang);
  }

  // ---- Init ----
  function init() {
    applyConfig();
    initLang();
    initCodeRain();
    initReveal();
    initCounters();
    initScrollChrome();
    initFaq();
    initNewsletter();
    initPreviewFrames();
    initSmartWhatsApp();
    initCompare();
    initCalculadora();
    initDeviceRotator();
    initTypewriter();
    initCountdown();
    initCupos();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
