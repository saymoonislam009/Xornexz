# Xornexz — Setup Guide

Complete click-by-click setup from zero to production.

---

## Prerequisites

- Node.js 20+
- A [Neon](https://neon.tech) account (free tier works)
- A [Cloudflare](https://cloudflare.com) account (free tier for R2)
- A [Vercel](https://vercel.com) account
- A [Resend](https://resend.com) account (free tier)
- A [Upstash](https://upstash.com) account (optional — rate limiting)

---

## Step 1 — Clone and Install

```bash
git clone <your-repo-url> xornexz
cd xornexz
cp .env.example .env.local
npm install
```

---

## Step 2 — Create Neon Database

1. Go to [console.neon.tech](https://console.neon.tech) and click **New Project**
2. Name it `xornexz`, choose the region closest to your users (we use `us-east-1` / AWS)
3. Once created, go to **Connection Details**
4. Copy the **Pooled connection string** → paste as `DATABASE_URL` in `.env.local`
   - The pooled URL contains `-pooler` in the hostname, e.g. `ep-xxxx-pooler.us-east-1.aws.neon.tech`
5. Copy the **Direct connection string** → paste as `DIRECT_URL` in `.env.local`
   - No `-pooler` in hostname, e.g. `ep-xxxx.us-east-1.aws.neon.tech`

> **Why two URLs?** Prisma uses the pooled URL for runtime queries (Neon's connection pool handles serverless cold starts), and the direct URL for `migrate deploy` which needs a persistent connection.

---

## Step 3 — Run Database Migration and Seed

```bash
# Apply migrations (creates all tables)
npx prisma migrate deploy

# Seed with default data (services, projects, FAQs, pricing, etc.)
# Uses ADMIN_EMAIL and ADMIN_PASSWORD from .env.local
npm run db:seed
```

After seeding, you can log into `/admin` with:
- Email: value of `ADMIN_EMAIL` (default: `admin@xornexz.com`)
- Password: value of `ADMIN_PASSWORD` (default: `ChangeMe123!` — **change this immediately**)

---

## Step 4 — Cloudflare R2 Bucket Setup

### 4a. Create the Bucket

1. Log into [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **R2 Object Storage** → **Create bucket**
3. Name it `xornexz-media`, choose region (e.g. `WNAM` for US West or `ENAM` for US East)
4. Leave defaults, click **Create bucket**

### 4b. Set CORS Policy

In the bucket settings → **CORS Policy**, paste this JSON:

```json
[
  {
    "AllowedOrigins": [
      "https://xornexz.com",
      "https://www.xornexz.com",
      "http://localhost:3000"
    ],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag", "Content-Length", "Content-Type"],
    "MaxAgeSeconds": 3600
  }
]
```

> Replace `xornexz.com` with your actual domain.

### 4c. Create API Token

1. Go to **R2** → **Manage R2 API Tokens** → **Create API Token**
2. Set permissions: **Object Read & Write** on your `xornexz-media` bucket
3. Copy:
   - **Access Key ID** → `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → `R2_SECRET_ACCESS_KEY`
4. Your Account ID is in the URL bar (32-char hex) → `R2_ACCOUNT_ID`
5. Set `R2_ENDPOINT=https://<R2_ACCOUNT_ID>.r2.cloudflarestorage.com`

### 4d. Custom Domain (CDN)

1. In the bucket → **Settings** → **Public Access** → **Custom Domains**
2. Add your domain, e.g. `media.xornexz.com`
3. In Cloudflare DNS, a CNAME record will be created automatically
4. Set `NEXT_PUBLIC_MEDIA_URL=https://media.xornexz.com` and `NEXT_PUBLIC_MEDIA_HOSTNAME=media.xornexz.com`

> The custom domain routes through Cloudflare CDN — all media is cached globally at edge.

---

## Step 5 — Resend Setup

1. Go to [resend.com](https://resend.com) → **API Keys** → **Create API Key**
2. Copy the key → `RESEND_API_KEY`
3. Go to **Domains** → Add your sending domain (e.g. `xornexz.com`)
4. Add the DNS records Resend shows you (SPF, DKIM, DMARC)
5. Set `RESEND_FROM_EMAIL=hello@xornexz.com` and `RESEND_FROM_NAME=Xornexz`

---

## Step 6 — Auth Secret

Generate a secure secret:

```bash
openssl rand -base64 32
```

Paste the output as `AUTH_SECRET`. Also set:
```
AUTH_URL=https://xornexz.com
```

---

## Step 7 — Upstash Redis (Optional — Rate Limiting)

If you want rate limiting on public forms and the login page:

1. Go to [upstash.com](https://upstash.com) → **Redis** → **Create Database**
2. Choose region matching your Vercel region
3. Copy **REST URL** → `UPSTASH_REDIS_REST_URL`
4. Copy **REST Token** → `UPSTASH_REDIS_REST_TOKEN`

> If these env vars are not set, rate limiting is silently skipped. The honeypot field still protects forms.

---

## Step 8 — Cron Secret

```bash
openssl rand -hex 32
```

Paste as `CRON_SECRET`. Vercel will send this header when calling the scheduled post endpoint.

---

## Step 9 — Deploy to Vercel

1. Push your code to GitHub/GitLab
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your repo
3. **Build & Output Settings**: Leave as defaults (Vercel reads `vercel.json`)
4. **Environment Variables**: Add every variable from `.env.example` with real values
5. **Region**: Set to match your Neon region (e.g. `iad1` for us-east-1)
6. Click **Deploy**

Vercel will run: `prisma generate && prisma migrate deploy && next build`

### First deploy steps

After deploy completes:
1. Visit `https://xornexz.com/admin/login`
2. Log in with your `ADMIN_EMAIL` and `ADMIN_PASSWORD`
3. Go to **Settings** and update all branding, contact info, and social links
4. Upload your logo in **Media** and set it in **Settings**
5. Change your admin password in **Users**

---

## Step 10 — Vercel Cron

The `vercel.json` configures a cron that runs every 5 minutes:
```json
{ "path": "/api/cron/publish", "schedule": "*/5 * * * *" }
```

This automatically publishes blog posts whose `scheduledAt` has passed.

> Crons are only active in production (Vercel Pro or Enterprise for < 1 day intervals on free).

---

## Local Development

```bash
# Install deps
npm install

# Apply migrations to your local/Neon DB
npx prisma migrate deploy

# Seed data
npm run db:seed

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

### Prisma Studio (DB browser)

```bash
npm run db:studio
```

---

## Bundle Analysis

```bash
ANALYZE=true npm run build
```

Opens an interactive treemap of the bundle.

---

## Sharing / Zipping the Project

The project source is under 5 MB. To share without `node_modules` and `.next`:

```bash
# From the project root
git archive --format=zip HEAD -o xornexz-source.zip
```

Or manually:
```bash
zip -r xornexz-source.zip . \
  --exclude "node_modules/*" \
  --exclude ".next/*" \
  --exclude ".env.local" \
  --exclude "*.log"
```

The recipient runs `npm install` and `npx prisma generate` to restore dependencies.

---

## Environment Variable Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Neon pooled connection string |
| `DIRECT_URL` | Yes | Neon direct connection string (for migrations) |
| `AUTH_SECRET` | Yes | 32-byte random secret for Auth.js |
| `AUTH_URL` | Yes | Your site URL |
| `RESEND_API_KEY` | Yes | For sending emails |
| `RESEND_FROM_EMAIL` | Yes | Sending address |
| `R2_ACCOUNT_ID` | Yes | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | Yes | R2 API key ID |
| `R2_SECRET_ACCESS_KEY` | Yes | R2 API secret |
| `R2_BUCKET` | Yes | Bucket name |
| `R2_ENDPOINT` | Yes | `https://<account_id>.r2.cloudflarestorage.com` |
| `NEXT_PUBLIC_MEDIA_URL` | Yes | Public CDN URL for media |
| `NEXT_PUBLIC_MEDIA_HOSTNAME` | Yes | Hostname only (for Next.js images config) |
| `CRON_SECRET` | Yes | Secures the scheduled post cron endpoint |
| `ADMIN_EMAIL` | Seed only | Initial admin email |
| `ADMIN_PASSWORD` | Seed only | Initial admin password (change after first login) |
| `UPSTASH_REDIS_REST_URL` | Optional | Rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Optional | Rate limiting |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Optional | Cloudflare Turnstile bot protection |
| `TURNSTILE_SECRET_KEY` | Optional | Cloudflare Turnstile verification |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional | Plausible analytics |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics 4 |
