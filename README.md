# Shichi Upadhyay — Portfolio

Personal portfolio site built with HTML, CSS, and JavaScript.

🔗 **Live site (Cloudflare Pages, full passcode gate):** [shichi-portfolio.pages.dev](https://shichi-portfolio.pages.dev)
🔗 **shichiupadhyay.com** still points at GitHub Pages via Wix DNS (Wix won't allow the nameserver change Cloudflare needs for a custom domain) - it serves the same site as a stopgap, but the gated case study there is just a placeholder link over to the Cloudflare version, since GitHub Pages can't run the real server-side check.

---

## About

Product Designer with an MS in HCI. This portfolio showcases selected work across 0→1 platforms, design systems, and AI product UX.

## Branches

- `main` — production. Auto-deploys to shichi-portfolio.pages.dev via
  Cloudflare Pages, and to shichiupadhyay.com via GitHub Pages (stopgap).
- `dev` — working branch. Merge into `main` to ship.

## Hosting: Cloudflare Pages (primary) + GitHub Pages (stopgap)

Cloudflare Pages is primary so the "Private Equity Platforms" case study
could be gated with a real, server-side passcode check (GitHub Pages has
no backend execution, so a client-side-only gate can't actually hide
content - anyone can read it from page source). Cloudflare Pages Functions
give that page a small serverless function that only returns the real
markup after the passcode is verified server-side.

`shichiupadhyay.com` is registered through Wix, and Wix does not allow
custom nameservers for domains it registers - which blocks the DNS
transfer Cloudflare Pages requires for a custom domain. Until that's
resolved (either transfer the domain away from Wix, or move hosting to a
platform like Netlify/Vercel that accepts a plain CNAME record instead of
full nameserver delegation), `shichiupadhyay.com` keeps pointing at GitHub
Pages as a stopgap so it shows a working site instead of a dead domain.
The gated case study on that GitHub Pages copy is just a placeholder page
linking over to the real gated version on Cloudflare - GitHub Pages has no
way to run the actual server-side check.

**One-time Cloudflare setup (done outside this repo, in the dashboard):**

1. Create a free Cloudflare account (if you don't have one).
2. Create a Cloudflare Pages project connected to this GitHub repo.
   - **Build output directory:** `docs`
   - **Build command:** none needed (static site)
3. In the Pages project's *Settings → Environment variables*, add
   `PEP_PASSCODE` as a **secret** (encrypted, not visible in the dashboard
   after saving) with the real passcode as its value. It's never stored in
   this repo.
4. Every push to `main` auto-deploys.
5. (Later, once the Wix nameserver issue is resolved) add
   `shichiupadhyay.com` as a custom domain in that Pages project, and
   delete the GitHub Pages placeholder / re-point DNS fully to Cloudflare.

**One-time GitHub Pages setup (stopgap only):**
In the repo's *Settings → Pages*, set source to "Deploy from a branch",
branch `main`, folder `/docs`.

**How the gate works:** `functions/case-studies/private-equity-platforms.html.js`
intercepts that exact URL. On GET it always shows a passcode form. On POST
it checks the submitted value against `env.PEP_PASSCODE`; only on a match
does it return the real markup, which lives in
`functions/_content/private-equity-platforms.js` - a file that sits outside
`docs/`, so neither Cloudflare nor GitHub Pages ever serves it as a static
asset. No cookie or session is set, so the passcode is required again on
every visit/reload. This entire gate only functions on the Cloudflare
deployment; the GitHub Pages copy at the same URL path is a static
placeholder (see above).

---

## Structure & Roadmap

```
shichi-portfolio/
│
├── docs/                            Build output for BOTH Cloudflare Pages and GitHub Pages - publicly served as-is
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
│   │   ├── private-equity-platforms.html   real gate: functions/ below (Cloudflare only). Here: static placeholder link (GitHub Pages stopgap)
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
│   └── CNAME                        shichiupadhyay.com - read by GitHub Pages, ignored by Cloudflare
│
├── functions/                       Cloudflare Pages Functions only - GitHub Pages ignores this folder entirely
│   ├── case-studies/
│   │   └── private-equity-platforms.html.js   intercepts that URL, checks passcode
│   └── _content/
│       └── private-equity-platforms.js        the real gated markup, lives outside docs/
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
> Locally (static pages only, functions won't run): `cd docs && python3 -m http.server 8000`
> To test the passcode gate locally, use `wrangler pages dev docs` from the repo root instead.

---

© 2026 Shichi Upadhyay