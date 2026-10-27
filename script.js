const albums = [
  { title: "Jessica", cover: "assets/covers/jessica.webp", description: "Texturas escuras, vermelho intenso e uma presença construída como capa de disco." },
  { title: "Tauane", cover: "assets/covers/tauane.webp", description: "Um editorial clássico, direto e silencioso, guiado por tons quentes e tipografia elegante." },
  { title: "The Lucas", cover: "assets/covers/lucas.webp", description: "Retrato autoral com linguagem gráfica vintage e uma personalidade impossível de ignorar." },
  { title: "Paulo", cover: "assets/covers/paulo.webp", description: "A quadra vira composição: azul, movimento e energia vistos através da cesta." },
  { title: "Rafael", cover: "assets/covers/rafael.webp", description: "Tons de sépia e textura analógica dão ao retrato a memória de um clássico." },
  { title: "Luis Ricardo", cover: "assets/covers/luis-ricardo.webp", description: "Luz cinematográfica, fundo profundo e uma presença construída com sobriedade." }
];

const cards = [...document.querySelectorAll(".album-card")];
const flow = document.querySelector("#coverflow");
const previous = document.querySelector("#previous");
const next = document.querySelector("#next");
const description = document.querySelector("#album-description");
const dockTitle = document.querySelector("#dock-title");
const dockCover = document.querySelector("#dock-cover");
const number = document.querySelector("#current-number");
const progress = document.querySelector("#progress");
const ambients = [document.querySelector(".ambient-a"), document.querySelector(".ambient-b")];
let active = 2;
let ambientIndex = 0;
let dragStart = 0;
let dragDistance = 0;
let dragged = false;
let wheelLock = false;

albums.forEach((album, index) => {
  const dot = document.createElement("button");
  dot.type = "button";
  dot.setAttribute("aria-label", `Selecionar ${album.title}`);
  dot.addEventListener("click", () => select(index));
  progress.append(dot);
});

function signedDistance(index) {
  let distance = index - active;
  if (distance > albums.length / 2) distance -= albums.length;
  if (distance < -albums.length / 2) distance += albums.length;
  return distance;
}

function render() {
  const mobile = window.innerWidth <= 720;
  const step = mobile ? Math.min(window.innerWidth * .47, 190) : Math.min(window.innerWidth * .205, 300);
  cards.forEach((card, index) => {
    const distance = signedDistance(index);
    const magnitude = Math.abs(distance);
    card.style.setProperty("--x", `${distance * step}px`);
    card.style.setProperty("--z", `${-magnitude * (mobile ? 105 : 145)}px`);
    card.style.setProperty("--ry", `${distance * (mobile ? -34 : -31)}deg`);
    card.style.setProperty("--scale", `${1 - Math.min(magnitude, 2) * (mobile ? .1 : .08)}`);
    card.style.setProperty("--opacity", `${magnitude > 2 ? 0 : 1 - magnitude * .13}`);
    card.style.setProperty("--layer", `${10 - magnitude}`);
    card.style.setProperty("--saturation", `${1 - magnitude * .16}`);
    card.style.setProperty("--brightness", `${1 - magnitude * .1}`);
    card.classList.toggle("is-active", index === active);
    card.setAttribute("aria-current", index === active ? "true" : "false");
    card.tabIndex = magnitude <= 1 ? 0 : -1;
  });
  [...progress.children].forEach((dot, index) => dot.classList.toggle("is-active", index === active));
  description.classList.add("is-changing");
  window.setTimeout(() => {
    description.textContent = albums[active].description;
    description.classList.remove("is-changing");
  }, 150);
  dockTitle.textContent = albums[active].title;
  dockCover.src = albums[active].cover;
  number.textContent = String(active + 1).padStart(2, "0");
  updateAmbient();
}

function updateAmbient() {
  const incoming = ambients[1 - ambientIndex];
  const outgoing = ambients[ambientIndex];
  incoming.style.setProperty("--ambient-image", `url('${albums[active].cover}')`);
  incoming.classList.add("is-visible");
  outgoing.classList.remove("is-visible");
  ambientIndex = 1 - ambientIndex;
}

function select(index) {
  active = (index + albums.length) % albums.length;
  render();
}

cards.forEach((card, index) => {
  card.addEventListener("click", event => {
    if (card.dataset.page) {
      event.preventDefault();
      if (dragged) return;
      enterAlbum(card, card.dataset.page);
      return;
    }
    select(index);
  });
  const surface = card.querySelector(".album-card__surface");
  card.addEventListener("pointermove", event => {
    if (index !== active || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = card.getBoundingClientRect();
    surface.style.setProperty("--tilt-x", `${((event.clientY - rect.top) / rect.height - .5) * -5}deg`);
    surface.style.setProperty("--tilt-y", `${((event.clientX - rect.left) / rect.width - .5) * 7}deg`);
  });
  card.addEventListener("pointerleave", () => {
    surface.style.setProperty("--tilt-x", "0deg");
    surface.style.setProperty("--tilt-y", "0deg");
  });
});

function enterAlbum(card, destination) {
  if (document.body.classList.contains("album-entering")) return;
  const targetUrl = new URL(destination, document.baseURI).href;
  const image = card.querySelector("img");
  const rect = image.getBoundingClientRect();
  const portal = document.createElement("div");
  portal.className = "album-portal";
  portal.style.setProperty("--portal-left", `${rect.left}px`);
  portal.style.setProperty("--portal-top", `${rect.top}px`);
  portal.style.setProperty("--portal-width", `${rect.width}px`);
  portal.style.setProperty("--portal-height", `${rect.height}px`);
  portal.style.backgroundImage = `url('${image.currentSrc || image.src}')`;
  document.body.append(portal);
  document.body.classList.add("album-entering");
  sessionStorage.setItem("visualize-entry", destination.includes("lucas") ? "lucas" : "paulo");
  requestAnimationFrame(() => requestAnimationFrame(() => portal.classList.add("is-running")));
  window.setTimeout(() => window.location.assign(targetUrl), 850);
}

previous.addEventListener("click", () => select(active - 1));
next.addEventListener("click", () => select(active + 1));
window.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") select(active - 1);
  if (event.key === "ArrowRight") select(active + 1);
});
flow.addEventListener("wheel", event => {
  if (wheelLock || Math.abs(event.deltaY) < 12 && Math.abs(event.deltaX) < 12) return;
  wheelLock = true;
  select(active + (event.deltaY + event.deltaX > 0 ? 1 : -1));
  window.setTimeout(() => wheelLock = false, 520);
}, { passive: true });
flow.addEventListener("pointerdown", event => {
  dragStart = event.clientX;
  dragDistance = 0;
  dragged = false;
  flow.classList.add("is-dragging");
});
flow.addEventListener("pointermove", event => {
  if (!flow.classList.contains("is-dragging")) return;
  dragDistance = event.clientX - dragStart;
  if (Math.abs(dragDistance) >= 10) dragged = true;
});
flow.addEventListener("pointerup", event => {
  flow.classList.remove("is-dragging");
  if (Math.abs(dragDistance) > 45) select(active + (dragDistance < 0 ? 1 : -1));
  window.setTimeout(() => { dragged = false; }, 0);
});
flow.addEventListener("pointercancel", () => flow.classList.remove("is-dragging"));
flow.addEventListener("dragstart", event => event.preventDefault());
window.addEventListener("resize", render, { passive: true });

ambients[0].style.setProperty("--ambient-image", `url('${albums[active].cover}')`);
render();
