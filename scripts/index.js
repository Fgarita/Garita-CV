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

document.addEventListener("DOMContentLoaded", () => {
  const accordions = document.querySelectorAll(".accordion-title");
  let lastScrollPosition = 0; // Variable para guardar la posición de desplazamiento

  accordions.forEach((title) => {
    title.addEventListener("click", () => {
      const accordion = title.parentElement;

      if (!accordion.classList.contains("active")) {
        // Si se está abriendo el acordeón, guarda la posición de desplazamiento actual
        lastScrollPosition = window.scrollY;
      }

      // Alterna la clase activa del acordeón actual
      accordion.classList.toggle("active");

      // Cierra otros acordeones
      document.querySelectorAll(".accordion").forEach((otherAccordion) => {
        if (otherAccordion !== accordion) {
          otherAccordion.classList.remove("active");
        }
      });

      // Si el acordeón se cierra, restablece la posición de desplazamiento
      if (!accordion.classList.contains("active")) {
        window.scrollTo(0, lastScrollPosition);
      }
    });
  });
});

  // Lista de habilidades
  const skills = [
    'Scrum/Agile',
    'Git/GitHub (Intermediate)',
    'ASP.NET Core (Intermediate)',
    'XHTML (Intermediate)',
    'REST APIs (Intermediate)',
    '.NET Framework (Intermediate)',
    'ASP.NET MVC (Intermediate)',
    'Systems auditing (basic)',
    'Oracle Database (basic)',
    'ASP.NET Web API (Intermediate)',
    'LINQ (Intermediate)',
    'SQL Server Management Studio',
    'Web Design (Intermediate)',
    'Sqlserver (Intermediate)',
    'Data Structure (Intermediate)',
    'Requirements analysis (Intermediate)',
    'Mysql (Intermediate)',
    'Electronics',
    'CCNA2',
    'Data Warehouse (basic)',
    'Java Web Services (basic)',
    'Attention to Details',
    'Teamwork',
    'Troubleshooting',
    'Communication',
    'Microsoft Visual Studio Code',
    'Microsoft Visual Studio',
    'Power BI (basic)',
    'Operating systems: Windows, Linux',
    'Java (basic)',
    'HTML/CSS (intermediate)',
    'JavaScript (basic)',
    'SQL(intermediate)',
    'C# (intermediate)',
    'Kotlin (basic)',
    'PHP (basic)',
    'Java (basic)',
    'Ethical Hacker (Intermediate)',
    'Data Science (basic)',
    'Cybersecurity (basic)',
    'Networking (Intermediate)',
  ];

  // Función para agregar las habilidades al HTML
  function displaySkills() {
    const skillsListContainer = document.getElementById('skills-list');
    
    // Limpiar el contenedor antes de agregar nuevas habilidades
    skillsListContainer.innerHTML = '';

    // Recorrer la lista de habilidades y agregar cada una al contenedor
    skills.forEach(skill => {
      const skillItem = document.createElement('div');
      skillItem.classList.add('skills-item');
      skillItem.innerHTML = `<h2>${skill}</h2>`;
      skillsListContainer.appendChild(skillItem);
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

  // Mantén el mensaje inicial
  const initialMessage = "Send us a message";

  emailjs
    .send("service_bivy7f6", "template_sk3r8mj", parms)
    .then(function (response) {
      // Cambia el texto y estilo a éxito
      messageStatus.textContent = "Your message has been sent successfully!";
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
      messageStatus.textContent = "Failed to send the message. Please try again.";
      messageStatus.className = "status-message error";

      // Restaurar el mensaje inicial después de 5 segundos
      setTimeout(() => {
        messageStatus.textContent = initialMessage;
        messageStatus.className = "status-message";
      }, 5000);
    });
}

