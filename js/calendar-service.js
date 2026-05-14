/* ============================================================
   CALENDAR SERVICE — Google Calendar via iCal
   ============================================================
   Lit les événements bloqués depuis Google Calendar
   Vérifie la disponibilité des dates
   Affiche un calendrier interactif
   ============================================================ */

const CalendarService = {

  datesBloquees: [],
  lastRefresh: 0,

  /* ========== CHARGER LE CALENDRIER ICAL ========== */
  async chargerICal() {
    const cfg = window.SITE_CONFIG?.calendrier;
    if (!cfg || !cfg.ical_url) {
      console.warn('Calendrier : URL iCal non configurée');
      this.chargerDatesManuelles();
      return [];
    }

    // Cache : ne pas recharger trop souvent
    const now = Date.now();
    const intervalMs = cfg.refresh_interval_minutes * 60 * 1000;
    if (this.lastRefresh && (now - this.lastRefresh) < intervalMs && this.datesBloquees.length) {
      return this.datesBloquees;
    }

    try {
      // ⚠️ Google Calendar iCal nécessite un proxy CORS en production
      // En attendant : utiliser un service public de proxy
      const proxyUrl = 'https://corsproxy.io/?';
      const response = await fetch(proxyUrl + encodeURIComponent(cfg.ical_url));
      const icalText = await response.text();

      this.datesBloquees = this.parserICal(icalText);
      this.chargerDatesManuelles();
      this.lastRefresh = now;

      // Cache localStorage
      localStorage.setItem('cal_cache', JSON.stringify({
        dates: this.datesBloquees,
        timestamp: now
      }));

      return this.datesBloquees;
    } catch (err) {
      console.error('Erreur chargement iCal :', err);
      // Fallback : utiliser le cache
      const cache = localStorage.getItem('cal_cache');
      if (cache) {
        const data = JSON.parse(cache);
        this.datesBloquees = data.dates;
      }
      this.chargerDatesManuelles();
      return this.datesBloquees;
    }
  },

  /* ========== AJOUTER DATES MANUELLES ========== */
  chargerDatesManuelles() {
    const cfg = window.SITE_CONFIG?.calendrier;
    if (!cfg?.dates_indisponibles_manuelles) return;

    cfg.dates_indisponibles_manuelles.forEach(periode => {
      this.datesBloquees.push({
        debut: periode.debut,
        fin: periode.fin,
        titre: periode.raison || 'Indisponible',
        source: 'manuel'
      });
    });
  },

  /* ========== PARSER ICAL ========== */
  parserICal(text) {
    const evenements = [];
    const lignes = text.split(/\r?\n/);
    let currentEvent = null;

    lignes.forEach(ligne => {
      ligne = ligne.trim();

      if (ligne === 'BEGIN:VEVENT') {
        currentEvent = {};
      } else if (ligne === 'END:VEVENT' && currentEvent) {
        if (currentEvent.debut && currentEvent.fin) {
          evenements.push({
            debut: currentEvent.debut,
            fin: currentEvent.fin,
            titre: currentEvent.titre || 'Réservé',
            source: 'google'
          });
        }
        currentEvent = null;
      } else if (currentEvent) {
        if (ligne.startsWith('DTSTART')) {
          currentEvent.debut = this.parseICalDate(ligne);
        } else if (ligne.startsWith('DTEND')) {
          currentEvent.fin = this.parseICalDate(ligne);
        } else if (ligne.startsWith('SUMMARY:')) {
          currentEvent.titre = ligne.substring(8);
        }
      }
    });

    return evenements;
  },

  parseICalDate(ligne) {
    const match = ligne.match(/(\d{8})/);
    if (!match) return null;
    const d = match[1];
    return `${d.substring(0,4)}-${d.substring(4,6)}-${d.substring(6,8)}`;
  },

  /* ========== VÉRIFIER SI UNE DATE EST DISPONIBLE ========== */
  estDisponible(dateStr) {
    const date = new Date(dateStr);
    return !this.datesBloquees.some(p => {
      const debut = new Date(p.debut);
      const fin = new Date(p.fin);
      return date >= debut && date < fin;
    });
  },

  /* ========== VÉRIFIER UNE PÉRIODE COMPLÈTE ========== */
  periodeDisponible(arrivee, depart) {
    const dArr = new Date(arrivee);
    const dDep = new Date(depart);

    for (const p of this.datesBloquees) {
      const debut = new Date(p.debut);
      const fin = new Date(p.fin);
      // Chevauchement ?
      if (dArr < fin && dDep > debut) {
        return { disponible: false, conflit: p };
      }
    }
    return { disponible: true };
  },

  /* ========== AFFICHER LE CALENDRIER ========== */
  async afficherCalendrier(containerId, options = {}) {
    await this.chargerICal();
    const container = document.getElementById(containerId);
    if (!container) return;

    const cfg = window.SITE_CONFIG.calendrier;
    const nbMois = options.nb_mois || cfg.nb_mois_affiches || 3;
    const onSelect = options.onSelect || null;
    const dateMin = options.dateMin ? new Date(options.dateMin) : new Date();

    let html = '<div class="cal-wrapper">';
    const aujourd = new Date();
    aujourd.setHours(0,0,0,0);

    for (let m = 0; m < nbMois; m++) {
      const dateMois = new Date(aujourd.getFullYear(), aujourd.getMonth() + m, 1);
      html += this.genererMoisHTML(dateMois, dateMin);
    }
    html += '</div>';

    // Légende
    html += `
      <div class="cal-legend">
        <span class="cal-legend__item"><i class="cal-dot cal-dot--dispo"></i> Disponible</span>
        <span class="cal-legend__item"><i class="cal-dot cal-dot--indispo"></i> Réservé</span>
        <span class="cal-legend__item"><i class="cal-dot cal-dot--today"></i> Aujourd'hui</span>
      </div>
    `;

    container.innerHTML = html;

    // Sélection de dates
    if (onSelect) {
      container.querySelectorAll('.cal-day:not(.cal-day--blocked):not(.cal-day--past)').forEach(jour => {
        jour.addEventListener('click', () => onSelect(jour.dataset.date));
      });
    }
  },

  /* ========== GÉNÉRER UN MOIS HTML ========== */
  genererMoisHTML(date, dateMin) {
    const mois = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
    const cfg = window.SITE_CONFIG.calendrier;
    const premierLundi = cfg.jour_premier === 'lundi';
    const joursLabels = premierLundi
      ? ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim']
      : ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

    const annee = date.getFullYear();
    const numMois = date.getMonth();
    const aujourd = new Date(); aujourd.setHours(0,0,0,0);
    const premierJour = new Date(annee, numMois, 1);
    const dernierJour = new Date(annee, numMois + 1, 0).getDate();

    // Décalage du premier jour
    let decalage = premierJour.getDay();
    if (premierLundi) decalage = (decalage + 6) % 7;

    let html = `
      <div class="cal-month">
        <div class="cal-month__header">${mois[numMois]} ${annee}</div>
        <div class="cal-grid">
    `;

    joursLabels.forEach(l => {
      html += `<div class="cal-weekday">${l}</div>`;
    });

    for (let i = 0; i < decalage; i++) {
      html += '<div class="cal-day cal-day--empty"></div>';
    }

    for (let j = 1; j <= dernierJour; j++) {
      const dateJour = new Date(annee, numMois, j);
      const dateStr = `${annee}-${String(numMois+1).padStart(2,'0')}-${String(j).padStart(2,'0')}`;
      const isPast = dateJour < dateMin;
      const isToday = dateJour.getTime() === aujourd.getTime();
      const isBlocked = !this.estDisponible(dateStr);

      let classes = 'cal-day';
      if (isPast) classes += ' cal-day--past';
      if (isToday) classes += ' cal-day--today';
      if (isBlocked && !isPast) classes += ' cal-day--blocked';

      html += `<div class="${classes}" data-date="${dateStr}">${j}</div>`;
    }

    html += '</div></div>';
    return html;
  },

  /* ========== AJOUTER UNE RÉSERVATION CONFIRMÉE ========== */
  ajouterReservation(reservation) {
    // En production : créer un événement dans Google Calendar via API
    // En attendant : sauvegarder en local pour l'admin
    const reservations = JSON.parse(localStorage.getItem('admin_reservations') || '[]');
    reservations.push({
      ...reservation,
      timestamp: Date.now()
    });
    localStorage.setItem('admin_reservations', JSON.stringify(reservations));
  }
};

window.CalendarService = CalendarService;
