const landscapeFrames = new Set([18, 19, 20, 25, 27, 28, 29, 31]);
const photos = Array.from({ length: 40 }, (_, index) => ({
  number: index + 1,
  src: `assets/photos/lucas-${String(index + 1).padStart(2, "0")}.jpg`,
  landscape: landscapeFrames.has(index + 1)
}));
const grid = document.querySelector("#contact-grid");

photos.forEach((photo, index) => {
  if (index === 16 || index === 29) {
    const note = document.createElement("aside");
    note.className = "divider-card reveal";
    note.innerHTML = index === 16
      ? "<small>VISUALIZE · PORTRAIT STUDY</small><strong>Light leaves<br>a memory.</strong><small>ROLL 03 / 2026</small>"
      : "<small>ARCHIVE NOTE</small><strong>Outside,<br>unposed.</strong><small>FRAMES 30—40</small>";
    grid.append(note);
  }
  const card = document.createElement("button");
  card.type = "button";
  card.className = `frame reveal${photo.landscape ? " landscape" : ""}`;
  card.dataset.photo = index;
  card.style.setProperty("--rotation", `${((index % 5) - 2) * .35}deg`);
  card.setAttribute("aria-label", `Ampliar fotografia ${photo.number} de Lucas`);
  card.innerHTML = `<img src="${photo.src}" alt="Retrato de Lucas — fotografia ${String(photo.number).padStart(2, "0")}" loading="lazy" draggable="false"><span class="frame-meta"><span>FRAME ${String(photo.number).padStart(2, "0")}</span><span>VZ / 26</span></span>`;
  grid.append(card);
});

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }
}), { threshold: .06, rootMargin: "0px 0px -35px" });
document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));
window.setTimeout(() => document.querySelector(".world-entry")?.classList.add("is-finished"), 1800);

const dialog = document.querySelector("#lightbox");
const dialogImage = dialog.querySelector("figure img");
const dialogCount = document.querySelector("#lightbox-count");
let current = 0;
function showPhoto(index) {
  current = (index + photos.length) % photos.length;
  dialogImage.src = photos[current].src;
  dialogImage.alt = `Retrato de Lucas — fotografia ${current + 1}`;
  dialogCount.textContent = `${String(current + 1).padStart(2, "0")} / 40`;
}
document.querySelectorAll(".frame").forEach((card, index) => card.addEventListener("click", () => {
  showPhoto(index); dialog.showModal(); document.body.style.overflow = "hidden";
}));
function closeLightbox(){dialog.close();document.body.style.overflow=""}
dialog.querySelector(".close").addEventListener("click",closeLightbox);
dialog.querySelector(".previous").addEventListener("click",()=>showPhoto(current-1));
dialog.querySelector(".next").addEventListener("click",()=>showPhoto(current+1));
dialog.addEventListener("click",event=>{if(event.target===dialog)closeLightbox()});
dialog.addEventListener("close",()=>document.body.style.overflow="");
window.addEventListener("keydown",event=>{if(!dialog.open)return;if(event.key==="ArrowLeft")showPhoto(current-1);if(event.key==="ArrowRight")showPhoto(current+1)});

const progress = document.querySelector(".scroll-progress span");
function updateScroll(){const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`}
window.addEventListener("scroll",updateScroll,{passive:true});window.addEventListener("resize",updateScroll,{passive:true});updateScroll();

const soundControl=document.querySelector(".sound-control");
const soundToggle=document.querySelector("#sound-toggle");
const soundLabel=document.querySelector("#sound-label");
const volumeControl=document.querySelector("#volume");
let musicPlayer;
let playerReady=false;
let wantsSound=true;

window.onYouTubeIframeAPIReady=()=>{
  musicPlayer=new YT.Player("youtube-player",{
    videoId:"xAgUYyosqVM",
    host:"https://www.youtube-nocookie.com",
    playerVars:{autoplay:1,controls:0,disablekb:1,loop:1,playlist:"xAgUYyosqVM",playsinline:1,rel:0},
    events:{
      onReady:event=>{
        playerReady=true;
        event.target.setVolume(Number(volumeControl.value));
        if(wantsSound)event.target.unMute();
        event.target.playVideo();
      },
      onAutoplayBlocked:()=>{
        soundLabel.textContent="TOQUE PARA O SOM";
        soundToggle.setAttribute("aria-label","Ativar música");
        soundControl.classList.remove("is-playing");
        soundToggle.setAttribute("aria-pressed","false");
      }
    }
  });
};

function setSound(active){
  wantsSound=active;
  if(playerReady){
    if(active){
      musicPlayer.setVolume(Number(volumeControl.value));
      musicPlayer.unMute();
      musicPlayer.playVideo();
    }else musicPlayer.mute();
  }
  soundControl.classList.toggle("is-playing",active);
  soundToggle.setAttribute("aria-pressed",String(active));
  soundToggle.setAttribute("aria-label",active?"Silenciar música":"Ativar música");
  soundLabel.textContent=active?"SOM ATIVO":"ATIVAR SOM";
}

soundToggle.addEventListener("click",()=>setSound(!soundControl.classList.contains("is-playing")));
volumeControl.addEventListener("input",()=>{
  if(playerReady)musicPlayer.setVolume(Number(volumeControl.value));
  setSound(Number(volumeControl.value)>0);
});

const resumeSound=()=>{
  if(wantsSound&&playerReady)setSound(true);
};
window.addEventListener("pointerdown",resumeSound,{once:true,capture:true});
window.addEventListener("keydown",resumeSound,{once:true,capture:true});
window.addEventListener("pagehide",()=>{
  if(!playerReady)return;
  musicPlayer.stopVideo();
  musicPlayer.destroy();
  playerReady=false;
});
