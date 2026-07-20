/* =============================================================
   WIDGET DE CHAT — JS puro, sin frameworks.
   No hace falta tocar este archivo: se configura desde config.js.
   Pegá en tu HTML (antes de </body>):
     <script src="config.js"></script>
     <script src="widget.js"></script>
   ============================================================= */
(function () {
  "use strict";

  if (window.__CHATBOT_LOADED__) return; // evita doble carga
  window.__CHATBOT_LOADED__ = true;

  // ---- Config con valores por defecto ----
  var cfg = window.CHATBOT_CONFIG || {};
  var C = {
    endpoint: cfg.endpoint || "/.netlify/functions/chat",
    businessName: cfg.businessName || "Nuestro negocio",
    title: cfg.title || "Asistente virtual",
    subtitle: cfg.subtitle || "Te respondo al instante",
    welcomeMessage: cfg.welcomeMessage || "¡Hola! ¿En qué puedo ayudarte?",
    placeholder: cfg.placeholder || "Escribí tu mensaje...",
    suggestions: Array.isArray(cfg.suggestions) ? cfg.suggestions : [],
    position: cfg.position === "left" ? "left" : "right",
    colors: cfg.colors || {},
  };
  var col = C.colors;
  var COLORS = {
    primary: col.primary || "#7c5cff",
    primaryText: col.primaryText || "#ffffff",
    userBubble: col.userBubble || col.primary || "#7c5cff",
    userText: col.userText || "#ffffff",
    botBubble: col.botBubble || "#2a2a35",
    botText: col.botText || "#f2f2f5",
    windowBg: col.windowBg || "#14141c",
    headerBg: col.headerBg || "#0e0d15",
  };

  // ---- Estado ----
  var history = []; // [{ role: "user"|"bot", text: "..." }]
  var open = false;
  var waiting = false;

  // ---- Utilidades ----
  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  // Convierte saltos de línea y **negritas** simples en HTML seguro.
  function format(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }

  // ---- Estilos ----
  var side = C.position === "left" ? "left:20px;" : "right:20px;";
  var css =
    "" +
    ".cbw-bubble{position:fixed;bottom:20px;" + side + "z-index:2147483000;width:60px;height:60px;border-radius:50%;border:none;cursor:pointer;background:" + COLORS.primary + ";color:" + COLORS.primaryText + ";box-shadow:0 8px 30px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;transition:transform .2s;}" +
    ".cbw-bubble:hover{transform:scale(1.07);}" +
    ".cbw-bubble svg{width:28px;height:28px;}" +
    ".cbw-badge{position:absolute;top:-2px;" + (C.position === "left" ? "right:-2px;" : "left:-2px;") + "width:14px;height:14px;border-radius:50%;background:#ff4d4f;border:2px solid " + COLORS.windowBg + ";}" +
    ".cbw-panel{position:fixed;bottom:90px;" + side + "z-index:2147483000;width:370px;max-width:calc(100vw - 40px);height:560px;max-height:calc(100vh - 120px);background:" + COLORS.windowBg + ";border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.5);display:flex;flex-direction:column;overflow:hidden;opacity:0;transform:translateY(16px) scale(.98);pointer-events:none;transition:opacity .22s,transform .22s;font-family:system-ui,-apple-system,'Segoe UI',Arial,sans-serif;}" +
    ".cbw-panel.cbw-open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}" +
    ".cbw-header{background:" + COLORS.headerBg + ";padding:14px 16px;display:flex;align-items:center;gap:10px;}" +
    ".cbw-avatar{width:38px;height:38px;border-radius:50%;background:" + COLORS.primary + ";color:" + COLORS.primaryText + ";display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;}" +
    ".cbw-htitle{color:#fff;font-weight:700;font-size:15px;line-height:1.2;}" +
    ".cbw-hsub{color:rgba(255,255,255,.6);font-size:12px;display:flex;align-items:center;gap:5px;}" +
    ".cbw-dot{width:7px;height:7px;border-radius:50%;background:#34d399;display:inline-block;}" +
    ".cbw-close{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.7);font-size:22px;cursor:pointer;line-height:1;padding:4px;}" +
    ".cbw-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;}" +
    ".cbw-msg{max-width:82%;padding:10px 13px;border-radius:14px;font-size:14px;line-height:1.5;word-wrap:break-word;}" +
    ".cbw-bot{align-self:flex-start;background:" + COLORS.botBubble + ";color:" + COLORS.botText + ";border-bottom-left-radius:4px;}" +
    ".cbw-user{align-self:flex-end;background:" + COLORS.userBubble + ";color:" + COLORS.userText + ";border-bottom-right-radius:4px;}" +
    ".cbw-typing{align-self:flex-start;background:" + COLORS.botBubble + ";padding:12px 14px;border-radius:14px;border-bottom-left-radius:4px;display:flex;gap:4px;}" +
    ".cbw-typing span{width:7px;height:7px;border-radius:50%;background:" + COLORS.botText + ";opacity:.5;animation:cbwBlink 1.2s infinite;}" +
    ".cbw-typing span:nth-child(2){animation-delay:.2s;}.cbw-typing span:nth-child(3){animation-delay:.4s;}" +
    "@keyframes cbwBlink{0%,60%,100%{opacity:.25;transform:translateY(0);}30%{opacity:1;transform:translateY(-3px);}}" +
    ".cbw-suggest{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 8px;}" +
    ".cbw-chip{background:transparent;border:1px solid rgba(255,255,255,.18);color:" + COLORS.botText + ";padding:6px 11px;border-radius:999px;font-size:12.5px;cursor:pointer;transition:background .15s;}" +
    ".cbw-chip:hover{background:rgba(255,255,255,.08);}" +
    ".cbw-foot{padding:10px;display:flex;gap:8px;border-top:1px solid rgba(255,255,255,.08);}" +
    ".cbw-input{flex:1;resize:none;border:1px solid rgba(255,255,255,.15);background:rgba(0,0,0,.25);color:#fff;border-radius:12px;padding:10px 12px;font-size:14px;font-family:inherit;outline:none;max-height:90px;}" +
    ".cbw-input:focus{border-color:" + COLORS.primary + ";}" +
    ".cbw-send{background:" + COLORS.primary + ";color:" + COLORS.primaryText + ";border:none;border-radius:12px;width:44px;flex-shrink:0;cursor:pointer;display:flex;align-items:center;justify-content:center;}" +
    ".cbw-send:disabled{opacity:.5;cursor:default;}" +
    ".cbw-send svg{width:20px;height:20px;}" +
    ".cbw-powered{text-align:center;font-size:10.5px;color:rgba(255,255,255,.35);padding:0 0 8px;}" +
    "@media(max-width:480px){.cbw-panel{width:calc(100vw - 24px);" + (C.position === "left" ? "left:12px;" : "right:12px;") + "height:calc(100vh - 100px);bottom:84px;}}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ---- Íconos ----
  var iconChat = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/></svg>';
  var iconSend = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>';

  // ---- Estructura DOM ----
  var initials = (C.businessName.trim()[0] || "?").toUpperCase();
  var panel = document.createElement("div");
  panel.className = "cbw-panel";
  panel.innerHTML =
    '<div class="cbw-header">' +
    '<div class="cbw-avatar">' + esc(initials) + "</div>" +
    "<div><div class='cbw-htitle'>" + esc(C.title) + "</div>" +
    "<div class='cbw-hsub'><span class='cbw-dot'></span>" + esc(C.subtitle) + "</div></div>" +
    '<button class="cbw-close" aria-label="Cerrar">&times;</button>' +
    "</div>" +
    '<div class="cbw-body"></div>' +
    '<div class="cbw-suggest"></div>' +
    '<div class="cbw-foot">' +
    '<textarea class="cbw-input" rows="1" placeholder="' + esc(C.placeholder) + '"></textarea>' +
    '<button class="cbw-send" aria-label="Enviar">' + iconSend + "</button>" +
    "</div>" +
    '<div class="cbw-powered">Chat con IA</div>';

  var bubble = document.createElement("button");
  bubble.className = "cbw-bubble";
  bubble.setAttribute("aria-label", "Abrir chat");
  bubble.innerHTML = iconChat + '<span class="cbw-badge"></span>';

  document.body.appendChild(panel);
  document.body.appendChild(bubble);

  var body = panel.querySelector(".cbw-body");
  var input = panel.querySelector(".cbw-input");
  var sendBtn = panel.querySelector(".cbw-send");
  var suggestWrap = panel.querySelector(".cbw-suggest");
  var badge = bubble.querySelector(".cbw-badge");

  // ---- Render de mensajes ----
  function addMsg(text, who) {
    var el = document.createElement("div");
    el.className = "cbw-msg " + (who === "user" ? "cbw-user" : "cbw-bot");
    el.innerHTML = format(text);
    body.appendChild(el);
    body.scrollTop = body.scrollHeight;
    return el;
  }
  function showTyping() {
    var t = document.createElement("div");
    t.className = "cbw-typing";
    t.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(t);
    body.scrollTop = body.scrollHeight;
    return t;
  }

  function renderSuggestions() {
    suggestWrap.innerHTML = "";
    if (history.length > 1) return; // se ocultan tras el primer intercambio
    C.suggestions.forEach(function (s) {
      var chip = document.createElement("button");
      chip.className = "cbw-chip";
      chip.textContent = s;
      chip.onclick = function () {
        input.value = s;
        send();
      };
      suggestWrap.appendChild(chip);
    });
  }

  // ---- Envío ----
  function send() {
    var text = input.value.trim();
    if (!text || waiting) return;
    input.value = "";
    input.style.height = "auto";
    addMsg(text, "user");
    history.push({ role: "user", text: text });
    renderSuggestions();

    waiting = true;
    sendBtn.disabled = true;
    var typing = showTyping();

    fetch(C.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, history: history.slice(0, -1) }),
    })
      .then(function (r) {
        return r.json().then(function (d) {
          return { ok: r.ok, status: r.status, data: d };
        });
      })
      .then(function (res) {
        typing.remove();
        if (!res.ok || !res.data || !res.data.reply) {
          var m =
            (res.data && res.data.error) ||
            "Uy, no pude responder en este momento. Probá de nuevo o escribinos por WhatsApp. 🙏";
          addMsg(m, "bot");
          return;
        }
        addMsg(res.data.reply, "bot");
        history.push({ role: "bot", text: res.data.reply });
      })
      .catch(function () {
        typing.remove();
        addMsg(
          "Parece que hay un problema de conexión. Revisá tu internet e intentá de nuevo. 🙏",
          "bot"
        );
      })
      .finally(function () {
        waiting = false;
        sendBtn.disabled = false;
        input.focus();
      });
  }

  // ---- Eventos ----
  function toggle(v) {
    open = typeof v === "boolean" ? v : !open;
    panel.classList.toggle("cbw-open", open);
    bubble.innerHTML = (open
      ? '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>'
      : iconChat + '<span class="cbw-badge"></span>');
    if (open) {
      if (badge) badge.style.display = "none";
      setTimeout(function () {
        input.focus();
      }, 250);
    }
  }

  bubble.addEventListener("click", function () {
    toggle();
  });
  panel.querySelector(".cbw-close").addEventListener("click", function () {
    toggle(false);
  });
  sendBtn.addEventListener("click", send);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
  input.addEventListener("input", function () {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 90) + "px";
  });

  // ---- Bienvenida ----
  addMsg(C.welcomeMessage, "bot");
  history.push({ role: "bot", text: C.welcomeMessage });
  renderSuggestions();
})();
