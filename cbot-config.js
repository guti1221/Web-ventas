/* Config del chatbot de TU web de ventas.
   (Solo lo visual y los textos. La info que usa la IA está en
   netlify/functions/chat.js) */
window.CHATBOT_CONFIG = {
  endpoint: "/.netlify/functions/chat",

  businessName: "Estudio Web",
  title: "Asistente de Estudio Web",
  subtitle: "Te respondo al instante",
  welcomeMessage:
    "¡Hola! 👋 Soy el asistente de Estudio Web. Te puedo contar sobre los planes, precios y tiempos para tu web. ¿Qué querés saber?",
  placeholder: "Escribí tu mensaje...",
  suggestions: ["¿Cuánto sale una web?", "¿Cuánto tardás?", "¿Qué incluye?"],

  colors: {
    primary: "#7c5cff",
    primaryText: "#0a0a0f",
    userBubble: "#7c5cff",
    userText: "#0a0a0f",
    botBubble: "#1b1b26",
    botText: "#f2f2f5",
    windowBg: "#14141c",
    headerBg: "#0a0a0f",
  },
  position: "right",
};
