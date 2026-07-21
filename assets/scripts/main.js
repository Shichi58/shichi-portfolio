document.addEventListener('DOMContentLoaded', () => {

    // ── REDUCED MOTION ── (disables idle bob + spring transitions, like useReducedMotion())
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
    }

    // ── LAMP (desktop + mobile lamp both toggle the same dim state) ──
    document.querySelectorAll('.lamp-item').forEach(lampBtn => {
      lampBtn.addEventListener('click', () => {
        document.body.classList.toggle('dim');
      });
    });

    // ── CASSETTE (desktop + mobile cassette each play independently) ──
    function wireCassette(btnId, reelLeftId, reelRightId, labelId) {
      const cassetteBtn = document.getElementById(btnId);
      const reelLeft = document.getElementById(reelLeftId);
      const reelRight = document.getElementById(reelRightId);
      const cassetteLabel = document.getElementById(labelId);
      if (!cassetteBtn) return;
      let isPlaying = false;
      let audio = null;
      cassetteBtn.addEventListener('click', () => {
        if (!isPlaying) {
          audio = new Audio('assets/audio/fav-song.mp3');
          audio.loop = true;
          audio.play();
          reelLeft.classList.add('spinning');
          reelRight.classList.add('spinning');
          cassetteLabel.textContent = '▶ playing';
          isPlaying = true;
        } else {
          audio.pause();
          audio.currentTime = 0;
          reelLeft.classList.remove('spinning');
          reelRight.classList.remove('spinning');
          cassetteLabel.textContent = 'now playing';
          isPlaying = false;
        }
      });
    }
    wireCassette('cassetteBtn', 'reelLeft', 'reelRight', 'cassetteLabel');
    wireCassette('cassetteBtnM', 'reelLeftM', 'reelRightM', 'cassetteLabelM');
  
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
    const aboutText = document.querySelector('.about-text');
    if (toggleBtns && aboutText) {
      toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          toggleBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          if (btn.dataset.target === 'tldr') {
            aboutText.classList.add('tldr-mode');
          } else {
            aboutText.classList.remove('tldr-mode');
          }
        });
      });
    }
  
    // ── MOBILE NAV ──
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.getElementById('nav-links');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        navToggle.classList.toggle('open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen);
      });
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  
  });