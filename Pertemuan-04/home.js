"use strict";

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const artwork = document.querySelector(".hero-art");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (artwork && !reduceMotion.matches && window.matchMedia("(pointer: fine)").matches) {
  const sun = artwork.querySelector(".sun");
  const stamp = artwork.querySelector(".art-stamp");

  artwork.addEventListener("pointermove", event => {
    const bounds = artwork.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    sun.style.translate = `${x * 9}px ${y * 9}px`;
    stamp.style.translate = `${x * -7}px ${y * -7}px`;
  });

  artwork.addEventListener("pointerleave", () => {
    sun.style.translate = "0 0";
    stamp.style.translate = "0 0";
  });
}
