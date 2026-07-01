// ===== Countdown =====
(function(){
  // 2 July 2026 14:00 WAT = UTC+1 → 13:00 UTC
  const target = new Date('2026-07-02T13:00:00Z');
  const days  = document.getElementById('cd-days');
  const hours = document.getElementById('cd-hours');
  const mins  = document.getElementById('cd-mins');
  const secs  = document.getElementById('cd-secs');
  if(!days) return;
  function pad(n){return String(n).padStart(2,'0')}
  function tick(){
    const diff = target - Date.now();
    if(diff <= 0){
      days.textContent = hours.textContent = mins.textContent = secs.textContent = '00';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000)  / 60000);
    const s = Math.floor((diff % 60000)    / 1000);
    days.textContent  = pad(d);
    hours.textContent = pad(h);
    mins.textContent  = pad(m);
    secs.textContent  = pad(s);
  }
  tick();
  setInterval(tick, 1000);
})();

// ===== Header scroll =====
const hdr = document.getElementById('hdr');
window.addEventListener('scroll', () => {
  hdr.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('toTop').classList.toggle('show', window.scrollY > 400);
});

// ===== Mobile nav =====
function toggleNav() {
  document.getElementById('nav').classList.toggle('open');
}
document.getElementById('nav').querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('nav').classList.remove('open'));
});

// ===== Scroll reveal =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('in'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ===== Count-up =====
function countUp(el, target, duration = 1800) {
  let start = 0, step = target / (duration / 16);
  const tick = () => {
    start = Math.min(start + step, target);
    el.textContent = Math.floor(start).toLocaleString();
    if (start < target) requestAnimationFrame(tick);
  };
  tick();
}
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const nums = e.target.querySelectorAll('[data-count]');
      nums.forEach(n => countUp(n, +n.dataset.count));
      statObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.stat-strip').forEach(el => statObserver.observe(el));

// ===== Modal =====
function openPartnerModal() {
  document.getElementById('partnerModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('partnerModal').classList.remove('open');
  document.body.style.overflow = '';
}
document.getElementById('partnerModal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ===== Interest form =====
function submitInterest(e) {
  e.preventDefault();
  const name = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const role = document.getElementById('f-role').value;
  if (!name || !email || !role) {
    showToast('Please fill in all fields before submitting.', 'error');
    return;
  }
  const subject = encodeURIComponent('SYDP Interest: ' + role);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${document.getElementById('f-phone').value}\nInterest: ${role}`);
  window.location.href = `mailto:auxiliummaxcompany@gmail.com?subject=${subject}&body=${body}`;
  showToast('Opening your email client… we look forward to hearing from you!', 'success');
}

// ===== Contact form =====
function handleContact(e) {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input,select,textarea');
  const vals = [...inputs].map(i => i.value.trim());
  if (vals.some(v => !v)) { showToast('Please complete all required fields.', 'error'); return; }
  const subject = encodeURIComponent('SYDP Contact Form — ' + vals[4]);
  const body = encodeURIComponent(`From: ${vals[0]} ${vals[1]}\nEmail: ${vals[2]}\nPhone: ${vals[3]}\nEnquiry: ${vals[4]}\n\nMessage:\n${vals[5]}`);
  window.location.href = `mailto:auxiliummaxcompany@gmail.com?subject=${subject}&body=${body}`;
  showToast('Opening your email client…', 'success');
}

// ===== Toast =====
function showToast(msg, type = 'success') {
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:32px;left:50%;transform:translateX(-50%);z-index:3000;
    background:${type === 'error' ? '#dc2626' : '#1f6b3a'};color:#fff;padding:14px 26px;
    border-radius:999px;font-size:.9rem;font-weight:600;box-shadow:0 10px 30px rgba(0,0,0,.2);
    transition:opacity .4s;max-width:90vw;text-align:center;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 400); }, 3500);
}

// ===== Smooth active nav =====
const sections = document.querySelectorAll('section[id], div[id]');
const navLinks = document.querySelectorAll('nav.menu a');
const activateNav = () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--gold-light)' : '';
  });
};
window.addEventListener('scroll', activateNav, { passive: true });
