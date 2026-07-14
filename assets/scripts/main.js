// ── SCROLL REVEAL ──
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  
  document.querySelectorAll('[data-r]').forEach(el => revealObserver.observe(el));
  
  // ── ABOUT TOGGLE ──
  const toggleBtns = document.querySelectorAll('.toggle-btn');
  const aboutContents = document.querySelectorAll('.about-content');
  
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
  
      const target = btn.dataset.target;
      aboutContents.forEach(content => {
        content.id === target
          ? content.classList.remove('hidden')
          : content.classList.add('hidden');
      });
    });
  });