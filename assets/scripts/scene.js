/* ============================================================
   HERO SCENE - data-driven
   ------------------------------------------------------------
   Two modes: "messy" (scattered) and "tidy" (bento grid).

     id       unique key
     w, h     size in stage units (px at 1280x860)
     messy    { x, y, r }   scattered pose
     tidy     { x, y }      bento position (rotation always 0)
     bob      idle float { amp, dur } - optional
     z        stacking order - optional
     cls      extra class - optional
     render   () => HTML string

   Anchors stay on their side in both modes:
     lamp + cassette right, globe left.
   ============================================================ */

   export const STAGE = { w: 1280, h: 860 };

   const ph = (label, bg = '#EAEAE4', radius = 10) => `
     <div class="tile" style="--tile-bg:${bg};--tile-radius:${radius}px;">
       <span class="tile-label">${label}</span>
     </div>`;
   
   export const ITEMS = [
   
     {
       id: 'nameBlock',
       w: 300, h: 130, z: 12,
       messy: { x: 130, y: 180, r: -3 },
       tidy:  { x: 150, y: 200 },
       render: () => `
         <div class="name-block">
           <span class="name-initials">SU</span>
           <span class="name-full">Shichi Upadhyay</span>
         </div>`,
     },
   
     {
       id: 'photo1',
       w: 180, h: 140, bob: { amp: 6, dur: 4.6 },
       messy: { x: 500, y: 130, r: 5 },
       tidy:  { x: 500, y: 180 },
       render: () => ph('photo 1', '#E8EEF4'),
     },
     {
       id: 'photo2',
       w: 180, h: 140, bob: { amp: 8, dur: 5.2 },
       messy: { x: 730, y: 200, r: -6 },
       tidy:  { x: 690, y: 180 },
       render: () => ph('photo 2', '#F0EDE8'),
     },
     {
       id: 'photo3',
       w: 380, h: 190, bob: { amp: 6, dur: 4.0 },
       messy: { x: 190, y: 520, r: -4 },
       tidy:  { x: 150, y: 480 },
       render: () => ph('photo 3 - wide', '#EAF0EC'),
     },
     {
       id: 'photo4',
       w: 180, h: 190, bob: { amp: 8, dur: 5.8 },
       messy: { x: 620, y: 560, r: 7 },
       tidy:  { x: 550, y: 480 },
       render: () => ph('photo 4', '#F4E4D6'),
     },
     {
       id: 'photo5',
       w: 150, h: 190, bob: { amp: 6, dur: 4.6 },
       messy: { x: 400, y: 340, r: -8 },
       tidy:  { x: 750, y: 480 },
       render: () => ph('photo 5', '#F4EDE8'),
     },
   
     {
       id: 'polaroid',
       w: 170, h: 195, z: 14, bob: { amp: 8, dur: 5.2 },
       messy: { x: 850, y: 400, r: 4 },
       tidy:  { x: 870, y: 180 },
       render: () => `
         <div class="polaroid">
           <div class="polaroid-ph">polaroid</div>
           <span>caption</span>
         </div>`,
     },
   
     {
       id: 'catOwl',
       w: 110, h: 92, z: 20, bob: { amp: 5, dur: 4.2 },
       messy: { x: 300, y: 330, r: -10 },
       tidy:  { x: 360, y: 330 },
       render: () => `
         <div class="cat-owl">
           <span class="creature creature-cat">cat</span>
           <span class="creature creature-owl">owl</span>
         </div>`,
     },
   
     {
       id: 'plant',
       w: 100, h: 130, bob: { amp: 6, dur: 5.4 },
       messy: { x: 620, y: 300, r: 6 },
       tidy:  { x: 940, y: 540 },
       render: () => ph('plant', '#E4EEE6', 8),
     },
   
     {
       id: 'lampBtn',
       w: 140, h: 270, z: 30, cls: 'lamp-item',
       messy: { x: 1030, y: 180, r: 4 },
       tidy:  { x: 1050, y: 190 },
       render: () => `
         <svg viewBox="0 0 140 270" width="140" height="270" fill="none"
              xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
           <path d="M28 118 Q70 8 112 118 Z" class="lamp-shade-fill"/>
           <ellipse cx="70" cy="120" rx="11" ry="6" class="bulb-glow"/>
           <rect x="64" y="120" width="11" height="118" rx="5" class="lamp-stem"/>
           <rect x="34" y="236" width="72" height="14" rx="7" class="lamp-base"/>
         </svg>
         <span class="lamp-tip">light / dark</span>`,
     },
   
     {
       id: 'cassetteBtn',
       w: 170, h: 105, z: 22, bob: { amp: 7, dur: 5.6 },
       messy: { x: 1010, y: 540, r: -5 },
       tidy:  { x: 1040, y: 500 },
       render: () => `
         <div class="cassette-card">
           <div class="cassette-window">
             <div class="cassette-reel" id="reelLeft"></div>
             <div class="cassette-tape"></div>
             <div class="cassette-reel" id="reelRight"></div>
           </div>
           <div class="cassette-label" id="cassetteLabel">now playing</div>
         </div>`,
     },
   
     {
       id: 'globe',
       w: 120, h: 120, z: 18, bob: { amp: 6, dur: 6.0 },
       messy: { x: 120, y: 380, r: 0 },
       tidy:  { x: 150, y: 340 },
       render: () => `
         <div class="globe-item" title="Recent trips">
           <div class="globe-sphere"></div>
           <span class="globe-tip">travels</span>
         </div>`,
     },
   
     {
       id: 'portfolioBlock',
       w: 280, h: 120, z: 12,
       messy: { x: 760, y: 690, r: -2 },
       tidy:  { x: 360, y: 700 },
       render: () => `
         <div class="portfolio-block">
           <span class="portfolio-word">PORTFOLIO</span>
           <div class="contact-row">
             <a href="https://linkedin.com/in/shichi-upadhyay" target="_blank" aria-label="LinkedIn">in</a>
             <a href="mailto:shichi58@gmail.com" aria-label="Email">@</a>
             <a href="resume.pdf" target="_blank" aria-label="Résumé">CV</a>
           </div>
         </div>`,
     },
   ];
   
   /* ---------- build DOM ---------- */
   export function mountScene(stageEl) {
     if (!stageEl) return [];
     const frag = document.createDocumentFragment();
   
     const nodes = ITEMS.map((item, i) => {
       const m = item.messy;
       const t = item.tidy;
   
       const el = document.createElement('div');
       el.className = 'scene-item ci' + (item.cls ? ' ' + item.cls : '');
       el.id = item.id;
       el.style.setProperty('--w', item.w + 'px');
       el.style.setProperty('--h', item.h + 'px');
       el.style.setProperty('--mx', m.x + 'px');
       el.style.setProperty('--my', m.y + 'px');
       el.style.setProperty('--mr', (m.r || 0) + 'deg');
       el.style.setProperty('--tx', t.x + 'px');
       el.style.setProperty('--ty', t.y + 'px');
       if (item.z) el.style.setProperty('--z', item.z);
   
       const cx = m.x + item.w / 2, cy = m.y + item.h / 2;
       el.dataset.dist = Math.hypot(cx - STAGE.w / 2, cy - STAGE.h / 2).toFixed(1);
   
       const inner = item.bob
         ? `<div class="bob" style="--bob-amp:${item.bob.amp};--bob-dur:${item.bob.dur}s;--bob-delay:${(i % 4) * .35}s">
              <div class="hover-lift">${item.render()}</div>
            </div>`
         : `<div class="bob-static"><div class="hover-lift">${item.render()}</div></div>`;
       el.innerHTML = inner;
   
       frag.appendChild(el);
       return el;
     });
   
     [...nodes]
       .sort((a, b) => a.dataset.dist - b.dataset.dist)
       .forEach((el, i) => el.style.setProperty('--stagger', i));
   
     stageEl.appendChild(frag);
     return nodes;
   }