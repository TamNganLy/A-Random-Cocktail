document.addEventListener("DOMContentLoaded", () => {
  const info = document.querySelector(".info");
  const img = document.querySelector(".thumbnail");

   if (!info || !img) return;

  const adjustHeight = () => {
    const infoHeight = info.offsetHeight;
    img.style.height = infoHeight > 650 ? infoHeight + "px" : "700px";
  };

  adjustHeight();
  window.addEventListener("resize", adjustHeight);
});