/* ============================================================
   MODE CONTROLLER - messy <-> tidy, plus lamp theme toggle
   ============================================================ */

   import { mountScene, ITEMS } from './scene.js';

   const MOVE_MS = 820;
   const STAGGER_MS = 24;
   
   export function initScene() {
     const stage = document.getElementById('canvasStage');
     if (!stage) return null;
   
     mountScene(stage);
   
     const flightMs = MOVE_MS + ITEMS.length * STAGGER_MS;
     let timer = null;
   
     const messyBtns = document.querySelectorAll('.mode-btn-messy');
     const tidyBtns  = document.querySelectorAll('.mode-btn-tidy');
   
     function setMode(mode, { animate = true } = {}) {
       const isTidy = mode === 'tidy';
       if (document.body.classList.contains('tidy-mode') === isTidy && animate) return;
   
       if (animate) {
         document.body.classList.add('mode-switching');
         clearTimeout(timer);
         timer = setTimeout(() => document.body.classList.remove('mode-switching'), flightMs);
       }
   
       document.body.classList.toggle('tidy-mode', isTidy);
   
       messyBtns.forEach(b => {
         b.classList.toggle('active', !isTidy);
         b.setAttribute('aria-pressed', String(!isTidy));
       });
       tidyBtns.forEach(b => {
         b.classList.toggle('active', isTidy);
         b.setAttribute('aria-pressed', String(isTidy));
       });
   
       try { localStorage.setItem('scene-mode', mode); } catch (_) {}
     }
   
     messyBtns.forEach(b => b.addEventListener('click', () => setMode('messy')));
     tidyBtns.forEach(b => b.addEventListener('click', () => setMode('tidy')));
   
     /* restore without animating on load */
     let saved = null;
     try { saved = localStorage.getItem('scene-mode'); } catch (_) {}
     if (saved === 'tidy') setMode('tidy', { animate: false });
   
     /* ---- lamp: light / dark theme ---- */
     const lamp = document.querySelector('.lamp-item');
     if (lamp) {
       lamp.addEventListener('click', () => {
         const dark = document.body.classList.toggle('dark-mode');
         try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (_) {}
       });
     }
     try {
       if (localStorage.getItem('theme') === 'dark') {
         document.body.classList.add('dark-mode');
       }
     } catch (_) {}
   
     return { setMode };
   }