# Shichi Upadhyay — Portfolio

Personal portfolio site built with HTML, CSS, and JavaScript. Fully static — no server, no build step, no backend of any kind.

🔗 **Live site:** [shichiupadhyay.com](https://shichiupadhyay.com) — served by GitHub Pages.

---

## About

Product Designer with an MS in HCI. This portfolio showcases selected work across 0→1 platforms, design systems, and AI product UX.

## Branches

- `main` — production. GitHub Pages deploys this branch automatically on push.
- `dev` — working branch. Merge into `main` (fast-forward) to ship.

## Hosting: GitHub Pages only

The site used to run on Cloudflare Pages as well, with a Cloudflare Pages
Function doing a server-side passcode check for the "Private Equity
Platforms" case study. **That's gone.** Cloudflare Pages, `wrangler`, the
`PEP_PASSCODE`/`PEP_CONTENT_KEY` secrets, and the server-side gate function
have all been removed — there is no Cloudflare project, no `.wrangler/`
build output, and no server anywhere in this stack anymore. Everything is
one static site, served by GitHub Pages from `/docs` on `main`, pointed at
the custom domain via `docs/CNAME`.

**One-time GitHub Pages setup:** repo *Settings → Pages* → source
"Deploy from a branch" → branch `main`, folder `/docs`.

That's the entire hosting story. No dashboard secrets, no environment
variables, no separate deploy step.

---

## The Private Equity Platforms passcode gate

This case study needed to stay behind a passcode without any server to
check it against — GitHub Pages can't run backend code, so "check the
password server-side" wasn't an option. The fix: make the *decryption
key itself* something only someone with the passcode can derive, so the
encrypted content can be published as a completely ordinary static file.
No password is ever compared against anything server-side, because
there's no server to do the comparing.

### How it works, end to end

**1. The plaintext master copy** lives at
`functions/_content/private-equity-platforms.js`, outside `docs/`. This
is the file you edit when the case study content changes. It is never
served by GitHub Pages (only `docs/` is published) — but see
**Limitations** below, because "not served" is not the same as "not
visible."

**2. Encrypting it — run locally, by you, never through an AI session:**

```
node tools/encrypt-pep-content.mjs
```

This script:
- Prompts for a passcode with hidden input, twice, to confirm they match.
- Derives an AES-256 key from that passcode using **PBKDF2-SHA256 with
  250,000 iterations** and a random 16-byte salt (via Node's Web Crypto
  API — `node:crypto`'s `webcrypto`).
- Encrypts the case-study body with **AES-256-GCM** (a random 12-byte
  IV, freshly generated every run).
- Writes `docs/assets/data/pep-content.enc.js`, exporting `salt`, `iv`,
  `iterations`, and `ciphertext` — all base64 strings except
  `iterations`, a plain number.

Re-run it any time the content changes, or you want a new passcode —
each run mints a fresh salt and IV, so the output is different every
time even for an identical passcode.

**3. The encrypted output is a public static asset.** That's
deliberate, not an oversight — `pep-content.enc.js` is safe to publish
because without the exact passcode it's just noise. Nobody, including
this README, records what the passcode actually is.

**4. Unlocking it — entirely in the browser, at**
`docs/assets/scripts/pep-gate.js`:
- Imports the encrypted blob directly (`salt`, `iv`, `iterations`,
  `ciphertext`).
- On form submit, re-derives an AES key from whatever the visitor typed,
  using the *exact same* PBKDF2 parameters read from the file.
- Attempts `crypto.subtle.decrypt(...)`. AES-GCM has a built-in
  authentication tag, so a wrong passcode doesn't produce garbled
  output — the decrypt call throws outright, which is what drives the
  "incorrect passcode" error state.
- On success, the decrypted HTML is injected into `#pep-content`, the
  gate form is hidden, and the section rail (`rail.js`) is
  re-initialized, since the newly-injected sections carry their own
  `data-rail` attributes.

**5. `docs/case-studies/private-equity-platforms.html`** ships with only
the passcode form and an empty mount point. The real case-study markup
does not exist anywhere in that file, in the page source, or in any
network response until it's decrypted client-side, in the visitor's own
browser, after a correct passcode.

### Security model — what this does and doesn't protect against

- **No rate limiting.** There's no server, so nothing stops repeated
  guesses. The ciphertext, salt, and IV are all fully public and
  downloadable by anyone — an attacker can take a copy and brute-force
  it offline, at their own pace, with no lockout ever.
- **PBKDF2's 250,000 iterations is the only friction.** It makes each
  guess computationally expensive (deliberately slow), but it does not
  make brute-forcing *impossible* — a short or common passcode is still
  crackable given enough time and hardware (e.g. GPU-accelerated
  cracking). The passcode's own length and randomness is what actually
  keeps this safe, not the algorithm.
- **Before unlocking:** the real content is unrecoverable without the
  passcode — view-source, the Network tab, and the DOM all show ciphertext
  only.
- **After unlocking:** like any content ever rendered in a browser, the
  decrypted markup is visible via dev tools once revealed. This is true
  of *any* gate that has to eventually show a human the content — it's
  not a weakness specific to this method, and it was equally true of the
  old server-side Cloudflare version once it returned plaintext HTML.

### ⚠️ Limitation this repo does not solve

`functions/_content/private-equity-platforms.js` — the **plaintext**
source — is a normal tracked file in this git repository. GitHub Pages
never serves it (only `/docs` is published), but if this repository
itself is **public** on GitHub, anyone can browse to that file on
github.com and read the real case-study content directly, no passcode
needed. The gate protects the *deployed site*; it does nothing to
protect the *source repository*. If this needs to stay genuinely
private, either the repo needs to be private, or that plaintext file
needs to live somewhere outside version control entirely.

---

## Structure

```
shichi-portfolio/
│
├── docs/                             Published as-is by GitHub Pages
│   ├── CNAME                         shichiupadhyay.com
│   ├── index.html                    home page
│   │   ├── Hero (Figma desk scene)
│   │   │   ├── Lamp click → site-wide dark theme (see Backlog — not on main yet)
│   │   │   ├── Cassette click → plays song.mp3, blended with a click sound effect
│   │   │   └── Journal / desk view toggle
│   │   ├── Section rail (Top / About Me / Selected Work / Skills / Contact)
│   │   ├── About (Story / TL;DR toggle)
│   │   ├── Selected Work (3 case studies)
│   │   ├── Skills
│   │   └── Footer (contact CTA + sound credits)
│   │
│   ├── case-studies/
│   │   ├── private-equity-platforms.html   client-side AES passcode gate (see above)
│   │   ├── fidelity-investments.html
│   │   ├── deepvue.html
│   │   └── quantiphi.html                  not started
│   │
│   └── assets/
│       ├── styles/main.css
│       ├── scripts/
│       │   ├── main.js            page behaviour (hero interactions, nav, reveal, etc.)
│       │   ├── rail.js            section-progress rail dots
│       │   ├── pep-gate.js        client-side decrypt for the PEP gate
│       │   ├── scene.js           hero scene data
│       │   └── mode.js            desk/journal switcher
│       ├── audio/                 song.mp3, cassette click effects
│       ├── data/
│       │   └── pep-content.enc.js   encrypted PEP case-study content (safe to publish)
│       ├── fonts/
│       └── images/
│
├── functions/
│   └── _content/
│       └── private-equity-platforms.js   plaintext PEP source — edit this, then re-encrypt
│                                          (see Limitations above)
│
├── tools/
│   └── encrypt-pep-content.mjs    run locally to (re)generate pep-content.enc.js
│
└── README.md
```

### Backlog

- [ ] **Dark theme** — implemented (lamp click toggles it site-wide, persisted via
  `localStorage`), but currently sitting only on `dev`, unpushed, pending a
  few more surfaces being audited (the colored "wash" sections in case
  studies and some other hardcoded colors don't adapt yet).
- [ ] `quantiphi.html` — not started.
- [ ] "View more" work / other work as tiles.
- [ ] Mobile hero — still hand-authored, not driven by `scene.js`'s `ITEMS`.
- [ ] No favicon, `robots.txt`, or `sitemap.xml` anywhere in `docs/`.
- [ ] Decide on the repo-visibility question raised above (public repo +
  plaintext PEP source in `functions/`).

---

## Built with

- HTML / CSS / JavaScript
- [Manrope](https://fonts.google.com/specimen/Manrope) — headings
- [Geist](https://vercel.com/font) — body
- [Geist Mono](https://vercel.com/font) — labels
- Hosted on GitHub Pages

> Serve over `http://`, not `file://` — `main.js` is an ES module.
> Locally: `cd docs && python3 -m http.server 8000`

---

© 2026 Shichi Upadhyay
