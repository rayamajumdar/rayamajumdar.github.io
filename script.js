const header = document.querySelector(".site-header");

const setHeaderTone = () => {
  if (window.scrollY > 20) {
    header.style.boxShadow = "0 12px 40px rgba(32, 25, 18, 0.08)";
  } else {
    header.style.boxShadow = "none";
  }
};

setHeaderTone();
window.addEventListener("scroll", setHeaderTone, { passive: true });
