// Core interactions (index/about/portfolio/contact)
// Nav toggle
const hamburger = document.querySelectorAll('.hamburger');
const navLinks = document.querySelectorAll('#mainNav');

hamburger.forEach(btn => {
  btn.addEventListener('click', () => {
    const nav = document.getElementById('mainNav');
    if (nav) nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', btn.getAttribute('aria-expanded') === 'true' ? 'false' : 'true');
  });
});

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, {threshold: 0.18});

document.querySelectorAll('.reveal, .card, .project-card').forEach(el => {
  revealObserver.observe(el);
});

// Projects data
const PROJECTS = [
  {
    title: 'Forex Market Dashboard',
    desc: 'Real-time price action dashboard. Built with JS and light-weight charting.',
    link: '#',
    images: []
  },
  {
    title: 'Portfolio Website Template',
    desc: 'Modular responsive portfolio template for freelancers.',
    link: '#',
    images: []
  },
  {
    title: 'Binary Signal Bot UI',
    desc: 'Interface for managing automated signals and logs.',
    link: '#',
    images: []
  },
  {
    title: 'Trade Journal (MVP)',
    desc: 'Minimal journal for logging trades and performance.',
    link: '#',
    images: []
  },
  {
    title: 'Data Tools',
    desc: 'Scripts and tools for data cleaning and export.',
    link: '#',
    images: []
  }
];

// Modal logic (portfolio)
const modal = document.getElementById('projectModal');
const modalTitle = modal ? modal.querySelector('#modalTitle') : null;
const modalDesc = modal ? modal.querySelector('#modalDesc') : null;
const modalGallery = modal ? modal.querySelector('#modalGallery') : null;
const modalLink = modal ? modal.querySelector('#modalLink') : null;
const modalClose = modal ? modal.querySelector('.modal-close') : null;

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', () => openProjectModal(parseInt(card.getAttribute('data-index') || '0', 10)));
  card.addEventListener('keydown', e => { if (e.key === 'Enter') openProjectModal(parseInt(card.getAttribute('data-index') || '0', 10)); });
});

function openProjectModal(i){
  const p = PROJECTS[i] || PROJECTS[0];
  if(!modal) return;
  modal.setAttribute('aria-hidden','false');
  modalTitle.textContent = p.title;
  modalDesc.textContent = p.desc;
  modalGallery.innerHTML = '';
  // images placeholder if available
  if(p.images && p.images.length){
    p.images.forEach(src=>{
      const img = document.createElement('img');
      img.src = src;
      modalGallery.appendChild(img);
    });
  } else {
    modalGallery.innerHTML = '<div class="muted">No gallery images provided.</div>';
  }
  modalLink.href = p.link || '#';
  document.body.style.overflow = 'hidden';
}

function closeProjectModal(){
  if(!modal) return;
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}

if(modalClose) modalClose.addEventListener('click', closeProjectModal);
if(modal) modal.addEventListener('click', (e)=>{ if(e.target === modal) closeProjectModal(); });
window.addEventListener('keydown', e=>{ if(e.key === 'Escape') closeProjectModal(); });

// Contact form (client-side demo)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if(contactForm){
  contactForm.addEventListener('submit', e=>{
    e.preventDefault();
    const f = new FormData(contactForm);
    // basic validation
    if(!f.get('name') || !f.get('email') || !f.get('message')){
      formStatus.textContent = 'Please complete all fields.';
      return;
    }
    // demo: show success and reset
    formStatus.textContent = 'Message sent successfully.';
    contactForm.reset();
    setTimeout(()=> formStatus.textContent = '', 4000);
    // TODO: wire to backend/email service
  });
}

// WhatsApp quick message
const waBtn = document.getElementById('waBtn');
if(waBtn){
  waBtn.addEventListener('click', ()=>{
    const text = encodeURIComponent('Hi James, I found your portfolio and would like to discuss a project.');
    window.open(`https://wa.me/254741704578?text=${text}`, '_blank');
  });
}

// Smooth internal link scroll on same page
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const target = document.querySelector(a.getAttribute('href'));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth'});
    }
  });
});
