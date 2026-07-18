// Notifica por correo cuando alguien visita el sitio (máximo 1 vez cada 8h por visitante)
document.addEventListener("DOMContentLoaded", () => {
  const ACCESS_KEY = "6b8b1d8f-a203-43ec-bc20-795602a49702";
  const STORAGE_KEY = "lastVisitNotifySent";
  const THROTTLE_MS = 8 * 60 * 60 * 1000; // 8 horas

  const lastSent = localStorage.getItem(STORAGE_KEY);
  const now = Date.now();

  if (lastSent && now - parseInt(lastSent, 10) < THROTTLE_MS) {
    return; // Ya se notificó una visita de esta persona en las últimas 8h
  }

  const pageLang = document.documentElement.lang || "es";
  const pageUrl = window.location.href;
  const referrer = document.referrer || "Directo / desconocido";
  const timestamp = new Date().toLocaleString("es-CR", {
    timeZone: "America/Costa_Rica",
  });

  // Info del navegador / dispositivo (no requiere permisos del visitante)
  const deviceInfo = {
    userAgent: navigator.userAgent || "Desconocido",
    platform: navigator.platform || "Desconocido",
    screen: `${window.screen.width}x${window.screen.height}`,
    browserLang: navigator.language || "Desconocido",
  };

  // Geolocalización aproximada por IP (ciudad/región/país), sin pedir permiso al visitante
  fetch("https://ipwho.is/")
    .then((res) => res.json())
    .then((geo) => sendNotification(geo))
    .catch(() => sendNotification(null)); // Si falla la geolocalización, igual notificamos

  function sendNotification(geo) {
    const locationText =
      geo && geo.success !== false
        ? `${geo.city || "?"}, ${geo.region || "?"}, ${geo.country || "?"} (IP: ${geo.ip || "?"})`
        : "No se pudo determinar";

    const formData = new FormData();
    formData.append("access_key", ACCESS_KEY);
    formData.append("subject", "🔔 Alguien visitó tu portafolio");
    formData.append("from_name", "Notificador del sitio web");
    formData.append("page", pageUrl);
    formData.append("lang", pageLang);
    formData.append("referrer", referrer);
    formData.append("time", timestamp);
    formData.append("location", locationText);
    formData.append("device", deviceInfo.userAgent);
    formData.append(
      "message",
      `Alguien entró a tu portafolio.\n\n` +
        `Página: ${pageUrl}\n` +
        `Hora: ${timestamp}\n` +
        `Ubicación aproximada: ${locationText}\n` +
        `Referido desde: ${referrer}\n` +
        `Idioma del navegador: ${deviceInfo.browserLang}\n` +
        `Pantalla: ${deviceInfo.screen}\n` +
        `Dispositivo/navegador: ${deviceInfo.userAgent}`
    );

    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {Accept: "application/json"},
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem(STORAGE_KEY, String(now));
        }
      })
      .catch(() => {
        // Falla silenciosa: no queremos que un error acá afecte la navegación del visitante
      });
  }
});
