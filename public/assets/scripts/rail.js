// rail.js — right-edge section dots for case study pages.

export function initRail() {
    const sections = [...document.querySelectorAll('[data-rail]')];
    if (sections.length < 2) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;
  
    const rail = document.createElement('nav');
    rail.className = 'cs-rail';
    rail.setAttribute('aria-label', 'Page sections');
  
    const items = sections.map(section => {
      const label = section.dataset.rail;
      const btn = document.createElement('button');
      btn.className = 'cs-rail-item';
      btn.type = 'button';
      btn.setAttribute('aria-label', label);
      btn.innerHTML =
      `<span class="cs-rail-label">${label}</span>` +
      `<span class="cs-rail-ring"></span>` +
      `<span class="cs-rail-dot"></span>`;
  
      btn.addEventListener('click', () => {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
  
      rail.appendChild(btn);
      return btn;
    });
  
    document.body.appendChild(rail);
  
    const setActive = i => items.forEach((b, n) => b.classList.toggle('active', n === i));
    setActive(0);
  
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        setActive(sections.indexOf(entry.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  
    sections.forEach(s => observer.observe(s));
  }