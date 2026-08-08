const hamburger = document.querySelector(
  ".header .nav-bar .nav-list .hamburger"
);
const mobile_menu = document.querySelector(".header .nav-bar .nav-list ul");
const menu_item = document.querySelectorAll(
  ".header .nav-bar .nav-list ul li a"
);
const header = document.querySelector(".header.container");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobile_menu.classList.toggle("active");
});

document.addEventListener("scroll", () => {
  var scroll_position = window.scrollY;
  if (scroll_position > 250) {
    header.style.backgroundColor = "#29323c";
  } else {
    header.style.backgroundColor = "transparent";
  }
});

menu_item.forEach((item) => {
  item.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    mobile_menu.classList.toggle("active");
  });
});

// --- Indicador de sección activa en el menú ---
(() => {
  const observedTargets = [];

  menu_item.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (target) observedTargets.push({link, target});
  });

  if (observedTargets.length === 0) return;

  const setActive = (targetEl) => {
    observedTargets.forEach(({link, target}) => {
      link.classList.toggle("active-link", target === targetEl);
    });
  };

  let suppressObserverUntil = 0;

  const observer = new IntersectionObserver(
    (entries) => {
      if (Date.now() < suppressObserverUntil) return; // scroll por clic en curso, no interferir
      // Elegimos la entrada visible más cercana a la parte superior del viewport
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length === 0) return;
      visible.sort(
        (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
      );
      setActive(visible[0].target);
    },
    {
      root: null,
      rootMargin: "-90px 0px -60% 0px",
      threshold: 0,
    }
  );

  observedTargets.forEach(({target}) => observer.observe(target));

  // Al hacer clic en un link del menú, marcarlo activo de inmediato
  // (no depender solo del observer, que puede tardar en "asentarse" durante el scroll suave)
  observedTargets.forEach(({link, target}) => {
    link.addEventListener("click", () => {
      setActive(target);
      suppressObserverUntil = Date.now() + 900; // duración aprox. del scroll suave
    });
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const accordions = document.querySelectorAll(".accordion-title");
  let lastScrollPosition = 0; // Variable para guardar la posición de desplazamiento
  accordions.forEach((title) => {
    title.addEventListener("click", () => {
      const accordion = title.closest(".accordion");
      if (!accordion) return;

      if (!accordion.classList.contains("active")) {
        // Si se está abriendo el acordeón, guarda la posición de desplazamiento actual
        lastScrollPosition = window.scrollY;
      }

      // Alterna la clase activa del acordeón actual
      accordion.classList.toggle("active");
      const isActive = accordion.classList.contains("active");
      title.setAttribute("aria-expanded", String(isActive));

      // Cierra otros acordeones (y su aria-expanded / clase active)
      document.querySelectorAll(".accordion").forEach((otherAccordion) => {
        if (otherAccordion !== accordion) {
          otherAccordion.classList.remove("active");
          const otherTitle = otherAccordion.querySelector(".accordion-title");
          if (otherTitle) otherTitle.setAttribute("aria-expanded", "false");
        }
      });

      // Si el acordeón se cierra, restablece la posición de desplazamiento
      if (!isActive) {
        window.scrollTo(0, lastScrollPosition);
      }
    });
  });
});

// Lista de habilidades: nombre, categoría y nivel (para el nuevo diseño con chips)
const skills = [
  {name: "C#", level: "intermediate", category: "backend"},
  {name: "ASP.NET Core", level: "intermediate", category: "backend"},
  {name: "ASP.NET MVC", level: "intermediate", category: "backend"},
  {name: ".NET Framework", level: "intermediate", category: "backend"},
  {name: "ASP.NET Web API", level: "intermediate", category: "backend"},
  {name: "REST APIs", level: "intermediate", category: "backend"},
  {name: "LINQ", level: "intermediate", category: "backend"},
  {name: "Java", level: "basic", category: "backend"},
  {name: "Java Web Services", level: "basic", category: "backend"},
  {name: "PHP", level: "basic", category: "backend"},
  {name: "Kotlin", level: "basic", category: "backend"},
  {name: "Data Structures", level: "intermediate", category: "backend"},

  {name: "SQL", level: "intermediate", category: "db"},
  {name: "SQL Server", level: "intermediate", category: "db"},
  {name: "SQL Server Management Studio", level: "intermediate", category: "db"},
  {name: "MySQL", level: "intermediate", category: "db"},
  {name: "Oracle Database", level: "basic", category: "db"},

  {name: "HTML/CSS", level: "intermediate", category: "frontend"},
  {name: "JavaScript", level: "basic", category: "frontend"},
  {name: "XHTML", level: "intermediate", category: "frontend"},
  {name: "Web Design", level: "intermediate", category: "frontend"},

  {name: "Networking", level: "intermediate", category: "network"},
  {name: "CCNA2", level: "intermediate", category: "network"},
  {name: "Cybersecurity", level: "basic", category: "network"},
  {name: "Ethical Hacker", level: "intermediate", category: "network"},
  {name: "Systems Auditing", level: "basic", category: "network"},

  {name: "Power BI", level: "basic", category: "data"},
  {name: "Data Science", level: "basic", category: "data"},
  {name: "Data Warehouse", level: "basic", category: "data"},
  {name: "Requirements Analysis", level: "intermediate", category: "data"},

  {name: "Git/GitHub", level: "intermediate", category: "tools"},
  {name: "Scrum/Agile", level: "intermediate", category: "tools"},
  {name: "Visual Studio", level: "intermediate", category: "tools"},
  {name: "Visual Studio Code", level: "intermediate", category: "tools"},
  {name: "Windows & Linux", level: "intermediate", category: "tools"},
  {name: "Electronics", level: "intermediate", category: "tools"},

  {name: "Attention to Detail", level: null, category: "soft"},
  {name: "Teamwork", level: null, category: "soft"},
  {name: "Troubleshooting", level: null, category: "soft"},
  {name: "Communication", level: null, category: "soft"},
];

// Categorías: clave interna -> etiquetas en inglés/español
const categories = [
  {key: "backend", en: "Backend & Frameworks", es: "Backend y Frameworks"},
  {key: "db", en: "Databases", es: "Bases de Datos"},
  {key: "frontend", en: "Frontend & Web", es: "Frontend y Web"},
  {key: "network", en: "Networking & Security", es: "Redes y Seguridad"},
  {key: "data", en: "Data & Analytics", es: "Datos y Analítica"},
  {key: "tools", en: "Tools & Practices", es: "Herramientas y Prácticas"},
  {key: "soft", en: "Soft Skills", es: "Habilidades Blandas"},
];

const levelLabels = {
  intermediate: {en: "Intermediate", es: "Intermedio"},
  basic: {en: "Basic", es: "Básico"},
};

// Función para agregar las habilidades al HTML, agrupadas por categoría
function displaySkills() {
  const skillsListContainer = document.getElementById("skills-list");
  if (!skillsListContainer) return;

  const isSpanish = document.documentElement.lang === "es";
  skillsListContainer.innerHTML = "";

  categories.forEach((cat) => {
    const items = skills.filter((s) => s.category === cat.key);
    if (items.length === 0) return;

    const group = document.createElement("div");
    group.classList.add("skills-category");

    const title = document.createElement("h3");
    title.textContent = isSpanish ? cat.es : cat.en;
    group.appendChild(title);

    const chipsWrap = document.createElement("div");
    chipsWrap.classList.add("skills-chips");

    items.forEach((skill) => {
      const chip = document.createElement("span");
      chip.classList.add("skill-chip");
      if (skill.level) chip.classList.add(`level-${skill.level}`);

      if (skill.level) {
        const dot = document.createElement("i");
        dot.classList.add("skill-dot");
        const levelText = levelLabels[skill.level][isSpanish ? "es" : "en"];
        dot.title = levelText;
        chip.appendChild(dot);
      }

      chip.appendChild(document.createTextNode(skill.name));
      chipsWrap.appendChild(chip);
    });

    group.appendChild(chipsWrap);
    skillsListContainer.appendChild(group);
  });
}

// Llamar a la función para mostrar las habilidades
displaySkills();

function sendMail(event) {
  event.preventDefault(); // Evita el comportamiento predeterminado del formulario

  let parms = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    subject: document.getElementById("subject").value,
    message: document.getElementById("message").value,
  };

  // Selecciona el elemento <h2> para mostrar los mensajes
  const messageStatus = document.getElementById("message-status");

  // Detecta el idioma de la página para mostrar los mensajes correctos
  const isSpanish = document.documentElement.lang === "es";
  const initialMessage = isSpanish ? "Envíame un mensaje" : "Send us a message";
  const successMessage = isSpanish
    ? "¡Tu mensaje fue enviado con éxito!"
    : "Your message has been sent successfully!";
  const errorMessage = isSpanish
    ? "No se pudo enviar el mensaje. Por favor intentá de nuevo."
    : "Failed to send the message. Please try again.";

  emailjs
    .send("service_bivy7f6", "template_sk3r8mj", parms)
    .then(function (response) {
      // Cambia el texto y estilo a éxito
      messageStatus.textContent = successMessage;
      messageStatus.className = "status-message success";

      // Limpiar el formulario
      document.getElementById("form").reset();

      // Restaurar el mensaje inicial después de 5 segundos
      setTimeout(() => {
        messageStatus.textContent = initialMessage;
        messageStatus.className = "status-message";
      }, 5000);
    })
    .catch(function (error) {
      // Cambia el texto y estilo a error
      messageStatus.textContent = errorMessage;
      messageStatus.className = "status-message error";

      // Restaurar el mensaje inicial después de 5 segundos
      setTimeout(() => {
        messageStatus.textContent = initialMessage;
        messageStatus.className = "status-message";
      }, 5000);
    });
}

// --- Modo oscuro ---
(() => {
  const root = document.documentElement;
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  const icon = toggleBtn.querySelector("i");

  const applyTheme = (theme) => {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      icon.className = "fa-solid fa-sun";
    } else {
      root.removeAttribute("data-theme");
      icon.className = "fa-solid fa-moon";
    }
  };

  const saved = localStorage.getItem("theme");
  if (saved === "dark") {
    applyTheme("dark");
  }
  // Si no hay preferencia guardada, siempre inicia en modo claro
  // (ya no se detecta automáticamente el modo oscuro del sistema operativo)

  toggleBtn.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem("theme", next);
  });
})();
