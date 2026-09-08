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

// Appeler au chargement de la page
window.addEventListener('DOMContentLoaded', addCursorEffect);