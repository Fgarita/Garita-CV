document.addEventListener("DOMContentLoaded", () => {
  const chatIcon = document.getElementById("chatbot-icon");
  const chatBox = document.getElementById("chatbot-box");
  const closeChat = document.getElementById("close-chat");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  // Presentar el chatbot automáticamente al cargar
  // El chatbot inicia oculto
  chatBox.style.display = "none";

  // --- Abrir chatbot al hacer clic en el ícono ---
  chatIcon.addEventListener("click", () => {
    chatBox.style.display = "flex";
    greetUser(); // Saludo solo al abrir
  });

  // --- Cerrar chatbot al hacer clic en ✖ ---
  closeChat.addEventListener("click", () => {
    chatBox.style.display = "none";
    messages.innerHTML = ""; // Limpia el historial
  });

  // --- Enviar mensaje con botón o Enter ---
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // --- Función de saludo ---
  function greetUser() {
    appendMessage(
      "¡Hola! Soy el chatbot de José Garita. ¿En qué le puedo ayudar? / Hello! I am José Garita's chatbot. How can I help you?",
      "bot"
    );
  }

  function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;
    appendMessage(text, "user");
    input.value = "";

    setTimeout(() => {
      const lang = detectLanguage(text);
      const response = getBotResponse(text, lang);
      appendMessage(response, "bot");
    }, 600);
  }

  function appendMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add(
      "message",
      sender === "user" ? "user-message" : "bot-message"
    );
    msg.textContent = text;
    messages.appendChild(msg);
    messages.scrollTop = messages.scrollHeight;
  }

  // --- Función para detectar el idioma según palabras comunes ---
  // --- Función para detectar el idioma del texto ---
  function detectLanguage(text) {
    const normalized = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Palabras comunes de español e inglés
    const spanishKeywords =
      /hola|buenas|gracias|adios|perfil|experiencia|educacion|habilidades|proyectos|certificaciones|idiomas|contacto|como estas|quien eres|presentate|ayuda|soporte|trabajo/;
    const englishKeywords =
      /hello|hi|thanks|bye|profile|experience|education|skills|projects|certifications|languages|contact|how are you|who are you|help|support|job/;

    // Reglas de detección
    if (englishKeywords.test(normalized)) return "en";
    if (spanishKeywords.test(normalized)) return "es";

    // Si detecta muchas palabras en inglés (por letras o estructura)
    if (/you|the|and|is|my|in|for|to|about/.test(normalized)) return "en";
    // Si detecta estructura propia del español
    if (/el |la |los |las |un |una |de |en |por |para/.test(normalized))
      return "es";

    // Por defecto, español
    return "es";
  }

  // --- Función principal del chatbot ---
  function getBotResponse(input) {
    const normalizeText = (text) =>
      text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[.,!?¿¡]/g, "")
        .trim();

    const text = normalizeText(input);
    const lang = detectLanguage(text); // <<--- aquí se usa correctamente

    // --- Respuestas ---
    const responses = {
      es: {
        saludo:
          "Hola, soy el chatbot de José Garita 🤖. ¿En qué le puedo ayudar?",
        chatbot:
          "Soy el asistente virtual de José Francisco Garita Sánchez. Fui creado para compartir información sobre su perfil profesional, experiencia y habilidades.",
        presentacion:
          "José Francisco Garita Sánchez es un Ingeniero en Sistemas graduado de la Universidad Fidélitas. Se especializa en desarrollo de software, soporte técnico y análisis de datos.",
        experiencia:
          "Ha trabajado como desarrollador de software en Vettel Car Wash y en la Asociación Comedor Infantil Cosechando Sonrisas, desarrollando sistemas y brindando soporte técnico.",
        educacion:
          "Obtuvo su Bachillerato en Ingeniería en Sistemas de la Universidad Fidélitas.",
        habilidades:
          "Posee conocimientos en C#, JavaScript, Java, PHP, Python, .NET, ASP.NET Core, HTML, CSS, React, SQL Server, MySQL y SQLite. También domina fundamentos de redes, soporte técnico y ciberseguridad.",
        proyectos:
          "Proyectos destacados: Portafolio Web, CRUD en C++ y SQLite, Password Manager en Python con cifrado AES y Tkinter, y Contact Company Jobs con Google Sheets API y DataTables.js.",
        certificaciones:
          "Certificaciones Cisco: CCNA Switching, Routing & Wireless Essentials, Networking Basics, Introduction to Cybersecurity, JavaScript Essentials, Ethical Hacker e Introduction to Data Science.",
        idiomas: "Habla español nativo e inglés intermedio (B1).",
        contacto:
          "Tel: 83-61-73-99 📞 | Email: frangarita@outlook.com ✉️ | LinkedIn: linkedin.com/in/jose-garita-sanchez | GitHub: fgarita.github.io/Garita-CV/",
        despedida: "¡Fue un gusto hablar contigo! 😊",
        desconocido:
          "No entiendo tu pregunta 🤔. Puedes preguntarme sobre el perfil, experiencia, educación, habilidades, proyectos, certificaciones, idiomas o contacto.",
      },
      en: {
        saludo: "Hello! I'm José Garita's chatbot 🤖. How can I help you?",
        chatbot:
          "I'm the virtual assistant of José Francisco Garita Sánchez. I was created to share information about his professional background, experience, and skills.",
        presentacion:
          "José Francisco Garita Sánchez is a Computer Systems Engineer graduated from Universidad Fidélitas. He specializes in software development, technical support, and data analysis.",
        experiencia:
          "He has worked as a software developer at Vettel Car Wash and Asociación Comedor Infantil Cosechando Sonrisas, developing systems and providing technical support.",
        educacion:
          "He holds a Bachelor's degree in Computer Systems Engineering from Universidad Fidélitas.",
        habilidades:
          "His skills include C#, JavaScript, Java, PHP, Python, .NET, ASP.NET Core, HTML, CSS, React, SQL Server, MySQL, and SQLite, as well as networking, IT support, and cybersecurity.",
        proyectos:
          "Highlighted projects: Web Portfolio, CRUD in C++ & SQLite, Password Manager in Python with AES & Tkinter, and Contact Company Jobs using Google Sheets API & DataTables.js.",
        certificaciones:
          "Cisco Certifications: CCNA Switching, Routing & Wireless Essentials, Networking Basics, Introduction to Cybersecurity, JavaScript Essentials, Ethical Hacker, and Introduction to Data Science.",
        idiomas: "He speaks native Spanish and intermediate English (B1).",
        contacto:
          "Phone: 83-61-73-99 📞 | Email: frangarita@outlook.com ✉️ | LinkedIn: linkedin.com/in/jose-garita-sanchez | GitHub: fgarita.github.io/Garita-CV/",
        despedida: "It was nice talking to you! 😊",
        desconocido:
          "I don't understand your question 🤔. You can ask me about his profile, experience, education, skills, projects, certifications, languages, or contact.",
      },
    };

    // --- Coincidencias flexibles ---
    const patterns = [
      {regex: /hola|buenas|saludos|hey|hello|hi|how are you/, resp: "saludo"},
      {
        regex:
          /quien eres tu|quien sos|que eres|eres un bot|chatbot|asistente|assistant|bot|ai|artificial|robot/,
        resp: "chatbot",
      },
      {
        regex:
          /quien es jose|presentate|hablame de ti|perfil|profile|introduce|about jose|who is jose|who are you/,
        resp: "presentacion",
      },
      {
        regex:
          /experiencia|trabaj|emple|puesto|labora|carrera|job|experience|developer|work|position|career/,
        resp: "experiencia",
      },
      {
        regex:
          /educacion|universidad|estudio|grado|titulo|bachiller|education|university|degree|studies/,
        resp: "educacion",
      },
      {
        regex:
          /habilidad|skill|tecnolog|lenguaj|programa|framework|red|soporte|network|support|tools|capacidad/,
        resp: "habilidades",
      },
      {
        regex:
          /proyecto|portfolio|portafolio|cv|aplicacion|sistema|projects|applications|work/,
        resp: "proyectos",
      },
      {
        regex:
          /certificacion|certificado|cisco|ccna|hacker|data science|certifications|certificate/,
        resp: "certificaciones",
      },
      {
        regex: /idioma|ingles|english|spanish|languages|bilingue|language/,
        resp: "idiomas",
      },
      {
        regex: /contacto|correo|email|telefono|linked|github|contact|phone/,
        resp: "contacto",
      },
      {
        regex: /gracias|adios|bye|thank|hasta luego|nos vemos|see you/,
        resp: "despedida",
      },
    ];

    // --- Coincidencia flexible ---
    for (const p of patterns) {
      if (p.regex.test(text)) return responses[lang][p.resp];
    }

    return responses[lang].desconocido;
  }
});
