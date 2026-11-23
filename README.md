# Setu247 — Brand Launch & Coming Soon Website

> **Setu247 — An upcoming health-tech venture by OXYSQUAD TECHNOLOGIES PVT LTD.**

A production-quality, responsive, single-page brand-launch website designed to introduce **Setu247**, establish an ambitious and credible brand identity, attract world-class talent, and invite strategic investor enquiries — while strictly maintaining product confidentiality.

---

## 1. Design & Architectural Philosophy

### Brand Meaning: "Setu" (The Bridge)
In Sanskrit and Hindi, *Setu* signifies a bridge. For Setu247, this represents the vital architectural bridge connecting human life and cutting-edge technology, bridging inherited healthcare paradigms with future possibilities, and uniting visionary builders with purpose-driven capital.

### Visual Aesthetic & Language
- **Colour Palette**:
  - **Primary Dark**: `#101114` (Deep obsidian charcoal)
  - **Graphite**: `#202329` (Architectural slate surfaces)
  - **Mid Grey**: `#747982` (Muted pewter labels and secondary metadata)
  - **Light Grey**: `#E8E9EB` (Clean platinum text and borders)
  - **Off-White**: `#F7F7F5` (Editorial alabaster contrast section)
  - **White**: `#FFFFFF` (Pure contrast typography)
  - **Accent**: Muted Electric Silver-Blue (`#38BDF8` / `#60A5FA`)
- **Typography**: Dual-font editorial pairing featuring **Plus Jakarta Sans** for headlines and interface prose, paired with **Space Grotesk** for architectural data tags, numerals, and structural badges.
- **Hero Canvas**: A GPU-efficient, interactive HTML5 Canvas simulating an architectural perspective horizon with dynamic bridge cables, vanishing point grids, and light-signal pulses with cursor parallax.
- **Tone & Mood**: Confident, cinematic, expensive, and restrained — strictly avoiding clichéd hospital clip art, green medical crosses, and fake stock photos.

---

## 2. Project Architecture & File Manifest

```
setu 247 coming soon/
├── public/
│   ├── favicon.svg             # Original abstract bridge icon
│   ├── og-image.svg            # Social media Open Graph preview card (1200x630)
│   └── robots.txt              # Search engine crawler indexing instructions
├── src/
│   ├── config/
│   │   └── siteConfig.ts       # Central source of truth for all brand and contact data
│   ├── services/
│   │   └── formService.ts      # Validation, security honeypot, storage, and API transmission
│   ├── components/
│   │   ├── BrandLogo.tsx       # Original geometric bridge mark & typography
│   │   ├── Header.tsx          # Transparent/glassmorphic responsive navigation
│   │   ├── HeroCanvas.tsx      # High-performance interactive bridge visual canvas
│   │   ├── Hero.tsx            # Cinematic hero with headlines and dual CTAs
│   │   ├── Vision.tsx          # Editorial light-contrast section ("Beyond Today")
│   │   ├── Principles.tsx      # Three guiding principles ("01, 02, 03")
│   │   ├── Careers.tsx         # Talent application form with file upload & validation
│   │   ├── Investors.tsx       # Discreet investor dialogue form
│   │   ├── Ownership.tsx       # Oxysquad Technologies relationship card
│   │   ├── FinalCTA.tsx        # High-impact closing call to action
│   │   ├── Footer.tsx          # Wordmark, links, copyright, policy links
│   │   ├── PrivacyPolicyModal.tsx # Accessible data protection notice
│   │   ├── TermsModal.tsx      # Pre-launch terms of use modal
│   │   └── StayConnectedModal.tsx # Quick connect routing modal
│   ├── App.tsx                 # Master single-page composition
│   ├── main.tsx                # React application entry point
│   ├── index.css               # Tailwind CSS v4 styling and custom utilities
│   └── vite-env.d.ts           # TypeScript environment declarations
├── .env.example                # Sample environment variables
├── index.html                  # HTML5 shell with Open Graph and Google Fonts
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler configuration
└── vite.config.ts              # Vite bundler configuration with Tailwind v4
```

---

## 3. Environment Variables

Create a `.env` file in the project root (see `.env.example`):

```bash
# Official Contact Emails (configured)
VITE_CONTACT_EMAIL=info@oxysquad.com
VITE_CAREERS_EMAIL=oxysquadtechnologies@gmail.com
VITE_INVESTOR_EMAIL=info@oxysquad.com

# Form Backend Endpoints (Optional: Formspree, Basin, Webhook, or Cloud Function)
# If left empty, submissions queue locally in localStorage for development/testing
VITE_CAREERS_ENDPOINT=
VITE_INVESTOR_ENDPOINT=

# Parent Company Link (Optional)
VITE_PARENT_COMPANY_URL=

# Social Media Links (Will only render if a non-empty URL is provided)
VITE_SOCIAL_TWITTER=
VITE_SOCIAL_LINKEDIN=
VITE_SOCIAL_GITHUB=
```

---

## 4. Configuring Form Endpoints & Email Destinations

Both forms (Careers and Investor Relations) are connected to a unified transmission service in `src/services/formService.ts`.

### How Submissions Work:
1. **Validation**: Client-side inspection checks email syntax, required fields, and file upload specifications (PDF, DOC, DOCX up to 5MB).
2. **Spam Defense**: An invisible honeypot field catches automated submission bots.
3. **Transmission Modes**:
   - **Local Queue Mode (Default)**: If no endpoint is configured in `.env`, submissions are stored securely in the browser's `localStorage` (`setu247_talent_submissions` and `setu247_investor_submissions`) with simulated network latency, generating a unique tracking reference code (`SETU-TALENT-XXXX` or `SETU-INV-XXXX`).
   - **Production Endpoint Mode**: When `VITE_CAREERS_ENDPOINT` or `VITE_INVESTOR_ENDPOINT` is defined, the form sends an HTTP POST JSON payload directly to your backend, Formspree, Formkeep, Make.com, Zapier, or AWS Lambda / Google Cloud Function.
   - **Direct Email Fallback**: Both sections feature clickable direct mailto links to `careers@setu247.com` and `investors@setu247.com` as fail-safe backups.

---

## 5. Local Development Instructions

### Prerequisites
- Node.js (v18.0 or higher)
- npm (v9.0 or higher)

### Steps to Run
```bash
# 1. Clone or navigate to the directory
cd "setu 247 coming soon"

# 2. Install dependencies (if not already installed)
npm install

# 3. Start the local development server
npm run dev

# 4. Open http://localhost:3000 in your browser
```

### Production Build & Preview
```bash
# Compile TypeScript and bundle assets
npm run build

# Preview production build locally
npm run preview
```

---

## 6. Deployment Guide

### Option A: Vercel (Recommended)
1. Push the repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Root Directory: `./`.
5. Add any environment variables in Project Settings.
6. Click **Deploy**.

### Option B: Netlify
1. Connect repository in [Netlify](https://netlify.com).
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Click **Deploy Site**.

### Option C: Cloudflare Pages
1. In Cloudflare Dashboard, go to **Workers & Pages** > **Create application** > **Pages**.
2. Build command: `npm run build`
3. Output directory: `dist`

### Option D: Traditional Server / S3 / Nginx
Build static assets with `npm run build` and upload the contents of the `dist/` directory to your web server or S3 bucket.

---

## 7. Company Information Still Required Before Public Launch

Before taking the website live on the official domain `setu247.com`, the following operational details should be provided by OXYSQUAD TECHNOLOGIES PVT LTD:

1. **Official Domain & DNS Configuration**:
   - A / CNAME records pointed to the production hosting provider.
2. **Official Inboxes Setup**:
   - Verification that `contact@setu247.com`, `careers@setu247.com`, and `investors@setu247.com` are created in Google Workspace, Microsoft 365, or your email host.
3. **Form Processing Backend / Webhook**:
   - Production webhook URL or form service endpoint (e.g. Formspree / Resend / AWS SES) to forward resumes directly to HR and the founding team.
4. **Parent Company Web Address**:
   - Official URL for OXYSQUAD TECHNOLOGIES PVT LTD if a public website exists.
5. **Social Media Handles**:
   - Official LinkedIn or X/Twitter profile URLs for Setu247 when registered.
6. **Legal & Incorporation Details (Optional)**:
   - If the company wishes to display CIN, GSTIN, or registered office address in the legal footer upon formal incorporation.
