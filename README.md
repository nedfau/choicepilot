# ChoicePilot

ChoicePilot helps international students make confident, transparent
decisions about the confusing, high-stakes logistics they face in their
first months abroad — things like choosing student housing, visa-compliant
health insurance, or a bank account — regardless of which country they're
from or studying in.

Users weight what matters to them (price, coverage, location, flexibility,
etc.) and see exactly how each option scores, with no sponsored ranking or
affiliate bias. Existing tools only cover one category each (insurance
comparison sites, bank guides, housing scoring blogs); ChoicePilot combines
them into one transparent, personal-priority decision layer. Future versions
add category templates, AI-assisted requirement checklists by nationality +
destination, and saved decisions.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Supabase](https://supabase.com) — prepared as the future data layer (client
  placeholder only, no active database logic yet)
- [GitHub](https://github.com) for source control
- [Vercel](https://vercel.com) for deployment

## Local setup

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.
`/` is the homepage and `/docs` is the docs placeholder.

To verify a production build locally:

```bash
npm run build
npm start
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in your own Supabase project
values if you want `src/lib/supabaseClient.ts` to resolve to a real project.
Neither variable is required for Week 0 — no code currently reads from the
database.

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase project's anon/public API key |

## Deployment

The site deploys to [Vercel](https://vercel.com) from this GitHub repository.
Vercel auto-detects the Next.js framework — no custom build configuration is
needed. If Supabase environment variables are added later, set them in the
Vercel project's Environment Variables settings before redeploying.

## Week 0 scope

Week 0 delivers the public infrastructure and positioning for ChoicePilot:

- Responsive homepage (`/`) with hero, "how it works," and roadmap sections
- Placeholder docs page (`/docs`)
- Shared navbar and footer with working navigation
- Supabase client placeholder and documented environment variables, with no
  active database logic
- Deployable to Vercel from this repository

Explicitly out of scope for Week 0: real AI recommendations, real
scoring/comparison logic, accounts/login, payments, external product APIs,
advanced database functionality, and a comparison dashboard.

## Roadmap

- **Week 0** — Infrastructure (this repository)
- **Future** — Comparison tool (add options, weight priorities, see scored
  results)
- **Future** — AI-assisted recommendations (requirement checklists by
  nationality + destination)
- **Future** — Saved decisions
