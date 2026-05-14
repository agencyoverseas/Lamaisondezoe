/* ============================================================
   ESPACE CLIENT — Logique des 5 étapes
   ============================================================ */

const EspaceClient = {

  reservation: null,
  signaturePad: null,
  signatureCtx: null,
  isDrawing: false,
  stripe: null,
  stripeElements: null,
  stripeCard: null,

  /* ============================================================
     INIT
     ============================================================ */
  init() {
    // 1. Récupérer token depuis URL ou créer nouvelle session
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      const res = Booking.getReservation(token);
      if (res && !res.erreur) {
        this.reservation = res;
        this.goStep(res.etape || 1);
        this.prefillForm();
      } else if (res && res.erreur) {
        alert(res.erreur);
      }
    } else {
      // Pré-remplir depuis les paramètres URL (venant du site)
      const form = document.getElementById('formReservation');
      if (form) {
        ['nom', 'email', 'telephone', 'arrivee', 'depart', 'nb_voyageurs', 'message'].forEach(field => {
          const v = params.get(field);
          if (v && form.elements[field]) form.elements[field].value = v;
        });
      }
    }

    // 2. Bind formulaire étape 1
    document.getElementById('formReservation')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.traiterFormulaire(e.target);
    });

    // 3. Init signature pad
    this.initSignaturePad();

    // 4. Init Stripe (si clé présente)
    this.initStripe();

    // 5. Bind bouton paiement
    document.getElementById('btnPaiement')?.addEventListener('click', () => this.lancerPaiement());

    // 6. Date min = aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]').forEach(input => {
      input.min = today;
    });

    // 7. Charger calendrier de disponibilités sur étape 1
    this.chargerCalendrierDispo();
  },

  /* ============================================================
     CALENDRIER DE DISPONIBILITÉS (étape 1)
     ============================================================ */
  async chargerCalendrierDispo() {
    if (window.CalendarService && document.getElementById('calendrierDispo')) {
      await CalendarService.afficherCalendrier('calendrierDispo', {
        nb_mois: 4,
        onSelect: (date) => this.selectionnerDate(date)
      });
    }
  },

  selectionnerDate(date) {
    const inputArrivee = document.querySelector('input[name="arrivee"]');
    const inputDepart = document.querySelector('input[name="depart"]');
    if (!inputArrivee.value || inputDepart.value) {
      // Sélectionner comme arrivée
      inputArrivee.value = date;
      inputDepart.value = '';
    } else {
      // Sélectionner comme départ (doit être après arrivée)
      if (date > inputArrivee.value) {
        inputDepart.value = date;
      } else {
        inputArrivee.value = date;
        inputDepart.value = '';
      }
    }
  },

  /* ============================================================
     NAVIGATION ENTRE ÉTAPES
     ============================================================ */
  goStep(num) {
    // UI : barre de progression
    document.querySelectorAll('.ec-step').forEach(el => {
      const step = parseInt(el.dataset.step);
      el.classList.remove('active', 'done');
      if (step < num) el.classList.add('done');
      if (step === num) el.classList.add('active');
    });

    // UI : sections
    document.querySelectorAll('.ec-section').forEach(s => s.classList.remove('active'));
    document.querySelector(`[data-content="${num}"]`)?.classList.add('active');

    // Sauvegarder étape
    if (this.reservation) {
      Booking.updateReservation(this.reservation.token, { etape: num });
    }

    // Actions spécifiques par étape
    if (num === 2) this.afficherRecap();
    if (num === 3) {
      this.afficherContrat();
      // Reconfigurer canvas APRÈS que la section soit visible
      setTimeout(() => this.configurerCanvas(), 100);
    }
    if (num === 4) this.afficherPaiement();
    if (num === 5) this.afficherConfirmation();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  /* ============================================================
     ÉTAPE 1 : TRAITER FORMULAIRE
     ============================================================ */
  async traiterFormulaire(form) {
    const data = Object.fromEntries(new FormData(form));
    const erreurDiv = document.getElementById('erreurTarif');
    erreurDiv.style.display = 'none';

    // Vérifier disponibilité avec le calendrier
    if (window.CalendarService) {
      await CalendarService.chargerICal();
      const dispo = CalendarService.periodeDisponible(data.arrivee, data.depart);
      if (!dispo.disponible) {
        erreurDiv.textContent = `❌ Ces dates ne sont pas disponibles. Veuillez consulter le calendrier ci-dessous.`;
        erreurDiv.style.display = 'block';
        return;
      }
    }

    // Calculer le tarif
    const tarif = Booking.calculerTarif(data.arrivee, data.depart, parseInt(data.nb_voyageurs));

    if (tarif.erreur) {
      erreurDiv.textContent = tarif.erreur;
      erreurDiv.style.display = 'block';
      return;
    }

    // Créer/mettre à jour la réservation
    const donneesReservation = {
      ...data,
      tarif,
      etape: 2
    };

    if (this.reservation) {
      this.reservation = Booking.updateReservation(this.reservation.token, donneesReservation);
    } else {
      const lien = Booking.genererLienMagique(donneesReservation);
      this.reservation = lien.reservation;
      window.history.replaceState({}, '', `?token=${lien.token}`);

      // Envoyer email avec lien magique (en arrière-plan, ne bloque pas)
      if (window.EmailService) {
        EmailService.envoyerLienMagique(this.reservation, lien.url)
          .then(r => console.log('Email lien magique :', r));
      }
    }

    this.goStep(2);
  },

  prefillForm() {
    if (!this.reservation) return;
    const form = document.getElementById('formReservation');
    if (!form) return;
    Object.entries(this.reservation).forEach(([key, value]) => {
      const input = form.elements[key];
      if (input && typeof value === 'string') input.value = value;
    });
  },

  /* ============================================================
     ÉTAPE 2 : RÉCAPITULATIF
     ============================================================ */
  afficherRecap() {
    const r = this.reservation;
    if (!r) return;
    const t = r.tarif;

    document.getElementById('recapClient').innerHTML = `
      <h3>Vos informations</h3>
      <div class="ec-card__row"><span>Nom</span><strong>${r.nom}</strong></div>
      <div class="ec-card__row"><span>Email</span><strong>${r.email}</strong></div>
      <div class="ec-card__row"><span>Téléphone</span><strong>${r.telephone}</strong></div>
      <div class="ec-card__row"><span>Arrivée</span><strong>${Booking.formatDate(r.arrivee)}</strong></div>
      <div class="ec-card__row"><span>Départ</span><strong>${Booking.formatDate(r.depart)}</strong></div>
      <div class="ec-card__row"><span>Durée</span><strong>${t.nbNuits} nuits</strong></div>
      <div class="ec-card__row"><span>Voyageurs</span><strong>${r.nb_voyageurs}</strong></div>
      ${r.message ? `<div class="ec-card__row"><span>Message</span><strong>${r.message}</strong></div>` : ''}
    `;

    document.getElementById('recapTarif').innerHTML = `
      <h3>Détail du tarif</h3>
      <div class="ec-card__row"><span>Hébergement (${t.nbNuits} nuits)</span><strong>${Booking.formatPrix(t.detail.hebergement)}</strong></div>
      <div class="ec-card__row"><span>Forfait ménage</span><strong>${Booking.formatPrix(t.detail.menage)}</strong></div>
      <div class="ec-card__row"><span>Taxe de séjour</span><strong>${Booking.formatPrix(t.detail.taxe_sejour)}</strong></div>
      <div class="ec-card__total"><span>TOTAL</span><strong>${Booking.formatPrix(t.total)}</strong></div>
      <div class="ec-card__acompte">
        <span>Acompte à régler maintenant (30%)</span>
        <strong>${Booking.formatPrix(t.acompte)}</strong>
      </div>
      <div class="ec-card__acompte" style="background:rgba(201,169,97,.05);border-left-color:var(--gris-clair)">
        <span>Solde à régler avant arrivée (70%)</span>
        <strong>${Booking.formatPrix(t.solde)}</strong>
      </div>
      <div style="margin-top:1rem;font-size:.85rem;color:var(--gris-clair);font-style:italic">
        + Caution de ${Booking.formatPrix(t.detail.caution)} demandée à l'arrivée (restituée au départ)
      </div>
    `;
  },

  /* ============================================================
     ÉTAPE 3 : CONTRAT + SIGNATURE
     ============================================================ */
  afficherContrat() {
    const r = this.reservation;
    const cfg = window.SITE_CONFIG.contrat;
    if (!r) return;

    const proprietaire = cfg.proprietaire;
    const bien = cfg.bien;

    let html = `
      <div class="ec-contrat__header">
        <h2>Contrat de location saisonnière</h2>
        <p style="font-family:var(--f-sans);font-size:.75rem;letter-spacing:.2em;color:var(--gris-clair);text-transform:uppercase">
          Établi le ${new Date().toLocaleDateString('fr-FR')} · Ref. ${r.token.substring(0, 8).toUpperCase()}
        </p>
      </div>

      <div class="ec-contrat__parties">
        <div class="ec-contrat__partie">
          <h4>Entre le propriétaire (« le bailleur »)</h4>
          <p>
            <strong>${proprietaire.nom_complet}</strong><br>
            ${proprietaire.adresse}<br>
            ${proprietaire.email}<br>
            ${proprietaire.telephone}
          </p>
        </div>
        <div class="ec-contrat__partie">
          <h4>Et le locataire (« le preneur »)</h4>
          <p>
            <strong>${r.nom}</strong><br>
            ${r.email}<br>
            ${r.telephone}
          </p>
        </div>
      </div>

      <div style="background:var(--noir);padding:1rem;margin-bottom:2rem;border:1px solid rgba(201,169,97,.15)">
        <h4 style="font-family:var(--f-sans);font-size:.7rem;letter-spacing:.3em;text-transform:uppercase;color:var(--or);margin-bottom:.6rem">Objet de la location</h4>
        <p style="font-size:.9rem">
          <strong>${bien.nom}</strong> — ${bien.type}<br>
          ${bien.adresse}<br>
          ${bien.pieces}
        </p>
      </div>
    `;

    cfg.clauses.forEach(clause => {
      html += `
        <div class="ec-contrat__clause">
          <h3>${clause.titre}</h3>
          <p>${Booking.remplirContrat(clause.texte, r)}</p>
        </div>
      `;
    });

    document.getElementById('contratContent').innerHTML = html;
  },

  /* ============================================================
     SIGNATURE PAD (canvas)
     ============================================================ */
  initSignaturePad() {
    this.signaturePad = document.getElementById('signaturePad');
    if (!this.signaturePad) return;

    // Configurer le canvas (sera reconfiguré quand l'étape 3 sera affichée)
    this.configurerCanvas();

    // Pointer events (souris + tactile)
    this.signaturePad.addEventListener('pointerdown', (e) => this.startDraw(e));
    this.signaturePad.addEventListener('pointermove', (e) => this.draw(e));
    this.signaturePad.addEventListener('pointerup', () => this.stopDraw());
    this.signaturePad.addEventListener('pointercancel', () => this.stopDraw());
    this.signaturePad.addEventListener('pointerleave', () => this.stopDraw());

    // Empêcher le scroll sur mobile pendant la signature
    this.signaturePad.addEventListener('touchstart', e => e.preventDefault(), { passive: false });
    this.signaturePad.addEventListener('touchmove', e => e.preventDefault(), { passive: false });

    // Réajuster si la fenêtre change de taille
    window.addEventListener('resize', () => {
      if (document.querySelector('[data-content="3"]').classList.contains('active')) {
        this.configurerCanvas();
      }
    });
  },

  configurerCanvas() {
    if (!this.signaturePad) return;

    // Sauvegarder la signature actuelle si elle existe
    let imageData = null;
    if (this.signatureCtx) {
      try { imageData = this.signaturePad.toDataURL(); } catch(e) {}
    }

    const ratio = window.devicePixelRatio || 1;
    const rect = this.signaturePad.getBoundingClientRect();

    // Définir la taille interne du canvas selon sa taille affichée
    this.signaturePad.width = rect.width * ratio;
    this.signaturePad.height = rect.height * ratio;

    this.signatureCtx = this.signaturePad.getContext('2d');
    this.signatureCtx.scale(ratio, ratio);
    this.signatureCtx.lineWidth = 2.5;
    this.signatureCtx.lineCap = 'round';
    this.signatureCtx.lineJoin = 'round';
    this.signatureCtx.strokeStyle = '#0a0a0a';

    // Restaurer la signature si elle existait
    if (imageData && imageData !== 'data:,') {
      const img = new Image();
      img.onload = () => {
        this.signatureCtx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = imageData;
    }
  },

  startDraw(e) {
    e.preventDefault();
    this.signaturePad.setPointerCapture(e.pointerId);
    this.isDrawing = true;
    const pos = this.getPos(e);
    this.signatureCtx.beginPath();
    this.signatureCtx.moveTo(pos.x, pos.y);
    // Tracer un point unique au démarrage (utile si l'utilisateur tape sans bouger)
    this.signatureCtx.lineTo(pos.x + 0.01, pos.y + 0.01);
    this.signatureCtx.stroke();
  },

  draw(e) {
    if (!this.isDrawing) return;
    e.preventDefault();
    const pos = this.getPos(e);
    this.signatureCtx.lineTo(pos.x, pos.y);
    this.signatureCtx.stroke();
  },

  stopDraw() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    this.signatureCtx.beginPath();
  },

  getPos(e) {
    const rect = this.signaturePad.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  },

  clearSignature() {
    if (!this.signatureCtx) return;
    const rect = this.signaturePad.getBoundingClientRect();
    this.signatureCtx.clearRect(0, 0, rect.width, rect.height);
  },

  isSignatureEmpty() {
    if (!this.signatureCtx) return true;
    const pixels = this.signatureCtx.getImageData(0, 0, this.signaturePad.width, this.signaturePad.height).data;
    // Vérifier si tous les pixels sont transparents
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] !== 0) return false;
    }
    return true;
  },

  validerSignature() {
    if (this.isSignatureEmpty()) {
      alert('Veuillez signer dans le cadre avant de valider.');
      return;
    }
    if (!document.getElementById('acceptContrat').checked) {
      alert('Veuillez cocher la case d\'acceptation du contrat.');
      return;
    }

    // Sauvegarder signature + métadonnées
    const signatureData = this.signaturePad.toDataURL('image/png');
    this.reservation = Booking.updateReservation(this.reservation.token, {
      signature: signatureData,
      signe_le: new Date().toISOString(),
      signe_ip: 'N/A', // En prod : récupérer côté serveur
      signe_userAgent: navigator.userAgent,
      statut: 'signe'
    });

    this.goStep(4);
  },

  /* ============================================================
     ÉTAPE 4 : PAIEMENT STRIPE
     ============================================================ */
  initStripe() {
    if (!window.Stripe || !window.SITE_CONFIG) return;
    const cfg = window.SITE_CONFIG.stripe;
    if (!cfg || cfg.publishable_key.includes('REMPLACER')) {
      console.warn('Stripe : clé publique non configurée');
      return;
    }
    this.stripe = Stripe(cfg.publishable_key);
    this.stripeElements = this.stripe.elements();
  },

  afficherPaiement() {
    const r = this.reservation;
    const t = r.tarif;

    document.getElementById('paymentSummary').innerHTML = `
      <h3>Récapitulatif</h3>
      <div class="ec-card__row"><span>Séjour</span><strong>${Booking.formatDate(r.arrivee)} → ${Booking.formatDate(r.depart)}</strong></div>
      <div class="ec-card__row"><span>Total séjour</span><strong>${Booking.formatPrix(t.total)}</strong></div>
      <div class="ec-card__row"><span>Solde à l'arrivée</span><strong>${Booking.formatPrix(t.solde)}</strong></div>
      <div class="ec-card__total">
        <span>Acompte à payer maintenant</span>
        <strong>${Booking.formatPrix(t.acompte)}</strong>
      </div>
    `;

    // Monter l'élément carte Stripe
    if (this.stripe && !this.stripeCard) {
      this.stripeCard = this.stripeElements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#0a0a0a',
            fontFamily: 'Jost, sans-serif'
          }
        }
      });
      this.stripeCard.mount('#card-element');

      this.stripeCard.on('change', (e) => {
        const errEl = document.getElementById('card-errors');
        errEl.textContent = e.error ? e.error.message : '';
        errEl.style.display = e.error ? 'block' : 'none';
      });
    } else if (!this.stripe) {
      document.getElementById('card-element').innerHTML =
        '<div style="padding:1rem;color:#a83232">⚠️ Stripe non configuré. Ajoutez votre clé publique dans config.js</div>';
    }
  },

  async lancerPaiement() {
    const btn = document.getElementById('btnPaiement');
    btn.disabled = true;
    btn.textContent = 'Traitement...';

    if (!this.stripe || !this.stripeCard) {
      // Mode démo sans Stripe - simule un paiement réussi
      console.warn('Mode démo : paiement simulé');
      await new Promise(r => setTimeout(r, 1500));
      this.reservation = Booking.updateReservation(this.reservation.token, {
        paye_le: new Date().toISOString(),
        montant_paye: this.reservation.tarif.acompte,
        statut: 'confirme'
      });

      // Bloquer les dates dans le calendrier
      if (window.CalendarService) {
        CalendarService.ajouterReservation(this.reservation);
      }

      // Envoyer email de confirmation
      if (window.EmailService) {
        EmailService.envoyerConfirmation(this.reservation)
          .then(r => console.log('Email confirmation :', r));
      }

      this.goStep(5);
      return;
    }

    // ⚠️ En production : appeler votre backend pour créer un PaymentIntent
    // Ici on simule juste la tokenisation de la carte
    try {
      const { token, error } = await this.stripe.createToken(this.stripeCard);
      if (error) {
        document.getElementById('card-errors').textContent = error.message;
        btn.disabled = false;
        btn.textContent = 'Payer l\'acompte';
        return;
      }

      // ⚠️ EN PRODUCTION : envoyer ce token à votre backend
      // qui créera le PaymentIntent et confirmera le paiement
      console.log('Token Stripe créé :', token.id);

      this.reservation = Booking.updateReservation(this.reservation.token, {
        paye_le: new Date().toISOString(),
        montant_paye: this.reservation.tarif.acompte,
        stripe_token: token.id,
        statut: 'confirme'
      });

      // Bloquer les dates dans le calendrier
      if (window.CalendarService) {
        CalendarService.ajouterReservation(this.reservation);
      }

      // Envoyer email de confirmation
      if (window.EmailService) {
        EmailService.envoyerConfirmation(this.reservation)
          .then(r => console.log('Email confirmation :', r));
      }

      this.goStep(5);
    } catch (err) {
      console.error(err);
      document.getElementById('card-errors').textContent = 'Erreur de paiement. Réessayez.';
      btn.disabled = false;
      btn.textContent = 'Payer l\'acompte';
    }
  },

  /* ============================================================
     ÉTAPE 5 : CONFIRMATION + PDF
     ============================================================ */
  afficherConfirmation() {
    const r = this.reservation;
    const cfg = window.SITE_CONFIG.espace_client.confirmation;

    document.getElementById('confirmationMessage').textContent = cfg.message;

    document.getElementById('confirmationDetails').innerHTML = `
      <h3>Récapitulatif final</h3>
      <div class="ec-card__row"><span>Référence</span><strong>${r.token.substring(0, 8).toUpperCase()}</strong></div>
      <div class="ec-card__row"><span>Voyageur</span><strong>${r.nom}</strong></div>
      <div class="ec-card__row"><span>Séjour</span><strong>${Booking.formatDate(r.arrivee)} → ${Booking.formatDate(r.depart)}</strong></div>
      <div class="ec-card__row"><span>Acompte payé</span><strong style="color:var(--or)">${Booking.formatPrix(r.tarif.acompte)} ✓</strong></div>
      <div class="ec-card__row"><span>Solde restant</span><strong>${Booking.formatPrix(r.tarif.solde)}</strong></div>
      <div style="margin-top:1.5rem;padding:1rem;background:rgba(201,169,97,.1);border-left:3px solid var(--or);font-size:.9rem">
        📧 Un email de confirmation avec le contrat signé en PDF a été envoyé à <strong>${r.email}</strong>
      </div>
    `;
  },

  /* ============================================================
     GÉNÉRER LE PDF DU CONTRAT
     ============================================================ */
  async telechargerContrat() {
    if (!window.jspdf) {
      alert('Erreur : bibliothèque PDF non chargée');
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const r = this.reservation;
    const cfg = window.SITE_CONFIG.contrat;
    const bien = window.SITE_CONFIG.identite;

    let y = 20;
    const margin = 20;
    const maxWidth = 170;

    // Titre
    doc.setFontSize(20);
    doc.setTextColor(201, 169, 97);
    doc.text(bien.nom, 105, y, { align: 'center' });
    y += 8;
    doc.setFontSize(12);
    doc.setTextColor(50);
    doc.text('Contrat de location saisonnière', 105, y, { align: 'center' });
    y += 6;
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Établi le ${new Date().toLocaleDateString('fr-FR')} · Ref. ${r.token.substring(0, 8).toUpperCase()}`, 105, y, { align: 'center' });
    y += 12;

    // Parties
    doc.setFontSize(10);
    doc.setTextColor(50);
    doc.setFont(undefined, 'bold');
    doc.text('BAILLEUR :', margin, y);
    doc.text('LOCATAIRE :', 110, y);
    y += 5;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text(cfg.proprietaire.nom_complet, margin, y);
    doc.text(r.nom, 110, y); y += 4;
    doc.text(cfg.proprietaire.adresse, margin, y);
    doc.text(r.email, 110, y); y += 4;
    doc.text(cfg.proprietaire.email, margin, y);
    doc.text(r.telephone, 110, y); y += 4;
    doc.text(cfg.proprietaire.telephone, margin, y);
    y += 10;

    // Bien
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.text('OBJET DE LA LOCATION :', margin, y);
    y += 5;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text(`${cfg.bien.nom} - ${cfg.bien.adresse}`, margin, y, { maxWidth }); y += 4;
    doc.text(cfg.bien.pieces, margin, y, { maxWidth });
    y += 10;

    // Clauses
    cfg.clauses.forEach(clause => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.setFont(undefined, 'bold');
      doc.setFontSize(10);
      doc.setTextColor(201, 169, 97);
      doc.text(clause.titre, margin, y);
      y += 5;
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);
      doc.setTextColor(50);
      const texteRempli = Booking.remplirContrat(clause.texte, r);
      const lignes = doc.splitTextToSize(texteRempli, maxWidth);
      lignes.forEach(ligne => {
        if (y > 280) { doc.addPage(); y = 20; }
        doc.text(ligne, margin, y);
        y += 4;
      });
      y += 4;
    });

    // Signature
    if (y > 230) { doc.addPage(); y = 20; }
    y += 8;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.text('SIGNATURE DU LOCATAIRE', margin, y);
    y += 5;
    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(120);
    doc.text(`Signé électroniquement le ${new Date(r.signe_le).toLocaleString('fr-FR')}`, margin, y);
    y += 6;
    if (r.signature) {
      doc.addImage(r.signature, 'PNG', margin, y, 60, 25);
    }

    doc.save(`Contrat-${bien.nom.replace(/\s/g, '-')}-${r.nom.replace(/\s/g, '-')}.pdf`);
  }
};

// Lancer au chargement
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => EspaceClient.init(), 100);
});

window.EspaceClient = EspaceClient;
