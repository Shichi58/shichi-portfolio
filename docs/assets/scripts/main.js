import { initScene } from './mode.js';
import { initRail } from './rail.js';
import { initFrames } from './frames.js';

function boot() {

    // ── REDUCED MOTION ── (disables idle bob + spring transitions, like useReducedMotion())
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
    }

    initScene();
    initRail();
    initFrames();

    const stage = document.getElementById('canvasStage');
    function scaleCanvas() {
      if (!stage) return;
      const frame = stage.parentElement;
      const s = Math.min(frame.clientWidth / 1280, frame.clientHeight / 860);
      stage.style.transform = `scale(${s})`;
    }
    scaleCanvas();
    window.addEventListener('resize', scaleCanvas);

    // ── FIGMA HERO CANVAS (scales the fixed 1440x800 canvas to fit any viewport) ──
    const heroCanvas = document.querySelector('.hero-canvas');
    const heroFrame = document.querySelector('.hero-canvas-frame');
    function scaleHeroCanvas() {
      if (!heroCanvas || !heroFrame) return;
      const s = Math.min(1, heroFrame.clientWidth / 1440);
      heroCanvas.style.transform = `scale(${s})`;
      heroFrame.style.height = `${800 * s}px`;
    }
    scaleHeroCanvas();
    window.addEventListener('resize', scaleHeroCanvas);

    // ── FIGMA HERO JOURNAL / DESK TOGGLE ──
    const journalBtn = document.querySelector('.hc-mode-journal');
    const deskBtn = document.querySelector('.hc-mode-desk');
    if (journalBtn && deskBtn) {
      function setHeroMode(mode) {
        const isDesk = mode === 'desk';
        document.body.classList.toggle('hc-journal-mode', !isDesk);
        journalBtn.setAttribute('aria-pressed', String(!isDesk));
        deskBtn.setAttribute('aria-pressed', String(isDesk));
      }
      journalBtn.addEventListener('click', () => setHeroMode('journal'));
      deskBtn.addEventListener('click', () => setHeroMode('desk'));
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
          audio = new Audio('assets/audio/song.mp3');
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

    // ── FIGMA HERO CASSETTE (click to play/pause, both modes) ──
    const heroCassetteBtn = document.querySelector('.hc-cassette-btn');
    const heroCassetteImg = document.querySelector('.hc-cassette');
    const heroOnAir = document.querySelector('.hc-onair');
    const HERO_CASSETTE_IDLE_SRC = 'assets/images/hero/cassette.svg';
    const HERO_CASSETTE_PLAYING_SRC = 'assets/images/hero/NewCassette.svg';
    const CROSSFADE_ON_MS = 10;
    const CROSSFADE_OFF_MS = 100;

    // Fades `from` out and `to` in together, then pauses `from`. Resolves once the blend is done.
    function crossfade(from, to, duration) {
      return new Promise(resolve => {
        to.volume = 0;
        to.play().catch(() => {});
        const start = performance.now();
        function step(now) {
          const t = Math.min(Math.max((now - start) / duration, 0), 1);
          to.volume = t;
          from.volume = 1 - t;
          if (t < 1) {
            requestAnimationFrame(step);
          } else {
            from.pause();
            from.currentTime = 0;
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    }

    if (heroCassetteBtn && heroCassetteImg) {
      let heroIsPlaying = false;
      let heroAudio = null;
      heroCassetteBtn.addEventListener('click', async () => {
        heroCassetteBtn.disabled = true;

        if (!heroIsPlaying) {
          // Turning on: click sound plays in full, song blends in only during its last CROSSFADE_ON_MS.
          const onSound = new Audio('assets/audio/SoundEffect_On.mp3');
          onSound.volume = 1;
          heroAudio = new Audio('assets/audio/song.mp3');
          heroAudio.loop = true;
          heroCassetteImg.src = HERO_CASSETTE_PLAYING_SRC;
          heroCassetteBtn.classList.add('hc-cassette-playing');
          heroCassetteBtn.setAttribute('aria-pressed', 'true');
          if (heroOnAir) heroOnAir.classList.add('hc-onair-visible');
          heroIsPlaying = true;

          await new Promise(resolve => {
            onSound.addEventListener('loadedmetadata', () => {
              onSound.play().catch(() => {});
              const tailDelay = Math.max(0, onSound.duration * 1000 - CROSSFADE_ON_MS);
              setTimeout(() => crossfade(onSound, heroAudio, CROSSFADE_ON_MS).then(resolve), tailDelay);
            }, { once: true });
          });
        } else {
          // Turning off: song blends into the off click sound, then stops.
          const offSound = new Audio('assets/audio/SoundEffect_Off.mp3');
          heroCassetteImg.src = HERO_CASSETTE_IDLE_SRC;
          heroCassetteBtn.classList.remove('hc-cassette-playing');
          heroCassetteBtn.setAttribute('aria-pressed', 'false');
          if (heroOnAir) heroOnAir.classList.remove('hc-onair-visible');
          heroIsPlaying = false;
          await crossfade(heroAudio, offSound, CROSSFADE_OFF_MS);
        }

        heroCassetteBtn.disabled = false;
      });
    }
  
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
  
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }