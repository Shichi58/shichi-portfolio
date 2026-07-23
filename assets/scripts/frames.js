// frames.js — pan/zoom for case study snippets.
// Requires the panzoom library, loaded before main.js.

export function initFrames() {
    const frames = document.querySelectorAll('.cs-frame');
    if (!frames.length || typeof panzoom !== 'function') return;
  
    frames.forEach(frame => {
      const stage = frame.querySelector('.cs-frame-stage');
      if (!stage) return;
  
      const target = stage.firstElementChild;
      if (!target) return;
  
      const pz = panzoom(target, {
        maxZoom: 6,
        minZoom: 0.9,
        bounds: true,
        boundsPadding: 0.3,
        smoothScroll: false,
        beforeWheel: e => !(e.ctrlKey || e.metaKey)
      });
  
      frame.querySelectorAll('[data-zoom]').forEach(btn => {
        btn.addEventListener('click', () => {
          const rect = stage.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          const current = pz.getTransform().scale;
  
          switch (btn.dataset.zoom) {
            case 'in':
              pz.smoothZoomAbs(cx, cy, current * 1.6);
              break;
            case 'out':
              pz.smoothZoomAbs(cx, cy, current / 1.6);
              break;
            default:
              pz.smoothZoomAbs(cx, cy, 1);
              pz.moveTo(0, 0);
          }
        });
      });
    });
  }