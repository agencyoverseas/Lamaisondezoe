// ===== NAVIGATION SCROLL =====
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

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
const galleryItems = document.querySelectorAll('.gallery__item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
let currentImgIndex = 0;
let imgSrcs = [];

if (galleryItems.length && lightbox) {
  galleryItems.forEach((item, index) => {
    const src = item.querySelector('img').src;
    imgSrcs.push(src);
    item.addEventListener('click', () => {
      currentImgIndex = index;
      lightboxImg.src = src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
  const showImg = (idx) => {
    currentImgIndex = (idx + imgSrcs.length) % imgSrcs.length;
    lightboxImg.src = imgSrcs[currentImgIndex];
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  lightboxPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    showImg(currentImgIndex - 1);
  });
  lightboxNext?.addEventListener('click', (e) => {
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

// ===== FORM RÉSERVATION =====
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(bookingForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const arrival = formData.get('arrival');
    const departure = formData.get('departure');
    const guests = formData.get('guests');
    const message = formData.get('message');

    // Construit lien WhatsApp avec message pré-rempli
    const text = `Bonjour, je souhaite réserver La Maison Zoé.%0A%0A` +
                 `Nom : ${name}%0A` +
                 `Email : ${email}%0A` +
                 `Téléphone : ${phone}%0A` +
                 `Arrivée : ${arrival}%0A` +
                 `Départ : ${departure}%0A` +
                 `Voyageurs : ${guests}%0A` +
                 `Message : ${message || '-'}`;
    const waUrl = `https://wa.me/590690987463?text=${text}`;

    document.getElementById('formSuccess').classList.add('show');
    setTimeout(() => { window.open(waUrl, '_blank'); }, 800);
    bookingForm.reset();
  });
}

// ===== REVEAL ON SCROLL =====
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
