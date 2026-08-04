# BAAM System L — Chinese Asylum Immigration Attorney

A premium, SEO-optimized website for a Chinese-speaking asylum immigration attorney in Los Angeles. Built as a reusable template for other legal practice sites via the BAAM platform.

**Live:** `http://localhost:3006` (dev) | Production domain TBD  

admin/login` →
 `admin@yuxiaris.com` / 
 `admin123`  


c


lsof -ti:3006 | xargs kill -9
rm -rf .next
npm run dev

npm install
npm run build


lsof -ti:3006,3007 | xargs kill -9
rm -rf .next .next-asylum .next-legaldispute
npm run dev:all



git add .
git commit -m "Update: describe your changes"
git push




---

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.local.example .env.local
# Fill in Supabase, Resend, and JWT_SECRET values

# Run Supabase schema + migrations (in order)
# 1) supabase/schema.sql
# 2) supabase/migrate-001.sql
# 3) supabase/migrate-002-data-api-grants.sql
#
# Note: Supabase now requires explicit GRANTs for Data API access on public tables.
# Keep grants in table-creation flow for all new tables.

# Seed content into database
npm run seed
node scripts/seed-admin-user.mjs

# Start dev server
npm run dev
# → http://localhost:3006/zh
```


---

## Project Structure

```
site/
├── app/
│   ├── [locale]/              # Public pages (zh/en bilingual)
│   │   ├── page.tsx           # Homepage (11 sections)
│   │   ├── about/             # Attorney profile
│   │   ├── services/          # Services hub + 15 detail pages
│   │   ├── articles/          # Article center + 6 detail pages
│   │   ├── consultation/      # 4-step intake form
│   │   ├── contact/           # Contact + quick form
│   │   ├── faq/               # 25 categorized FAQs
│   │   ├── testimonials/      # 20 testimonials wall
│   │   ├── locations/[city]/  # 8 near-location SEO pages
│   │   ├── remote-consultation/
│   │   ├── asylum-lawyer-los-angeles/  # Core SEO landing
│   │   ├── privacy/           # Privacy policy
│   │   ├── terms/             # Terms of use
│   │   └── disclaimer/        # Legal disclaimer
│   ├── admin/
│   │   ├── (auth)/login/      # Admin login
│   │   └── (dashboard)/       # Content editor + sidebar
│   ├── api/
│   │   ├── consultation/      # Form submission → DB + email
│   │   └── admin/             # Auth + content CRUD APIs
│   ├── sitemap.ts             # Dynamic sitemap (82 URLs)
│   ├── robots.ts              # Robots.txt
│   └── icon.tsx               # Dynamic favicon
├── components/
│   ├── layout/                # Header, Footer
│   ├── shared/                # TrustBar, FaqAccordion, SectionHeader, etc.
│   ├── consultation/          # IntakeForm (multi-step)
│   └── admin/                 # AdminSidebar, ContentEditor, LoginForm
├── lib/
│   ├── content.ts             # Content loader (DB-first, file fallback)
│   ├── contentDb.ts           # Supabase content queries
│   ├── sites.ts               # Multi-site resolution
│   ├── i18n.ts                # Locale config (zh, en)
│   ├── types.ts               # TypeScript interfaces
│   ├── schema.ts              # JSON-LD schema generators
│   ├── services-data.ts       # 15 services with full Chinese content
│   ├── articles-data.ts       # 6 articles with 800+ word content
│   ├── locations-data.ts      # 8 near-location cities
│   ├── supabase/server.ts     # Supabase server client
│   └── admin/auth.ts          # JWT auth (login, session, verify)
├── content/
│   ├── _sites.json            # Site registry
│   └── asylum-attorney-la/    # Site content
│       ├── theme.json         # Navy + gold design tokens
│       └── zh/                # Chinese content
│           ├── site.json      # Firm info, NAP, legal disclaimers
│           ├── header.json    # Nav, CTA, logo
│           ├── footer.json    # Columns, NAP, compliance
│           ├── seo.json       # Default SEO config
│           └── pages/         # Page content JSON files
├── supabase/
│   ├── schema.sql             # Full database schema
│   ├── migrate-001.sql        # Backfill columns/tables for older DBs
│   └── migrate-002-data-api-grants.sql  # Data API explicit grants + RLS baseline
├── scripts/
│   ├── seed-content.mjs       # Seed JSON → Supabase content_entries
│   └── seed-admin-user.mjs    # Create default admin user
└── prototypes/                # (in parent dir) HTML design prototypes
```

---

## Pages & Routes

### Public Pages (80+ pages, bilingual zh/en)

| Route | Page | Sections |
|-------|------|----------|
| `/` | Homepage | Hero+stats, services, why-us, timeline, attorney, articles, videos, testimonials, FAQ, CTA |
| `/about` | Attorney Profile | Split hero, story, credentials, stats, languages, office, team |
| `/services` | Services Hub | 9 primary + 6 additional service cards |
| `/services/[slug]` | Service Detail (×15) | What-is, who-needs, process, requirements, mistakes, how-we-help, testimonial, FAQ, related |
| `/articles` | Article Center | Category filter, card grid, pagination |
| `/articles/[slug]` | Article Detail (×6) | Author byline, rich content, mid-article CTA, topic cluster nav |
| `/consultation` | Intake Form | 4-step progressive form with validation + trust sidebar |
| `/contact` | Contact | Methods grid, quick form, map, hours, emergency notice |
| `/faq` | FAQ | 25 questions in 5 categories, FAQPage schema |
| `/testimonials` | Reviews Wall | 20 testimonials in masonry layout |
| `/locations/[city]` | Near-Location (×8) | Irvine, San Gabriel, Alhambra, Monterey Park, Pasadena, etc. |
| `/remote-consultation` | Remote Service | Process, coverage, platform cards |
| `/asylum-lawyer-los-angeles` | Core SEO Landing | Full local landing pattern with trust bar, FAQ, NAP |
| `/privacy` | Privacy Policy | Full Chinese legal text |
| `/terms` | Terms of Use | Full Chinese legal text |
| `/disclaimer` | Legal Disclaimer | Full Chinese legal text |

### Admin Pages

| Route | Page | Auth |
|-------|------|------|
| `/admin/login` | Login form | Public |
| `/admin/content` | Content Editor (JSON + Form) | Protected |

### API Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/consultation` | POST | Form submission → Supabase + email |
| `/api/admin/auth/login` | POST | JWT authentication |
| `/api/admin/auth/logout` | POST | Clear session |
| `/api/admin/auth/session` | GET | Verify current session |
| `/api/admin/content/files` | GET | List content entries |
| `/api/admin/content/file` | GET/PUT | Read/write content |

---

## Design System

**Color Palette:**

| Role | Color | Hex |
|------|-------|-----|
| Primary | Deep Navy | `#1B2A4A` |
| Secondary | Warm Gold | `#C9963B` |
| Accent / CTA | Warm Red | `#B8373D` |
| Success | Forest Green | `#2D7D46` |
| Dark Background | Navy Dark | `#0F1A32` |
| Light Background | Gray 50 | `#F9FAFB` |

**Typography:**

| Role | Font | Weight |
|------|------|--------|
| Chinese Headings | Noto Serif SC | 600, 700 |
| Chinese Body | Noto Sans SC | 400, 500, 600 |
| English | Inter | 400, 500, 600, 700 |

**Theme tokens** are defined in `content/asylum-attorney-la/theme.json` and injected as CSS custom properties via the locale layout.

---

## Database Schema

8 tables in Supabase (see `supabase/schema.sql`):

| Table | Purpose |
|-------|---------|
| `consultation_requests` | Intake form submissions |
| `contact_submissions` | Quick contact form submissions |
| `content_entries` | CMS content (JSON per page) |
| `sites` | Multi-site registry |
| `site_domains` | Domain → site mapping |
| `site_seo_pages` | SEO page registry |
| `admin_users` | Admin accounts (bcrypt passwords) |
| `media` | Uploaded media registry |

---

## Content Architecture

Content loads via a **DB-first, file fallback** pattern:

1. Check Supabase `content_entries` table
2. If not found, read from `content/[siteId]/[locale]/[path].json`
3. Admin CMS writes to both DB and local files (dev sync)

### Content Types

| Type | Source | Count |
|------|--------|-------|
| Page content | JSON files / DB | 10 files |
| Services | `lib/services-data.ts` | 15 services |
| Articles | `lib/articles-data.ts` | 6 articles |
| Locations | `lib/locations-data.ts` | 8 cities |
| Testimonials | Hardcoded in page | 20 items |
| FAQ | Hardcoded in page | 25 questions |

---

## SEO

- **Sitemap:** 82 URLs generated dynamically from content
- **Robots.txt:** Allows public, blocks `/admin/` and `/api/admin/`
- **Schema.org JSON-LD:** LocalBusiness + Attorney on every page
- **hreflang:** zh + en + x-default on all pages
- **Canonical URLs:** Set on every page
- **OpenGraph + Twitter Cards:** Title, description, image on every page
- **FAQPage schema:** On FAQ page with 25 questions
- **BreadcrumbList:** On all inner pages

---

## Multi-Site Platform

This codebase hosts multiple client sites from one deployment. **All page content is
per-site**; nothing about a specific firm lives in the components.

### Live sites

| Site ID | Brand | Domain | Local port | Dev host |
|---------|-------|--------|-----------|----------|
| `asylum-attorney-la` | 宇霞移民服务中心 | `asylumsolution.com` | **3006** | `asylum.local` |
| `legal-dispute-help` | 公道法律咨询 / Legal Dispute Help | `legaldisputehelp.com` | **3007** | `legaldispute.local` |

### Running the sites locally — one port per client

Each client site gets its own port. A Next server binds a single port, so this means one
server process per client, each pinned with `SITE_ID`:

```bash
npm run dev:asylum        # → http://localhost:3006   asylum-attorney-la
npm run dev:legaldispute  # → http://localhost:3007   legal-dispute-help
npm run dev:all           # both at once
```

Each pinned server also gets its own **build directory** (`NEXT_DIST_DIR`). Two `next dev`
processes sharing one `.next` overwrite each other's compiled output; the symptom is
`TypeError: __webpack_modules__[moduleId] is not a function` on whichever server compiled
second. Keep the `NEXT_DIST_DIR` in any new per-client script.

A pinned server serves **only** its own site — host headers and `?site=` cannot make it
render another client. That is deliberate: it keeps `localhost:3006` permanently the
asylum site.

`npm run dev` (unpinned, port 3006) is the multi-tenant mode: it resolves by host and
supports `?site=<siteId>` preview. Use it when working on the platform itself or
previewing a site that has no port of its own yet.

Production equivalents: `npm run start:asylum`, `npm run start:legaldispute`.

Adding a port for a new client — add two scripts to `package.json`:

```json
"dev:newclient":   "SITE_ID=new-client NEXT_DIST_DIR=.next-newclient next dev -p 3008",
"start:newclient": "SITE_ID=new-client NEXT_DIST_DIR=.next-newclient next start -p 3008"
```

### How a request resolves to a site

1. `SITE_ID` env var — pins the whole process to one site (used by the per-client scripts)
2. `?site=<siteId>` query param (sets a `site-preview` cookie; dev only unless
   `NEXT_PUBLIC_ALLOW_SITE_PREVIEW=1`)
3. Host → `site_domains` alias table → `sites.domain`
4. On plain `localhost`, the first enabled site in `content/_sites.json`

> **Every route under `app/[locale]` is `force-dynamic`.** Content depends on the request
> host, so prerendering would bake one tenant's content and serve it on every other
> tenant's domain. Do not add `generateStaticParams` to these routes, and never cache
> per-site content in module-level variables — use React's `cache()`.

### Onboarding a new client site

```bash
# 1. Create the site (admin UI → /admin/sites/new, or the API)
#    Choose "Clone from" to copy an existing site's content as a starting point.

# 2. Add a dev host alias on /admin/sites/<id>, then:
echo "127.0.0.1 newclient.local" | sudo tee -a /etc/hosts
sudo dscacheutil -flushcache && sudo killall -HUP mDNSResponder

# 3. Preview without DNS at any time:
open "http://localhost:3006/zh?site=newclient"
```

Then author `content/<siteId>/`:

| Path | Purpose |
|------|---------|
| `theme.json` | Colour + typography tokens (injected as CSS custom properties) |
| `<locale>/site.json` | Brand, NAP, hours, languages, `trustBar`, legal disclaimers |
| `<locale>/header.json` `footer.json` | Nav, logo text, footer columns, `tagline` |
| `<locale>/seo.json` | Default SEO |
| `<locale>/pages/*.json` | home, about, services, contact, consultation, faq, testimonials, privacy, terms, disclaimer, remote-consultation |
| `<locale>/service-categories/*.json` | Category hubs → `/services/[category]` |
| `<locale>/services/*.json` | Service detail pages |
| `<locale>/locations/*.json` | Near-location SEO pages |
| `<locale>/landing/*.json` | Keyword landing pages → `/<slug>` |
| `<locale>/blog/*.json` `videos/*.json` | Articles and videos |

Missing content in a non-default locale falls back to the site's default locale, so a
partially translated site shows its primary language rather than blank sections.

### Compliance: what each site may claim

`legal-dispute-help` is **not a law firm**. Its content is written as legal-matter
consultation and law-firm referral, and every page carries a non-law-firm disclosure via
`site.json → legal.disclaimer` (rendered by `LegalDisclaimer` in the locale layout).

When editing that site's content, do not introduce phrasing that implies practising law:
no "代发律师信", "全程代理", "我们起诉/出庭", or English equivalents. Service pages state
that representation is handled by a partner law firm. Re-run this check after edits:

```bash
grep -rn "代发\|代为发出\|全程代理\|律师信\|我们代理" content/<siteId>
```

### Services: one tier or two

A site with **no** `service-categories/` renders the flat layout and keeps one-level URLs
(`/services/[slug]`) — this is what `asylum-attorney-la` uses.

A site **with** categories gets hubs at `/services/[category]` and details at
`/services/[category]/[slug]`, set by each service's `categorySlug`. Categories may use
`groups` to sub-divide a large hub. `legal-dispute-help` uses this: 8 hubs, 56 matter
types, 20 detail pages.

---

## Scripts

```bash
npm run dev          # Start dev server on port 3006
npm run build        # Production build
npm run start        # Start production server
npm run seed         # Seed content JSON → Supabase
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

---

## Environment Variables

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=       # Supabase project URL
SUPABASE_URL=                   # Same as above (for server)
SUPABASE_SERVICE_ROLE_KEY=      # Supabase service role key
JWT_SECRET=                     # Secret for admin JWT tokens

# Email notifications
RESEND_API_KEY=                 # Resend API key
RESEND_FROM=                    # From email address
CONTACT_FALLBACK_TO=            # Notification recipient

# Optional
NEXT_PUBLIC_SITE_URL=           # Production URL for sitemap
PEXELS_API_KEY=                 # Stock photos
UNSPLASH_ACCESS_KEY=            # Stock photos
```

---

## Phase Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | Done | Infrastructure, theme, content contracts, seed |
| Phase 1 | Done | Core pages (Home, About, Services×15, Contact, SEO landing) |
| Phase 2 | Done | Consultation form, Articles×6, FAQ, Testimonials, Locations×8, Legal pages |
| Phase 3 | Done | Admin CMS, content seeding, sitemap, robots, schema helpers |
| Phase 4 | Next | QA + production deploy |
| Phase 5 | Future | 12-month growth plan, content velocity, GBP optimization |

---

Built with the [BAAM Platform](https://github.com/anthropics/claude-code) — System L (Legal/Asylum)
