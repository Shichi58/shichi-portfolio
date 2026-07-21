/* ============================================================
   HERO SCENE — data-driven
   ------------------------------------------------------------
   One array describes every object in the hero. Each item has:

     id       unique key
     w, h     intrinsic size in stage units (px at 1280x950)
     journal  { x, y, r }  scattered pose — hand-authored
     desk     { col, row, span }  grid slot — layout does the math
     bob      idle-float config (amp px, dur s) — optional
     z        stacking order — optional
     render   () => HTML string for the item's contents

   To move something, edit the numbers here. Nothing else.
   To add your cat / owl / a photo, append one entry.
   ============================================================ */

   export const STAGE = { w: 1280, h: 950 };

   /* Desk-mode grid. Desk positions are COMPUTED from this, not
      hand-tuned, so the structured layout stays truly aligned. */
   export const GRID = {
     cols: 16,
     colW: 63,
     gutter: 14,
     rowH: 210,
     originX: 56,
     originY: 430,
   };
   
   /* Placeholder tile — swap for <img> once real assets land. */
   const tile = (bg, label = '', radius = 8) => `
     <div class="tile" style="--tile-bg:${bg};--tile-radius:${radius}px;">
       <span class="tile-label">${label}</span>
     </div>`;
   
   export const ITEMS = [
     {
       id: 'notebookImg',
       w: 787, h: 525, z: 1, static: true,
       journal: { x: 246, y: 331, r: -4 },
       desk:    { plane: true, x: 40, y: 400, w: 1200, h: 460 },
       render: () => `<img src="assets/images/open_notebook.png" alt=""
                       style="width:100%;height:100%;object-fit:cover;border-radius:4px;">`,
     },
     {
       id: 'polaroid1',
       w: 197, h: 214, bob: { amp: 8, dur: 4.6 },
       journal: { x: 301, y: 351, r: -5.5 },
       desk:    { col: 0, row: 0, span: 3 },
       render: () => `
         <div class="polaroid">
           <div class="polaroid-ph">[ photo ]</div>
           <span>trail day</span>
         </div>`,
     },
     {
       id: 'polaroid2',
       w: 197, h: 214, bob: { amp: 10, dur: 5.2 },
       journal: { x: 429, y: 386, r: 1.7 },
       desk:    { col: 4, row: 0, span: 3 },
       render: () => `
         <div class="polaroid">
           <div class="polaroid-ph">[ photo ]</div>
           <span>field notes</span>
         </div>`,
     },
     {
       id: 'img18',
       w: 344, h: 229, bob: { amp: 6, dur: 4.0 },
       journal: { x: 768, y: 512, r: -0.4 },
       desk:    { col: 7, row: 0, span: 5 },
       render: () => tile('#EAF0EC', '[ photo ]'),
     },
     {
       id: 'img21',
       w: 139, h: 139, bob: { amp: 6, dur: 4.6 },
       journal: { x: 514, y: 565, r: 0.7 },
       desk:    { col: 12, row: 0, span: 2 },
       render: () => tile('#F0EDE8', '[ photo ]', 6),
     },
     {
       id: 'img23',
       w: 195, h: 195, bob: { amp: 8, dur: 5.2 },
       journal: { x: 660, y: 353, r: -8.6 },
       desk:    { col: 0, row: 1, span: 4 },
       render: () => tile('#F4E4D6', '[ photo ]'),
     },
     {
       id: 'img24',
       w: 147, h: 184, bob: { amp: 8, dur: 4.0 },
       journal: { x: 746, y: 456, r: 5.5 },
       desk:    { col: 4, row: 1, span: 3 },
       render: () => tile('#F4EDE8', '[ photo ]', 6),
     },
     {
       id: 'img22',
       w: 57, h: 188, bob: { amp: 10, dur: 5.8 },
       journal: { x: 281, y: 547, r: -4.7 },
       desk:    { col: 8, row: 1, span: 1 },
       render: () => tile('#E8EEF4', '', 4),
     },
     {
       id: 'img1014',
       w: 98, h: 160, bob: { amp: 10, dur: 4.6 },
       journal: { x: 672, y: 539, r: 0 },
       desk:    { col: 10, row: 1, span: 2 },
       render: () => tile('#E8EEF4', '', 6),
     },
     {
       id: 'cassetteBtn',
       w: 149, h: 168, bob: { amp: 8, dur: 5.8 }, z: 20,
       journal: { x: 361, y: 526, r: -0.6 },
       desk:    { col: 12, row: 1, span: 3 },
       render: () => `
         <div class="cassette-card">
           <div class="cassette-window">
             <div class="cassette-reel" id="reelLeft"></div>
             <div class="cassette-tape"></div>
             <div class="cassette-reel" id="reelRight"></div>
           </div>
           <div class="cassette-label" id="cassetteLabel">now playing</div>
           <div class="cassette-hint">click to play</div>
         </div>`,
     },
     {
       id: 'lampBtn',
       w: 128, h: 283, bob: { amp: 6, dur: 5.8 }, z: 30,
       cls: 'lamp-item',
       journal: { x: 873, y: 300, r: 2.1 },
       desk:    { col: 13, row: 0, span: 3, h: 283 },
       render: () => `
         <svg viewBox="0 0 127 283" width="127" height="283" fill="none"
              xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
           <polygon points="20,130 107,130 85,30 42,30" class="lamp-shade-fill"/>
           <ellipse cx="63" cy="133" rx="10" ry="6" class="bulb-glow"/>
           <rect x="58" y="133" width="11" height="120" rx="4" class="lamp-stem"/>
           <rect x="30" y="250" width="67" height="14" rx="6" class="lamp-base"/>
         </svg>
         <span class="lamp-tip">click for dark</span>`,
     },
   ];
   
   /* ---------- desk position solver ---------- */
   function deskPose(item) {
     if (item.desk.plane) {
       return { x: item.desk.x, y: item.desk.y, r: 0,
                w: item.desk.w, h: item.desk.h };
     }
     const { col, row, span } = item.desk;
     const cellW = GRID.colW * span + GRID.gutter * (span - 1);
     const x = GRID.originX + col * (GRID.colW + GRID.gutter);
     const y = GRID.originY + row * GRID.rowH;
     const h = item.desk.h ?? item.h;
     /* centre the item inside its slot so mixed sizes still align */
     return {
       x: Math.round(x + (cellW - item.w) / 2),
       y: Math.round(y + (GRID.rowH - Math.min(h, GRID.rowH)) / 2),
       r: 0,
     };
   }
   
   /* ---------- build DOM ---------- */
   export function mountScene(stageEl) {
     if (!stageEl) return [];
     const frag = document.createDocumentFragment();
   
     const nodes = ITEMS.map((item, i) => {
       const j = item.journal;
       const d = deskPose(item);
   
       const el = document.createElement('div');
       el.className = 'scene-item' + (item.static ? '' : ' ci') +
                      (item.cls ? ' ' + item.cls : '');
       el.id = item.id;
       el.style.setProperty('--w', item.w + 'px');
       el.style.setProperty('--h', item.h + 'px');
       el.style.setProperty('--jx', j.x + 'px');
       el.style.setProperty('--jy', j.y + 'px');
       el.style.setProperty('--jr', j.r + 'deg');
       el.style.setProperty('--dx', d.x + 'px');
       el.style.setProperty('--dy', d.y + 'px');
       el.style.setProperty('--dr', d.r + 'deg');
       if (d.w) el.style.setProperty('--dw', d.w + 'px');
       if (d.h) el.style.setProperty('--dh', d.h + 'px');
       if (item.z) el.style.setProperty('--z', item.z);
   
       /* stagger: order items by distance from stage centre so the
          transition ripples outward instead of firing all at once */
       const cx = j.x + item.w / 2, cy = j.y + item.h / 2;
       const dist = Math.hypot(cx - STAGE.w / 2, cy - STAGE.h / 2);
       el.dataset.dist = dist.toFixed(1);
   
       const inner = item.bob
         ? `<div class="bob" style="--bob-amp:${item.bob.amp};--bob-dur:${item.bob.dur}s;--bob-delay:${(i % 4) * 0.4}s">
              <div class="hover-lift">${item.render()}</div>
            </div>`
         : `<div class="hover-lift">${item.render()}</div>`;
       el.innerHTML = inner;
   
       frag.appendChild(el);
       return el;
     });
   
     /* assign stagger index from the distance ordering */
     [...nodes]
       .sort((a, b) => a.dataset.dist - b.dataset.dist)
       .forEach((el, i) => el.style.setProperty('--stagger', i));
   
     stageEl.appendChild(frag);
     return nodes;
   }