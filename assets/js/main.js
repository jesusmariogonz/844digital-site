/* ==========================================================================
   844 Digital — main.js
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- Header on scroll ---------- */
  const header = document.querySelector(".site-header");
  const onScroll = () => {
    if (window.scrollY > 40) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const navToggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      navToggle.classList.toggle("is-open");
      mobileMenu.classList.toggle("is-open");
      document.body.style.overflow = mobileMenu.classList.contains("is-open") ? "hidden" : "";
    });
    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        navToggle.classList.remove("is-open");
        mobileMenu.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if (counters.length && "IntersectionObserver" in window) {
    const ioCount = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          ioCount.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => ioCount.observe(el));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    q.addEventListener("click", () => {
      const wasOpen = item.classList.contains("is-open");
      item.parentElement.querySelectorAll(".faq-item").forEach((i) => i.classList.remove("is-open"));
      if (!wasOpen) item.classList.add("is-open");
    });
  });

  /* ---------- Pricing toggle (contado / 3 pagos) ---------- */
  const toggleBtns = document.querySelectorAll(".pricing-toggle button");
  const priceEls = document.querySelectorAll("[data-price-onetime]");
  toggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const mode = btn.dataset.mode;
      priceEls.forEach((el) => {
        if (mode === "installments") {
          const per = Math.round(parseInt(el.dataset.priceOnetime, 10) * 1.12 / 3);
          el.innerHTML = `$${per.toLocaleString("es-MX")} <span>MXN x 3 pagos</span>`;
        } else {
          el.innerHTML = `$${parseInt(el.dataset.priceOnetime, 10).toLocaleString("es-MX")} <span>MXN pago único</span>`;
        }
      });
    });
  });

  /* ==========================================================================
     Cotizador interactivo
     ========================================================================== */
  const BASE_PRICES = {
    salud: 9000,
    restaurante: 8500,
    servicios: 7500,
    tienda: 15000,
    otro: 9500,
  };
  const ADDONS = {
    agenda: 6000,
    whatsapp: 4500,
    pagos: 5500,
    panel: 8000,
    idiomas: 3000,
  };
  const BUSINESS_LABELS = {
    salud: "Consultorio / clínica",
    restaurante: "Restaurante o café",
    servicios: "Servicios profesionales",
    tienda: "Tienda en línea",
    otro: "Negocio / corporativo",
  };
  const ADDON_LABELS = {
    agenda: "Agenda de citas propia",
    whatsapp: "Pedidos automatizados por WhatsApp",
    pagos: "Pagos en línea",
    panel: "Panel de administración a la medida",
    idiomas: "Sitio en varios idiomas",
  };

  const quoter = document.querySelector(".quoter");
  if (quoter) {
    let selectedBusiness = "salud";
    const selectedAddons = new Set();

    const businessInputs = quoter.querySelectorAll('input[name="business"]');
    const addonInputs = quoter.querySelectorAll('input[name="addon"]');
    const resultPrice = quoter.querySelector(".quoter-price");
    const resultNote = quoter.querySelector(".quoter-note");
    const waBtn = quoter.querySelector(".quoter-wa-btn");

    function recalc() {
      const base = BASE_PRICES[selectedBusiness];
      let addonSum = 0;
      selectedAddons.forEach((key) => { addonSum += ADDONS[key]; });
      let low = base + Math.round(addonSum * 0.8);
      let high = base + Math.round(addonSum * 1.3) + 4000;
      low = Math.round(low / 500) * 500;
      high = Math.round(high / 500) * 500;

      resultPrice.textContent = `$${low.toLocaleString("es-MX")} – $${high.toLocaleString("es-MX")}`;
      resultNote.textContent = `Estimado en pesos mexicanos (MXN) para un ${BUSINESS_LABELS[selectedBusiness].toLowerCase()}${selectedAddons.size ? " con " + [...selectedAddons].map(a => ADDON_LABELS[a].toLowerCase()).join(", ") : ""}. Cotización final tras una llamada de 15 minutos.`;

      const addonText = selectedAddons.size ? [...selectedAddons].map((a) => ADDON_LABELS[a]).join(", ") : "sin funciones adicionales";
      const message = `Hola 844 Digital, quiero cotizar un sitio para: ${BUSINESS_LABELS[selectedBusiness]}. Funciones: ${addonText}. Rango estimado en el sitio: $${low.toLocaleString("es-MX")} - $${high.toLocaleString("es-MX")} MXN.`;
      if (waBtn) waBtn.href = `https://wa.me/528440000000?text=${encodeURIComponent(message)}`;
    }

    businessInputs.forEach((input) => {
      input.addEventListener("change", () => {
        selectedBusiness = input.value;
        quoter.querySelectorAll('.pill-option[data-group="business"]').forEach(p => p.classList.remove("is-active"));
        input.closest(".pill-option").classList.add("is-active");
        recalc();
      });
    });
    addonInputs.forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) selectedAddons.add(input.value);
        else selectedAddons.delete(input.value);
        input.closest(".pill-option").classList.toggle("is-active", input.checked);
        recalc();
      });
    });

    recalc();
  }

  /* ---------- Year in footer ---------- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
