document.addEventListener("DOMContentLoaded", function () {
  const animatedText = document.getElementById("animated-text");
  const roles = ["Full-Stack", "Web Developer", "Mobile Developer"];
  let mainIndex = 0;
  let subIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    let displayText = roles[mainIndex].substring(0, subIndex);
    animatedText.innerHTML = `<span class="gradient-text">${displayText}|</span>`;

    if (!isDeleting && subIndex === roles[mainIndex].length) {
      setTimeout(() => (isDeleting = true), 2000);
    } else if (isDeleting && subIndex === 0) {
      isDeleting = false;
      mainIndex = (mainIndex + 1) % roles.length;
    }

    subIndex += isDeleting ? -1 : 1;
    setTimeout(typeEffect, isDeleting ? 50 : 100);
  }

  typeEffect();
});
