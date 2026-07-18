document.addEventListener("DOMContentLoaded", () => {
  const chatIcon = document.getElementById("chatbot-icon");
  const chatBox = document.getElementById("chatbot-box");
  const closeChat = document.getElementById("close-chat");
  const sendBtn = document.getElementById("chatbot-send");
  const input = document.getElementById("chatbot-input");
  const messages = document.getElementById("chatbot-messages");

  // Recuerda el último idioma detectado para no "perder" el idioma
  // en mensajes cortos como "si", "ok", "gracias", etc.
  let lastLang = "es";
  let closeTimeoutId = null;

  // --- Abrir chatbot al hacer clic en el ícono ---
  chatIcon.addEventListener("click", () => {
    // Si había un cierre pendiente (que borraría los mensajes), lo cancelamos
    if (closeTimeoutId) {
      clearTimeout(closeTimeoutId);
      closeTimeoutId = null;
    }
    chatBox.classList.remove("closing");
    chatBox.classList.add("open");
    if (messages.children.length === 0) {
      showTyping();
      setTimeout(() => {
        hideTyping();
        greetUser();
        setTimeout(showSuggestions, 350);
      }, 600);
    }
  });

  // --- Cerrar chatbot al hacer clic en ✖ ---
  closeChat.addEventListener("click", () => {
    chatBox.classList.remove("open");
    chatBox.classList.add("closing");
    closeTimeoutId = setTimeout(() => {
      // Solo limpiamos si el chat sigue cerrado (no se volvió a abrir mientras tanto)
      if (!chatBox.classList.contains("open")) {
        chatBox.classList.remove("closing");
        messages.innerHTML = ""; // Limpia el historial
      }
      closeTimeoutId = null;
    }, 220);
  });

  // --- Enviar mensaje con botón o Enter ---
  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // --- Función de saludo ---
  function greetUser() {
    appendMessage(
      "¡Hola! Soy el asistente de José Garita 🤖. Podés preguntarme sobre su experiencia, educación, certificados, proyectos, habilidades, disponibilidad o cómo contactarlo. / Hi! I'm José Garita's assistant 🤖. Ask me about his experience, education, certifications, projects, skills, availability, or how to reach him.",
      "bot"
    );
  }

  // --- Chips de sugerencias rápidas ---
  function showSuggestions() {
    const chips = ["Experiencia", "Proyectos", "Certificados", "Contacto"];

    const wrap = document.createElement("div");
    wrap.classList.add("chatbot-suggestions");
    chips.forEach((label) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.classList.add("chatbot-chip");
      btn.textContent = label;
      btn.addEventListener("click", () => {
        appendMessage(label, "user");
        wrap.remove();
        showTyping();
        setTimeout(() => {
          hideTyping();
          const detected = detectLanguage(label);
          lastLang = detected;
          appendMessage(getBotResponse(label, detected), "bot");
        }, 600);
      });
      wrap.appendChild(btn);
    });
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }

  function sendMessage() {
    const text = input.value.trim();
    if (text === "") return;
    appendMessage(text, "user");
    input.value = "";

    // Quita cualquier chip de sugerencias que haya quedado sin usar
    const oldChips = messages.querySelector(".chatbot-suggestions");
    if (oldChips) oldChips.remove();

    showTyping();
    setTimeout(() => {
      hideTyping();
      const lang = detectLanguage(text);
      lastLang = lang;
      const response = getBotResponse(text, lang);
      appendMessage(response, "bot");
    }, 700);
  }

  function showTyping() {
    const typing = document.createElement("div");
    typing.classList.add("typing-indicator");
    typing.id = "typing-indicator";
    typing.innerHTML = "<span></span><span></span><span></span>";
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const typing = document.getElementById("typing-indicator");
    if (typing) typing.remove();
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

  // --- Función para detectar el idioma del texto ---
  function detectLanguage(text) {
    const normalized = text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Mensajes muy cortos ("si", "ok", "gracias") no alcanzan para
    // detectar idioma de forma confiable: se mantiene el último usado.
    if (normalized.split(/\s+/).length <= 1 && normalized.length <= 4) {
      return lastLang;
    }

    const spanishKeywords =
      /hola|buenas|gracias|adios|perfil|experiencia|educacion|habilidades|proyectos|certificacion|idiomas|contacto|como estas|quien eres|presentate|ayuda|soporte|trabajo|disponib|salario|donde vive|edad|ingles|espanol|universidad|celular|whatsapp|correo/;
    const englishKeywords =
      /hello|hi there|thanks|bye|profile|experience|education|skills|projects|certification|languages|contact|how are you|who are you|help|support|job|available|salary|where does he live|age|english|spanish|university|phone|whatsapp|email/;

    if (englishKeywords.test(normalized)) return "en";
    if (spanishKeywords.test(normalized)) return "es";
    if (
      /\byou\b|\bthe\b|\band\b|\bis\b|\bmy\b|\bin\b|\bfor\b|\bto\b|\babout\b|\bwhat\b|\bwho\b|\bdoes\b/.test(
        normalized
      )
    )
      return "en";
    if (
      /\bel \b|\bla \b|\blos \b|\blas \b|\bun \b|\buna \b|\bde \b|\ben \b|\bpor \b|\bpara \b|\bque \b|\bquien\b/.test(
        normalized
      )
    )
      return "es";

    return lastLang;
  }

  // --- Función principal del chatbot ---
  function getBotResponse(rawInput, lang) {
    const normalizeText = (text) =>
      text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[.,!?¿¡]/g, "")
        .trim();

    const text = normalizeText(rawInput);

    const responses = {
      es: {
        saludo:
          "¡Hola! ¿En qué te puedo ayudar? Podés preguntarme sobre su experiencia, estudios, certificados, proyectos, habilidades o contacto.",
        chatbot:
          "Soy el asistente virtual del portafolio de José Francisco Garita Sánchez. Puedo contarte sobre su perfil profesional, formación, certificaciones, proyectos y cómo contactarlo. No soy José: si necesitás hablar con él directamente, escribile por WhatsApp o correo.",
        presentacion:
          "José Francisco Garita Sánchez es Ingeniero en Sistemas Computacionales, egresado de la Universidad Fidélitas. Le atraen especialmente las partes de un sistema que nadie ve: la lógica backend que sostiene todo por detrás. Su stack más fuerte es C# y el ecosistema .NET (ASP.NET Core, SQL Server), y también tiene experiencia en redes y ciberseguridad (CCNA, Ethical Hacking).",
        objetivo:
          "Busca desarrollarse en la industria tecnológica aplicando sus conocimientos en desarrollo de software, bases de datos y redes, especializándose en backend y arquitectura de software, y sigue ampliando conocimientos en ciberseguridad, automatización y análisis de datos.",
        experiencia:
          "Tiene dos experiencias principales: Backend Developer en su proyecto final de carrera para Vettel Car Wash (un sistema de gestión de citas, inventario y finanzas hecho en C#/.NET Framework y SQL Server), y Analista de Sistemas en un servicio comunitario de 150 horas para la Asociación Comedor Infantil Cosechando Sonrisas, diseñando la base de un sistema de inventario. ¿Querés que te cuente más de alguno de los dos?",
        educacion:
          "Es Bachiller en Ingeniería en Sistemas Computacionales por la Universidad Fidélitas (2019-2024).",
        habilidades:
          "Su stack principal es C# y .NET (ASP.NET Core, ASP.NET MVC, SQL Server). También trabaja con JavaScript, Python, HTML/CSS, y tiene formación en redes (CCNA), ciberseguridad (Ethical Hacking), análisis de datos con Power BI, y herramientas como GitHub y Jira.",
        certificaciones:
          "Certificaciones de Cisco: CCNA Switching, Routing & Wireless Essentials (2021), Networking Basics (2024), Introduction to Cybersecurity (2024), JavaScript Essentials 1 (2024), Introduction to Data Science (2024) y Ethical Hacker (2024). Además tiene la CCNA Routing and Switching: Introduction to Networks y un certificado de inglés nivel 4 (Universidad Fidélitas, 2024).",
        aprendiendo:
          "Ahora mismo está enfocado en mejorar su inglés avanzado, con miras a comunicarse mejor con equipos técnicos internacionales.",
        proyectos:
          "Tiene 6 proyectos en su portafolio: este mismo sitio web (CV interactivo), el sistema de gestión Web Sigma (su proyecto final de carrera, en C#/ASP.NET MVC), un CRUD en C++ con SQLite, un Password Manager en Python con cifrado AES, una app de servicio comunitario, y Contact Company Jobs (una app web con Google Sheets API y DataTables.js). ¿Sobre cuál querés saber más?",
        proyecto_sigma:
          "Web Sigma es su proyecto final de carrera: un sistema de gestión de citas para un lavado de autos, con 4 módulos (agendado, gestión de citas, inventario y finanzas). José estuvo a cargo del backend en C# y ASP.NET MVC, con base de datos en SQL Server.",
        proyecto_password:
          "Password Manager es un gestor de contraseñas de escritorio hecho en Python. Guarda las credenciales cifradas con AES, protege la clave con variables de entorno, y tiene interfaz gráfica en Tkinter, empaquetado como ejecutable con PyInstaller.",
        proyecto_crud:
          "El CRUD en C++ es una aplicación de consola que usa SQLite para operaciones completas de Crear, Leer, Actualizar y Eliminar, con validación de ID y creación automática de tablas.",
        idiomas:
          "Habla español nativo, y está en proceso de fortalecer su inglés (actualmente nivel intermedio-avanzado, estudiando para mejorar su fluidez técnica).",
        ubicacion: "Vive en Heredia, Costa Rica.",
        disponibilidad:
          "Para consultas sobre disponibilidad laboral, lo mejor es escribirle directo por WhatsApp o correo — él te puede confirmar su situación actual con más detalle del que yo tengo.",
        salario:
          "Ese tipo de detalles (pretensión salarial, tarifas, etc.) los conversa José directamente. Te recomiendo escribirle por WhatsApp o correo.",
        contacto:
          "📞 Teléfono/WhatsApp: +506 8361-7399\n✉️ Correo: frangarita@outlook.com\n💼 LinkedIn: linkedin.com/in/jose-garita-sanchez\n💻 GitHub: github.com/Fgarita\n📍 Heredia, Costa Rica",
        despedida:
          "¡Fue un gusto ayudarte! Si tenés más preguntas, seguí escribiendo. 😊",
        agradecimiento: "¡De nada! ¿Hay algo más que quieras saber sobre José?",
        chiste:
          "Ja, no tengo chistes propios, pero puedo contarte algo bueno de verdad: José una vez pasó 150 horas de trabajo voluntario diseñando un sistema de inventario para una organización sin fines de lucro 🙂",
        desconocido:
          "No estoy seguro de haber entendido eso 🤔. Puedo hablarte sobre su perfil, experiencia, educación, certificados, proyectos, habilidades, en qué está aprendiendo ahora, o cómo contactarlo. ¿Sobre cuál te gustaría saber?",
      },
      en: {
        saludo:
          "Hi! How can I help? You can ask about his experience, education, certifications, projects, skills, or contact info.",
        chatbot:
          "I'm the virtual assistant for José Francisco Garita Sánchez's portfolio. I can tell you about his professional background, education, certifications, projects, and how to reach him. I'm not José himself — for a direct conversation, reach out via WhatsApp or email.",
        presentacion:
          "José Francisco Garita Sánchez is a Computer Systems Engineering graduate from Universidad Fidélitas. He's drawn to the parts of a system nobody sees — the backend logic that holds everything together. His strongest stack is C# and the .NET ecosystem (ASP.NET Core, SQL Server), with additional experience in networking and cybersecurity (CCNA, Ethical Hacking).",
        objetivo:
          "He's focused on growing in the tech industry through software development, databases and networking, specializing in backend and software architecture, while continuing to build skills in cybersecurity, automation and data analysis.",
        experiencia:
          "He has two main experiences: Backend Developer for his capstone project at Vettel Car Wash (an appointment, inventory and financial management system built in C#/.NET Framework and SQL Server), and Systems Analyst for a 150-hour community service project with Asociación Comedor Infantil Cosechando Sonrisas, designing the foundation of an inventory system. Want to hear more about either one?",
        educacion:
          "He holds a Bachelor's degree in Computer Systems Engineering from Universidad Fidélitas (2019-2024).",
        habilidades:
          "His main stack is C# and .NET (ASP.NET Core, ASP.NET MVC, SQL Server). He also works with JavaScript, Python, HTML/CSS, and has training in networking (CCNA), cybersecurity (Ethical Hacking), data analysis with Power BI, and tools like GitHub and Jira.",
        certificaciones:
          "Cisco certifications: CCNA Switching, Routing & Wireless Essentials (2021), Networking Basics (2024), Introduction to Cybersecurity (2024), JavaScript Essentials 1 (2024), Introduction to Data Science (2024), and Ethical Hacker (2024). He also holds CCNA Routing and Switching: Introduction to Networks and an English Level 4 certificate (Universidad Fidélitas, 2024).",
        aprendiendo:
          "Right now he's focused on advancing his English, aiming for stronger fluency for technical communication with international teams.",
        proyectos:
          "He has 6 projects in his portfolio: this website itself (interactive resume), the Web Sigma management system (his capstone project, built in C#/ASP.NET MVC), a CRUD app in C++ with SQLite, a Password Manager in Python with AES encryption, a community-service inventory project, and Contact Company Jobs (a web app using the Google Sheets API and DataTables.js). Want details on any of them?",
        proyecto_sigma:
          "Web Sigma is his capstone project: an appointment management system for a car wash business, covering 4 modules (booking, appointment management, inventory and financials). José owned the backend in C# and ASP.NET MVC, with a SQL Server database.",
        proyecto_password:
          "Password Manager is a desktop app built in Python. It stores credentials AES-encrypted, keeps the key out of the codebase using environment variables, and has a Tkinter GUI, packaged as a standalone executable with PyInstaller.",
        proyecto_crud:
          "The CRUD in C++ is a console app using SQLite for full Create, Read, Update and Delete operations, with ID validation and automatic table creation.",
        idiomas:
          "He's a native Spanish speaker and is actively working on strengthening his English (currently intermediate-advanced, studying to improve technical fluency).",
        ubicacion: "He lives in Heredia, Costa Rica.",
        disponibilidad:
          "For questions about his current availability, it's best to reach out directly via WhatsApp or email — he can confirm his current status with more detail than I have.",
        salario:
          "Details like salary expectations or rates are best discussed with José directly. I'd recommend reaching out via WhatsApp or email.",
        contacto:
          "📞 Phone/WhatsApp: +506 8361-7399\n✉️ Email: frangarita@outlook.com\n💼 LinkedIn: linkedin.com/in/jose-garita-sanchez\n💻 GitHub: github.com/Fgarita\n📍 Heredia, Costa Rica",
        despedida:
          "It was great helping you! Feel free to ask anything else. 😊",
        agradecimiento:
          "You're welcome! Anything else you'd like to know about José?",
        chiste:
          "Ha, I don't have jokes of my own, but here's something genuinely cool: José once spent 150 volunteer hours designing an inventory system for a non-profit 🙂",
        desconocido:
          "I'm not sure I understood that 🤔. I can talk about his profile, experience, education, certifications, projects, skills, what he's currently learning, or how to contact him. Which one would you like?",
      },
    };

    const patterns = [
      {
        regex:
          /^(hola+|buenas|saludos|hey|hello|hi there|que tal|buenos dias|buenas tardes|buenas noches)\b/,
        resp: "saludo",
      },
      {regex: /gracias|thank/, resp: "agradecimiento"},
      {regex: /chiste|joke|cuenta algo divertido|funny/, resp: "chiste"},
      {
        regex:
          /quien eres tu|quien sos|que eres|eres un bot|chatbot|asistente virtual|eres una ia|are you (a |an )?(bot|ai|robot)|artificial intelligence/,
        resp: "chatbot",
      },
      {
        regex:
          /quien es jose|presentate|hablame de (el|ti)|preséntame a jose|cuentame sobre (el|jose)|about jose|who is jose|tell me about (him|jose)|introduce (him|yourself)/,
        resp: "presentacion",
      },
      {
        regex:
          /objetivo|meta profesional|que busca|goal|career objective|what does he want/,
        resp: "objetivo",
      },
      {
        regex: /vettel|car wash|lavado de autos/,
        resp: "experiencia",
      },
      {
        regex:
          /experiencia|trabaj|emple|puesto|labora|carrera laboral|job experience|work experience|developer role|position|career history/,
        resp: "experiencia",
      },
      {
        regex:
          /educacion|universidad|estudio|grado academico|titulo|bachiller|fidelitas|education|university|degree|studies|academic/,
        resp: "educacion",
      },
      {
        regex:
          /habilidad|skill|tecnolog|lenguaje de programacion|stack|framework|programa(cion)?|red(es)?\b|soporte tecnico|network|it support|tools|capacidad tecnica/,
        resp: "habilidades",
      },
      {
        regex: /web sigma|sigma project|proyecto (final|sigma)/,
        resp: "proyecto_sigma",
      },
      {
        regex: /password manager|gestor de contrasen/,
        resp: "proyecto_password",
      },
      {
        regex: /crud.*c\+\+|c\+\+.*crud|sqlite.*c\+\+/,
        resp: "proyecto_crud",
      },
      {
        regex:
          /proyecto|portfolio|portafolio|aplicacion|sistema que (hizo|desarrollo|construyo)|projects|applications built|what has he built/,
        resp: "proyectos",
      },
      {
        regex:
          /certificacion|certificado|cisco|ccna|ethical hacker|data science cert|ingles b1|english certificate|certifications|certificate/,
        resp: "certificaciones",
      },
      {
        regex:
          /aprendiendo|estudiando ahora|currently learning|learning now|studying right now/,
        resp: "aprendiendo",
      },
      {
        regex:
          /idioma|habla ingles|nivel de ingles|speaks english|english level|bilingue|language(s)?\b/,
        resp: "idiomas",
      },
      {
        regex:
          /donde vive|de donde es|ubicacion|ciudad|pais|where does he live|located|based in|location/,
        resp: "ubicacion",
      },
      {
        regex:
          /disponib|busca trabajo|esta buscando empleo|available for work|open to work|looking for a job|hiring/,
        resp: "disponibilidad",
      },
      {
        regex:
          /salario|cuanto cobra|tarifa|pretension salarial|salary|rate|how much does he charge/,
        resp: "salario",
      },
      {
        regex:
          /contacto|correo|email|telefono|numero|whatsapp|linked ?in|github\.com|contact|phone number|reach him|get in touch/,
        resp: "contacto",
      },
      {
        regex: /adios|hasta luego|nos vemos|bye|see you|goodbye|farewell/,
        resp: "despedida",
      },
    ];

    for (const p of patterns) {
      if (p.regex.test(text)) return responses[lang][p.resp];
    }

    return responses[lang].desconocido;
  }
});
