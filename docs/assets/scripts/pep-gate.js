// Client-side passcode gate for the Private Equity Platforms case study.
// Fully static - no server involved. The AES-256 decryption key is
// derived from the passcode itself via PBKDF2, so the encrypted markup
// (assets/data/pep-content.enc.js) is safe to publish as a normal static
// asset: without the exact passcode it's unrecoverable in practice.

import { salt, iv, iterations, ciphertext } from '../data/pep-content.enc.js';

function fromBase64(b64) {
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

async function deriveKey(passcode) {
  const baseKey = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(passcode), 'PBKDF2', false, ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: fromBase64(salt), iterations, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );
}

async function tryUnlock(passcode) {
  const key = await deriveKey(passcode);
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: fromBase64(iv) },
    key,
    fromBase64(ciphertext)
  );
  return new TextDecoder().decode(plaintext);
}

export function initPepGate() {
  const form = document.getElementById('pep-gate-form');
  const input = document.getElementById('pep-passcode');
  const error = document.getElementById('pep-gate-error');
  const gate = document.getElementById('pep-gate');
  const mount = document.getElementById('pep-content');
  if (!form || !input || !mount) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    error.hidden = true;
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    try {
      const html = await tryUnlock(input.value);
      mount.innerHTML = html;
      gate.hidden = true;
      mount.hidden = false;
      // Re-run the section rail now that the gated sections (with their
      // own data-rail attributes) exist in the DOM.
      const { initRail } = await import('./rail.js');
      initRail();
      history.replaceState(null, '', location.pathname);
    } catch {
      error.hidden = false;
      input.value = '';
      input.focus();
    } finally {
      submitBtn.disabled = false;
    }
  });
}
