/* ============================================================
   LA MAISON ZOÉ — FICHIER DE CONFIGURATION
   ============================================================
   
   ⚙️  MODIFIEZ UNIQUEMENT CE FICHIER pour personnaliser le site.
   
   Toutes les informations affichées sur le site (nom, adresse,
   téléphone, prix, textes, etc.) sont définies ici.
   
   Après modification : sauvegardez ce fichier et rechargez le site.
   Aucun autre fichier n'a besoin d'être touché.
   
   ============================================================ */

const CONFIG = {

  /* ============================================================
     1. IDENTITÉ DE LA MAISON
     ============================================================ */
  identite: {
    nom: "La Maison Zoé",
    nom_court: "Zoé",                    // utilisé dans le hero
    prefixe: "La Maison",                // affiché au-dessus du nom
    slogan: "Confort · Sérénité · Élégance",
    tagline: "Votre cocon tropical, à cinq minutes de l'aéroport.",
    description_meta: "Maison 3 chambres climatisées au Raizet, à 5 min de l'aéroport. Jardin privé, BBQ, cuisine équipée. Notée 10/10 par nos voyageurs.",
    annee_copyright: "2026"
  },

  /* ============================================================
     2. CONTACT
     ============================================================ */
  contact: {
    telephone: "+590 690 987 463",
    telephone_brut: "590690987463",      // sans espaces ni +, pour les liens WhatsApp/tel
    email: "maisonzoe971@gmail.com",
    whatsapp: "590690987463",            // numéro sans + ni espaces

    adresse: {
      ligne1: "Le Raizet",
      ligne2: "Guadeloupe",
      ville: "Le Raizet",
      region: "Guadeloupe",
      pays: "France"
    },

    reseaux: {
      instagram: "",                     // ex: "https://instagram.com/maisonzoe"
      facebook: "",
      airbnb: "",
      booking: ""
    }
  },

  /* ============================================================
     3. LOCALISATION & EMPLACEMENT
     ============================================================ */
  emplacement: {
    quartier: "Le Raizet",
    region: "Guadeloupe",
    distance_aeroport: "5 min",
    nom_aeroport: "Aéroport du Raizet",
    label_court: "— Le Raizet · Guadeloupe —"
  },

  /* ============================================================
     4. CARACTÉRISTIQUES DU LOGEMENT
     ============================================================ */
  logement: {
    nb_chambres: 3,
    nb_voyageurs_max: 7,
    type: "Maison",
    surface: "",                         // optionnel, ex: "120 m²"

    caracteristiques: [
      "Maison tout équipée",
      "3 chambres climatisées",
      "Cuisine fonctionnelle",
      "Jardin privé & barbecue",
      "À 5 min de l'aéroport",
      "Idéal couples, familles, pros"
    ]
  },

  /* ============================================================
     5. AVIS & NOTATION
     ============================================================ */
  avis: {
    note_globale: "10",
    note_label: "Exceptionnel",
    nb_etoiles: 5,

    criteres: [
      { nom: "Propreté",         note: "10" },
      { nom: "Confort",          note: "10" },
      { nom: "Emplacement",      note: "10" },
      { nom: "Équipements",      note: "10" },
      { nom: "Personnel",        note: "10" },
      { nom: "Qualité / prix",   note: "10" }
    ],

    // Témoignages affichés sur la page Avis
    temoignages: [
      {
        initiale: "R",
        nom: "Renise",
        contexte: "Groupe d'amis · Guadeloupe · Déc. 2025",
        note: "10",
        texte: "Séjour parfait dans un superbe duplex. Tout est pensé pour le confort et la propreté est irréprochable. À recommander sans hésiter !"
      },
      {
        initiale: "E",
        nom: "Edmonde",
        contexte: "Voyageuse · Guadeloupe · Déc. 2025",
        note: "10",
        texte: "Fabuleux. Appartement confortable et hôte accueillante. Nous reviendrons sans hésiter lors de notre prochain passage en Guadeloupe."
      },
      {
        initiale: "M",
        nom: "Maelys",
        contexte: "Voyageur individuel · Guadeloupe · Févr. 2026",
        note: "10",
        texte: "Un séjour absolument exceptionnel en Guadeloupe ! Logement spacieux, ultra confortable, et espaces détente pensés pour le bien-être. Proche de l'aéroport, c'est l'idéal."
      },
      {
        initiale: "P",
        nom: "Patrick",
        contexte: "Couple · France · Janv. 2026",
        note: "10",
        texte: "Nous avons passé un séjour formidable. La maison est très bien équipée, le jardin est un vrai plus, et l'hôte est aux petits soins. Merci pour ce moment."
      },
      {
        initiale: "S",
        nom: "Sophie",
        contexte: "Famille · Guadeloupe · Nov. 2025",
        note: "10",
        texte: "Idéal en famille. Les enfants ont adoré le jardin et le barbecue. La cuisine est complète, on a vraiment pu se sentir comme à la maison. Merci !"
      },
      {
        initiale: "L",
        nom: "Laurent",
        contexte: "Séjour pro · France · Oct. 2025",
        note: "10",
        texte: "Parfait pour un déplacement professionnel. Calme, propre, bien situé près de l'aéroport. Wi-Fi efficace. Je recommande vivement."
      }
    ],

    // Citation principale affichée sur la page d'accueil
    citation_principale: "Un séjour absolument exceptionnel en Guadeloupe. Logement spacieux, ultra confortable, et une hôte aux petits soins.",
    citation_finale: "La Maison Zoé, ce n'est pas qu'un hébergement… c'est une expérience."
  },

  /* ============================================================
     6. POINTS FORTS (page d'accueil)
     ============================================================ */
  points_forts: [
    {
      numero: "01",
      titre: "Propreté irréprochable",
      description: "Un soin maniaque du détail, salué dans chaque avis."
    },
    {
      numero: "02",
      titre: "Confort & literie",
      description: "Matelas et linge de maison pensés pour le repos."
    },
    {
      numero: "03",
      titre: "Emplacement stratégique",
      description: "Au Raizet, à quelques minutes de l'aéroport."
    },
    {
      numero: "04",
      titre: "Hôte attentive",
      description: "Un accueil chaleureux et une disponibilité constante."
    }
  ],

  /* ============================================================
     7. ÉQUIPEMENTS (page Équipements)
     ============================================================ */
  equipements: [
    {
      categorie: "Confort & climatisation",
      items: [
        { icone: "❄",  titre: "Climatisation",     description: "Dans chaque chambre" },
        { icone: "⛅",  titre: "Ventilateur",       description: "Salon et pièces de vie" },
        { icone: "⌂",  titre: "3 chambres",        description: "Literie premium, linge fourni" },
        { icone: "▭",  titre: "Salon chaleureux",  description: "Espace détente convivial" },
        { icone: "✦",  titre: "Linge fourni",      description: "Draps et serviettes propres" },
        { icone: "◐",  titre: "Wi-Fi",             description: "Connexion haut débit" }
      ]
    },
    {
      categorie: "Cuisine équipée",
      items: [
        { icone: "▣",  titre: "Plaques de cuisson",     description: "Gaz, 4 feux" },
        { icone: "▤",  titre: "Four & micro-ondes",     description: "Encastrés, multifonctions" },
        { icone: "▦",  titre: "Hotte aspirante",        description: "Design moderne" },
        { icone: "◉",  titre: "Réfrigérateur",          description: "+ cave à vin intégrée" },
        { icone: "☕",  titre: "Machine Dolce Gusto",   description: "Capsules à disposition" },
        { icone: "⚉",  titre: "Bouilloire",             description: "Alpina, en verre LED" },
        { icone: "▩",  titre: "Blender",                description: "Smoothies & jus frais" },
        { icone: "▣",  titre: "Grille-pain",            description: "Acier inoxydable" },
        { icone: "▤",  titre: "Vaisselle complète",     description: "Assiettes, verres, couverts" }
      ]
    },
    {
      categorie: "Extérieur & loisirs",
      items: [
        { icone: "🌿", titre: "Jardin privé",       description: "Gazon, espace clos" },
        { icone: "♨",  titre: "Barbecue Weber",     description: "Charbon, prêt à l'usage" },
        { icone: "▭",  titre: "Transats",           description: "3 chaises longues" },
        { icone: "◈",  titre: "Table à manger",     description: "6 personnes" },
        { icone: "▦",  titre: "Jeu de dominos",     description: "Soirées conviviales" }
      ]
    },
    {
      categorie: "Multimédia & services",
      items: [
        { icone: "▢",  titre: "Télévision",          description: "Écran connecté Smart TV" },
        { icone: "◐",  titre: "Wi-Fi haut débit",    description: "Idéal pour télétravail" },
        { icone: "⚿",  titre: "Entrée autonome",     description: "Check-in flexible" },
        { icone: "✈",  titre: "Proche aéroport",     description: "5 min du Raizet" },
        { icone: "⚐",  titre: "Parking",             description: "Gratuit, sur place" },
        { icone: "♥",  titre: "Hôte attentive",      description: "Disponible 7j/7" }
      ]
    }
  ],

  /* ============================================================
     8. IMAGES DE LA GALERIE
     ============================================================
     Les images doivent être placées dans le dossier /images/
     Modifiez le nom de fichier (src) et la description (alt)
     ============================================================ */
  galerie: [
    { src: "la_maisonzoe-20260513-0001.jpg",         alt: "Chambre principale",   taille: "tall" },
    { src: "la_maisonzoe-20260513-0003.jpg",         alt: "Salle à manger",       taille: "" },
    { src: "la_maisonzoe-20260513-0004.jpg",         alt: "Salon",                taille: "" },
    { src: "la_maisonzoe-20260513-0005.jpg",         alt: "Jardin privé",         taille: "wide" },
    { src: "la_maisonzoe-20260513-0007.jpg",         alt: "Chambre",              taille: "" },
    { src: "la_maisonzoe-20260513-0008.jpg",         alt: "Cuisine équipée",      taille: "" },
    { src: "la_maisonzoe-20260513-0006.jpg",         alt: "Coin café",            taille: "tall" },
    { src: "la_maisonzoe-20260513-0002.jpg",         alt: "Bouilloire",           taille: "" },
    { src: "la_maisonzoe-20260513-0010_heic.webp",   alt: "Cuisine vue jardin",   taille: "" },
    { src: "la_maisonzoe-20260513-0006_heic.webp",   alt: "BBQ extérieur",        taille: "wide" },
    { src: "la_maisonzoe-20260513-0009_heic.webp",   alt: "Détail cuisine",       taille: "" }
  ],

  // Images d'aperçu sur la page d'accueil (4 max)
  preview_accueil: [
    { src: "la_maisonzoe-20260513-0003.jpg", label: "Salle à manger", grand: true },
    { src: "la_maisonzoe-20260513-0001.jpg", label: "Chambre",        grand: false },
    { src: "la_maisonzoe-20260513-0005.jpg", label: "Jardin",         grand: false },
    { src: "la_maisonzoe-20260513-0004.jpg", label: "Salon",          grand: false }
  ],

  /* ============================================================
     9. TEXTES & CONTENU
     ============================================================ */
  textes: {
    accueil: {
      intro_eyebrow: "L'expérience",
      intro_titre: "Une parenthèse de confort<br>et de sérénité.",
      intro_lead: "Offrez-vous un hébergement élégant, pensé pour le bien-être. Trois chambres climatisées, une cuisine entièrement équipée, un salon chaleureux et un jardin privé avec espace barbecue — tout est réuni pour transformer votre séjour en véritable expérience.",
      citation_frame: "« Ce n'est pas qu'un hébergement… c'est une expérience. »",

      highlights_eyebrow: "— Ce qui nous distingue —",
      highlights_titre: "10/10 partout.",

      preview_eyebrow: "— Aperçu —",
      preview_titre: "La maison en images.",

      cta_titre: "Prêt à vivre l'expérience Zoé ?",
      cta_texte: "Réservez votre séjour en quelques clics ou contactez-nous directement."
    },

    galerie: {
      header_eyebrow: "— Galerie photos —",
      header_titre: "L'écrin",
      header_sous_titre: "Chaque espace a été pensé avec soin pour offrir confort, élégance et sérénité.",
      cta_titre: "Séduit par les lieux ?",
      cta_texte: "Réservez dès maintenant votre séjour à La Maison Zoé."
    },

    equipements: {
      header_eyebrow: "— Tout inclus —",
      header_titre: "Équipements",
      header_sous_titre: "Une maison entièrement équipée pour un séjour sans aucune mauvaise surprise.",
      cta_titre: "Tout est prêt pour vous accueillir.",
      cta_texte: "Profitez d'un séjour clé en main, sans tracas."
    },

    avis: {
      header_eyebrow: "— Témoignages —",
      header_titre: "Avis voyageurs",
      header_sous_titre: "« Des avis qui se répètent… parce que l'expérience est toujours au rendez-vous. »",
      cta_titre: "À votre tour de vivre l'expérience.",
      cta_texte: "Réservez votre séjour et rejoignez nos voyageurs satisfaits."
    },

    reservation: {
      header_eyebrow: "— Demande de réservation —",
      header_titre: "Réserver",
      header_sous_titre: "Quelques informations pour préparer votre séjour. Réponse rapide garantie.",
      form_titre: "Une question, une demande ?",
      form_intro: "Remplissez le formulaire ci-contre ou contactez-nous directement par WhatsApp, téléphone ou email. Nous répondons sous quelques heures, 7j/7.",
      form_success: "✓ Votre demande est prête. Vous allez être redirigé vers WhatsApp pour la confirmer."
    }
  },

  /* ============================================================
     10. APPARENCE (COULEURS)
     ============================================================
     Pour changer la charte graphique, modifiez ces couleurs.
     Format : hexadécimal (#RRGGBB)
     ============================================================ */
  couleurs: {
    noir:        "#0a0a0a",
    noir_2:      "#141414",
    noir_3:      "#1c1c1c",
    or:          "#c9a961",
    or_clair:    "#e8d5a0",
    or_fonce:    "#8a7340",
    creme:       "#f5efe0",
    gris:        "#2a2a2a",
    gris_clair:  "#9a9a9a",
    blanc:       "#ffffff",
    whatsapp:    "#25D366"
  }

};

/* ============================================================
   ⚠️  NE PAS MODIFIER CE QUI SUIT
   Ce code applique automatiquement la configuration au site.
   ============================================================ */

// Export global pour utilisation par les scripts du site
if (typeof window !== 'undefined') {
  window.SITE_CONFIG = CONFIG;
}


/* ============================================================
   11. TARIFICATION & SAISONS
   ============================================================
   ⚠️ À PERSONNALISER : remplacer les dates et prix par les vrais.
   ============================================================ */
CONFIG.tarifs = {

  devise: "EUR",
  symbole: "€",

  // Durée minimum de séjour en nuits
  duree_min_nuits: 7,

  // Frais supplémentaires
  frais: {
    menage: 80,                          // forfait ménage (€)
    caution: 500,                        // caution (€)
    taxe_sejour_par_nuit: 1.50,          // par personne par nuit
    arrivee_tardive: 0                   // 0 = gratuit
  },

  // Modèle de paiement
  paiement: {
    pourcentage_acompte: 30,             // % à la réservation
    pourcentage_solde: 70,               // % à l'arrivée ou avant
    delai_solde_jours_avant: 7           // J-7 pour le solde
  },

  // 4 saisons - DATES À COMPLÉTER
  saisons: [
    {
      nom: "basse",
      label: "Basse saison",
      couleur: "#7a9e3d",
      periodes: [
        // Format : { debut: "MM-JJ", fin: "MM-JJ" }
        { debut: "01-15", fin: "02-15" },
        { debut: "05-01", fin: "06-30" },
        { debut: "09-15", fin: "11-30" }
      ],
      prix: {
        nuit: 75,
        semaine: 480,                    // 7 nuits ≈ -8%
        mois: 1800                       // 30 nuits ≈ -20%
      }
    },
    {
      nom: "moyenne",
      label: "Moyenne saison",
      couleur: "#d4a04a",
      periodes: [
        { debut: "03-01", fin: "04-30" },
        { debut: "07-01", fin: "07-14" },
        { debut: "09-01", fin: "09-14" }
      ],
      prix: {
        nuit: 95,
        semaine: 620,
        mois: 2400
      }
    },
    {
      nom: "haute",
      label: "Haute saison",
      couleur: "#c9633c",
      periodes: [
        { debut: "07-15", fin: "08-31" },
        { debut: "02-16", fin: "02-28" },
        { debut: "10-25", fin: "11-05" }
      ],
      prix: {
        nuit: 130,
        semaine: 850,
        mois: 3200
      }
    },
    {
      nom: "fetes",
      label: "Vacances de fin d'année",
      couleur: "#a83232",
      periodes: [
        { debut: "12-20", fin: "01-05" }
      ],
      prix: {
        nuit: 165,
        semaine: 1100,
        mois: 4200
      }
    }
  ]
};


/* ============================================================
   12. CONTRAT DE LOCATION
   ============================================================
   Texte du contrat affiché et signé par le client.
   Variables disponibles : {nom}, {email}, {tel}, {arrivee},
   {depart}, {nb_nuits}, {nb_voyageurs}, {total}, {acompte}, {solde}
   ============================================================ */
CONFIG.contrat = {

  // Informations propriétaire
  proprietaire: {
    nom_complet: "Mme [Nom Propriétaire]",
    adresse: "Le Raizet, Guadeloupe",
    email: "maisonzoe971@gmail.com",
    telephone: "+590 690 987 463",
    siret: ""                            // optionnel
  },

  // Informations du bien
  bien: {
    nom: "La Maison Zoé",
    adresse: "Le Raizet, 97122 Baie-Mahault, Guadeloupe",
    type: "Maison meublée de tourisme",
    surface: "",                         // ex: "120 m²"
    pieces: "3 chambres, salon, cuisine, jardin, BBQ"
  },

  // Clauses du contrat (chaque entrée = un article)
  clauses: [
    {
      titre: "Article 1 — Objet du contrat",
      texte: "Le présent contrat a pour objet la location saisonnière du bien meublé situé au Raizet (Guadeloupe), à usage exclusif d'habitation, dans le cadre d'un séjour de tourisme conformément à l'article L324-1-1 du Code du tourisme."
    },
    {
      titre: "Article 2 — Durée du séjour",
      texte: "Le séjour est conclu du {arrivee} au {depart} inclus, soit {nb_nuits} nuit(s), pour {nb_voyageurs} voyageur(s). Toute prolongation devra faire l'objet d'un accord écrit du propriétaire."
    },
    {
      titre: "Article 3 — Prix et modalités de paiement",
      texte: "Le montant total du séjour est de {total} €, comprenant la location, les charges et le forfait ménage. Un acompte de 30% ({acompte} €) est dû à la signature du présent contrat. Le solde de 70% ({solde} €) est exigible au plus tard 7 jours avant l'arrivée, ou à défaut, le jour même de l'arrivée. Une caution de 500 € est demandée à l'entrée dans les lieux et restituée au départ après état des lieux."
    },
    {
      titre: "Article 4 — Conditions d'annulation",
      texte: "En cas d'annulation par le locataire : plus de 30 jours avant l'arrivée, l'acompte est remboursé à 50% ; entre 30 et 7 jours avant l'arrivée, l'acompte est conservé ; moins de 7 jours avant l'arrivée, la totalité du séjour est due. En cas d'annulation par le propriétaire pour cas de force majeure, l'intégralité des sommes versées sera restituée."
    },
    {
      titre: "Article 5 — État des lieux et caution",
      texte: "Un état des lieux d'entrée sera réalisé contradictoirement à l'arrivée. Un état des lieux de sortie sera effectué au départ. La caution de 500 € sera restituée dans un délai de 7 jours après le départ, déduction faite des éventuels frais de réparation ou de remise en état."
    },
    {
      titre: "Article 6 — Obligations du locataire",
      texte: "Le locataire s'engage à : occuper les lieux paisiblement et en bon père de famille ; respecter le voisinage ; ne pas sous-louer le bien ; restituer le bien en bon état de propreté ; respecter le nombre maximum de personnes ({nb_voyageurs}) ; ne pas fumer à l'intérieur ; ne pas organiser de fêtes ou événements bruyants."
    },
    {
      titre: "Article 7 — Animaux",
      texte: "Les animaux de compagnie ne sont pas autorisés sans accord écrit préalable du propriétaire."
    },
    {
      titre: "Article 8 — Assurance",
      texte: "Le locataire déclare être titulaire d'une assurance responsabilité civile couvrant les risques liés à la location saisonnière (incendie, dégâts des eaux, vol, etc.)."
    },
    {
      titre: "Article 9 — Litiges et droit applicable",
      texte: "Le présent contrat est soumis au droit français. Tout litige relatif à son exécution sera, à défaut de règlement amiable, porté devant les tribunaux compétents du lieu de situation de l'immeuble."
    },
    {
      titre: "Article 10 — Acceptation",
      texte: "En signant électroniquement ce contrat, le locataire {nom} reconnaît avoir pris connaissance de l'ensemble des clauses, les accepter sans réserve, et autoriser le paiement de l'acompte de {acompte} € par carte bancaire via la plateforme sécurisée Stripe."
    }
  ]
};


/* ============================================================
   13. PAIEMENT STRIPE
   ============================================================
   ⚠️ À REMPLACER par vos vraies clés Stripe.
   Récupérez-les sur https://dashboard.stripe.com/apikeys
   ============================================================ */
CONFIG.stripe = {

  // Clé PUBLIQUE (commence par pk_live_ ou pk_test_)
  // ⚠️ Cette clé est visible côté client, c'est normal
  publishable_key: "pk_test_REMPLACER_PAR_VOTRE_CLE_PUBLIQUE",

  // Mode test ou production
  mode: "test",                          // "test" ou "live"

  // Devise (doit correspondre à la devise tarifs)
  currency: "eur",

  // Description affichée sur le ticket Stripe
  description_template: "Acompte 30% - Réservation {nom} ({arrivee} au {depart})"
};


/* ============================================================
   14. FIREBASE (BASE DE DONNÉES + EMAIL)
   ============================================================
   ⚠️ À REMPLACER par votre config Firebase.
   Créez un projet gratuit sur https://console.firebase.google.com
   ============================================================ */
CONFIG.firebase = {

  apiKey: "REMPLACER_PAR_VOTRE_API_KEY",
  authDomain: "VOTRE-PROJET.firebaseapp.com",
  projectId: "VOTRE-PROJET",
  storageBucket: "VOTRE-PROJET.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};


/* ============================================================
   15. ESPACE CLIENT
   ============================================================ */
CONFIG.espace_client = {

  // Étapes du processus de réservation
  etapes: [
    { num: 1, titre: "Vos informations",   description: "Coordonnées et dates" },
    { num: 2, titre: "Détails du séjour",  description: "Récapitulatif et prix" },
    { num: 3, titre: "Signature du contrat", description: "Lecture et signature" },
    { num: 4, titre: "Paiement acompte",   description: "30% sécurisé Stripe" },
    { num: 5, titre: "Confirmation",       description: "Email + PDF contrat" }
  ],

  // Textes de confirmation
  confirmation: {
    titre: "Réservation confirmée !",
    message: "Votre séjour est officiellement réservé. Vous recevrez le PDF du contrat signé par email, ainsi qu'un rappel pour le solde 7 jours avant votre arrivée.",
    cta_telecharger: "Télécharger le contrat (PDF)",
    cta_accueil: "Retour à l'accueil"
  },

  // Email de bienvenue (lien magique)
  email_lien_magique: {
    sujet: "Finalisez votre réservation - La Maison Zoé",
    apercu: "Cliquez sur le lien pour accéder à votre espace de réservation",
    bouton_texte: "Accéder à mon espace",
    duree_validite_heures: 48
  }
};


/* ============================================================
   16. ENVOI D'EMAILS — EmailJS
   ============================================================
   ⚠️ À CONFIGURER :
   1. Créer compte gratuit sur https://www.emailjs.com (200 emails/mois)
   2. Connecter un service Gmail dans EmailJS
   3. Créer 2 templates :
      - "lien_magique" : email avec lien vers espace client
      - "confirmation" : email de confirmation après paiement
   4. Récupérer les IDs et coller ci-dessous
   ============================================================ */
CONFIG.emailjs = {
  // Public Key (Dashboard > Account > API Keys)
  public_key: "REMPLACER_PAR_VOTRE_PUBLIC_KEY",

  // Service ID (Dashboard > Email Services)
  service_id: "service_REMPLACER",

  // Templates (Dashboard > Email Templates)
  templates: {
    lien_magique: "template_REMPLACER_lien",
    confirmation: "template_REMPLACER_confirmation",
    admin_notification: "template_REMPLACER_admin"   // optionnel : alerte propriétaire
  },

  // Envoyer aussi une copie au propriétaire
  notifier_proprietaire: true,
  email_proprietaire: "maisonzoe971@gmail.com"
};


/* ============================================================
   17. CALENDRIER — Google Calendar (synchro iCal)
   ============================================================
   ⚠️ À CONFIGURER :
   1. Créer un calendrier Google dédié "La Maison Zoé"
   2. Paramètres du calendrier > Intégrer le calendrier
   3. Copier l'URL "Adresse publique au format iCal"
   4. Coller dans 'ical_url' ci-dessous
   ============================================================ */
CONFIG.calendrier = {

  // URL iCal Google Calendar (lecture seule)
  // Exemple : https://calendar.google.com/calendar/ical/xxx%40group.calendar.google.com/public/basic.ics
  ical_url: "",

  // Synchronisation automatique
  refresh_auto: true,
  refresh_interval_minutes: 60,

  // Préréservations : bloquer aussi les dates ajoutées manuellement dans config
  dates_indisponibles_manuelles: [
    // Exemple : { debut: "2026-12-20", fin: "2026-12-27", raison: "Travaux" }
  ],

  // Affichage
  nb_mois_affiches: 12,                    // 12 mois en avance
  jour_premier: "lundi",                   // "lundi" ou "dimanche"

  // Couleurs (statut visuel)
  couleurs: {
    disponible: "#1c3a1c",
    indisponible: "#5a2020",
    selectionne: "#c9a961",
    passe: "#1a1a1a",
    aujourdhui: "#c9a961"
  }
};


/* ============================================================
   18. DASHBOARD ADMIN
   ============================================================
   ⚠️ CHANGEZ LE MOT DE PASSE IMMÉDIATEMENT
   Accès : votre-site.com/admin/
   ============================================================ */
CONFIG.admin = {

  // ⚠️ CHANGEZ CE MOT DE PASSE
  mot_de_passe: "MaisonZoe2026!",

  // Le mot de passe est hashé au runtime pour ne pas être visible en clair
  // Pour plus de sécurité : utiliser Firebase Auth (voir documentation)

  // Durée de la session admin (heures)
  duree_session: 24,

  // Pages affichées dans le menu
  menu: [
    { titre: "Tableau de bord",   slug: "dashboard" },
    { titre: "Réservations",      slug: "reservations" },
    { titre: "Calendrier",        slug: "calendrier" },
    { titre: "Paramètres",        slug: "settings" }
  ]
};
