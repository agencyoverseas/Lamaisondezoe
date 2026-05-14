/* ============================================================
   ADMIN DASHBOARD — Logique
   ============================================================ */

const Admin = {

  reservations: [],

  /* ========== INIT ========== */
  init() {
    // Vérifier session existante
    if (this.estConnecte()) {
      this.afficherDashboard();
    } else {
      this.afficherLogin();
    }

    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.login();
    });

    // Bind onglets
    document.querySelectorAll('.admin-nav__item').forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // Bind filtres
    document.getElementById('filterStatut')?.addEventListener('change', () => this.afficherReservations());
    document.getElementById('filterSearch')?.addEventListener('input', () => this.afficherReservations());
  },

  /* ========== AUTHENTIFICATION ========== */
  estConnecte() {
    const session = localStorage.getItem('admin_session');
    if (!session) return false;
    const data = JSON.parse(session);
    return data.expiration > Date.now();
  },

  login() {
    const password = document.getElementById('adminPassword').value;
    const cfg = window.SITE_CONFIG.admin;

    if (password === cfg.mot_de_passe) {
      const dureeMs = cfg.duree_session * 3600000;
      localStorage.setItem('admin_session', JSON.stringify({
        expiration: Date.now() + dureeMs,
        login_at: Date.now()
      }));
      this.afficherDashboard();
    } else {
      document.getElementById('loginError').style.display = 'block';
      document.getElementById('adminPassword').value = '';
    }
  },

  logout() {
    localStorage.removeItem('admin_session');
    this.afficherLogin();
  },

  afficherLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminApp').style.display = 'none';
  },

  afficherDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminApp').style.display = 'block';
    this.chargerReservations();
    this.afficherStats();
    this.afficherRecents();
    document.getElementById('adminLastSync').textContent =
      `Connecté · ${new Date().toLocaleTimeString('fr-FR', {hour:'2-digit',minute:'2-digit'})}`;
  },

  /* ========== ONGLETS ========== */
  switchTab(tab) {
    document.querySelectorAll('.admin-nav__item').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
    document.querySelectorAll('.admin-tab').forEach(s => s.classList.remove('active'));
    document.querySelector(`[data-content="${tab}"]`).classList.add('active');

    if (tab === 'reservations') this.afficherReservations();
    if (tab === 'calendrier') this.afficherCalendrier();
    if (tab === 'settings') this.afficherConfigStatus();
  },

  /* ========== CHARGEMENT DES RÉSERVATIONS ========== */
  chargerReservations() {
    // Scanner localStorage pour récupérer toutes les réservations
    this.reservations = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('reservation_')) {
        try {
          this.reservations.push(JSON.parse(localStorage.getItem(key)));
        } catch (e) {}
      }
    }
    // Ajouter aussi celles stockées via admin (CalendarService.ajouterReservation)
    const adminRes = JSON.parse(localStorage.getItem('admin_reservations') || '[]');
    adminRes.forEach(r => {
      if (!this.reservations.find(x => x.token === r.token)) {
        this.reservations.push(r);
      }
    });

    // Trier par date création décroissante
    this.reservations.sort((a, b) => (b.created || 0) - (a.created || 0));
  },

  /* ========== STATISTIQUES ========== */
  afficherStats() {
    const total = this.reservations.length;
    const confirmees = this.reservations.filter(r => r.statut === 'confirme').length;
    const enCours = this.reservations.filter(r => r.statut === 'en_cours').length;
    const signees = this.reservations.filter(r => r.statut === 'signe').length;

    const ca = this.reservations
      .filter(r => r.statut === 'confirme' && r.tarif)
      .reduce((sum, r) => sum + (r.tarif.total || 0), 0);

    const acomptes = this.reservations
      .filter(r => r.montant_paye)
      .reduce((sum, r) => sum + (r.montant_paye || 0), 0);

    document.getElementById('adminStats').innerHTML = `
      <div class="admin-stat">
        <div class="admin-stat__num">${total}</div>
        <div class="admin-stat__label">Réservations totales</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat__num">${confirmees}</div>
        <div class="admin-stat__label">Confirmées</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat__num">${enCours + signees}</div>
        <div class="admin-stat__label">En attente</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat__num">${Booking.formatPrix(ca)}</div>
        <div class="admin-stat__label">CA réservé</div>
      </div>
      <div class="admin-stat">
        <div class="admin-stat__num">${Booking.formatPrix(acomptes)}</div>
        <div class="admin-stat__label">Acomptes encaissés</div>
      </div>
    `;
  },

  /* ========== RÉSERVATIONS RÉCENTES ========== */
  afficherRecents() {
    const recents = this.reservations.slice(0, 5);
    const container = document.getElementById('adminRecentReservations');

    if (!recents.length) {
      container.innerHTML = '<p style="color:var(--gris-clair);padding:2rem;text-align:center">Aucune réservation pour le moment.</p>';
      return;
    }

    container.innerHTML = recents.map(r => `
      <div class="admin-recent-item" onclick="Admin.ouvrirReservation('${r.token}')">
        <div class="admin-recent-item__avatar">${(r.nom || '?').charAt(0).toUpperCase()}</div>
        <div>
          <div style="font-family:var(--f-display);font-size:1.1rem;color:var(--creme)">${r.nom || 'Anonyme'}</div>
          <div style="font-size:.8rem;color:var(--gris-clair)">
            ${r.arrivee ? Booking.formatDate(r.arrivee) : '?'} → ${r.depart ? Booking.formatDate(r.depart) : '?'}
          </div>
        </div>
        <div style="text-align:right">
          <div style="font-family:var(--f-display);color:var(--or);font-size:1.2rem">${r.tarif ? Booking.formatPrix(r.tarif.total) : '-'}</div>
        </div>
        <span class="statut-pill statut-${r.statut || 'en_cours'}">${this.libStatut(r.statut)}</span>
      </div>
    `).join('');
  },

  libStatut(s) {
    const labels = {
      'en_cours': 'En cours',
      'signe': 'Signé',
      'confirme': 'Confirmé',
      'annule': 'Annulé'
    };
    return labels[s] || 'En cours';
  },

  /* ========== TABLE COMPLÈTE RÉSERVATIONS ========== */
  afficherReservations() {
    const filtreStatut = document.getElementById('filterStatut').value;
    const search = document.getElementById('filterSearch').value.toLowerCase();

    let liste = this.reservations;
    if (filtreStatut) liste = liste.filter(r => r.statut === filtreStatut);
    if (search) {
      liste = liste.filter(r =>
        (r.nom || '').toLowerCase().includes(search) ||
        (r.email || '').toLowerCase().includes(search) ||
        (r.telephone || '').toLowerCase().includes(search)
      );
    }

    const tbody = document.querySelector('#adminReservationsTable tbody');

    if (!liste.length) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--gris-clair)">Aucun résultat</td></tr>';
      return;
    }

    tbody.innerHTML = liste.map(r => `
      <tr onclick="Admin.ouvrirReservation('${r.token}')">
        <td><code style="color:var(--or)">${r.token.substring(0,8).toUpperCase()}</code></td>
        <td>
          <strong>${r.nom || '-'}</strong><br>
          <small style="color:var(--gris-clair)">${r.email || ''}</small>
        </td>
        <td>
          ${r.arrivee ? Booking.formatDate(r.arrivee) : '-'}<br>
          <small style="color:var(--gris-clair)">→ ${r.depart ? Booking.formatDate(r.depart) : '-'}</small>
        </td>
        <td>${r.nb_voyageurs || '-'}</td>
        <td>${r.tarif ? Booking.formatPrix(r.tarif.total) : '-'}</td>
        <td><span class="statut-pill statut-${r.statut || 'en_cours'}">${this.libStatut(r.statut)}</span></td>
        <td>
          <button onclick="event.stopPropagation();Admin.ouvrirReservation('${r.token}')" style="background:transparent;border:1px solid var(--or);color:var(--or);padding:.3rem .8rem;cursor:pointer;font-size:.7rem">VOIR</button>
        </td>
      </tr>
    `).join('');
  },

  /* ========== MODAL DÉTAIL ========== */
  ouvrirReservation(token) {
    const r = this.reservations.find(x => x.token === token);
    if (!r) return;

    document.getElementById('modalReservationContent').innerHTML = `
      <h2 style="font-family:var(--f-display);color:var(--or);margin-bottom:1.5rem">
        Réservation ${r.token.substring(0,8).toUpperCase()}
      </h2>

      <div class="ec-card">
        <h3>Client</h3>
        <div class="ec-card__row"><span>Nom</span><strong>${r.nom || '-'}</strong></div>
        <div class="ec-card__row"><span>Email</span><strong>${r.email || '-'}</strong></div>
        <div class="ec-card__row"><span>Téléphone</span><strong>${r.telephone || '-'}</strong></div>
      </div>

      <div class="ec-card">
        <h3>Séjour</h3>
        <div class="ec-card__row"><span>Arrivée</span><strong>${r.arrivee ? Booking.formatDate(r.arrivee) : '-'}</strong></div>
        <div class="ec-card__row"><span>Départ</span><strong>${r.depart ? Booking.formatDate(r.depart) : '-'}</strong></div>
        <div class="ec-card__row"><span>Durée</span><strong>${r.tarif?.nbNuits || '-'} nuits</strong></div>
        <div class="ec-card__row"><span>Voyageurs</span><strong>${r.nb_voyageurs || '-'}</strong></div>
        ${r.message ? `<div class="ec-card__row"><span>Message</span><strong>${r.message}</strong></div>` : ''}
      </div>

      ${r.tarif ? `
      <div class="ec-card">
        <h3>Tarif</h3>
        <div class="ec-card__row"><span>Total</span><strong>${Booking.formatPrix(r.tarif.total)}</strong></div>
        <div class="ec-card__row"><span>Acompte (30%)</span><strong>${Booking.formatPrix(r.tarif.acompte)}</strong></div>
        <div class="ec-card__row"><span>Solde restant</span><strong>${Booking.formatPrix(r.tarif.solde)}</strong></div>
        ${r.montant_paye ? `<div class="ec-card__row"><span>Payé</span><strong style="color:#7a9e3d">${Booking.formatPrix(r.montant_paye)} ✓</strong></div>` : ''}
      </div>` : ''}

      <div class="ec-card">
        <h3>Statut & dates</h3>
        <div class="ec-card__row"><span>Statut</span><span class="statut-pill statut-${r.statut || 'en_cours'}">${this.libStatut(r.statut)}</span></div>
        <div class="ec-card__row"><span>Créée</span><strong>${r.created ? new Date(r.created).toLocaleString('fr-FR') : '-'}</strong></div>
        ${r.signe_le ? `<div class="ec-card__row"><span>Signée</span><strong>${new Date(r.signe_le).toLocaleString('fr-FR')}</strong></div>` : ''}
        ${r.paye_le ? `<div class="ec-card__row"><span>Payée</span><strong>${new Date(r.paye_le).toLocaleString('fr-FR')}</strong></div>` : ''}
      </div>

      ${r.signature ? `
      <div class="ec-card">
        <h3>Signature</h3>
        <img src="${r.signature}" style="max-width:300px;background:white;padding:1rem">
      </div>` : ''}

      <div class="ec-actions">
        <button class="ec-btn ec-btn--ghost" onclick="Admin.envoyerMessage('${r.token}')">📧 Contacter</button>
        ${r.statut !== 'annule' ? `<button class="ec-btn ec-btn--ghost" onclick="Admin.annulerReservation('${r.token}')">❌ Annuler</button>` : ''}
        <button class="ec-btn ec-btn--ghost" onclick="Admin.supprimerReservation('${r.token}')">🗑️ Supprimer</button>
      </div>
    `;

    document.getElementById('modalReservation').style.display = 'flex';
  },

  fermerModal() {
    document.getElementById('modalReservation').style.display = 'none';
  },

  envoyerMessage(token) {
    const r = this.reservations.find(x => x.token === token);
    if (!r) return;
    if (r.email) window.location.href = `mailto:${r.email}?subject=Votre réservation - ${window.SITE_CONFIG.identite.nom}`;
  },

  annulerReservation(token) {
    if (!confirm('Annuler cette réservation ?')) return;
    const updated = Booking.updateReservation(token, { statut: 'annule', annule_le: new Date().toISOString() });
    this.chargerReservations();
    this.afficherStats();
    this.afficherReservations();
    this.fermerModal();
  },

  supprimerReservation(token) {
    if (!confirm('Supprimer définitivement cette réservation ? Cette action est irréversible.')) return;
    localStorage.removeItem(`reservation_${token}`);
    const adminRes = JSON.parse(localStorage.getItem('admin_reservations') || '[]');
    localStorage.setItem('admin_reservations', JSON.stringify(adminRes.filter(r => r.token !== token)));
    this.chargerReservations();
    this.afficherStats();
    this.afficherReservations();
    this.fermerModal();
  },

  /* ========== EXPORT CSV ========== */
  exporterCSV() {
    if (!this.reservations.length) {
      alert('Aucune réservation à exporter');
      return;
    }
    const headers = ['Référence','Nom','Email','Téléphone','Arrivée','Départ','Nuits','Voyageurs','Total','Acompte payé','Statut','Date création'];
    const rows = this.reservations.map(r => [
      r.token.substring(0,8).toUpperCase(),
      r.nom || '',
      r.email || '',
      r.telephone || '',
      r.arrivee || '',
      r.depart || '',
      r.tarif?.nbNuits || '',
      r.nb_voyageurs || '',
      r.tarif?.total || '',
      r.montant_paye || '',
      this.libStatut(r.statut),
      r.created ? new Date(r.created).toLocaleString('fr-FR') : ''
    ]);
    const csv = [headers, ...rows].map(row => row.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reservations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  },

  /* ========== CALENDRIER ========== */
  async afficherCalendrier() {
    const cfg = window.SITE_CONFIG.calendrier;
    const info = document.getElementById('adminCalInfo');

    if (!cfg.ical_url) {
      info.innerHTML = '⚠️ <strong>URL iCal Google Calendar non configurée.</strong><br>Ouvrez <code>config.js</code> section 17 pour ajouter votre lien iCal.';
    } else {
      info.innerHTML = `✓ Synchronisé avec Google Calendar · Rafraîchissement automatique toutes les ${cfg.refresh_interval_minutes} minutes`;
    }

    await CalendarService.afficherCalendrier('adminCalendar', { nb_mois: 6 });
  },

  /* ========== STATUT CONFIG ========== */
  afficherConfigStatus() {
    const cfg = window.SITE_CONFIG;
    const checks = [
      { label: 'Stripe (clé publique)',       ok: !cfg.stripe.publishable_key.includes('REMPLACER') },
      { label: 'EmailJS (clés)',              ok: !cfg.emailjs.public_key.includes('REMPLACER') },
      { label: 'Google Calendar (URL iCal)',  ok: !!cfg.calendrier.ical_url },
      { label: 'Mot de passe admin',          ok: cfg.admin.mot_de_passe !== 'MaisonZoe2026!' },
      { label: 'Contrat propriétaire',        ok: !cfg.contrat.proprietaire.nom_complet.includes('[Nom Propriétaire]') },
      { label: 'Tarifs personnalisés',        ok: true /* tarifs ont des valeurs par défaut */ }
    ];

    document.getElementById('adminConfigStatus').innerHTML = checks.map(c => `
      <div class="admin-config-item ${c.ok ? 'ok' : 'ko'}">
        <span class="admin-config-item__label">${c.label}</span>
        <span class="admin-config-item__status">${c.ok ? '✓ Configuré' : '⚠️ À configurer'}</span>
      </div>
    `).join('');
  },

  /* ========== ACTIONS PARAMÈTRES ========== */
  changerMotDePasse() {
    alert('Pour changer le mot de passe :\n\n1. Ouvrez le fichier config.js\n2. Section 18 (Admin)\n3. Modifiez "mot_de_passe"\n4. Sauvegardez et reconnectez-vous');
  },

  viderCache() {
    if (!confirm('Vider tout le cache local ? Les sessions en cours seront perdues.')) return;
    Object.keys(localStorage).forEach(k => {
      if (!k.startsWith('admin_session')) localStorage.removeItem(k);
    });
    alert('Cache vidé.');
    location.reload();
  },

  exporterDonnees() {
    const data = {
      reservations: this.reservations,
      export_date: new Date().toISOString(),
      site: window.SITE_CONFIG.identite.nom
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  afficherAide() {
    alert('AIDE\n\n• Tous les paramètres se modifient dans config.js\n• Les réservations sont stockées localement dans votre navigateur\n• Pour synchroniser entre appareils : utiliser Firebase\n• Pour les emails : configurer EmailJS (section 16)\n• Pour le calendrier : configurer Google Calendar iCal (section 17)\n\nDocumentation complète dans README.md');
  }
};

// Lancer au chargement
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => Admin.init(), 100);
});

window.Admin = Admin;
