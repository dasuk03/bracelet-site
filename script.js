// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// Carousel controls
const track = document.getElementById('carTrack');
const prevBtn = document.getElementById('carPrev');
const nextBtn = document.getElementById('carNext');

function cardStep(){
  const card = track.querySelector('.product-card');
  if(!card) return 320;
  const style = getComputedStyle(track);
  const gap = parseFloat(style.gap) || 26;
  return card.getBoundingClientRect().width + gap;
}

prevBtn.addEventListener('click', () => {
  track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
});
nextBtn.addEventListener('click', () => {
  track.scrollBy({ left: cardStep(), behavior: 'smooth' });
});

// Demo form submit (front-end only — wire up to real backend/email later)
const form = document.getElementById('orderForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  note.textContent = 'Спасибо! Это демо-форма — подключите её к почте, Telegram-боту или CRM, чтобы получать заявки.';
  note.style.color = 'rgba(201,169,110,0.9)';
  form.reset();
});

// Reveal on scroll for section headers/cards
const revealTargets = document.querySelectorAll('.product-card, .about-inner, .order-inner');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.style.opacity = 1;
      entry.target.style.transform = entry.target.classList.contains('product-card')
        ? entry.target.style.transform
        : 'translateY(0)';
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.about-inner, .order-inner').forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity .8s ease, transform .8s ease';
  io.observe(el);
});
