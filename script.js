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

// Projects data (fallback). We'll attempt to fetch `data/projects.json` on load.
let PROJECTS = [
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

// Render projects into the DOM
function renderProjects(list){
  const grid = document.getElementById('projectGrid') || document.querySelector('.project-grid');
  if(!grid) return;
  grid.innerHTML = '';
  list.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.setAttribute('data-index', i);
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-pressed', 'false');

    const thumb = document.createElement('img');
    thumb.className = 'project-thumb-img';
    thumb.alt = p.title + ' thumbnail';
    thumb.src = (p.images && p.images.length) ? p.images[0] : 'assets/project-placeholder.svg';

    const h = document.createElement('h3');
    h.textContent = p.title;
    const d = document.createElement('p');
    d.textContent = p.desc;

    // Build card
    if(p.images && p.images.length){
      card.appendChild(thumb);
    }
    card.appendChild(h);
    card.appendChild(d);

    grid.appendChild(card);

    // Attach reveal observer to newly created card
    try{ if(revealObserver) revealObserver.observe(card); } catch(e){}

    // Events
    card.addEventListener('click', ()=> openProjectModal(i));
    card.addEventListener('keydown', e=>{ if(e.key === 'Enter') openProjectModal(i); });
  });
}

// Try loading external data file
fetch('data/projects.json').then(r=>{
  if(!r.ok) throw new Error('no data');
  return r.json();
}).then(data=>{
  if(Array.isArray(data) && data.length) PROJECTS = data;
  renderProjects(PROJECTS);
}).catch(()=>{
  // fallback to built-in list
  renderProjects(PROJECTS);
});

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
