document.addEventListener("DOMContentLoaded", () => {
  const animatedText = document.getElementById("animated-text");
  const roles = ["Full-Stack"];
  let mainIndex = 0;
  let subIndex = 0;
  let isDeleting = false;

  const typeEffect = () => {
    const currentRole = roles[mainIndex];
    animatedText.innerHTML = `<span>${currentRole.substring(
      0,
      subIndex
    )}|</span>`;

    if (!isDeleting && subIndex === currentRole.length) {
      setTimeout(() => {
        isDeleting = true;
        typeEffect();
      }, 2000);
      return;
    } else if (isDeleting && subIndex === 0) {
      isDeleting = false;
      mainIndex = (mainIndex + 1) % roles.length;
    }

    subIndex += isDeleting ? -1 : 1;
    setTimeout(typeEffect, isDeleting ? 50 : 200);
  };

  typeEffect();

  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  let width, height;
  let stars = [];

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  function createStars() {
    stars = [];
    const numStars = Math.floor((width * height) / 5000);
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.2 + 0.2,
        alpha: Math.random(),
        dx: (Math.random() - 0.5) * 0.1,
        dy: (Math.random() - 0.5) * 0.1,
        layer: Math.random(),
      });
    }
  }

  function drawStars(parallaxX = 0, parallaxY = 0) {
    ctx.clearRect(0, 0, width, height);
    stars.forEach((star) => {
      const px = star.x + parallaxX * star.layer * 15;
      const py = star.y + parallaxY * star.layer * 15;

      ctx.beginPath();
      ctx.arc(px, py, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${star.alpha})`;
      ctx.fill();
    });
  }

  function animate() {
    stars.forEach((star) => {
      star.x += star.dx;
      star.y += star.dy;

      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;
    });
    drawStars(parallaxX, parallaxY);
    requestAnimationFrame(animate);
  }

  let parallaxX = 0;
  let parallaxY = 0;

  window.addEventListener("resize", () => {
    resize();
    createStars();
  });

  window.addEventListener("mousemove", (e) => {
    parallaxX = (e.clientX / width - 0.5) * 2;
    parallaxY = (e.clientY / height - 0.5) * 2;
  });

  resize();
  createStars();
  animate();
  const projectsContainer = document.querySelector(".projects-container");

  if (projectsContainer) {
    let isDown = false;
    let startX;
    let scrollLeft;

    projectsContainer.addEventListener("mousedown", (e) => {
      isDown = true;
      projectsContainer.classList.add("active");
      startX = e.pageX - projectsContainer.offsetLeft;
      scrollLeft = projectsContainer.scrollLeft;
    });

    projectsContainer.addEventListener("mouseleave", () => {
      isDown = false;
      projectsContainer.classList.remove("active");
    });

    projectsContainer.addEventListener("mouseup", () => {
      isDown = false;
      projectsContainer.classList.remove("active");
    });

    projectsContainer.addEventListener("mousemove", (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - projectsContainer.offsetLeft;
      const walk = (x - startX) * 2;
      projectsContainer.scrollLeft = scrollLeft - walk;
    });
  }
});
