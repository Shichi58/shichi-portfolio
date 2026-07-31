# Shichi Upadhyay — Portfolio

Personal portfolio site built with HTML, CSS, and JavaScript.

🔗 **Live site:** [shichiupadhyay.com](https://shichiupadhyay.com)

---

## About

Product Designer with an MS in HCI. This portfolio showcases selected work across 0→1 platforms, design systems, and AI product UX.

## Branches

- `main` — production. Auto-deploys to shichiupadhyay.com via Cloudflare Pages.
- `dev` — working branch. Merge into `main` to ship.

## Hosting: Cloudflare Pages

Migrated from GitHub Pages so the "Private Equity Platforms" case study
could be gated with a real, server-side passcode check (GitHub Pages has
no backend execution, so a client-side-only gate can't actually hide
content - anyone can read it from page source). Cloudflare Pages Functions
give that page a small serverless function that only returns the real
markup after the passcode is verified server-side.

**One-time setup (done outside this repo, in the Cloudflare dashboard):**

1. Create a free Cloudflare account (if you don't have one).
2. Add `shichiupadhyay.com` to Cloudflare and switch the domain's
   nameservers to the ones Cloudflare gives you. This is the one step with
   real-world downtime risk - DNS propagation is usually minutes, but can
   take longer.
3. Create a Cloudflare Pages project connected to this GitHub repo.
   - **Build output directory:** `public`
   - **Build command:** none needed (static site)
4. In the Pages project's *Settings → Environment variables*, add
   `PEP_PASSCODE` as a **secret** (encrypted, not visible in the dashboard
   after saving) with the real passcode as its value. It's never stored in
   this repo.
5. In the Pages project's *Custom domains*, add `shichiupadhyay.com`.
6. Every push to `main` auto-deploys, same as GitHub Pages did.

**How the gate works:** `functions/case-studies/private-equity-platforms.html.js`
intercepts that exact URL. On GET it always shows a passcode form. On POST
it checks the submitted value against `env.PEP_PASSCODE`; only on a match
does it return the real markup, which lives in
`functions/_content/private-equity-platforms.js` - a file that sits outside
`public/`, so Cloudflare never serves it as a static asset. No cookie or
session is set, so the passcode is required again on every visit/reload.

---

## Structure & Roadmap

```
shichi-portfolio/
│
├── public/                          Cloudflare Pages build output - everything here is publicly served as-is
│   │
│   ├── index.html
│   │   │
│   │   ├── 1. HERO SECTION
│   │   │   ├── [ ] Desk view
│   │   │   ├── [ ] Journal view
│   │   │   ├── [ ] Interactive elements
│   │   │   │   ├── [ ] Lamp — light/dark theme toggle
│   │   │   │   ├── [ ] Cassette — audio player
│   │   │   │   └── [ ] Icons — LinkedIn, email, phone
│   │   │   └── [ ] Globe — revolves showing recent trips → Travel section  (LATER)
│   │   │
│   │   ├── 2. WORK SECTION
│   │   │   ├── [x] 3 default case studies, written in depth
│   │   │   ├── [ ] "View more" → other work
│   │   │   └── [ ] Other work as square tiles (App Store style)
│   │   │
│   │   ├── ABOUT · EXPERIENCE · SKILLS
│   │   │   └── [x] Story / TL;DR toggle
│   │   │
│   │   └── 3. FOOTER
│   │       ├── [ ] Mention the blog
│   │       └── [ ] Final CTA
│   │
│   ├── case-studies/                2b. INDIVIDUAL PAGE VIEW
│   │   ├── [x] Shared template across all pages
│   │   ├── [ ] Add interactions
│   │   ├── [ ] Add visuals — hi-fi, micro-interactions, design system
│   │   ├── [ ] Make it a more personal view
│   │   │
│   │   ├── private-equity-platforms.html   passcode-gated, see functions/ below - not in this folder
│   │   ├── fidelity-investments.html    [x] written
│   │   ├── deepvue.html                 [x] written
│   │   └── quantiphi.html               [ ] not started
│   │
│   ├── assets/
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── scripts/
│   │   │   ├── main.js              page behaviour
│   │   │   ├── scene.js             hero scene data — ITEMS array
│   │   │   └── mode.js              desk/journal switcher
│   │   │                            └── built, disabled pending design
│   │   ├── fonts/
│   │   ├── audio/
│   │   └── images/
│   │       └── work/                case study card images
│   │
│   └── CNAME                        legacy from GitHub Pages, unused by Cloudflare
│
├── functions/                       Cloudflare Pages Functions - server-side code, never served as static files
│   ├── case-studies/
│   │   └── private-equity-platforms.html.js   intercepts that URL, checks passcode
│   └── _content/
│       └── private-equity-platforms.js        the real gated markup, lives outside public/
│
└── README.md
```

### Backlog
- [ ] Mobile hero — still hand-authored, not driven by `ITEMS`
- [ ] Dark theme — token audit across `main.css`

---

## Built with

- HTML / CSS / JavaScript
- [Manrope](https://fonts.google.com/specimen/Manrope) — headings
- [Geist](https://vercel.com/font) — body
- [Geist Mono](https://vercel.com/font) — labels
- Hosted on Cloudflare Pages

> Serve over `http://` — `main.js` is an ES module and won't load from `file://`.
> Locally (static pages only, functions won't run): `cd public && python3 -m http.server 8000`
> To test the passcode gate locally, use `wrangler pages dev public` from the repo root instead.

---

© 2026 Shichi Upadhyay