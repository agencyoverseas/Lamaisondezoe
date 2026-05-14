/* ============================================================
   EMAIL SERVICE — EmailJS
   ============================================================
   Envoi des emails de lien magique + confirmation + notif admin
   ============================================================ */

const EmailService = {

  initialized: false,

  /* ========== INIT ========== */
  init() {
    if (this.initialized) return;
    const cfg = window.SITE_CONFIG?.emailjs;
    if (!cfg || cfg.public_key.includes('REMPLACER')) {
      console.warn('EmailJS : clés non configurées');
      return false;
    }
    if (!window.emailjs) {
      console.error('EmailJS SDK non chargé');
      return false;
    }
    window.emailjs.init({ publicKey: cfg.public_key });
    this.initialized = true;
    return true;
  },

  /* ========== ENVOYER LIEN MAGIQUE ========== */
  async envoyerLienMagique(reservation, urlEspaceClient) {
    if (!this.init()) {
      console.warn('Mode démo : email simulé');
      return { success: true, demo: true, preview_url: urlEspaceClient };
    }

    const cfg = window.SITE_CONFIG;
    const t = reservation.tarif;

    const params = {
      to_name: reservation.nom,
      to_email: reservation.email,
      site_name: cfg.identite.nom,
      lien_espace_client: urlEspaceClient,
      arrivee: Booking.formatDate(reservation.arrivee),
      depart: Booking.formatDate(reservation.depart),
      nb_nuits: t?.nbNuits || '',
      total: t?.total ? Booking.formatPrix(t.total) : '',
      acompte: t?.acompte ? Booking.formatPrix(t.acompte) : '',
      validite_heures: cfg.espace_client.email_lien_magique.duree_validite_heures
    };

    try {
      await window.emailjs.send(
        cfg.emailjs.service_id,
        cfg.emailjs.templates.lien_magique,
        params
      );

      // Notification au propriétaire
      if (cfg.emailjs.notifier_proprietaire) {
        await this.notifierProprietaire(reservation, 'nouvelle_demande');
      }

      return { success: true };
    } catch (err) {
      console.error('Erreur envoi email lien magique :', err);
      return { success: false, error: err };
    }
  },

  /* ========== ENVOYER CONFIRMATION ========== */
  async envoyerConfirmation(reservation, pdfBase64 = null) {
    if (!this.init()) {
      console.warn('Mode démo : confirmation simulée');
      return { success: true, demo: true };
    }

    const cfg = window.SITE_CONFIG;
    const t = reservation.tarif;

    const params = {
      to_name: reservation.nom,
      to_email: reservation.email,
      site_name: cfg.identite.nom,
      reference: reservation.token.substring(0, 8).toUpperCase(),
      arrivee: Booking.formatDate(reservation.arrivee),
      depart: Booking.formatDate(reservation.depart),
      nb_nuits: t.nbNuits,
      nb_voyageurs: reservation.nb_voyageurs,
      total: Booking.formatPrix(t.total),
      acompte_paye: Booking.formatPrix(t.acompte),
      solde_restant: Booking.formatPrix(t.solde),
      delai_solde: cfg.tarifs.paiement.delai_solde_jours_avant,
      adresse: cfg.contrat.bien.adresse,
      tel_proprietaire: cfg.contact.telephone,
      email_proprietaire: cfg.contact.email,
      pdf_attachment: pdfBase64 || ''
    };

    try {
      await window.emailjs.send(
        cfg.emailjs.service_id,
        cfg.emailjs.templates.confirmation,
        params
      );

      if (cfg.emailjs.notifier_proprietaire) {
        await this.notifierProprietaire(reservation, 'confirmation');
      }

      return { success: true };
    } catch (err) {
      console.error('Erreur envoi confirmation :', err);
      return { success: false, error: err };
    }
  },

  /* ========== NOTIFIER LE PROPRIÉTAIRE ========== */
  async notifierProprietaire(reservation, type) {
    const cfg = window.SITE_CONFIG;
    if (!cfg.emailjs.templates.admin_notification ||
        cfg.emailjs.templates.admin_notification.includes('REMPLACER')) {
      return;  // Template admin pas configuré
    }

    const t = reservation.tarif;
    const params = {
      to_email: cfg.emailjs.email_proprietaire,
      type_notification: type === 'confirmation' ? 'Réservation confirmée 🎉' : 'Nouvelle demande de réservation',
      client_nom: reservation.nom,
      client_email: reservation.email,
      client_tel: reservation.telephone,
      arrivee: Booking.formatDate(reservation.arrivee),
      depart: Booking.formatDate(reservation.depart),
      nb_nuits: t?.nbNuits || '',
      nb_voyageurs: reservation.nb_voyageurs,
      total: t ? Booking.formatPrix(t.total) : '',
      statut: reservation.statut,
      reference: reservation.token.substring(0, 8).toUpperCase(),
      lien_admin: `${window.location.origin}/admin/`
    };

    try {
      await window.emailjs.send(
        cfg.emailjs.service_id,
        cfg.emailjs.templates.admin_notification,
        params
      );
    } catch (err) {
      console.error('Erreur notif proprio :', err);
    }
  }
};

window.EmailService = EmailService;
