document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const navToggle = document.querySelector(".nav-toggle");
  const siteNav = document.querySelector(".site-nav");
  const year = document.getElementById("year");
  const todayDate = document.getElementById("todayDate");
  const contactForm = document.getElementById("contactForm");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (todayDate) {
    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    todayDate.textContent = formatted;
  }

  const closeNav = () => {
    if (!siteNav || !navToggle) return;
    siteNav.classList.remove("is-open");
    body.classList.remove("nav-open");
    navToggle.setAttribute("aria-expanded", "false");
  };

  const openNav = () => {
    if (!siteNav || !navToggle) return;
    siteNav.classList.add("is-open");
    body.classList.add("nav-open");
    navToggle.setAttribute("aria-expanded", "true");
  };

  if (navToggle && siteNav) {
    navToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = siteNav.classList.contains("is-open");
      isOpen ? closeNav() : openNav();
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeNav();
      });
    });

    document.addEventListener("click", (event) => {
      const clickedInsideNav = siteNav.contains(event.target);
      const clickedToggle = navToggle.contains(event.target);

      if (!clickedInsideNav && !clickedToggle) {
        closeNav();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const button = contactForm.querySelector("button[type='submit']");
      if (!button) return;

      const originalHTML = button.innerHTML;
      button.disabled = true;
      button.innerHTML = "Sending...";

      setTimeout(() => {
        button.innerHTML = "Message Sent";
      }, 500);

      setTimeout(() => {
        contactForm.reset();
        button.disabled = false;
        button.innerHTML = originalHTML;
      }, 1800);
    });
  }
});