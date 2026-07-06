// Scroll-triggered animations using IntersectionObserver
(function () {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("scroll-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  function observeElements() {
    // Static sections
    document.querySelectorAll(".scroll-hidden").forEach((el) => observer.observe(el));

    // Dynamically loaded game cards
    const list = document.querySelector(".project-list");
    if (list) {
      const mo = new MutationObserver(() => {
        list.querySelectorAll(".project-item:not(.scroll-hidden):not(.scroll-visible)").forEach((el, i) => {
          el.classList.add("scroll-hidden");
          el.style.setProperty("--anim-order", i % 12);
          observer.observe(el);
        });
      });
      mo.observe(list, { childList: true });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", observeElements);
  } else {
    observeElements();
  }
})();
