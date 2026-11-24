# ARCON Growth — Official Website

**Capital. Growth. Technology.**

[![Live](https://img.shields.io/badge/status-live-brightgreen)](https://arcongrowth.com/)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Farcongrowth.com)](https://arcongrowth.com/)

> 🟢 **The site is live and running at [https://arcongrowth.com](https://arcongrowth.com/)**
>
> Designed, built and maintained by the **ARCON Growth** team.

---

## About

ARCON Growth is the parent ecosystem behind **CA Services**, **PLSTC** (marketing & growth), **Funding** and **Technology** — bringing together capital, growth and the systems businesses need to scale.

This repository contains the full source code of the official ARCON Growth website.

## Pages

| Route | File | Description |
|---|---|---|
| `/` | `index.html` | Home |
| `/about/` | `about.html` | About ARCON Growth |
| `/companies/` | `companies.html` | The ARCON ecosystem |
| `/ca-services/` | `ca-services.html` | CA firm services |
| `/plastic/` | `plastic.html` | PLSTC — Marketing & Growth |
| `/funding/` | `funding.html` | Funding |
| `/technology/` | `technology.html` | Technology |
| `/clients/` | `clients.html` | Clients |
| `/partners/` | `partners.html` | Partner banks & institutions |
| `/contact/` | `contact.html` | Contact & enquiry form |
| — | `404.html` | Custom not-found page |

## Tech Stack

- **HTML5, CSS3, vanilla JavaScript** — a fast, dependency-free static multi-page site (no build step)
- **[GSAP 3](https://gsap.com/) + ScrollTrigger** (via cdnjs) — scroll and entrance animations
- **Google Fonts** — DM Sans, DM Mono, Manrope
- **Google Apps Script + Google Sheets** — serverless backend for the enquiry form
- **[Netlify](https://www.netlify.com/)** — hosting, clean URLs, redirects and security headers

## Project Structure

```
.
├── index.html, about.html, ...   # One HTML file per page
├── 404.html                      # Not-found page
├── config.js                     # Enquiry endpoint & contact number
├── css/
│   ├── tokens.css                # Design tokens (colours, type, spacing)
│   ├── base.css                  # Global styles, header, footer
│   ├── home.css                  # Home page
│   ├── pages.css                 # Inner pages
│   └── plastic.css               # PLSTC page
├── js/
│   ├── main.js                   # Shared header/footer, nav, loader
│   ├── home.js                   # Home page animations
│   ├── enquiry.js                # Enquiry form logic
│   └── contact.js                # Contact page logic
├── assets/                       # Logos and partner bank marks
├── apps-script/Code.gs           # Google Apps Script enquiry backend
├── netlify.toml                  # Redirects + security headers
├── robots.txt
└── sitemap.xml
```

## Running Locally

No build tools needed — just serve the folder:

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

> Pages use root-relative paths (`/css/...`, `/js/...`), so serve from the project root rather than opening files directly.

## Enquiry Form Backend

Form submissions are sent to a Google Apps Script Web App and saved into a Google Sheet, routed into tabs by requirement (Funding, CA Services, Marketing, Technology, General).

1. Create a Google Sheet → **Extensions › Apps Script** → paste in `apps-script/Code.gs`.
2. **Deploy › New deployment › Web app** — execute as *Me*, access *Anyone*.
3. Copy the `/exec` URL into `config.js` as `enquiryEndpoint`.

## Deployment

The site is deployed on **Netlify** at **[arcongrowth.com](https://arcongrowth.com/)**.

- Publish directory: repository root (no build command)
- `netlify.toml` redirects old `.html` URLs to clean URLs (e.g. `/about.html` → `/about/`), blocks source folders from being served, and adds security headers (HSTS, X-Frame-Options, CSP, etc.)

## Contact

- 🌐 Website: [arcongrowth.com](https://arcongrowth.com/)
- ✉️ Email: [hello@arcongrowth.com](mailto:hello@arcongrowth.com)
- 📸 Instagram: [@arcongrowth](https://instagram.com/arcongrowth)
- 💼 LinkedIn: [ARCON Growth](https://linkedin.com/company/arcongrowth)

---

© ARCON Growth. All rights reserved. Made with ❤️ by the ARCON Growth team.
