/* ============================================================
   MOTEUR DE RENDU — N'À PAS MODIFIER
   Injecte automatiquement les données de config.js dans le HTML
   ============================================================ */

(function() {
  if (!window.SITE_CONFIG) {
    console.error('config.js non chargé');
    return;
  }
  const C = window.SITE_CONFIG;

  // Helper : remplacer le contenu d'un élément par data-config
  function setText(selector, value) {
    document.querySelectorAll(selector).forEach(el => {
      el.innerHTML = value;
    });
  }

  function setAttr(selector, attr, value) {
    document.querySelectorAll(selector).forEach(el => {
      el.setAttribute(attr, value);
    });
  }

  // ========== APPLIQUER LES COULEURS ==========
  const root = document.documentElement;
  const c = C.couleurs;
  root.style.setProperty('--noir', c.noir);
  root.style.setProperty('--noir-2', c.noir_2);
  root.style.setProperty('--noir-3', c.noir_3);
  root.style.setProperty('--or', c.or);
  root.style.setProperty('--or-clair', c.or_clair);
  root.style.setProperty('--or-fonce', c.or_fonce);
  root.style.setProperty('--creme', c.creme);
  root.style.setProperty('--gris', c.gris);
  root.style.setProperty('--gris-clair', c.gris_clair);

  // ========== IDENTITÉ / TITLE / META ==========
  const pageTitle = document.title;
  if (pageTitle.includes('{{NOM}}')) {
    document.title = pageTitle.replace('{{NOM}}', C.identite.nom);
  }
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', C.identite.description_meta);

  // ========== NAV / LOGO ==========
  setText('[data-cfg="brand-prefix"]', C.identite.prefixe);
  setText('[data-cfg="brand-name"]', C.identite.nom_court);
  setText('[data-cfg="brand-full"]', C.identite.nom);

  // ========== HERO ==========
  setText('[data-cfg="hero-eyebrow"]', C.emplacement.label_court);
  setText('[data-cfg="hero-line1"]', C.identite.prefixe);
  setText('[data-cfg="hero-line2"]', C.identite.nom_court);
  setText('[data-cfg="hero-tagline"]', C.identite.tagline);
  setText('[data-cfg="hero-rating-text"]', `Noté ${C.avis.note_globale}/10 — ${C.avis.note_label}`);

  // ========== LIENS WHATSAPP ==========
  document.querySelectorAll('[data-cfg-href="whatsapp"]').forEach(el => {
    el.setAttribute('href', `https://wa.me/${C.contact.whatsapp}`);
  });
  document.querySelectorAll('[data-cfg-href="tel"]').forEach(el => {
    el.setAttribute('href', `tel:+${C.contact.telephone_brut}`);
  });
  document.querySelectorAll('[data-cfg-href="email"]').forEach(el => {
    el.setAttribute('href', `mailto:${C.contact.email}`);
  });
  setText('[data-cfg="tel-display"]', C.contact.telephone);
  setText('[data-cfg="email-display"]', C.contact.email);
  setText('[data-cfg="adresse-display"]', `${C.contact.adresse.ligne1}, ${C.contact.adresse.ligne2}`);

  // ========== INTRO ACCUEIL ==========
  setText('[data-cfg="intro-eyebrow"]', C.textes.accueil.intro_eyebrow);
  setText('[data-cfg="intro-titre"]', C.textes.accueil.intro_titre);
  setText('[data-cfg="intro-lead"]', C.textes.accueil.intro_lead);
  setText('[data-cfg="intro-citation"]', C.textes.accueil.citation_frame);

  // Features liste
  const featuresList = document.querySelector('[data-cfg="features-list"]');
  if (featuresList) {
    featuresList.innerHTML = C.logement.caracteristiques.map(f =>
      `<li><span class="check">✓</span> ${f}</li>`
    ).join('');
  }

  // ========== HIGHLIGHTS / POINTS FORTS ==========
  setText('[data-cfg="highlights-eyebrow"]', C.textes.accueil.highlights_eyebrow);
  setText('[data-cfg="highlights-titre"]', C.textes.accueil.highlights_titre);

  const highlightsGrid = document.querySelector('[data-cfg="highlights-grid"]');
  if (highlightsGrid) {
    highlightsGrid.innerHTML = C.points_forts.map(p => `
      <div class="highlight">
        <div class="highlight__num">${p.numero}</div>
        <h3>${p.titre}</h3>
        <p>${p.description}</p>
      </div>
    `).join('');
  }

  // ========== PREVIEW ACCUEIL ==========
  setText('[data-cfg="preview-eyebrow"]', C.textes.accueil.preview_eyebrow);
  setText('[data-cfg="preview-titre"]', C.textes.accueil.preview_titre);

  const previewGrid = document.querySelector('[data-cfg="preview-grid"]');
  if (previewGrid) {
    const imgPrefix = previewGrid.dataset.imgPath || 'images/';
    previewGrid.innerHTML = C.preview_accueil.map(p => `
      <a href="${previewGrid.dataset.galerieHref || 'pages/galerie.html'}" class="preview__item ${p.grand ? 'preview__item--lg' : ''}">
        <div class="preview__img" style="background-image:url('${imgPrefix}${p.src}')"></div>
        <span class="preview__label">${p.label}</span>
      </a>
    `).join('');
  }

  // ========== TESTIMONIAL ACCUEIL ==========
  setText('[data-cfg="citation-principale"]', `« ${C.avis.citation_principale} »`);
  setText('[data-cfg="citation-cite"]', `— Avis voyageur · ${C.avis.note_globale}/10 ${C.avis.note_label}`);

  // ========== CTA FINAL ==========
  setText('[data-cfg="cta-titre"]', C.textes.accueil.cta_titre);
  setText('[data-cfg="cta-texte"]', C.textes.accueil.cta_texte);

  // ========== FOOTER ==========
  setText('[data-cfg="footer-brand"]', C.identite.nom);
  setText('[data-cfg="footer-tagline"]', `Votre cocon tropical<br>au ${C.contact.adresse.ligne1}, ${C.contact.adresse.ligne2}.`);
  setText('[data-cfg="copyright"]', `© ${C.identite.annee_copyright} ${C.identite.nom} · ${C.identite.slogan}`);

  // ========== GALERIE COMPLÈTE ==========
  const galleryGrid = document.querySelector('[data-cfg="gallery-grid"]');
  if (galleryGrid) {
    const imgPrefix = galleryGrid.dataset.imgPath || '../images/';
    galleryGrid.innerHTML = C.galerie.map(img => `
      <div class="gallery__item ${img.taille || ''}">
        <img src="${imgPrefix}${img.src}" alt="${img.alt}">
      </div>
    `).join('');
  }

  // Page galerie textes
  setText('[data-cfg="galerie-eyebrow"]', C.textes.galerie.header_eyebrow);
  setText('[data-cfg="galerie-titre"]', C.textes.galerie.header_titre);
  setText('[data-cfg="galerie-soustitre"]', C.textes.galerie.header_sous_titre);
  setText('[data-cfg="galerie-cta-titre"]', C.textes.galerie.cta_titre);
  setText('[data-cfg="galerie-cta-texte"]', C.textes.galerie.cta_texte);

  // ========== ÉQUIPEMENTS ==========
  setText('[data-cfg="equipements-eyebrow"]', C.textes.equipements.header_eyebrow);
  setText('[data-cfg="equipements-titre"]', C.textes.equipements.header_titre);
  setText('[data-cfg="equipements-soustitre"]', C.textes.equipements.header_sous_titre);
  setText('[data-cfg="equipements-cta-titre"]', C.textes.equipements.cta_titre);
  setText('[data-cfg="equipements-cta-texte"]', C.textes.equipements.cta_texte);

  const equipContainer = document.querySelector('[data-cfg="equipements-container"]');
  if (equipContainer) {
    equipContainer.innerHTML = C.equipements.map(cat => `
      <div class="equip-category">
        <h2>${cat.categorie}</h2>
        <div class="equip-grid">
          ${cat.items.map(it => `
            <div class="equip-item">
              <div class="equip-icon">${it.icone}</div>
              <div>
                <h3>${it.titre}</h3>
                <p>${it.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
  }

  // ========== AVIS ==========
  setText('[data-cfg="avis-eyebrow"]', C.textes.avis.header_eyebrow);
  setText('[data-cfg="avis-titre"]', C.textes.avis.header_titre);
  setText('[data-cfg="avis-soustitre"]', C.textes.avis.header_sous_titre);
  setText('[data-cfg="avis-note-num"]', C.avis.note_globale);
  setText('[data-cfg="avis-note-label"]', C.avis.note_label);

  const criteresContainer = document.querySelector('[data-cfg="avis-criteres"]');
  if (criteresContainer) {
    criteresContainer.innerHTML = C.avis.criteres.map(cr => `
      <div class="criteria-item"><span>${cr.nom}</span><span>${cr.note}</span></div>
    `).join('');
  }

  const avisContainer = document.querySelector('[data-cfg="avis-list"]');
  if (avisContainer) {
    avisContainer.innerHTML = C.avis.temoignages.map(t => `
      <article class="review">
        <div class="review__header">
          <div class="review__avatar">${t.initiale}</div>
          <div class="review__info">
            <h4>${t.nom}</h4>
            <span>${t.contexte}</span>
          </div>
          <div class="review__score">${t.note}</div>
        </div>
        <p>${t.texte}</p>
      </article>
    `).join('');
  }

  setText('[data-cfg="citation-finale"]', `« ${C.avis.citation_finale} »`);
  setText('[data-cfg="avis-cta-titre"]', C.textes.avis.cta_titre);
  setText('[data-cfg="avis-cta-texte"]', C.textes.avis.cta_texte);

  // ========== RÉSERVATION ==========
  setText('[data-cfg="reservation-eyebrow"]', C.textes.reservation.header_eyebrow);
  setText('[data-cfg="reservation-titre"]', C.textes.reservation.header_titre);
  setText('[data-cfg="reservation-soustitre"]', C.textes.reservation.header_sous_titre);
  setText('[data-cfg="reservation-form-titre"]', C.textes.reservation.form_titre);
  setText('[data-cfg="reservation-form-intro"]', C.textes.reservation.form_intro);
  setText('[data-cfg="reservation-form-success"]', C.textes.reservation.form_success);

  // Options nombre de voyageurs (selon nb_voyageurs_max)
  const guestsSelect = document.querySelector('[data-cfg="guests-select"]');
  if (guestsSelect) {
    const max = C.logement.nb_voyageurs_max;
    let opts = '<option value="">— Sélectionner —</option>';
    for (let i = 1; i <= max; i++) {
      opts += `<option value="${i}">${i} personne${i > 1 ? 's' : ''}</option>`;
    }
    opts += `<option value="${max+1}+">${max+1} personnes ou plus</option>`;
    guestsSelect.innerHTML = opts;
  }

})();
