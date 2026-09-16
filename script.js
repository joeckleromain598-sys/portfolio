// ── CUSTOM CURSOR ──────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

// Suivre la souris partout
document.addEventListener('mousemove', e => {
  mx = e.clientX; 
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
  animateRingTo(mx,my);
});

let cursorFramePending = false;
function updateRingPosition(){
  cursorFramePending = false;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
}
function animateRingTo(x,y){
  rx = x; ry = y;
  if(!cursorFramePending){
    cursorFramePending = true;
    requestAnimationFrame(updateRingPosition);
  }
}

// Agrandir le curseur sur tous les éléments cliquables
function addCursorEffect() {
  document.querySelectorAll('a, button, .tp-card, .close-modal, .download-btn, .project-link').forEach(el => {
    // Supprimer les anciens listeners pour éviter les doublons
    el.removeEventListener('mouseenter', enlargeCursor);
    el.removeEventListener('mouseleave', shrinkCursor);
    // Ajouter les nouveaux listeners
    el.addEventListener('mouseenter', enlargeCursor);
    el.addEventListener('mouseleave', shrinkCursor);
  });
}

function enlargeCursor() {
  cursor.style.width = '24px';
  cursor.style.height = '24px';
  ring.style.width = '60px';
  ring.style.height = '60px';
}

function shrinkCursor() {
  cursor.style.width = '12px';
  cursor.style.height = '12px';
  ring.style.width = '40px';
  ring.style.height = '40px';
}

// ── SCROLL REVEAL ───────────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 60);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));

// ── U5 MODALS ──────────────────────────────────────────────────
function openU5Modal(event) {
  event.preventDefault();
  document.getElementById('u5Modal').style.display = 'block';
  document.body.style.overflow = 'hidden';
  setTimeout(addCursorEffect, 100);
}

function closeU5Modal() {
  document.getElementById('u5Modal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function openTPModal(tpId) {
  document.getElementById('u5Modal').style.display = 'none';
  document.getElementById(tpId + 'Modal').style.display = 'block';
  setTimeout(addCursorEffect, 100);
}

function closeTPModal(tpId) {
  document.getElementById(tpId + 'Modal').style.display = 'none';
  document.getElementById('u5Modal').style.display = 'block';
  setTimeout(addCursorEffect, 100);
}

// ── PROJETS PÉDAGOGIQUES MODALS ────────────────────────────────
function openDistribModal(event) {
  event.preventDefault();
  document.getElementById('distribModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
  setTimeout(addCursorEffect, 100);
}

function closeDistribModal() {
  document.getElementById('distribModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

function openSiteModal(event) {
  event.preventDefault();
  document.getElementById('siteModal').style.display = 'block';
  document.body.style.overflow = 'hidden';
  setTimeout(addCursorEffect, 100);
}

function closeSiteModal() {
  document.getElementById('siteModal').style.display = 'none';
  document.body.style.overflow = 'auto';
}

// Fermer les modals en cliquant à l'extérieur
window.onclick = function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
}

// ── VEILLE TECHNOLOGIQUE (RSS AUTO-UPDATE) ─────────────────────
async function fetchVeille() {
  const container = document.getElementById('veille-container');
  if (!container) return;

  // URL du flux RSS (Ici le CERT-FR pour la cybersécurité)
  const rssUrl = encodeURIComponent('https://www.cert.ssi.gouv.fr/alerte/feed/');
  // API publique pour convertir le RSS en JSON
  const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.status === 'ok') {
      let html = '';
      // On récupère uniquement les 3 dernières alertes/articles
      const articles = data.items.slice(0, 3);
      
      articles.forEach(item => {
        // Formatage de la date en français
        const date = new Date(item.pubDate).toLocaleDateString('fr-FR', {
          day: '2-digit', month: 'long', year: 'numeric'
        });

        // Nettoyage de la description (retirer les balises HTML éventuelles)
        const cleanDesc = item.description.replace(/(<([^>]+)>)/gi, "").substring(0, 120);

        // Création de la carte en réutilisant tes classes CSS existantes
        html += `
          <div class="project-card reveal visible" style="opacity: 1; transform: translateY(0);">
            <div class="project-inner">
              <div class="project-type">${date} · CERT-FR</div>
              <div class="project-title" style="font-size: 18px;">${item.title}</div>
              <p class="project-desc">${cleanDesc}...</p>
              <div class="project-techs">
                <span class="tech-chip">Cybersécurité</span>
                <span class="tech-chip">Alerte</span>
              </div>
              <a href="${item.link}" target="_blank" class="project-link">Lire l'alerte <i class="fa-solid fa-arrow-right"></i></a>
            </div>
          </div>
        `;
      });
      
      container.innerHTML = html;
      
      // On ré-applique ton effet de curseur sur les nouveaux boutons générés
      addCursorEffect();
    } else {
      container.innerHTML = `<p class="project-desc">Impossible de charger le flux de veille.</p>`;
    }
  } catch (error) {
    console.error('Erreur RSS:', error);
    container.innerHTML = `<p class="project-desc">Erreur de connexion au flux d'actualités.</p>`;
  }
}

// Appeler au chargement de la page : Curseur + Veille Technologique
window.addEventListener('DOMContentLoaded', () => {
  addCursorEffect();
  fetchVeille();
});

/* ── V3 NAV / SCROLL UI ─────────────────────────────────────────── */
(function(){
  const nav = document.querySelector('nav');
  const toggle = document.getElementById('navToggle');
  const backTop = document.getElementById('backTop');
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  if(toggle && nav){
    toggle.addEventListener('click',()=>{
      const open = nav.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });
    links.forEach(link=>link.addEventListener('click',()=>{
      nav.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded','false');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }));
  }

  const updateScrollUI = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
    let bar = document.getElementById('scrollProgress');
    if(!bar){
      bar = document.createElement('div');
      bar.id='scrollProgress';
      bar.style.cssText='position:fixed;left:0;top:0;width:0;height:2px;background:linear-gradient(90deg,#65ffb8,#45a7ff);z-index:10001;pointer-events:none;transition:width .08s linear;';
      document.body.appendChild(bar);
    }
    bar.style.width = progress + '%';
    if(backTop) backTop.classList.toggle('visible', window.scrollY > 500);
  };
  window.addEventListener('scroll',updateScrollUI,{passive:true});
  updateScrollUI();

  if(backTop) backTop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        const id = entry.target.id;
        links.forEach(link=>link.classList.toggle('active', link.getAttribute('href') === '#'+id));
      }
    });
  },{rootMargin:'-35% 0px -55% 0px',threshold:0});
  sections.forEach(section=>observer.observe(section));
})();

/* ── PREMIUM INTERACTIONS ─────────────────────────────────────── */
(function(){
  const recruiterToggle = document.getElementById('recruiterToggle');
  if(recruiterToggle){
    recruiterToggle.addEventListener('click',()=>{
      const active = document.body.classList.toggle('recruiter-mode');
      recruiterToggle.setAttribute('aria-pressed', String(active));
      recruiterToggle.querySelector('span').textContent = active ? 'Mode normal' : 'Mode recruteur';
      window.dispatchEvent(new Event('scroll'));
    });
  }

  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit',(event)=>{
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const subject = String(data.get('subject') || 'Prise de contact').trim();
      const message = String(data.get('message') || '').trim();
      const body = `Bonjour Romain,\n\n${message}\n\nNom : ${name}\nEmail : ${email}`;
      window.location.href = `mailto:joeckleromain598@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }
})();


/* V5 — clavier, resize et fermeture propre */
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  const nav = document.querySelector('nav');
  const toggle = document.getElementById('navToggle');
  if (nav && nav.classList.contains('menu-open')) {
    nav.classList.remove('menu-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  }

  document.querySelectorAll('.modal').forEach(modal => {
    if (getComputedStyle(modal).display !== 'none') {
      modal.style.display = 'none';
    }
  });
  document.body.style.overflow = '';
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 1100) {
    const nav = document.querySelector('nav');
    const toggle = document.getElementById('navToggle');
    if (nav) nav.classList.remove('menu-open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  }
});

/* ═══════════════════════════════════════════════════════════════════
   V8 — LONG INTRO / 3D-STYLE DRAGON / HERO POLISH
   ═══════════════════════════════════════════════════════════════════ */
(function(){
  const loader = document.getElementById('introLoader');
  const bar = document.getElementById('loaderProgressBar');
  const percent = document.getElementById('loaderPercent');
  const status = document.getElementById('loaderStatus');
  const skip = document.getElementById('loaderSkip');
  if (!loader) return;

  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const duration = reduced ? 250 : 1700;
  const startedAt = performance.now();
  let finished = false;

  const phases = [
    [0, 'BOOTING VISUAL CORE'],
    [18, 'MAPPING DRAGON GEOMETRY'],
    [38, 'CALIBRATING 3D PERSPECTIVE'],
    [58, 'SYNCHRONIZING NETWORK LAYERS'],
    [78, 'LOADING R//JOECKLE PROFILE'],
    [93, 'SECURE CHANNEL ESTABLISHED'],
    [100, 'SYSTEM READY']
  ];

  function update(now){
    if (finished) return;
    const elapsed = now - startedAt;
    const raw = Math.min(elapsed / duration, 1);
    // smooth, slower first half then accelerate into the finish
    const eased = raw < 0.78 ? raw * 0.88 / 0.78 : 0.88 + (raw - 0.78) * 0.12 / 0.22;
    const value = Math.round(Math.min(eased,1) * 100);
    if (bar) bar.style.width = value + '%';
    if (percent) percent.textContent = String(value).padStart(2,'0') + '%';
    let phaseText = phases[0][1];
    for (const [threshold, text] of phases) if (value >= threshold) phaseText = text;
    if (status) status.textContent = phaseText;
    if (raw < 1) requestAnimationFrame(update);
    else finish(false);
  }

  function finish(skipped){
    if (finished) return;
    finished = true;
    if (bar) bar.style.width = '100%';
    if (percent) percent.textContent = '100%';
    if (status) status.textContent = skipped ? 'SKIPPED · SYSTEM READY' : 'SYSTEM READY';
    document.body.classList.add('intro-complete');
    setTimeout(() => loader.classList.add('is-done'), skipped ? 20 : 0);
  }

  if (skip) skip.addEventListener('click', () => finish(true));
  requestAnimationFrame(update);

  // Safety net if the tab throttles animation frames.
  window.setTimeout(() => finish(false), duration + 500);

  // Subtle mouse-controlled camera motion: the dragon feels spatial without needing a 3D model.
  if (!reduced && window.matchMedia?.('(pointer:fine)').matches) {
    const visual = loader.querySelector('.loader-visual');
    if (visual) {
      window.addEventListener('pointermove', (event) => {
        if (finished) return;
        const x = (event.clientX / window.innerWidth - 0.5) * 2;
        const y = (event.clientY / window.innerHeight - 0.5) * 2;
        visual.style.setProperty('--mx', `${x.toFixed(3)}`);
        visual.style.setProperty('--my', `${y.toFixed(3)}`);
      }, {passive:true});
    }
  }
})();

/* Prevent accidental horizontal overflow from dynamic components. */
window.addEventListener('load', () => {
  document.documentElement.style.overflowX = 'hidden';
});

/* ═══════════════════════════════════════════════════════════════════
   V21 — LIGHTWEIGHT KALI FLIGHT
   Uses CSS 3D layers instead of WebGL. This keeps the wing beat visible
   while removing the continuous GPU render loop that caused stutter.
   ═══════════════════════════════════════════════════════════════════ */
(function initLightKaliFlight(){
  const loader = document.getElementById('introLoader');
  const visual = document.getElementById('dragon3dScene');
  if (!loader || !visual) return;
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  visual.classList.add('light-flight');

  const skip = document.getElementById('loaderSkip');
  const finish = () => {
    loader.classList.add('is-done');
    document.body.classList.add('intro-finished');
  };
  const introTimer = window.setTimeout(finish, 2050);
  if (skip) skip.addEventListener('click', () => { window.clearTimeout(introTimer); finish(); }, {once:true});
})();

window.addEventListener('load',()=>{ document.documentElement.style.overflowX='hidden'; });
