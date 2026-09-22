/* =============================================================
   Diseño Web — brand data (window.__BRAND__)
   EDITÁ AQUÍ tus datos de contacto y precios.
   ============================================================= */
(function () {
  "use strict";
  window.__BRAND__ = {
    name: "Diseño Web",

    // ---- CONTACTO: cambiá estos valores por los tuyos ----
    contact: {
      email: "hola@disenoweb.uy",
      // Número de WhatsApp en formato internacional, solo dígitos (sin +, espacios ni guiones)
      // Tu número 099 532 976 -> Uruguay (598) + 99532976
      whatsapp: "59899532976",
      whatsappLabel: "+598 99 532 976",
      city: "Maldonado · Uruguay",
      instagram: "@estudioweb.uy",
      // URL completa de tu Instagram — ⚠️ CONFIRMAR el usuario exacto de la cuenta "Estudio Web"
      instagramUrl: "https://instagram.com/estudioweb.uy"
    },

    // ---- PAGO: links de Mercado Pago ----
    // Creá tus links de pago en tu cuenta de Mercado Pago y pegá las URLs acá.
    // (App/Panel de Mercado Pago → "Cobrar" / "Link de pago" → copiar link)
    // - "mercadoPago" es el link general (botón grande de la sección Planes).
    // - Podés poner un link distinto por plan de mantenimiento en su "payUrl".
    // ⚠️ El link de abajo es de EJEMPLO: reemplazalo por el tuyo real antes de publicar.
    payment: {
      mercadoPago: "https://link.mercadopago.com.uy/disenoweb"
    },

    // ---- INSTAGRAM: vista del perfil en el mockup de dispositivo ----
    // EJEMPLO: editá con tus datos y números reales. "tiles" = fotos de tus
    // posts (poné rutas tipo "assets/img/post1.jpg"); si lo dejás vacío, se
    // muestran mosaicos de ejemplo con degradados.
    instagramProfile: {
      fullName: "Estudio Web",
      bio: "🌐 Creamos páginas web para tu negocio\n✨ Diseño profesional + Chatbot IA\n📍 Uruguay",
      posts: "6",
      followers: "1.240",
      following: "2",
      tiles: [
        "assets/img/ig1.jpg",
        "assets/img/ig2.jpg",
        "assets/img/ig3.jpg",
        "assets/img/ig4.jpg",
        "assets/img/ig5.jpg",
        "assets/img/ig6.jpg"
      ]
    },

    // ---- EJEMPLOS DE PÁGINAS (carrusel que se desliza al costado) ----
    // Diseños ILUSTRATIVOS de distintos rubros. Las fotos salen de Lorem Picsum
    // (gratis, sin derechos): https://picsum.photos/seed/<seed>/800/450
    // Podés cambiar textos, color (accent), rubro y el "seed" de la foto.
    works: [
      { brand: "Sabores", tag: "Restaurante", accent: "#e0651d", img: "assets/img/resto.jpg", title: "Reservá tu mesa", sub: "Cocina de autor en el centro", cta: "Ver el menú", url: "sabores.uy" },
      { brand: "Pulse", tag: "Gimnasio", accent: "#16a34a", img: "assets/img/gym.jpg", title: "Entrená sin excusas", sub: "Planes flexibles todo el año", cta: "Empezar hoy", url: "pulse.fit" },
      { brand: "Terra", tag: "Inmobiliaria", accent: "#2563eb", img: "assets/img/casa.jpg", title: "Tu próxima casa", sub: "Propiedades en Maldonado y Punta", cta: "Ver propiedades", url: "terra.com.uy" },
      { brand: "Bloom", tag: "Peluquería", accent: "#db2777", img: "assets/img/pelu.jpg", title: "Reservá tu turno", sub: "Color, corte y estilo", cta: "Agendar", url: "bloomstudio.uy" },
      { brand: "Nova", tag: "Tienda online", accent: "#7c3aed", img: "assets/img/tienda.jpg", title: "Envíos a todo el país", sub: "Moda y accesorios con onda", cta: "Comprar ahora", url: "novastore.uy" }
    ],

    // ---- CHAT BOT: preguntas y respuestas automáticas ----
    // Editá o agregá pares pregunta/respuesta. El bot muestra las preguntas como botones.
    botGreeting: "¡Hola! 👋 Soy el asistente de Diseño Web. ¿En qué te puedo ayudar?",
    botQA: [
      { q: "¿Cuánto cuesta una web?", a: "Los planes arrancan en USD 150 (1 página), USD 300 (varias secciones) y USD 600 (tienda online). El precio final depende de tu proyecto — te paso un presupuesto cerrado sin sorpresas." },
      { q: "¿Cuánto demoran?", a: "Una web sencilla puede estar online en unos 5 días. Proyectos más grandes, un poco más. Siempre te damos una fecha concreta antes de empezar." },
      { q: "¿Hacen tiendas online?", a: "¡Sí! Catálogo con carrito y pedidos que te llegan directo por WhatsApp o email, sin comisiones por venta." },
      { q: "¿Incluye los textos?", a: "En el plan Profesional y Tienda, sí. Escribimos el contenido por vos para que quede claro y venda." },
      { q: "Quiero un presupuesto", a: "¡Genial! Tocá el botón de abajo para seguir por WhatsApp y te respondo en menos de 24 h. 👇" }
    ],

    // ---- SERVICIOS (lista desplegable) ----
    services: [
      {
        name: "Sitios web a medida",
        detail: "Landing page, web institucional o multipágina, diseñada desde cero para tu negocio. Cada sección tiene un porqué: nada de plantillas genéricas ni bloques de relleno.",
        tags: ["Landing", "Institucional", "Multipágina"]
      },
      {
        name: "Tiendas online",
        detail: "Catálogo de productos con carrito y pedidos que te llegan directo por WhatsApp o email. Tuya de punta a punta: sin comisiones por venta ni suscripciones mensuales caras.",
        tags: ["Catálogo", "Carrito", "Pedidos directos"]
      },
      {
        name: "Rediseño y mejora",
        detail: "¿Tu web quedó vieja, va lenta o no se ve bien en el celular? La reconstruimos rápida, clara y lista para 2026, conservando lo que ya funciona.",
        tags: ["Velocidad", "Mobile first", "SEO básico"]
      },
      {
        name: "Textos y mantenimiento",
        detail: "Escribimos el contenido que convierte y nos ocupamos de los cambios: precios, fotos, secciones nuevas. Vos seguís atendiendo tu negocio.",
        tags: ["Copywriting", "Cambios", "Soporte"]
      }
    ],

    // ---- PLANES ----
    plans: [
      {
        name: "Esencial",
        desc: "Una página que presenta tu negocio y capta contactos.",
        amount: 150, cur: "USD",
        features: ["1 página (landing)", "Diseño a medida", "Botón de WhatsApp", "Adaptada al celular", "Online en 5 días"],
        featured: false,
        payUrl: "https://mpago.la/2PuSTSm"
      },
      {
        name: "Profesional",
        desc: "Varias secciones para negocios que quieren mostrar todo.",
        amount: 300, cur: "USD",
        features: ["Hasta 5 secciones", "Formulario de contacto", "Galería / servicios", "Google Maps + SEO básico", "Textos incluidos"],
        featured: true
      },
      {
        name: "Tienda",
        desc: "Catálogo online con pedidos directos, sin intermediarios.",
        amount: 600, cur: "USD",
        features: ["Catálogo de productos", "Carrito de compras", "Pedidos por WhatsApp/email", "Panel para editar precios", "Todo lo del plan Profesional"],
        featured: false
      }
    ],

    // ---- PLANES DE MANTENIMIENTO (pago mensual) ----
    // Para que la web siga andando, segura y actualizada mes a mes.
    // "payUrl" (opcional): link de pago de Mercado Pago de ESE plan. Si lo dejás
    // vacío, el botón "Pagar" usa el link general de payment.mercadoPago.
    maintenance: [
      {
        name: "Al día",
        desc: "Lo básico para que tu web nunca se caiga ni quede vieja.",
        amount: 15, cur: "USD", period: "mes",
        features: ["Hosting y dominio monitoreados", "Respaldos automáticos", "Actualizaciones de seguridad", "Hasta 2 cambios de texto/foto por mes", "Soporte por WhatsApp"],
        featured: false,
        payUrl: ""
      },
      {
        name: "Activo",
        desc: "Para negocios que cambian seguido y quieren estar arriba.",
        amount: 35, cur: "USD", period: "mes",
        features: ["Todo lo del plan Al día", "Cambios de contenido ilimitados", "1 sección nueva por trimestre", "Optimización de velocidad", "Respuesta prioritaria (24-48 h)"],
        featured: true,
        payUrl: ""
      },
      {
        name: "Full",
        desc: "Nos ocupamos de todo. Vos solo atendés tu negocio.",
        amount: 70, cur: "USD", period: "mes",
        features: ["Todo lo del plan Activo", "Cambios y secciones ilimitadas", "Informe mensual de visitas", "Mini-optimización SEO mensual", "Soporte prioritario"],
        featured: false,
        payUrl: ""
      }
    ],

    // ---- MENSAJES / TESTIMONIOS (marquee automático) ----
    // ⚠️ Estos son EJEMPLOS. Reemplazalos por mensajes reales de tus clientes.
    messages: [
      { text: "Quedó tal cual la imaginaba y en una semana ya estaba online. Me empezaron a escribir por WhatsApp a los pocos días.", name: "Carla M.", role: "Peluquería · Maldonado" },
      { text: "Tenía una web vieja que no se veía en el celular. La rehicieron y ahora se ve impecable en todos lados.", name: "Diego R.", role: "Estudio contable" },
      { text: "El catálogo online nos ordenó los pedidos. Ahora llegan todos por WhatsApp sin perder ninguno.", name: "Flor & Santi", role: "Rotisería" },
      { text: "Muy claros con los precios y los tiempos. Cero vueltas técnicas, todo explicado en criollo.", name: "Nicolás P.", role: "Gimnasio" },
      { text: "Me hicieron los textos también, que era lo que más me costaba. Quedó profesional de verdad.", name: "Valentina S.", role: "Nutricionista" },
      { text: "Rápidos para responder y para hacer cambios. Se nota que les importa que quede bien.", name: "Martín G.", role: "Inmobiliaria" }
    ],

    // ---- STATS (contador animado) ----
    stats: [
      { to: 100, suffix: "%", label: "A medida, sin plantillas" },
      { to: 5,   suffix: " días", label: "Para verla online" },
      { to: 24,  suffix: "h", label: "Respondemos tu mensaje" },
      { to: 0,   suffix: "", prefix: "$", label: "Comisiones por venta" }
    ]
  };
})();
