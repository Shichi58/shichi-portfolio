# Shichi Upadhyay — Portfolio

Personal portfolio site built with HTML, CSS, and JavaScript.

🔗 **Live site:** [shichiupadhyay.com](https://shichiupadhyay.com)

---

## About

Product Designer with an MS in HCI. This portfolio showcases selected work across 0→1 platforms, design systems, and AI product UX.

## Branches

- `main` — production. Auto-deploys to shichiupadhyay.com via GitHub Pages.
- `dev` — working branch. Merge into `main` to ship.

---

## Structure & Roadmap

```
shichi-portfolio/
│
├── index.html
│   │
│   ├── 1. HERO SECTION
│   │   ├── [ ] Desk view
│   │   ├── [ ] Journal view
│   │   ├── [ ] Interactive elements
│   │   │   ├── [ ] Lamp — light/dark theme toggle
│   │   │   ├── [ ] Cassette — audio player
│   │   │   └── [ ] Icons — LinkedIn, email, phone
│   │   └── [ ] Globe — revolves showing recent trips → Travel section  (LATER)
│   │
│   ├── 2. WORK SECTION
│   │   ├── [x] 3 default case studies, written in depth
│   │   ├── [ ] "View more" → other work
│   │   └── [ ] Other work as square tiles (App Store style)
│   │
│   ├── ABOUT · EXPERIENCE · SKILLS
│   │   └── [x] Story / TL;DR toggle
│   │
│   └── 3. FOOTER
│       ├── [ ] Mention the blog
│       └── [ ] Final CTA
│
├── case-studies/                    2b. INDIVIDUAL PAGE VIEW
│   ├── [x] Shared template across all pages
│   ├── [ ] Add interactions
│   ├── [ ] Add visuals — hi-fi, micro-interactions, design system
│   ├── [ ] Make it a more personal view
│   │
│   ├── private-equity-platforms.html   [x] written
│   ├── fidelity-investments.html    [x] written
│   ├── deepvue.html                 [x] written
│   └── quantiphi.html               [ ] not started
│
├── assets/
│   ├── styles/
│   │   └── main.css
│   ├── scripts/
│   │   ├── main.js                  page behaviour
│   │   ├── scene.js                 hero scene data — ITEMS array
│   │   └── mode.js                  desk/journal switcher
│   │                                └── built, disabled pending design
│   ├── fonts/
│   ├── audio/
│   └── images/
│       └── work/                    case study card images
│
├── resume.pdf
├── CNAME                            shichiupadhyay.com
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
- Hosted on GitHub Pages

> Serve over `http://` — `main.js` is an ES module and won't load from `file://`.
> Locally: `python3 -m http.server 8000`

---

© 2026 Shichi Upadhyay