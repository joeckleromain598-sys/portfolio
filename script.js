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
});

function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

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