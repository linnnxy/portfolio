document.addEventListener("DOMContentLoaded", () => {
  const debounce = (func, delay) => {
    let t;
    return (...a) => {
      clearTimeout(t);
      t = setTimeout(() => func.apply(this, a), delay);
    };
  };

  const throttle = (func, limit) => {
    let i;
    return (...a) => {
      if (!i) {
        func.apply(this, a);
        i = true;
        setTimeout(() => (i = false), limit);
      }
    };
  };

  const initTypingEffect = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return;

    const config = {
      roles: ["Full-Stack"],
      typingSpeed: 100,
      deletingSpeed: 50,
      pauseDuration: 2000,
    };
    let mainIndex = 0,
      subIndex = 0,
      isDeleting = false;
    const cursorHTML = `<span aria-hidden="true">|</span>`;

    const setMinWidth = () => {
      const longestWord = config.roles.reduce(
        (a, b) => (a.length > b.length ? a : b),
        ""
      );
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const style = window.getComputedStyle(element);
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      element.style.minWidth = `${ctx.measureText(longestWord).width}px`;
    };

    const type = () => {
      const currentRole = config.roles[mainIndex];
      subIndex += isDeleting ? -1 : 1;
      element.textContent = currentRole.substring(0, subIndex);
      element.insertAdjacentHTML("beforeend", cursorHTML);

      let nextTimeout = isDeleting ? config.deletingSpeed : config.typingSpeed;
      if (!isDeleting && subIndex === currentRole.length) {
        isDeleting = true;
        nextTimeout = config.pauseDuration;
      } else if (isDeleting && subIndex === 0) {
        isDeleting = false;
        mainIndex = (mainIndex + 1) % config.roles.length;
        nextTimeout = 500;
      }
      setTimeout(type, nextTimeout);
    };

    setMinWidth();
    element.setAttribute("aria-live", "polite");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      element.textContent = config.roles[0];
    } else {
      type();
    }
  };

  const initStarfield = (selector) => {
    const canvas = document.querySelector(selector);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let stars = [],
      parallaxX = 0,
      parallaxY = 0;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);

      const numStars = Math.floor((canvas.width * canvas.height) / 5000 / dpr);
      stars = Array.from({ length: numStars }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.2 + 0.2,
        alpha: Math.random(),
        dx: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.1,
        dy: prefersReducedMotion ? 0 : (Math.random() - 0.5) * 0.1,
        layer: Math.random(),
      }));
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        star.x += star.dx;
        star.y += star.dy;
        if (star.x < 0) star.x = window.innerWidth;
        if (star.x > window.innerWidth) star.x = 0;
        if (star.y < 0) star.y = window.innerHeight;
        if (star.y > window.innerHeight) star.y = 0;

        const px = star.x + parallaxX * star.layer * 25;
        const py = star.y + parallaxY * star.layer * 25;

        ctx.beginPath();
        ctx.arc(px, py, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };

    window.addEventListener("resize", debounce(resize, 250));
    if (!prefersReducedMotion) {
      window.addEventListener(
        "mousemove",
        throttle((e) => {
          parallaxX = e.clientX / window.innerWidth - 0.5;
          parallaxY = e.clientY / window.innerHeight - 0.5;
        }, 50)
      );
    }

    resize();
    animate();
  };

  const initDraggableSlider = (selector) => {
    const container = document.querySelector(selector);
    if (!container) return;

    let isDown = false,
      startX,
      scrollLeft;

    container.setAttribute("role", "region");
    container.setAttribute("aria-label", "Carrossel de projetos");
    container
      .querySelectorAll(".project-card, .polaroid-card")
      .forEach((card) => card.setAttribute("tabindex", "0"));

    container.addEventListener("mousedown", (e) => {
      isDown = true;
      container.classList.add("active");
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    const stopDragging = () => {
      isDown = false;
      container.classList.remove("active");
    };
    container.addEventListener("mouseleave", stopDragging);
    container.addEventListener("mouseup", stopDragging);

    container.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      container.scrollLeft = scrollLeft - (x - startX) * 2;
    });

    container.addEventListener("keydown", (e) => {
      const scrollAmount = 300;
      if (e.key === "ArrowRight") {
        container.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
      if (e.key === "ArrowLeft") {
        container.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      }
    });
  };

  initTypingEffect("#animated-text");
  initStarfield("#stars");
  initDraggableSlider(".projects-container");
});
