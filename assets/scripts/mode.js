/* ============================================================
   MODE CONTROLLER — journal <-> desk
   Owns the switch, the in-flight damping window, and persistence.
   ============================================================ */

   import { mountScene, ITEMS } from './scene.js';

   const MOVE_MS = 780;
   const STAGGER_MS = 22;
   
   export function initScene() {
     const stage = document.getElementById('canvasStage');
     mountScene(stage);
   
     /* total settle time = longest stagger + move duration */
     const flightMs = MOVE_MS + ITEMS.length * STAGGER_MS;
     let timer = null;
   
     const journalBtns = document.querySelectorAll('.mode-btn-journal');
     const deskBtns = document.querySelectorAll('.mode-btn-desk');
   
     function setMode(mode, { animate = true } = {}) {
       const isDesk = mode === 'desk';
       if (document.body.classList.contains('desk-mode') === isDesk && animate) return;
   
       if (animate) {
         document.body.classList.add('mode-switching');
         clearTimeout(timer);
         timer = setTimeout(
           () => document.body.classList.remove('mode-switching'),
           flightMs
         );
       }
   
       document.body.classList.toggle('desk-mode', isDesk);
   
       journalBtns.forEach(b => {
         b.classList.toggle('active', !isDesk);
         b.setAttribute('aria-pressed', String(!isDesk));
       });
       deskBtns.forEach(b => {
         b.classList.toggle('active', isDesk);
         b.setAttribute('aria-pressed', String(isDesk));
       });
   
       try { localStorage.setItem('scene-mode', mode); } catch (_) {}
     }
   
     journalBtns.forEach(b => b.addEventListener('click', () => setMode('journal')));
     deskBtns.forEach(b => b.addEventListener('click', () => setMode('desk')));
   
     /* restore last mode without playing the transition on load */
     let saved = null;
     try { saved = localStorage.getItem('scene-mode'); } catch (_) {}
     if (saved === 'desk') setMode('desk', { animate: false });
   
     return { setMode };
   }