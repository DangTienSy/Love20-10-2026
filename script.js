// ============================================================
//  20/10 Love Page – script.js
// ============================================================

/* ---- Falling petals via Canvas ---- */
(function () {
  const canvas = document.getElementById('petalCanvas');
  const ctx    = canvas.getContext('2d');

  const EMOJIS = ['🌸', '🌺', '🌷', '🌹', '💗', '💕', '💖', '🌸'];
  const PETAL_COUNT = 28;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const petals = Array.from({ length: PETAL_COUNT }, () => makePetal());

  function makePetal(y) {
    return {
      x:     Math.random() * window.innerWidth,
      y:     y !== undefined ? y : Math.random() * window.innerHeight,
      size:  Math.random() * 18 + 14,
      speed: Math.random() * 1.2 + 0.5,
      drift: (Math.random() - 0.5) * 1.2,
      rot:   Math.random() * Math.PI * 2,
      rotSpd:Math.random() * 0.05 - 0.025,
      opacity: Math.random() * 0.5 + 0.4,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.emoji, 0, 0);
      ctx.restore();

      p.y   += p.speed;
      p.x   += p.drift;
      p.rot += p.rotSpd;

      if (p.y > canvas.height + 30) {
        Object.assign(p, makePetal(-30));
        p.y = -30;
      }
      if (p.x < -30)                  p.x = canvas.width  + 30;
      if (p.x > canvas.width  + 30)   p.x = -30;
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---- Photo upload helpers ---- */
function triggerUpload(card) {
  const input = card.querySelector('.file-input');
  input.click();
}

function previewPhoto(event, card) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const img         = card.querySelector('.photo-preview');
    const placeholder = card.querySelector('.photo-placeholder');
    img.src = e.target.result;
    img.classList.add('visible');
    placeholder.style.opacity = '0';
    placeholder.style.pointerEvents = 'none';
  };
  reader.readAsDataURL(file);
  event.stopPropagation();
}

/* ---- Modal open / close ---- */
function openLetter() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  // confetti burst
  burstHearts();
}

function closeLetter(event, force) {
  if (!force && event && event.target !== document.getElementById('modalOverlay')) return;
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ---- Mini heart confetti on open ---- */
function burstHearts() {
  const hearts = ['💗','💖','💕','🌸','🌹','✨'];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    Object.assign(el.style, {
      position: 'fixed',
      left:     Math.random() * 100 + 'vw',
      top:      '50vh',
      fontSize: (Math.random() * 20 + 16) + 'px',
      pointerEvents: 'none',
      zIndex:   '2000',
      transition: 'none',
    });
    document.body.appendChild(el);
    const tx = (Math.random() - 0.5) * 300;
    const ty = -(Math.random() * 400 + 100);
    el.animate([
      { transform: 'translate(0,0) scale(1)', opacity: 1 },
      { transform: `translate(${tx}px, ${ty}px) scale(0.3)`, opacity: 0 },
    ], { duration: 1400 + Math.random() * 600, easing: 'cubic-bezier(0,0.9,1,1)', fill: 'forwards' })
      .addEventListener('finish', () => el.remove());
  }
}

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll('.photos-section, .photo-card, .letter-section');
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 120);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ---- Escape key closes modal ---- */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLetter(null, true);
});
