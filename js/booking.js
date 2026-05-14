/* ============================================================
   MOTEUR DE RÉSERVATION — booking.js
   ============================================================
   Calcule les tarifs, génère liens magiques, gère la session.
   ============================================================ */

const Booking = {

  /* ========== CALCUL DU TARIF ========== */
  calculerTarif(dateArrivee, dateDepart, nbVoyageurs = 1) {
    if (!window.SITE_CONFIG) return null;
    const C = window.SITE_CONFIG.tarifs;

    const arrivee = new Date(dateArrivee);
    const depart = new Date(dateDepart);
    const nbNuits = Math.round((depart - arrivee) / (1000 * 60 * 60 * 24));

    if (nbNuits < C.duree_min_nuits) {
      return { erreur: `Séjour minimum de ${C.duree_min_nuits} nuits requis.` };
    }

    // Calcule prix par nuit selon saison de chaque nuit
    let totalHebergement = 0;
    const detailJours = [];

    for (let i = 0; i < nbNuits; i++) {
      const jour = new Date(arrivee);
      jour.setDate(jour.getDate() + i);
      const saison = this.trouverSaison(jour);
      totalHebergement += saison.prix.nuit;
      detailJours.push({ date: jour.toISOString().split('T')[0], saison: saison.nom, prix: saison.prix.nuit });
    }

    // Frais annexes
    const menage = C.frais.menage;
    const taxeSejour = C.frais.taxe_sejour_par_nuit * nbNuits * nbVoyageurs;
    const total = totalHebergement + menage + taxeSejour;

    // Répartition acompte / solde
    const acompte = Math.round(total * C.paiement.pourcentage_acompte / 100 * 100) / 100;
    const solde = Math.round((total - acompte) * 100) / 100;

    return {
      nbNuits,
      nbVoyageurs,
      arrivee: dateArrivee,
      depart: dateDepart,
      detail: {
        hebergement: totalHebergement,
        menage,
        taxe_sejour: taxeSejour,
        caution: C.frais.caution
      },
      detailJours,
      total: Math.round(total * 100) / 100,
      acompte,
      solde,
      devise: C.symbole
    };
  },

  /* ========== TROUVER LA SAISON D'UNE DATE ========== */
  trouverSaison(date) {
    const C = window.SITE_CONFIG.tarifs;
    const mmjj = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    for (const saison of C.saisons) {
      for (const periode of saison.periodes) {
        // Période classique (ex: 03-01 → 05-31)
        if (periode.debut <= periode.fin) {
          if (mmjj >= periode.debut && mmjj <= periode.fin) return saison;
        } else {
          // Période qui chevauche le nouvel an (ex: 12-20 → 01-05)
          if (mmjj >= periode.debut || mmjj <= periode.fin) return saison;
        }
      }
    }

    // Saison par défaut : basse
    return C.saisons[0];
  },

  /* ========== GÉNÉRER UN LIEN MAGIQUE ========== */
  genererLienMagique(donneesReservation) {
    const token = this.genererToken();
    const expiration = Date.now() + (window.SITE_CONFIG.espace_client.email_lien_magique.duree_validite_heures * 3600000);

    const reservation = {
      ...donneesReservation,
      token,
      expiration,
      created: Date.now(),
      etape: 1,
      statut: "en_cours"   // en_cours | signe | paye | confirme | annule
    };

    // Sauvegarde dans localStorage (en démo - en prod : Firebase)
    localStorage.setItem(`reservation_${token}`, JSON.stringify(reservation));

    // URL de l'espace client
    const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
    return {
      token,
      url: `${baseUrl}/espace-client/index.html?token=${token}`,
      reservation
    };
  },

  /* ========== TOKEN UNIQUE ========== */
  genererToken() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
  },

  /* ========== RÉCUPÉRER UNE RÉSERVATION ========== */
  getReservation(token) {
    const data = localStorage.getItem(`reservation_${token}`);
    if (!data) return null;
    const res = JSON.parse(data);
    if (res.expiration < Date.now()) {
      return { erreur: "Ce lien a expiré." };
    }
    return res;
  },

  /* ========== METTRE À JOUR UNE RÉSERVATION ========== */
  updateReservation(token, updates) {
    const res = this.getReservation(token);
    if (!res || res.erreur) return null;
    const updated = { ...res, ...updates, lastUpdate: Date.now() };
    localStorage.setItem(`reservation_${token}`, JSON.stringify(updated));
    return updated;
  },

  /* ========== SIMULER ENVOI EMAIL ========== */
  // En production : utiliser Firebase Functions + SendGrid/Resend
  envoyerEmailLienMagique(reservation, urlEspaceClient) {
    const cfg = window.SITE_CONFIG.espace_client.email_lien_magique;
    console.log('=== EMAIL ENVOYÉ (simulation) ===');
    console.log('À:', reservation.email);
    console.log('Sujet:', cfg.sujet);
    console.log('Lien:', urlEspaceClient);
    console.log('=================================');

    // En attendant Firebase : ouvre directement l'espace client
    return {
      success: true,
      preview_url: urlEspaceClient
    };
  },

  /* ========== FORMATER UN PRIX ========== */
  formatPrix(montant) {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: window.SITE_CONFIG.tarifs.devise
    }).format(montant);
  },

  /* ========== FORMATER UNE DATE ========== */
  formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  },

  /* ========== REMPLIR VARIABLES DU CONTRAT ========== */
  remplirContrat(texte, reservation) {
    const tarif = reservation.tarif || {};
    return texte
      .replace(/{nom}/g, reservation.nom || '')
      .replace(/{email}/g, reservation.email || '')
      .replace(/{tel}/g, reservation.telephone || '')
      .replace(/{arrivee}/g, this.formatDate(reservation.arrivee))
      .replace(/{depart}/g, this.formatDate(reservation.depart))
      .replace(/{nb_nuits}/g, tarif.nbNuits || 0)
      .replace(/{nb_voyageurs}/g, reservation.nb_voyageurs || tarif.nbVoyageurs || 0)
      .replace(/{total}/g, tarif.total || 0)
      .replace(/{acompte}/g, tarif.acompte || 0)
      .replace(/{solde}/g, tarif.solde || 0);
  }
};

window.Booking = Booking;
