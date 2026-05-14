# La Maison Zoé — Site complet avec espace client

Site vitrine + tunnel de réservation avec **signature électronique** et **paiement Stripe**.

---

## 🎯 PARCOURS CLIENT COMPLET

```
1. Visite du site → Clic "Réserver"
2. Formulaire de réservation
3. Espace client (5 étapes) :
   - Étape 1 : Vérification des infos
   - Étape 2 : Récapitulatif tarif (calcul auto selon saison)
   - Étape 3 : Lecture + signature électronique du contrat
   - Étape 4 : Paiement acompte 30% (Stripe)
   - Étape 5 : Confirmation + téléchargement contrat PDF
```

---

## ⚙️ CONFIGURATION (config.js)

**Tout est centralisé dans `config.js` :**

| Section | Contenu |
|---------|---------|
| 1. Identité | Nom, slogan, tagline |
| 2. Contact | Tel, WhatsApp, email, adresse |
| 3. Emplacement | Quartier, distance aéroport |
| 4. Logement | Nb chambres, voyageurs max |
| 5. Avis | Note, critères, témoignages |
| 6. Points forts | 4 atouts page d'accueil |
| 7. Équipements | 4 catégories |
| 8. Galerie | Liste des photos |
| 9. Textes | Tous les textes |
| 10. Couleurs | Charte graphique |
| **11. Tarifs** | **4 saisons + prix nuit/semaine/mois** |
| **12. Contrat** | **Articles du contrat de location** |
| **13. Stripe** | **Clé publique Stripe** |
| **14. Firebase** | **Config base de données (optionnel)** |
| **15. Espace client** | **Étapes + textes confirmation** |

---

## 🔑 ÉTAPES POUR ACTIVER LE PAIEMENT STRIPE

### 1. Récupérer votre clé Stripe
- Aller sur https://dashboard.stripe.com/apikeys
- Copier la clé **publishable** (commence par `pk_test_` ou `pk_live_`)

### 2. Modifier config.js
```javascript
CONFIG.stripe = {
  publishable_key: "pk_test_VOTRE_VRAIE_CLE_ICI",
  mode: "test",        // "test" pour essai, "live" pour production
  currency: "eur"
};
```

### 3. ⚠️ Pour la production (paiement réel)
Un **backend** est nécessaire pour créer les PaymentIntents Stripe.

Options :
- **Firebase Functions** (gratuit jusqu'à 125k appels/mois)
- **Vercel + Stripe Checkout** (le plus simple)
- **Netlify Functions**

En l'état, le site fonctionne en **mode démo** : la carte est validée mais aucun débit réel.

---

## 💰 TARIFS — 4 SAISONS

**À personnaliser dans `config.js` section 11 :**

```javascript
saisons: [
  {
    nom: "basse",
    periodes: [{ debut: "01-15", fin: "02-15" }],  // MM-JJ
    prix: { nuit: 75, semaine: 480, mois: 1800 }
  },
  // ... idem pour moyenne, haute, fetes
]
```

**Modèle de paiement :** 30% acompte + 70% à l'arrivée (modifiable)
**Durée minimum :** 7 nuits (modifiable)
**Frais :** ménage, taxe séjour, caution (modifiables)

---

## 📄 CONTRAT DE LOCATION

**Articles disponibles dans `config.js` section 12 :**
1. Objet du contrat
2. Durée du séjour
3. Prix et modalités de paiement
4. Conditions d'annulation
5. État des lieux et caution
6. Obligations du locataire
7. Animaux
8. Assurance
9. Litiges et droit applicable
10. Acceptation

**Variables auto-remplies :** `{nom}`, `{arrivee}`, `{depart}`, `{nb_nuits}`, `{total}`, `{acompte}`, `{solde}`

---

## 🔐 SIGNATURE ÉLECTRONIQUE

- **Type :** Signature manuscrite sur canvas HTML5 (doigt sur mobile, souris desktop)
- **Métadonnées capturées :** Date/heure, IP, User-Agent
- **Sortie :** Signature intégrée dans le PDF du contrat
- **Valeur juridique :** Suffisante pour location courte durée (preuve technique + acceptation explicite)

Pour une signature certifiée eIDAS (recommandée pour contrats > 1500€) :
- DocuSign : ~25€/mois
- Yousign (français) : ~9€/mois

---

## 📁 STRUCTURE

```
maison-zoe/
├── config.js                ← 🎯 SEUL FICHIER À MODIFIER
├── index.html
├── README.md
│
├── css/
│   ├── styles.css           (site vitrine)
│   └── espace-client.css    (tunnel réservation)
│
├── js/
│   ├── render.js            (moteur de rendu)
│   ├── script.js            (interactions site)
│   ├── booking.js           (calcul tarifs)
│   └── espace-client.js     (logique 5 étapes)
│
├── images/                  ← Photos
│
├── pages/
│   ├── galerie.html
│   ├── equipements.html
│   ├── avis.html
│   └── reservation.html     → redirige vers espace-client
│
└── espace-client/
    └── index.html           ← Tunnel de réservation
```

---

## 🚀 DÉPLOIEMENT GITHUB PAGES

1. Créer un repo GitHub
2. Uploader tout le contenu de ce dossier
3. Settings → Pages → Source : `main` / `(root)` → Save
4. Site disponible sur `https://[votre-username].github.io/maison-zoe/`

**⚠️ Pour le paiement réel :** héberger plutôt sur **Vercel** ou **Netlify** (gratuits) pour avoir des Functions backend.

---

## ✅ FONCTIONNALITÉS

- ✅ Site vitrine 5 pages
- ✅ Galerie avec lightbox
- ✅ Bouton WhatsApp flottant
- ✅ Formulaire de réservation
- ✅ Espace client avec 5 étapes
- ✅ Calcul automatique des tarifs (4 saisons)
- ✅ Contrat de location personnalisable
- ✅ Signature électronique sur canvas
- ✅ Paiement Stripe (mode démo en l'état)
- ✅ Génération PDF contrat signé
- ✅ Tout configurable depuis un seul fichier
- ✅ Responsive mobile/tablette/desktop

---

## 📞 Contact (modifiable dans config.js)

- **WhatsApp** : +590 690 987 463
- **Email** : maisonzoe971@gmail.com
- **Localisation** : Le Raizet, Guadeloupe

---

© 2026 La Maison Zoé · Confort · Sérénité · Élégance

---

## 📧 ACTIVER LES EMAILS (EmailJS)

### 1. Créer compte EmailJS (gratuit 200 emails/mois)
- https://www.emailjs.com → S'inscrire

### 2. Connecter Gmail
- Email Services → Add New Service → Gmail → Connect

### 3. Créer 2 templates
- **Template 1 : "lien_magique"**
  - Variables : `{{to_name}}`, `{{lien_espace_client}}`, `{{arrivee}}`, `{{depart}}`, `{{total}}`, `{{acompte}}`
- **Template 2 : "confirmation"**
  - Variables : `{{to_name}}`, `{{reference}}`, `{{arrivee}}`, `{{depart}}`, `{{total}}`, `{{acompte_paye}}`, `{{solde_restant}}`
- (Optionnel) **Template 3 : "admin_notification"** pour recevoir une alerte sur chaque réservation

### 4. Coller les IDs dans config.js (section 16)

```javascript
CONFIG.emailjs = {
  public_key: "votre_public_key",
  service_id: "service_abc123",
  templates: {
    lien_magique: "template_xxxxx",
    confirmation: "template_yyyyy",
    admin_notification: "template_zzzzz"
  }
};
```

---

## 📅 ACTIVER LE CALENDRIER GOOGLE CALENDAR

### 1. Créer un calendrier dédié
- Google Calendar → ⚙️ → Créer un calendrier → "La Maison Zoé"

### 2. Récupérer l'URL iCal publique
- Cliquer sur le calendrier → **Paramètres**
- Section "Intégrer le calendrier"
- Copier "**Adresse publique au format iCal**"
- ⚠️ Important : rendre le calendrier **public** (visibilité)

### 3. Coller dans config.js (section 17)

```javascript
CONFIG.calendrier = {
  ical_url: "https://calendar.google.com/calendar/ical/xxx/public/basic.ics"
};
```

### 4. Bloquer des dates
- Ajouter un événement dans Google Calendar (ex: "Réservé Dupont 1-7 juillet")
- Le site lit automatiquement et bloque ces dates dans le calendrier

---

## 🔐 DASHBOARD ADMIN

### Accès
- URL : `https://votre-site.com/admin/`
- Mot de passe par défaut : `MaisonZoe2026!` (⚠️ À CHANGER)

### Fonctionnalités
- 📊 **Tableau de bord** : stats, CA, réservations récentes
- 📋 **Réservations** : liste complète, filtres, export CSV, détail par modal
- 📅 **Calendrier** : vue d'ensemble des disponibilités
- ⚙️ **Paramètres** : statut de configuration, actions admin

### Changer le mot de passe
Dans `config.js` (section 18) :
```javascript
CONFIG.admin = {
  mot_de_passe: "VotreNouveauMotDePasse!"
};
```

---

## 📁 STRUCTURE COMPLÈTE FINALE

```
maison-zoe/
├── config.js                ← 🎯 SEUL FICHIER À MODIFIER (18 sections)
├── index.html               ← Accueil
├── README.md
│
├── css/
│   ├── styles.css           Site vitrine
│   ├── espace-client.css    Tunnel réservation
│   └── calendar.css         Calendrier
│
├── js/
│   ├── render.js            Moteur de rendu
│   ├── script.js            Site
│   ├── booking.js           Calcul tarifs
│   ├── espace-client.js     Tunnel 5 étapes
│   ├── email-service.js     EmailJS
│   └── calendar-service.js  Google Calendar
│
├── images/                  19 photos
│
├── pages/                   Pages vitrine
│   ├── galerie.html
│   ├── equipements.html
│   ├── avis.html
│   └── reservation.html
│
├── espace-client/
│   └── index.html           Tunnel réservation (5 étapes)
│
└── admin/                   Dashboard admin
    ├── index.html
    ├── admin.css
    └── admin.js
```

---

## ✅ FONCTIONNALITÉS TOTALES

### Site vitrine
- ✅ 5 pages liées (Accueil, Galerie, Équipements, Avis, Réservation)
- ✅ Galerie avec lightbox
- ✅ Bouton WhatsApp flottant
- ✅ Responsive mobile/desktop

### Tunnel de réservation (5 étapes)
- ✅ Formulaire avec calendrier de disponibilités
- ✅ Vérification disponibilité auto (Google Calendar)
- ✅ Calcul tarif auto (4 saisons)
- ✅ Récapitulatif détaillé
- ✅ Contrat 10 articles personnalisable
- ✅ Signature électronique tactile
- ✅ Paiement Stripe (mode démo en l'état)
- ✅ Génération PDF contrat signé
- ✅ Email lien magique + confirmation
- ✅ Lien unique avec expiration 48h

### Dashboard admin
- ✅ Authentification par mot de passe
- ✅ Statistiques (CA, réservations, acomptes)
- ✅ Liste filtrable et recherche
- ✅ Détail réservation avec signature
- ✅ Annulation / Suppression
- ✅ Export CSV
- ✅ Calendrier visuel
- ✅ Statut de configuration
- ✅ Backup JSON

### Configuration
- ✅ Un seul fichier `config.js` pour tout
- ✅ 18 sections documentées
- ✅ Valeurs par défaut fonctionnelles

