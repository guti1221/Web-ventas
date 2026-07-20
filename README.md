# 🌐 Web de ventas — Estudio Web

Tu sitio de ventas listo para subir a **Netlify**. Es 100% estático
(HTML/CSS/JS), así que no necesita build ni servidor.

## 📁 Qué hay adentro

```
web-ventas/
├── index.html          # Página principal (tiendas, planes, testimonios, etc.)
├── ebooks.html         # Sección de ebooks
├── apps.html           # Sección de apps
├── css/styles.css      # Estilos
├── js/config.js        # 👈 TUS DATOS (lo único que editás siempre)
├── js/main.js          # Animaciones y formulario (no tocar)
├── demos/              # Las webs de muestra (barbería, uñas)
├── chatbot/            # Widget del chatbot con IA
└── netlify/functions/  # Función del chatbot (Gemini)
```

## ✏️ Antes de subir: completá tus datos

Abrí **`js/config.js`** y cambiá:

- `whatsapp` → tu número real con código de país (Uruguay = 598). **Sin esto los botones de WhatsApp no funcionan.**
- `instagram` → tu usuario sin la @.
- `email`, `nombre`, `marca`, `ciudad`.

Todo el resto (planes, precios, testimonios) se edita directo en `index.html`.

> ⚠️ Los **testimonios son de ejemplo** ("Nombre Apellido"). Cambialos por reseñas
> reales de clientes apenas las tengas.

## 🚀 Cómo subir a Netlify (2 minutos)

**Opción rápida (arrastrar):**
1. Entrá a **https://app.netlify.com/drop**
2. Arrastrá la carpeta `web-ventas` entera.
3. ¡Listo! Netlify te da una URL (podés cambiarle el nombre después).

**Opción con GitHub (recomendada para actualizar fácil):**
1. Subí la carpeta a un repo de GitHub.
2. En Netlify: *Add new site → Import from GitHub* → elegí el repo.
3. Publish directory: `.` (o `web-ventas` si subiste todo el proyecto).

## 📧 Captación de emails (ya funciona)

El formulario "Sumate a la lista VIP" usa **Netlify Forms** (gratis, sin backend).
Cada persona que se anota aparece en:
**Netlify → tu sitio → Forms → "ofertas"**.
Ahí podés exportar los correos a CSV para mandar tus ofertas y ebooks.

## 🤖 Chatbot con IA (opcional)

El chatbot ya está integrado. Para que responda necesitás la API key de Gemini:
1. Sacá tu clave gratis en **https://aistudio.google.com/app/apikey**.
2. En Netlify: *Site configuration → Environment variables* → agregá
   `GEMINI_API_KEY` con tu clave → redeploy.
3. Editá la info que usa el bot en `netlify/functions/chat.js` (constante `NEGOCIO`).

Si no ponés la key, el chat se ve pero contesta con un mensaje pidiendo escribir por WhatsApp.

## 🔗 Las demos

Las webs de muestra están en `demos/`. Se abren solas desde los botones
"Ver demo en vivo". Para agregar otra, poné su carpeta en `demos/` y sumá una
tarjeta en `index.html`.
