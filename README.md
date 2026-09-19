# Xornexz — Full-Stack Website & Admin Panel

A complete, production-ready website and admin panel for **Xornexz**, a technology studio. Built with Next.js 15, TypeScript, Tailwind CSS, Prisma, and Auth.js.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) + TypeScript |
| Styling | Tailwind CSS v3 + shadcn/ui |
| Animation | Framer Motion + GSAP + Lenis |
| 3D | React Three Fiber + Drei |
| Database | Prisma ORM + PostgreSQL |
| Auth | Auth.js v5 (NextAuth) |
| Email | Resend |
| Storage | Cloudinary |
| Forms | React Hook Form + Zod |
| Editor | Tiptap |
| Charts | Recharts |
| Icons | Lucide React |

---

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database (we recommend [Neon](https://neon.tech) — free tier works)
- Accounts for: Resend (email), Cloudinary (images)

### 1. Clone and Install

```bash
git clone https://github.com/yourusername/xornexz.git
cd xornexz
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in all variables in `.env.local`:

```env
DATABASE_URL="postgresql://..."
AUTH_SECRET="run: openssl rand -base64 32"
RESEND_API_KEY="re_..."
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the website.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

**Default admin credentials:**
- Email: `admin@xornexz.com`
- Password: `Admin@123456`

> ⚠️ Change this immediately in production!

---

## Project Structure

```
xornexz/
├── app/
│   ├── (public pages)
│   │   ├── page.tsx              # Home
│   │   ├── services/             # Services + 7 sub-pages
│   │   ├── portfolio/            # Portfolio + case studies
│   │   ├── about/
│   │   ├── process/
│   │   ├── pricing/
│   │   ├── estimator/            # Project estimator wizard
│   │   ├── blog/                 # Blog + posts
│   │   ├── contact/
│   │   ├── careers/              # Jobs + applications
│   │   └── legal/               # Privacy, Terms, Cookies
│   ├── admin/                    # Admin panel
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── leads/
│   │   ├── projects/
│   │   ├── blog/
│   │   ├── media/
│   │   ├── settings/
│   │   └── users/
│   └── api/                      # API route handlers
├── components/
│   ├── home/                     # Home page sections
│   ├── layout/                   # Navbar, Footer
│   ├── providers/                # Theme, Lenis
│   ├── ui/                       # Shared UI components
│   ├── admin/                    # Admin panel components
│   └── estimator/                # Estimator wizard steps
├── lib/
│   ├── auth.ts                   # Auth.js config
│   ├── db.ts                     # Prisma client
│   └── data/                     # Static data files
│       ├── services.ts
│       ├── projects.ts
│       ├── blog.ts
│       └── team.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
└── .env.example
```

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database (dev)
npm run db:migrate   # Create and run migration (prod)
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
```

---

## Customization Guide

### Changing Brand Colors

Edit `tailwind.config.ts` — look for the `colors` section:

```ts
accent: {
  violet: "#7C3AED",  // ← Change your primary accent
  cyan: "#06B6D4",    // ← Change your secondary accent
},
```

Also update `app/globals.css` for the CSS custom properties.

### Changing Company Name & Copy

1. **Site name & metadata**: Update `app/layout.tsx` `metadata` object
2. **Navbar logo**: Edit `components/layout/Navbar.tsx`
3. **Hero copy**: Edit `app/page.tsx` and `components/home/Hero.tsx`
4. **Services content**: Edit `lib/data/services.ts`
5. **Admin settings**: Go to `/admin/settings` and update from the UI

### Changing Fonts

1. Update the Google Fonts import in `app/globals.css`
2. Update `fontFamily` in `tailwind.config.ts`
3. Update `next/font` import in `app/layout.tsx`

### Adding Your Logo

1. Upload your logo to Cloudinary
2. Go to `/admin/settings` → General → upload logo
3. Or directly replace the text logo in `components/layout/Navbar.tsx`

---

## Deployment (Vercel)

1. Push to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables from `.env.example`
4. Deploy

### Required Production Steps

- [ ] Change admin password (`admin@xornexz.com`)
- [ ] Set up custom domain
- [ ] Configure Resend domain verification
- [ ] Set `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Run `npm run db:migrate` for production database
- [ ] Run `npm run db:seed` once for initial data

---

## What to Customize Before Launch

1. **Logo & Brand**: Replace text logo with your logo SVG/image
2. **Colors**: Update accent colors in `tailwind.config.ts`
3. **Copy**: Update all text in components (hero, about, etc.)
4. **Projects**: Add your real case studies via admin panel
5. **Team**: Add team members via `/admin` → Team
6. **Services**: Edit service descriptions to match your actual offerings
7. **Domain**: Update `NEXT_PUBLIC_APP_URL` and OG image URLs
8. **Analytics**: Add your GA4 measurement ID or Plausible domain
9. **Cal.com**: Replace the calendar placeholder link in the contact page
10. **Social links**: Update via `/admin` → Settings → Social

---

## Admin Panel

Access at `/admin/login`

### Modules

| Module | Description |
|--------|-------------|
| Dashboard | KPI cards, charts, recent activity |
| Leads | Inquiry pipeline with kanban-style status |
| Projects | Portfolio CRUD with media upload |
| Blog | Rich text editor with scheduling |
| Media | Cloudinary-backed image library |
| Settings | Site-wide configuration |
| Users | Role-based access control |

### Roles

| Role | Access |
|------|--------|
| Super Admin | Everything |
| Admin | All content + settings |
| Editor | Content only (no settings/users) |
| Viewer | Read-only |

---

## Features Summary

### Public Website
- Cinematic preloader with logo animation
- Interactive Three.js hero scene (mouse-reactive)
- Smooth scrolling with Lenis
- GSAP ScrollTrigger animations
- Custom cursor with context states
- Cmd+K command palette
- Dark/light theme toggle
- Infinite marquee for tech stack
- Multi-step contact form & project estimator
- Blog with reading time and table of contents
- Cookie consent banner

### Admin Panel
- Auth.js authentication with RBAC
- Lead management pipeline
- Projects/Portfolio CRUD
- Tiptap rich text editor
- Cloudinary media library
- Site settings manager
- Activity/audit log
- Newsletter subscribers

---

## License

MIT — use freely for commercial projects.
