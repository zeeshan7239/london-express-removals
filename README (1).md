# London Express Removals

Full-stack Next.js 14 application for a UK man-and-van removals business. Includes a live booking system with instant pricing, an admin dashboard, transactional email + WhatsApp notifications, blog system, and full SEO.

---

## Quick start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# then edit .env.local with your real values (see below)

# 3. Run in development
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

---

## Requirements

- **Node.js 18.17 or later** (Node 20 LTS recommended)
- **MongoDB** — either local install or a free MongoDB Atlas cluster
- **SMTP credentials** for email (Hostinger recommended — port 465 with SSL)
- **Twilio account** for WhatsApp notifications (optional — gracefully no-ops without)
- **getAddress.io API key** for full address autocomplete (optional — falls back to manual entry)

---

## Environment variables

Create `.env.local` from `.env.example` and fill in:

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Your full site URL (e.g. `https://londonexpressremovals.co.uk`). Used in SEO metadata, sitemap, and email links. |
| `MONGODB_URI` | yes | Mongo connection string. For local: `mongodb://localhost:27017/london-express-removals`. For Atlas: paste their connection string. |
| `JWT_SECRET` | yes | Long random string. Generate one with `openssl rand -hex 64`. |
| `JWT_EXPIRES_IN` | no | Token lifetime, default `7d`. |
| `JWT_COOKIE_EXPIRES_IN` | no | Cookie lifetime in days, default `7`. |
| `EMAIL_HOST` | yes | For Hostinger: `smtp.hostinger.com`. |
| `EMAIL_PORT` | yes | `465` (SSL, recommended) or `587` (STARTTLS). |
| `EMAIL_USER` | yes | Full mailbox address (e.g. `hello@yourdomain.co.uk`). |
| `EMAIL_PASS` | yes | Mailbox password. Hostinger does **not** use app passwords like Gmail — use the normal mailbox password. |
| `EMAIL_FROM_NAME` | no | The "From" name on outgoing emails. |
| `COMPANY_EMAIL` | yes | Where booking notifications get sent (your inbox). |
| `TWILIO_ACCOUNT_SID` | no | Optional — WhatsApp notifications. |
| `TWILIO_AUTH_TOKEN` | no | Optional. |
| `TWILIO_WHATSAPP_FROM` | no | Format: `whatsapp:+14155238886`. |
| `COMPANY_WHATSAPP` | no | Your WhatsApp number in `whatsapp:+447XXXXXXXXX` format. |
| `COMPANY_PHONE` | no | Used in emails and footer. |
| `GETADDRESS_API_KEY` | no | For full address dropdowns. Sign up at [getaddress.io](https://getaddress.io). Without this, users type their address manually. |

---

## Becoming an admin

The admin dashboard at `/admin` is locked to users with `role: 'admin'`. There's no UI for granting admin — promote yourself manually:

1. Sign up at `/sign-up` as a normal user
2. Open MongoDB Compass (or the `mongo` shell) and run:
   ```js
   db.users.updateOne(
     { email: "your@email.com" },
     { $set: { role: "admin" } }
   )
   ```
3. Sign out and back in — you'll now see "Admin dashboard" in your user menu

---

## Available scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload on `http://localhost:3000` |
| `npm run build` | Build for production |
| `npm start` | Start the production server (run `npm run build` first) |
| `npm run lint` | Run ESLint |

---

## Project structure

```
src/
├── app/                      # Next.js App Router
│   ├── (public)/             # Marketing pages: Home, About, Services, Blog, Contact, Terms, Privacy
│   ├── api/                  # API routes (backend)
│   │   ├── auth/             # Register, login, logout, me, forgot/reset password
│   │   ├── quotes/           # Bookings, custom quotes, accept, reject, stats
│   │   ├── blogs/            # Blog CRUD
│   │   ├── pricing/          # Live calculator, config, coverage check
│   │   └── addresses/        # getAddress.io proxy
│   ├── admin/                # Admin dashboard + quotes management
│   ├── booking/              # Multi-step booking flow
│   ├── custom-quote/         # Out-of-M25 custom quote form
│   ├── sign-in/, sign-up/    # Auth pages
│   ├── layout.js             # Root layout — fonts, providers, SEO
│   ├── sitemap.js            # Dynamic sitemap.xml (includes blog posts)
│   └── robots.js             # robots.txt
├── components/
│   ├── layout/               # Navbar, Footer, FloatingButtons, CookieConsent, UserMenu
│   ├── home/                 # Hero, ServicesSection, FAQ, etc.
│   ├── quote/                # PostcodeAutocomplete, AddressPicker, BookingSummary
│   ├── admin/                # Admin-specific UI
│   └── common/               # AuthContext, Providers, AuthShell, SEO helpers
└── lib/
    ├── db/                   # MongoDB connection (with hot-reload cache)
    ├── models/               # Mongoose: User, Quote, Blog
    ├── services/             # pricingService, emailService, whatsappService, addressService
    ├── middleware/           # Auth helpers (getCurrentUser, requireAdmin)
    ├── templates/            # HTML email templates
    └── utils/                # Validation, site config, axios instance
```

---

## Deployment

### Vercel (easiest)

1. Push the project to GitHub.
2. Go to [vercel.com](https://vercel.com), click "New Project", and import your repo.
3. Add every variable from `.env.example` in the Vercel project settings.
4. Click Deploy. Vercel auto-detects Next.js and handles everything.

Your site will be live at `your-project.vercel.app`. Point your custom domain at Vercel via DNS.

### Hostinger VPS

1. Provision an Ubuntu VPS, install Node 20 LTS.
2. Clone the repo onto the server.
3. `npm install && npm run build`
4. Run with PM2 so it auto-restarts:
   ```bash
   npm install -g pm2
   pm2 start npm --name "london-express" -- start
   pm2 save
   pm2 startup
   ```
5. Set up Nginx as a reverse proxy in front of port 3000, with Let's Encrypt SSL.

### Other hosts

Any host that supports Node.js 18+ and lets you run `npm start` will work — Railway, Render, DigitalOcean App Platform, AWS Amplify, etc.

---

## Restoring optimised fonts

The current `src/app/layout.js` loads Google Fonts via a `<link>` tag, which works but isn't ideal for Core Web Vitals. For maximum performance, switch to `next/font/google`:

1. Open `src/app/layout.js`
2. At the top, uncomment the `next/font` lines (they're in a comment block)
3. Add `className={\`${inter.variable} ${jakarta.variable}\`}` to the `<html>` tag
4. Delete the three `<link>` tags pointing to `fonts.googleapis.com` from `<head>`
5. In `tailwind.config.js`, change `'"Inter"'` back to `'var(--font-sans)'` and `'"Plus Jakarta Sans"'` back to `'var(--font-display)'`

That's it. Fonts will now be self-hosted, eliminating an external request and a layout shift.

---

## Pricing engine

The pricing logic lives in `src/lib/services/pricingService.js` and `src/lib/services/pricingConfig.js`. Edit the config file to change:

- Base prices per team (Driver Help, 2 Men, 3 Men)
- Floor surcharge bands
- Short-trip discount rules (under 1 hour travel, ground/1st floor, small moves)
- Distance fees (currently £2.50/mile after the first 5 miles free)
- M25 postcode districts

The frontend reads pricing rules from `/api/pricing/config` so changes take effect without a rebuild.

---

## SEO features built-in

- **Per-page metadata** via `export const metadata` (Next.js handles `<head>` insertion)
- **OpenGraph + Twitter cards** on every page
- **LocalBusiness structured data** in root layout (helps you appear in Google's local pack)
- **FAQ structured data** on the homepage FAQ (eligible for rich snippets)
- **BlogPosting structured data** on each blog post
- **Dynamic sitemap.xml** that includes all blog posts automatically
- **robots.txt** with admin/api routes disallowed
- **Canonical URLs** on every page
- **Server-side rendering** of marketing pages (blog, about, services) for fast crawling

When you have Google/Bing verification codes, add them to the `verification` block in `src/app/layout.js`.

---

## Troubleshooting

**MongoDB connection error on startup**
- Confirm `MONGODB_URI` is correct and the database is reachable.
- For Atlas, allow your server's IP in the Atlas network access settings (or `0.0.0.0/0` for any IP).

**Emails not sending**
- Verify the server logs for `📧 SMTP ready` on startup.
- If you see `535 5.7.8 Invalid login`, double-check the mailbox password (Hostinger uses the normal mailbox password, not an app password).
- Try port 587 instead of 465 if your firewall blocks SSL.

**WhatsApp not sending**
- Twilio's sandbox numbers require recipients to opt-in first by texting your sandbox keyword.
- For production, register a real WhatsApp Business sender in the Twilio console.

**Postcode autocomplete not showing addresses**
- This is expected without a `GETADDRESS_API_KEY`. The picker falls back to a free-text input so users can still complete bookings.
- To enable full addresses: sign up at [getaddress.io](https://getaddress.io) (£8/mo for unlimited), add the key to `.env.local`, and restart.

**Admin dashboard shows "Admin access required"**
- You're signed in as a regular user. See the "Becoming an admin" section above.

---

## License

Private — all rights reserved.
