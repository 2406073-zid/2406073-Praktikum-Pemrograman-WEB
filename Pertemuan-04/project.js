"use strict";

const STORAGE_KEY = "myPortfolioProjects";
const starterProjects = [
  { id: "sample-1", title: "Prediksi Harga Rumah", category: "Machine Learning", description: "Model regresi untuk memperkirakan harga rumah berdasarkan luas bangunan, lokasi, dan jumlah kamar.", tech: "Python, Scikit-learn, Pandas", link: "" },
  { id: "sample-2", title: "Klasifikasi Gambar", category: "Computer Vision", description: "Eksperimen klasifikasi gambar dengan pemrosesan citra dan model deep learning.", tech: "Python, TensorFlow, Pillow", link: "" },
  { id: "sample-3", title: "Website Portfolio", category: "Web Development", description: "Ruang sederhana untuk mengenalkan diri, membagikan karya, dan mencatat proses belajar.", tech: "HTML, CSS, JavaScript", link: "" }
];

const form = document.querySelector("#projectForm");
const list = document.querySelector("#projectList");
const search = document.querySelector("#searchInput");
const categoryFilter = document.querySelector("#categoryFilter");
const emptyState = document.querySelector("#emptyState");
const message = document.querySelector("#formMessage");
let projects = readProjects();

function readProjects() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.warn("Tidak dapat membaca koleksi proyek:", error);
  }
  return starterProjects.map(project => ({ ...project }));
}

function saveProjects() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    return true;
  } catch (error) {
    console.warn("Tidak dapat menyimpan koleksi proyek:", error);
    showMessage("Penyimpanan browser tidak tersedia.", "error");
    return false;
  }
}

function showMessage(text, type = "success") {
  message.textContent = text;
  message.className = type === "error" ? "error" : "";
  if (text) window.setTimeout(() => { message.textContent = ""; }, 3500);
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function createCard(project, index) {
  const card = element("article", "project-card");
  card.style.animationDelay = `${Math.min(index * 45, 180)}ms`;

  const top = element("div", "card-top");
  top.append(element("span", "card-number", `NO. ${String(index + 1).padStart(2, "0")}`));
  top.append(element("span", "category-badge", project.category));

  const title = element("h3", "", project.title);
  const description = element("p", "project-description", project.description);
  const technologies = element("div", "tech-list");
  String(project.tech || "").split(",").map(item => item.trim()).filter(Boolean).forEach(tech => {
    technologies.append(element("span", "tech-tag", tech));
  });

  const actions = element("div", "project-actions");
  if (project.link) {
    const link = element("a", "project-link", "Buka proyek ↗");
    link.href = project.link;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    actions.append(link);
  } else {
    actions.append(element("span", "private-label", "Proyek pribadi"));
  }

  const remove = element("button", "delete-button", "Hapus");
  remove.type = "button";
  remove.setAttribute("aria-label", `Hapus ${project.title}`);
  remove.addEventListener("click", () => deleteProject(project.id));
  actions.append(remove);
  card.append(top, title, description, technologies, actions);
  return card;
}

function renderProjects() {
  const keyword = search.value.trim().toLocaleLowerCase("id");
  const category = categoryFilter.value;
  const filtered = projects.filter(project => {
    const text = [project.title, project.category, project.description, project.tech].join(" ").toLocaleLowerCase("id");
    return text.includes(keyword) && (!category || project.category === category);
  });

  list.replaceChildren(...filtered.map(createCard));
  emptyState.hidden = filtered.length > 0;
  document.querySelector("#resultCount").textContent = `Menampilkan ${filtered.length} dari ${projects.length} proyek`;
  document.querySelector("#totalProjects").textContent = projects.length;
  document.querySelector("#totalCategories").textContent = new Set(projects.map(project => project.category)).size;
  const techs = projects.flatMap(project => String(project.tech || "").split(",").map(tech => tech.trim().toLocaleLowerCase("id")).filter(Boolean));
  document.querySelector("#totalTechnologies").textContent = new Set(techs).size;
}

function deleteProject(id) {
  const previous = projects;
  projects = projects.filter(project => project.id !== id);
  if (!saveProjects()) { projects = previous; return; }
  renderProjects();
  showMessage("Proyek dihapus dari koleksi.");
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const data = new FormData(form);
  const project = {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    title: String(data.get("title") || "").trim(),
    category: String(data.get("category") || "").trim(),
    description: String(data.get("description") || "").trim(),
    tech: String(data.get("tech") || "").trim(),
    link: String(data.get("link") || "").trim()
  };

  if (project.link) {
    try {
      const url = new URL(project.link);
      if (!["https:", "http:"].includes(url.protocol)) throw new Error("URL tidak didukung");
    } catch {
      showMessage("Tautan harus memakai alamat http:// atau https://.", "error");
      return;
    }
  }

  projects.unshift(project);
  if (!saveProjects()) { projects.shift(); return; }
  form.reset();
  search.value = "";
  categoryFilter.value = "";
  renderProjects();
  showMessage("Proyek baru sudah masuk koleksi.");
  document.querySelector("#koleksi").scrollIntoView({ behavior: "smooth", block: "start" });
});

form.addEventListener("reset", () => { message.textContent = ""; });
search.addEventListener("input", renderProjects);
categoryFilter.addEventListener("change", renderProjects);
document.querySelector("#backToTop").addEventListener("click", event => {
  event.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderProjects();
