"use strict";

const contactForm = document.querySelector("#contactForm");
const formHint = document.querySelector("#formHint");
const whatsappNumber = "6282121573028";

contactForm.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const service = String(formData.get("service")).trim();
  const message = String(formData.get("message")).trim();
  const lines = [
    "Halo Zidane, saya ingin menghubungi kamu.",
    "",
    `Nama: ${name}`,
    ...(email ? [`Email: ${email}`] : []),
    `Topik: ${service}`,
    "",
    message
  ];
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join("\n"))}`;
  formHint.textContent = "Membuka WhatsApp dengan pesan yang sudah disiapkan…";
  window.location.assign(url);
});
