// Run this LOCALLY, in your own terminal (not through an AI tool session) -
// it prompts for the real passcode with hidden input and never prints it.
//
//   node tools/encrypt-pep-content.mjs
//
// It reads the case-study body markup from SRC (the same markup a visitor
// sees, minus the shared nav/footer chrome), derives an AES-256 key from
// the passcode you type via PBKDF2-SHA256 (250,000 iterations, random
// salt), encrypts the markup with AES-256-GCM (random IV), and writes the
// result to OUT as a plain JS module of base64 strings.
//
// OUT is a normal static asset - safe to publish. Without the exact
// passcode, PBKDF2's iteration count makes brute-forcing it offline slow
// (deliberately - there is no server involved to rate-limit attempts).
//
// Re-run this any time the case-study content or the passcode changes;
// each run mints a fresh salt + IV.

import { webcrypto } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { createInterface } from 'node:readline';

const { subtle } = webcrypto;
const getRandomValues = webcrypto.getRandomValues.bind(webcrypto);

const SRC = new URL('../functions/_content/private-equity-platforms.js', import.meta.url);
const OUT = new URL('../docs/assets/data/pep-content.enc.js', import.meta.url);
const ITERATIONS = 250_000;

function extractBody(src) {
  const startMarker = '<!-- 1. HERO -->';
  const endMarker = '  <footer id="contact"';
  const start = src.indexOf(startMarker);
  const end = src.indexOf(endMarker);
  if (start === -1 || end === -1) throw new Error('markers not found - did the content file structure change?');
  return src.slice(start, end).trim();
}

function toBase64(bytes) {
  return Buffer.from(bytes).toString('base64');
}

function makeHiddenPrompt() {
  // A single shared interface for both prompts - creating a second
  // readline.Interface after closing the first can lose already-buffered
  // piped stdin, so we reuse one instance and just swap its prompt text.
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  let currentPrompt = '';
  rl._writeToOutput = str => {
    if (str.trim() === currentPrompt.trim() || str === '\n' || str === '\r\n') rl.output.write(str);
  };
  return {
    ask(prompt) {
      currentPrompt = prompt;
      return new Promise(resolve => {
        rl.question(prompt, answer => {
          rl.output.write('\n');
          resolve(answer);
        });
      });
    },
    close() { rl.close(); },
  };
}

async function deriveKey(passcode, salt) {
  const baseKey = await subtle.importKey('raw', new TextEncoder().encode(passcode), 'PBKDF2', false, ['deriveKey']);
  return subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: ITERATIONS, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );
}

async function main() {
  const prompt = makeHiddenPrompt();
  const passcode = await prompt.ask('Passcode to encrypt with: ');
  const confirm = await prompt.ask('Retype to confirm: ');
  prompt.close();
  if (passcode !== confirm) {
    console.error('Passcodes did not match - nothing written.');
    process.exit(1);
  }
  if (!passcode) {
    console.error('Empty passcode - nothing written.');
    process.exit(1);
  }

  const body = extractBody(readFileSync(SRC, 'utf8'));
  const salt = getRandomValues(new Uint8Array(16));
  const iv = getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passcode, salt);

  const ciphertext = await subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(body)
  );

  writeFileSync(OUT,
    `// AES-256-GCM encrypted case-study markup, keyed by PBKDF2(passcode).\n` +
    `// Generated locally by tools/encrypt-pep-content.mjs - do not edit by\n` +
    `// hand. Safe to publish: useless without the passcode.\n` +
    `export const salt = ${JSON.stringify(toBase64(salt))};\n` +
    `export const iv = ${JSON.stringify(toBase64(iv))};\n` +
    `export const iterations = ${ITERATIONS};\n` +
    `export const ciphertext = ${JSON.stringify(toBase64(ciphertext))};\n`
  );

  console.log('Wrote', OUT.pathname);
}

main();
