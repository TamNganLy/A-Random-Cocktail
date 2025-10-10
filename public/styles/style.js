document.addEventListener("DOMContentLoaded", () => {
  const info = document.querySelector(".info");
  const img = document.querySelector(".thumbnail");

  const adjustHeight = () => {
    const infoHeight = info.offsetHeight;
    img.style.height = infoHeight > 700 ? infoHeight + "px" : "700px";
  };

  adjustHeight();
  window.addEventListener("resize", adjustHeight);
});