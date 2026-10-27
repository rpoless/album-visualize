const photos = Array.from({ length: 20 }, (_, index) => `assets/photos/paulo-${String(index + 1).padStart(2, "0")}.jpg`);
const cards = [...document.querySelectorAll(".photo-card")];
const dialog = document.querySelector("#lightbox");
const dialogImage = dialog.querySelector("figure img");
const dialogCount = document.querySelector("#lightbox-count");
const progress = document.querySelector(".scroll-progress span");
const soundControl = document.querySelector(".sound-control");
const soundToggle = document.querySelector("#sound-toggle");
const soundLabel = document.querySelector("#sound-label");
const volumeControl = document.querySelector("#volume");
let current = 0;
let musicPlayer;
let playerReady = false;
let wantsSound = true;

window.setTimeout(() => document.querySelector(".world-entry")?.classList.add("is-finished"), 1700);

window.onYouTubeIframeAPIReady = () => {
  musicPlayer = new YT.Player("youtube-player", {
    videoId: "WILNIXZr2oc",
    host: "https://www.youtube-nocookie.com",
    playerVars: { autoplay: 1, controls: 0, disablekb: 1, loop: 1, playlist: "WILNIXZr2oc", playsinline: 1, rel: 0 },
    events: { onReady: event => {
      playerReady = true;
      event.target.setVolume(Number(volumeControl.value));
      if (wantsSound) event.target.unMute();
      event.target.playVideo();
    }, onAutoplayBlocked: () => {
      soundLabel.textContent = "TOQUE PARA O SOM";
      soundToggle.setAttribute("aria-label", "Ativar música");
      soundControl.classList.remove("is-playing");
      soundToggle.setAttribute("aria-pressed", "false");
    }}
  });
};

function setSound(active) {
  wantsSound = active;
  if (!playerReady) {
    soundControl.classList.toggle("is-playing", active);
    soundToggle.setAttribute("aria-pressed", String(active));
    soundLabel.textContent = active ? "SOM ATIVO" : "ATIVAR SOM";
    return;
  }
  if (active) {
    musicPlayer.setVolume(Number(volumeControl.value));
    musicPlayer.unMute();
    musicPlayer.playVideo();
  } else {
    musicPlayer.mute();
  }
  soundControl.classList.toggle("is-playing", active);
  soundToggle.setAttribute("aria-pressed", String(active));
  soundToggle.setAttribute("aria-label", active ? "Silenciar música" : "Ativar música");
  soundLabel.textContent = active ? "SOM ATIVO" : "ATIVAR SOM";
}

soundToggle.addEventListener("click", () => setSound(!soundControl.classList.contains("is-playing")));
const resumeRequestedSound = () => {
  if (wantsSound && playerReady) setSound(true);
};
window.addEventListener("pointerdown", resumeRequestedSound, { once: true, capture: true });
window.addEventListener("keydown", resumeRequestedSound, { once: true, capture: true });
volumeControl.addEventListener("input", () => {
  if (!playerReady) return;
  musicPlayer.setVolume(Number(volumeControl.value));
  setSound(Number(volumeControl.value) > 0);
});

window.addEventListener("pagehide", () => {
  if (!playerReady) return;
  musicPlayer.stopVideo();
  musicPlayer.destroy();
  playerReady = false;
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .08, rootMargin: "0px 0px -40px" });

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

function showPhoto(index) {
  current = (index + photos.length) % photos.length;
  dialogImage.src = photos[current];
  dialogImage.alt = cards[current].querySelector("img").alt;
  dialogCount.textContent = `${String(current + 1).padStart(2, "0")} / ${photos.length}`;
}

cards.forEach((card, index) => card.addEventListener("click", () => {
  showPhoto(index);
  dialog.showModal();
  document.body.style.overflow = "hidden";
}));

function closeLightbox() {
  dialog.close();
  document.body.style.overflow = "";
}

dialog.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
dialog.querySelector(".previous").addEventListener("click", () => showPhoto(current - 1));
dialog.querySelector(".next").addEventListener("click", () => showPhoto(current + 1));
dialog.addEventListener("click", event => { if (event.target === dialog) closeLightbox(); });
dialog.addEventListener("close", () => { document.body.style.overflow = ""; });
window.addEventListener("keydown", event => {
  if (!dialog.open) return;
  if (event.key === "ArrowLeft") showPhoto(current - 1);
  if (event.key === "ArrowRight") showPhoto(current + 1);
});

function updateScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
}

window.addEventListener("scroll", updateScroll, { passive: true });
window.addEventListener("resize", updateScroll, { passive: true });
updateScroll();
