// Interações progressivas: a navegação por âncoras continua funcionando sem JavaScript.
document.documentElement.classList.add("js-ready");

// Track the pointer only inside Section 01 and only when motion is allowed.
(() => {
  const section = document.querySelector(".intro");
  if (!section || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const cards = [...section.querySelectorAll(".intro-benefits li")];
  let sectionFrame = 0;
  let pointerX = 0;
  let pointerY = 0;

  const clearLights = () => {
    section.classList.remove("is-pointer-lit");
    cards.forEach((card) => card.classList.remove("is-card-lit"));
  };

  const onSectionPointerMove = (event) => {
    if (reducedMotion.matches || event.pointerType !== "mouse") return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (sectionFrame) return;

    sectionFrame = window.requestAnimationFrame(() => {
      sectionFrame = 0;
      if (reducedMotion.matches || !section.matches(":hover")) return;
      const bounds = section.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((pointerX - bounds.left) / bounds.width) * 100));
      const y = Math.max(0, Math.min(100, ((pointerY - bounds.top) / bounds.height) * 100));
      section.style.setProperty("--intro-pointer-x", `${x}%`);
      section.style.setProperty("--intro-pointer-y", `${y}%`);
      section.classList.add("is-pointer-lit");
    });
  };

  section.addEventListener("pointermove", onSectionPointerMove, { passive: true });
  section.addEventListener("pointerleave", () => {
    if (sectionFrame) window.cancelAnimationFrame(sectionFrame);
    sectionFrame = 0;
    clearLights();
  }, { passive: true });

  cards.forEach((card) => {
    let cardFrame = 0;
    let cardX = 0;
    let cardY = 0;

    card.addEventListener("pointermove", (event) => {
      if (reducedMotion.matches || event.pointerType !== "mouse") return;
      cardX = event.clientX;
      cardY = event.clientY;
      if (cardFrame) return;

      cardFrame = window.requestAnimationFrame(() => {
        cardFrame = 0;
        if (reducedMotion.matches || !card.matches(":hover")) return;
        const bounds = card.getBoundingClientRect();
        const x = Math.max(0, Math.min(100, ((cardX - bounds.left) / bounds.width) * 100));
        const y = Math.max(0, Math.min(100, ((cardY - bounds.top) / bounds.height) * 100));
        card.style.setProperty("--card-pointer-x", `${x}%`);
        card.style.setProperty("--card-pointer-y", `${y}%`);
        card.classList.add("is-card-lit");
      });
    }, { passive: true });

    card.addEventListener("pointerleave", () => {
      if (cardFrame) window.cancelAnimationFrame(cardFrame);
      cardFrame = 0;
      card.classList.remove("is-card-lit");
    }, { passive: true });
  });

  const onMotionPreferenceChange = (event) => {
    if (event.matches) clearLights();
  };
  if (typeof reducedMotion.addEventListener === "function") {
    reducedMotion.addEventListener("change", onMotionPreferenceChange);
  } else {
    reducedMotion.addListener(onMotionPreferenceChange);
  }
})();

// Reveal key content as it enters the viewport, with a safe no-motion fallback.
(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

  const groups = [
    [".intro > .section-kicker, .intro-grid", 0, "up"],
    [".intro-benefits li", 70, "up"],
    [".services .section-heading > div", 0, "left"],
    [".services .section-heading > p", 0, "right"],
    [".service-card", 70, "up"],
    [".service-disclaimer", 0, "right"],
    [".process-inner", 0, "left"],
    [".process-side", 80, "right"],
    [".steps .step", 65, "left"],
    [".faq-heading", 0, "up"],
    [".faq-item", 55, "up"],
    [".faq-contact-link", 0, "up"],
    [".contact-panel", 0, "up"]
  ];
  const targets = [];

  groups.forEach(([selector, stagger, direction]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("motion-reveal");
      element.dataset.reveal = direction;
      if (stagger) element.style.setProperty("--reveal-delay", `${Math.min(index * stagger, 280)}ms`);
      targets.push(element);
    });
  });

  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  targets.forEach((element) => observer.observe(element));
  document.documentElement.classList.add("motion-ready");

  const stopMotion = (event) => {
    if (!event.matches) return;
    observer.disconnect();
    document.documentElement.classList.remove("motion-ready");
    targets.forEach((element) => element.classList.add("is-visible"));
  };
  if (typeof reducedMotion.addEventListener === "function") reducedMotion.addEventListener("change", stopMotion);
  else reducedMotion.addListener(stopMotion);
})();

// Share a single animation-frame loop for page progress and sticky header state.
(() => {
  const header = document.querySelector(".landing-page .site-header");
  if (!header) return;
  let frame = 0;

  const updateScrollState = () => {
    frame = 0;
    const root = document.documentElement;
    const range = root.scrollHeight - window.innerHeight;
    const progress = range > 0 ? Math.max(0, Math.min(1, window.scrollY / range)) : 0;
    root.style.setProperty("--page-progress", progress.toFixed(4));
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  const queueScrollUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(updateScrollState);
  };

  window.addEventListener("scroll", queueScrollUpdate, { passive: true });
  window.addEventListener("resize", queueScrollUpdate, { passive: true });
  updateScrollState();
})();

// Ease the Hero photo with a tiny pointer parallax on desktop.
(() => {
  const hero = document.querySelector(".hero");
  const photo = hero && hero.querySelector(".hero-photo-frame");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!hero || !photo || reducedMotion.matches || !finePointer.matches) return;

  let frame = 0;
  let x = 0;
  let y = 0;
  const reset = () => {
    photo.style.setProperty("--hero-tilt-x", "0deg");
    photo.style.setProperty("--hero-tilt-y", "0deg");
    photo.style.setProperty("--hero-image-x", "0px");
    photo.style.setProperty("--hero-image-y", "0px");
  };
  const move = (event) => {
    if (reducedMotion.matches || event.pointerType !== "mouse") return;
    x = event.clientX;
    y = event.clientY;
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      if (reducedMotion.matches || !hero.matches(":hover")) return;
      const bounds = hero.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((x - bounds.left) / bounds.width - .5) * 2));
      const ny = Math.max(-1, Math.min(1, ((y - bounds.top) / bounds.height - .5) * 2));
      photo.style.setProperty("--hero-tilt-x", `${(-ny * 2.2).toFixed(2)}deg`);
      photo.style.setProperty("--hero-tilt-y", `${(nx * 2.2).toFixed(2)}deg`);
      photo.style.setProperty("--hero-image-x", `${(nx * 2).toFixed(1)}px`);
      photo.style.setProperty("--hero-image-y", `${(ny * 2).toFixed(1)}px`);
    });
  };
  hero.addEventListener("pointermove", move, { passive: true });
  hero.addEventListener("pointerleave", () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    reset();
  }, { passive: true });
  const stop = (event) => {
    if (!event.matches) return;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    reset();
  };
  if (typeof reducedMotion.addEventListener === "function") reducedMotion.addEventListener("change", stop);
  else reducedMotion.addListener(stop);
})();

// Add a restrained 3D tilt and pointer-following highlight to service cards.
(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (reducedMotion.matches || !finePointer.matches) return;

  document.querySelectorAll(".service-card").forEach((card) => {
    let frame = 0;
    let x = 0;
    let y = 0;
    const reset = () => {
      card.classList.remove("is-tilting");
      card.style.setProperty("--service-tilt-x", "0deg");
      card.style.setProperty("--service-tilt-y", "0deg");
      card.style.setProperty("--service-pointer-x", "50%");
      card.style.setProperty("--service-pointer-y", "50%");
    };
    card.addEventListener("pointermove", (event) => {
      if (reducedMotion.matches || event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (reducedMotion.matches || !card.matches(":hover")) return;
        const bounds = card.getBoundingClientRect();
        const px = Math.max(0, Math.min(1, (x - bounds.left) / bounds.width));
        const py = Math.max(0, Math.min(1, (y - bounds.top) / bounds.height));
        card.style.setProperty("--service-pointer-x", `${(px * 100).toFixed(1)}%`);
        card.style.setProperty("--service-pointer-y", `${(py * 100).toFixed(1)}%`);
        card.style.setProperty("--service-tilt-x", `${((.5 - py) * 4).toFixed(2)}deg`);
        card.style.setProperty("--service-tilt-y", `${((px - .5) * 4).toFixed(2)}deg`);
        card.classList.add("is-tilting");
      });
    }, { passive: true });
    card.addEventListener("pointerleave", () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      reset();
    }, { passive: true });
    const stop = (event) => {
      if (event.matches) reset();
    };
    if (typeof reducedMotion.addEventListener === "function") reducedMotion.addEventListener("change", stop);
    else reducedMotion.addListener(stop);
  });
})();

// Give key calls to action a small magnetic response on fine pointers.
(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (reducedMotion.matches || !finePointer.matches) return;

  document.querySelectorAll(".header-cta, .hero .button-primary, .contact-whatsapp-button, .whatsapp-float").forEach((button) => {
    let frame = 0;
    let x = 0;
    let y = 0;
    button.classList.add("magnetic-ready");
    const reset = () => {
      button.style.setProperty("--magnet-x", "0px");
      button.style.setProperty("--magnet-y", "0px");
    };
    button.addEventListener("pointermove", (event) => {
      if (reducedMotion.matches || event.pointerType !== "mouse") return;
      x = event.clientX;
      y = event.clientY;
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (reducedMotion.matches || !button.matches(":hover")) return;
        const bounds = button.getBoundingClientRect();
        const dx = Math.max(-3.2, Math.min(3.2, (x - (bounds.left + bounds.width / 2)) * .08));
        const dy = Math.max(-2.8, Math.min(2.8, (y - (bounds.top + bounds.height / 2)) * .08));
        button.style.setProperty("--magnet-x", `${dx.toFixed(2)}px`);
        button.style.setProperty("--magnet-y", `${dy.toFixed(2)}px`);
      });
    }, { passive: true });
    button.addEventListener("pointerleave", () => {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      reset();
    }, { passive: true });
    const stop = (event) => {
      if (event.matches) reset();
    };
    if (typeof reducedMotion.addEventListener === "function") reducedMotion.addEventListener("change", stop);
    else reducedMotion.addListener(stop);
  });
})();

// A restrained cursor light on the Hero for fine pointers only.
(() => {
  const hero = document.querySelector(".hero");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  if (!hero || reducedMotion.matches || !finePointer.matches) return;

  let frame = 0;
  let clientX = 0;
  let clientY = 0;

  const clear = () => hero.classList.remove("is-pointer-lit");
  const move = (event) => {
    if (reducedMotion.matches || event.pointerType !== "mouse") return;
    clientX = event.clientX;
    clientY = event.clientY;
    if (frame) return;

    frame = window.requestAnimationFrame(() => {
      frame = 0;
      if (reducedMotion.matches || !hero.matches(":hover")) return;
      const bounds = hero.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((clientX - bounds.left) / bounds.width) * 100));
      const y = Math.max(0, Math.min(100, ((clientY - bounds.top) / bounds.height) * 100));
      hero.style.setProperty("--hero-pointer-x", `${x}%`);
      hero.style.setProperty("--hero-pointer-y", `${y}%`);
      hero.classList.add("is-pointer-lit");
    });
  };

  hero.addEventListener("pointermove", move, { passive: true });
  hero.addEventListener("pointerleave", () => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    clear();
  }, { passive: true });

  const stopMotion = (event) => {
    if (!event.matches) return;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    clear();
  };
  if (typeof reducedMotion.addEventListener === "function") reducedMotion.addEventListener("change", stopMotion);
  else reducedMotion.addListener(stopMotion);
})();
