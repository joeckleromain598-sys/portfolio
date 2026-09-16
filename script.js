(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const body = document.body;
  const cursor = $('#cursor');
  const cursorRing = $('#cursorRing');

  function setBodyLocked(locked) {
    body.style.overflow = locked ? 'hidden' : '';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    setBodyLocked(false);
  }

  function openModal(modal) {
    if (!modal) return;
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    setBodyLocked(true);
    const close = $('.close-modal, .project-modal-close', modal);
    close?.focus();
  }

  // ------------------------------------------------------------
  // CUSTOM CURSOR — guarded so one missing element cannot break JS
  // ------------------------------------------------------------
  let rafCursor = 0;
  if (cursor && cursorRing && matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
      cursorRing.style.left = `${event.clientX}px`;
      cursorRing.style.top = `${event.clientY}px`;
      if (!rafCursor) {
        rafCursor = requestAnimationFrame(() => {
          rafCursor = 0;
        });
      }
    }, { passive: true });
  }

  function addCursorEffect() {
    if (!cursor || !cursorRing) return;
    $$("a, button, .tp-card, .close-modal, .download-btn, .project-link").forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width = '24px';
        cursor.style.height = '24px';
        cursorRing.style.width = '60px';
        cursorRing.style.height = '60px';
      }, { passive: true });
      el.addEventListener('mouseleave', () => {
        cursor.style.width = '12px';
        cursor.style.height = '12px';
        cursorRing.style.width = '40px';
        cursorRing.style.height = '40px';
      }, { passive: true });
    });
  }

  // ------------------------------------------------------------
  // REVEAL — starts safely after DOM is ready
  // ------------------------------------------------------------
  function initReveal() {
    const items = $$('.reveal');
    if (!('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    items.forEach(el => observer.observe(el));
  }

  // ------------------------------------------------------------
  // MOBILE NAV + RECRUITER MODE + BACK TOP
  // ------------------------------------------------------------
  function initNavigation() {
    const nav = $('nav');
    const toggle = $('#navToggle');
    toggle?.addEventListener('click', () => {
      const open = nav?.classList.toggle('menu-open') ?? false;
      toggle.setAttribute('aria-expanded', String(open));
    });
    $$('.nav-links a').forEach(link => link.addEventListener('click', () => {
      nav?.classList.remove('menu-open');
      toggle?.setAttribute('aria-expanded', 'false');
    }));

    const recruiter = $('#recruiterToggle');
    recruiter?.addEventListener('click', () => {
      const active = !recruiter.classList.contains('is-active');
      recruiter.classList.toggle('is-active', active);
      recruiter.setAttribute('aria-pressed', String(active));
      document.documentElement.classList.toggle('recruiter-mode', active);
      const label = $('span', recruiter);
      if (label) label.textContent = active ? 'Mode normal' : 'Mode recruteur';
    });

    const backTop = $('#backTop');
    const updateBackTop = () => {
      const show = window.scrollY > 700;
      backTop?.classList.toggle('show', show);
    };
    window.addEventListener('scroll', updateBackTop, { passive: true });
    backTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    updateBackTop();
  }

  // ------------------------------------------------------------
  // INTRO — short and guaranteed to disappear
  // ------------------------------------------------------------
  function initIntro() {
    const loader = $('#introLoader');
    if (!loader) return;
    const skip = $('#loaderSkip');
    const percent = $('#loaderPercent');
    const bar = $('#loaderProgressBar');
    const status = $('#loaderStatus');
    const duration = 2000;
    let finished = false;
    const states = ['INITIALISATION…','CHARGEMENT…','SYSTÈMES PRÊTS','ACCÈS AUTORISÉ'];

    const finish = () => {
      if (finished) return;
      finished = true;
      loader.classList.add('is-done');
      window.setTimeout(() => loader.remove(), 420);
    };
    skip?.addEventListener('click', finish);

    const start = performance.now();
    const tick = (now) => {
      if (finished) return;
      const progress = Math.min(1, (now - start) / duration);
      const pct = Math.round(progress * 100);
      if (percent) percent.textContent = `${pct}%`;
      if (bar) bar.style.width = `${pct}%`;
      if (status) status.textContent = states[Math.min(states.length - 1, Math.floor(progress * states.length))];
      if (progress < 1) requestAnimationFrame(tick);
      else finish();
    };
    requestAnimationFrame(tick);
  }

  // ------------------------------------------------------------
  // PROFILE
  // ------------------------------------------------------------
  function openProfileDetails() {
    openModal($('#profileModal'));
  }
  window.openProfileDetails = openProfileDetails;

  // ------------------------------------------------------------
  // SKILLS
  // ------------------------------------------------------------
  const skillDetails = {
    network: { icon:'<i class="fa-solid fa-network-wired"></i>', title:'Réseaux & Systèmes', intro:"Je développe mes bases d'administration réseau et système autour du modèle OSI/TCP-IP, des services réseau et des environnements Linux/virtualisés.", points:['Adressage IP, compréhension des réseaux LAN et des flux TCP/IP.','Configuration et compréhension des services DNS et DHCP.','Mise en œuvre et lecture d’architectures Cisco dans les TPs réseau.','Administration de base sous Linux et travail en environnement virtualisé.'], tools:['IP / DNS / DHCP','LAN','Cisco','OSI / TCP-IP','Linux','VM'], footer:'Cette compétence est directement liée à mon parcours BTS SIO SISR et à mes travaux pratiques réseau.' },
    security: { icon:'<i class="fa-solid fa-shield-halved"></i>', title:'Cybersécurité', intro:'Je travaille les fondamentaux de la sécurité des systèmes et réseaux, avec une approche orientée protection, analyse et compréhension des risques.', points:['Compréhension des principes de cryptographie et de protection des échanges.','Sécurisation des accès et des réseaux dans les configurations étudiées.','Identification et analyse de vulnérabilités dans des scénarios pédagogiques.','Prise en compte des risques et des bonnes pratiques de sécurisation.'], tools:['Cryptographie','Sécurité réseaux','ACL','GPO','Analyse de vulnérabilités'], footer:'Mes TPs BTS SIO abordent notamment la sécurité réseau, les ACL et l’administration sécurisée.' },
    web: { icon:'<i class="fa-solid fa-code"></i>', title:'Développement Web', intro:'Je réalise des sites web en combinant structure, mise en forme, interactions côté client et gestion de données.', points:['Création de pages structurées avec HTML et CSS responsive.','Ajout d’interactions et de fonctionnalités avec JavaScript.','Bases de développement PHP et de connexion à des bases SQL.','Déploiement et maintenance de projets web avec GitHub et Vercel.'], tools:['HTML / CSS','JavaScript','PHP','SQL','Visual Studio','GitHub / Vercel'], footer:'Mon portfolio lui-même est un projet concret de cette compétence.' },
    embedded: { icon:'<i class="fa-solid fa-robot"></i>', title:'Systèmes Embarqués', intro:'Je conserve une base issue de mon parcours STI2D dans les systèmes embarqués et les objets connectés.', points:['Programmation et prototypage avec Arduino et C / C++.','Utilisation de capteurs, actionneurs et modules de communication.','Mise en œuvre de RFID et Bluetooth dans des projets connectés.','Création d’interfaces Android pour piloter ou accompagner un système.'], tools:['Arduino','C / C++','Android Studio','RFID','Bluetooth'], footer:'Cette compétence est notamment illustrée par mon projet de distributeur automatique de nourriture.' },
    content: { icon:'<i class="fa-solid fa-photo-film"></i>', title:'Création de Contenus', intro:'En parallèle de l’informatique, je produis et diffuse du contenu numérique avec ma marque Ryokoo.', points:['Montage vidéo et préparation de formats pour YouTube et les réseaux.','Création et optimisation de miniatures et éléments graphiques.','Utilisation du SEO et analyse des performances des publications.','Gestion du site et du déploiement avec GitHub et Vercel.'], tools:['Photoshop','CapCut','Filmora','SEO','GitHub','Vercel'], footer:'Le projet Ryokoo me permet de combiner création, technique, organisation et suivi des performances.' },
    soft: { icon:'<i class="fa-solid fa-bolt"></i>', title:'Soft Skills', intro:'Des qualités de travail utiles autant en entreprise que dans les projets scolaires et personnels.', points:['Autonomie dans la réalisation et la recherche de solutions.','Esprit d’équipe et capacité à travailler dans un cadre professionnel.','Créativité pour concevoir des projets et trouver des solutions.','Minutie dans la configuration, la documentation et la présentation.','Permis B.'], tools:['Autonomie','Esprit d’équipe','Créativité','Rigueur','Minutie','Permis B'], footer:'Ces qualités sont développées à travers mes études, mes projets personnels et mon expérience en entreprise.' }
  };

  function openSkillDetails(key) {
    const item = skillDetails[key];
    const modal = $('#skillModal');
    if (!item || !modal) return;
    $('#skillModalIcon').innerHTML = item.icon;
    $('#skillModalTitle').textContent = item.title;
    $('#skillModalKicker').textContent = 'COMPÉTENCE · DÉTAIL';
    $('#skillModalIntro').textContent = item.intro;
    $('#skillModalPoints').innerHTML = item.points.map(point => `<li>${point}</li>`).join('');
    $('#skillModalTools').innerHTML = item.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('');
    $('#skillModalFooter').textContent = item.footer;
    openModal(modal);
  }
  window.openSkillDetails = openSkillDetails;
  window.closeSkillDetails = () => closeModal($('#skillModal'));

  // ------------------------------------------------------------
  // EXPERIENCES
  // ------------------------------------------------------------
  const experienceDetails = {
    'veolia-current': {title:'Alternant — Veolia RVD', badge:'EXPÉRIENCE ACTUELLE', intro:'Alternance débutée en septembre 2026 chez Veolia RVD, en parallèle du BTS SIO SISR.', points:['Mise en pratique des connaissances acquises en systèmes et réseaux dans un environnement professionnel.','Découverte des méthodes, outils et contraintes d’un service informatique en entreprise.','Progression sur l’administration, le support et les problématiques d’infrastructure selon les missions confiées.'], tools:['Veolia RVD','BTS SIO SISR','Systèmes','Réseaux','Administration'], footer:'Expérience actuellement en cours.'},
    'veolia-stage': {title:'Stage — Veolia RVD', badge:'EXPÉRIENCE TERMINÉE', intro:'Stage professionnel de 5 semaines réalisé du 27 juillet au 28 août 2026 chez Veolia RVD, avant le début de mon alternance.', points:['Première immersion dans l’environnement professionnel de Veolia RVD.','Découverte du fonctionnement d’un service et de ses contraintes opérationnelles.','Transition directe vers l’alternance débutée en septembre 2026.'], tools:['Veolia RVD','5 semaines','27 juillet → 28 août 2026'], footer:'Stage terminé avant le début de mon alternance.'},
    creator: {title:'Créateur de Contenus Vidéo', badge:'EXPÉRIENCE EN COURS', intro:'Depuis avril 2025, je développe mon activité de création de contenus autour de la marque Ryokoo.', points:['Création et gestion d’une chaîne YouTube et de contenus numériques.','Montage vidéo, miniatures, optimisation SEO et suivi des statistiques.','Administration et évolution du site avec GitHub et Vercel.','Gestion et développement d’une communauté autour des contenus.'], tools:['YouTube','Photoshop','CapCut','Filmora','SEO','GitHub','Vercel'], footer:'Cette expérience complète mon profil technique par une pratique régulière du numérique et de la gestion de projet.'},
    losch: {title:'Stage de 3ème — Diagnostic Automobile', badge:'EXPÉRIENCE TERMINÉE', intro:'Stage de 3ème réalisé en décembre 2021 chez Martin Losch à Esch-sur-Alzette, au Luxembourg.', points:['Utilisation de logiciels de diagnostic automobile dans un environnement professionnel.','Découverte des outils numériques de recherche et de détection de pannes.','Observation des systèmes électroniques et embarqués du secteur automobile.','Première découverte des méthodes de travail en entreprise.'], tools:['Martin Losch Luxembourg','Volkswagen','SEAT','Audi','Diagnostic'], footer:'Première expérience professionnelle, terminée en décembre 2021.'}
  };

  function openExperienceDetails(key) {
    const item = experienceDetails[key];
    const modal = $('#experienceModal');
    if (!item || !modal) return;
    $('#experienceModalTitle').textContent = item.title;
    $('#experienceModalBadge').textContent = item.badge;
    $('#experienceModalIntro').textContent = item.intro;
    $('#experienceModalPoints').innerHTML = item.points.map(point => `<li>${point}</li>`).join('');
    $('#experienceModalTools').innerHTML = item.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('');
    $('#experienceModalFooter').textContent = item.footer;
    openModal(modal);
  }
  window.openExperienceDetails = openExperienceDetails;
  window.closeExperienceDetails = () => closeModal($('#experienceModal'));

  // ------------------------------------------------------------
  // FORMATIONS
  // ------------------------------------------------------------
  const formationDetails = {
    'bts-sio': {
      title:'BTS SIO option SISR',
      badge:'FORMATION · EN COURS',
      intro:"Formation suivie à Campus Ynov France — Val d'Europe, dans le parcours SISR, en alternance depuis septembre 2026.",
      points:[
        'Étude, conception et exploitation des réseaux informatiques et des systèmes.',
        'Travaux pratiques autour de Linux, Windows Server, Active Directory, DNS, Apache, GLPI et des environnements réseau.',
        'Développement d’une approche orientée administration, infrastructure et cybersécurité.',
        'Formation suivie en parallèle de mon alternance chez Veolia RVD.'
      ],
      tools:['BTS SIO SISR','Campus Ynov — Val d’Europe','Réseaux','Systèmes','Cybersécurité','Veolia RVD'],
      footer:'Formation en cours sur la période 2025–2027.'
    },
    'sti2d': {
      title:'Baccalauréat STI2D option SIN',
      badge:'FORMATION · TERMINÉE',
      intro:'Baccalauréat obtenu en 2025 au Lycée Jules Ferry — Coulommiers, dans la spécialité Systèmes d’Information et Numérique.',
      points:[
        'Formation orientée systèmes d’information et numérique.',
        'Découverte des systèmes embarqués, de la programmation et des technologies numériques.',
        'Projet et travail autour de la conception de systèmes techniques.',
        'Cette formation constitue la base de mon parcours actuel en informatique et systèmes.'
      ],
      tools:['STI2D','SIN','Systèmes numériques','Programmation','Systèmes embarqués','Lycée Jules Ferry'],
      footer:'Diplôme obtenu en 2025.'
    }
  };

  function openFormationDetails(key) {
    const item = formationDetails[key];
    const modal = $('#formationModal');
    if (!item || !modal) return;
    $('#formationModalTitle').textContent = item.title;
    $('#formationModalBadge').textContent = item.badge;
    $('#formationModalIntro').textContent = item.intro;
    $('#formationModalPoints').innerHTML = item.points.map(point => `<li>${point}</li>`).join('');
    $('#formationModalTools').innerHTML = item.tools.map(tool => `<span class="tool-tag">${tool}</span>`).join('');
    $('#formationModalFooter').textContent = item.footer;
    openModal(modal);
  }
  window.openFormationDetails = openFormationDetails;

  // ------------------------------------------------------------
  // PROJECTS
  // ------------------------------------------------------------
  const projectMap = {
    'ryokoo-content': 'projectRyokooContentModal',
    'ryokoo-site': 'projectRyokooSiteModal',
    'food-dispenser': 'distribModal',
    'site-vitrine': 'siteModal',
    'admin-network': 'u5Modal'
  };

  // ------------------------------------------------------------
  // LEGACY / INLINE MODAL FUNCTIONS
  // ------------------------------------------------------------
  window.openU5Modal = (event) => { event?.preventDefault(); openModal($('#u5Modal')); };
  window.closeU5Modal = () => closeModal($('#u5Modal'));
  window.openTPModal = (tpId) => { closeModal($('#u5Modal')); openModal($(`#${tpId}Modal`)); };
  window.closeTPModal = (tpId) => { closeModal($(`#${tpId}Modal`)); openModal($('#u5Modal')); };
  window.openDistribModal = (event) => { event?.preventDefault(); openModal($('#distribModal')); };
  window.closeDistribModal = () => closeModal($('#distribModal'));
  window.openSiteModal = (event) => { event?.preventDefault(); openModal($('#siteModal')); };
  window.closeSiteModal = () => closeModal($('#siteModal'));

  // ------------------------------------------------------------
  // CONTACT FORM
  // ------------------------------------------------------------
  function initContact() {
    const form = $('#contactForm');
    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const subject = encodeURIComponent(String(data.get('subject') || 'Prise de contact'));
      const bodyText = `Bonjour Romain,\n\nNom : ${data.get('name') || ''}\nEmail : ${data.get('email') || ''}\n\n${data.get('message') || ''}`;
      window.location.href = `mailto:joeckleromain598@gmail.com?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
    });
  }

  // ------------------------------------------------------------
  // GLOBAL EVENT DELEGATION
  // ------------------------------------------------------------
  function initInteractions() {
    document.addEventListener('click', (event) => {
      const closeButton = event.target.closest('.close-modal, [data-close-project]');
      if (closeButton) {
        const targetId = closeButton.dataset.closeProject || closeButton.closest('.modal')?.id;
        const targetModal = targetId ? document.getElementById(targetId) : closeButton.closest('.modal');
        closeModal(targetModal);
        return;
      }

      if (event.target.closest('#profileDetailTrigger')) {
        event.preventDefault();
        openProfileDetails();
        return;
      }

      const skillCard = event.target.closest('.skill-card-button');
      if (skillCard) {
        event.preventDefault();
        openSkillDetails(skillCard.dataset.skill);
        return;
      }

      const experienceCard = event.target.closest('.experience-detail-card');
      if (experienceCard && !event.target.closest('a,button,input,select,textarea')) {
        event.preventDefault();
        openExperienceDetails(experienceCard.dataset.experience);
        return;
      }

      const projectCard = event.target.closest('.project-card-button');
      if (projectCard && !event.target.closest('a,button,input,select,textarea')) {
        event.preventDefault();
        openModal($(`#${projectMap[projectCard.dataset.project]}`));
        return;
      }

      const formationCard = event.target.closest('.formation-detail-card');
      if (formationCard && !event.target.closest('a,button,input,select,textarea')) {
        event.preventDefault();
        openFormationDetails(formationCard.dataset.formation);
        return;
      }

      const closeBtn = event.target.closest('[data-close-project]');
      if (closeBtn) {
        closeModal($(`#${closeBtn.dataset.closeProject}`));
        return;
      }

      const clickedModal = event.target.closest('.modal');
      if (clickedModal && event.target === clickedModal) closeModal(clickedModal);

    });

    document.addEventListener('keydown', (event) => {
      const activeCard = event.target.closest?.('.skill-card-button, .experience-detail-card, .project-card-button, .formation-detail-card');
      if (activeCard && (event.key === 'Enter' || event.key === ' ')) {
        event.preventDefault();
        if (activeCard.classList.contains('skill-card-button')) openSkillDetails(activeCard.dataset.skill);
        else if (activeCard.classList.contains('experience-detail-card')) openExperienceDetails(activeCard.dataset.experience);
        else if (activeCard.classList.contains('formation-detail-card')) openFormationDetails(activeCard.dataset.formation);
        else openModal($(`#${projectMap[activeCard.dataset.project]}`));
      }
      if (event.key === 'Escape') {
        $$('.modal').forEach(modal => {
          if (getComputedStyle(modal).display !== 'none') closeModal(modal);
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initIntro();
    initReveal();
    initNavigation();
    initContact();
    initInteractions();
    addCursorEffect();
  }, { once: true });
})();
