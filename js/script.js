// ===== NAVIGATION SCROLL =====
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });
}

// ===== MOBILE MENU =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ===== LIGHTBOX GALERIE =====
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentImgIndex = 0;
let imgSrcs = [];

if (lightbox) {
  setTimeout(() => {
    const galleryItems = document.querySelectorAll('.gallery__item');
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      if (!img) return;
      imgSrcs.push(img.src);
      item.addEventListener('click', () => {
        currentImgIndex = index;
        lightboxImg.src = img.src;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });
  }, 50);

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
  const showImg = (idx) => {
    currentImgIndex = (idx + imgSrcs.length) % imgSrcs.length;
    lightboxImg.src = imgSrcs[currentImgIndex];
  };

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => {
    e.stopPropagation();
    showImg(currentImgIndex - 1);
  });
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => {
    e.stopPropagation();
    showImg(currentImgIndex + 1);
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showImg(currentImgIndex - 1);
    if (e.key === 'ArrowRight') showImg(currentImgIndex + 1);
  });
}

// ===== FORM RÉSERVATION (page reservation.html) =====
// Redirige maintenant vers l'espace client au lieu de WhatsApp
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    const params = new URLSearchParams();
    ['name', 'email', 'phone', 'arrival', 'departure', 'guests', 'message'].forEach(k => {
      if (formData.get(k)) params.set(k, formData.get(k));
    });

    document.getElementById('formSuccess').classList.add('show');

    // Redirection vers espace client avec pré-remplissage
    setTimeout(() => {
      // Mapper les noms de champs vers ceux de l'espace client
      const mapping = {
        name: 'nom',
        email: 'email',
        phone: 'telephone',
        arrival: 'arrivee',
        departure: 'depart',
        guests: 'nb_voyageurs',
        message: 'message'
      };
      const ecParams = new URLSearchParams();
      Object.entries(mapping).forEach(([from, to]) => {
        const v = formData.get(from);
        if (v) ecParams.set(to, v);
      });

      // Pages sont dans /pages/, donc espace-client est dans ../espace-client/
      window.location.href = `../espace-client/index.html?${ecParams.toString()}`;
    }, 800);

    bookingForm.reset();
  });
}

// ===== REVEAL ON SCROLL =====
setTimeout(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.highlight, .preview__item, .gallery__item, .review, .equip-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity .8s ease, transform .8s ease';
    observer.observe(el);
  });
}, 100);
