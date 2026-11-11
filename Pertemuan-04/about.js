"use strict";

const topics = {
  web: {
    title: "Pengembangan web",
    text: "Merancang halaman yang mudah dipahami, nyaman digunakan, dan tetap terasa punya karakter.",
    tags: ["HTML & CSS", "JavaScript", "Next.js"]
  },
  js: {
    title: "JavaScript",
    text: "Mengeksplorasi bagaimana interaksi dan logika membuat halaman web terasa lebih hidup dan berguna.",
    tags: ["Interaksi", "DOM", "Logika aplikasi"]
  },
  ideas: {
    title: "Ide jadi produk",
    text: "Memecah ide menjadi bagian kecil, membangun versi awal, lalu belajar dari hasilnya.",
    tags: ["Eksperimen", "Pemecahan masalah", "Proyek"]
  }
};

const tabs = [...document.querySelectorAll(".interest-tab")];
const panel = document.querySelector("#interest-panel");
const panelTitle = document.querySelector("#panelTitle");
const panelText = document.querySelector("#panelText");
const panelTags = document.querySelector("#panelTags");

function selectTopic(tab) {
  const topic = topics[tab.dataset.topic];
  if (!topic) return;

  tabs.forEach(item => {
    const selected = item === tab;
    item.classList.toggle("active", selected);
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
  });

  panel.setAttribute("aria-labelledby", tab.id);
  panelTitle.textContent = topic.title;
  panelText.textContent = topic.text;
  panelTags.replaceChildren(...topic.tags.map(label => {
    const tag = document.createElement("span");
    tag.textContent = label;
    return tag;
  }));
  panel.style.animation = "none";
  requestAnimationFrame(() => { panel.style.animation = ""; });
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTopic(tab));
  tab.addEventListener("keydown", event => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowDown" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    selectTopic(tabs[nextIndex]);
  });
});

if (tabs[0]) tabs[0].tabIndex = 0;
