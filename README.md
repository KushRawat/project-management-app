# Project Management App

A full-stack project management application using Next.js, tRPC, Prisma and AWS (via SST).

---

## Project Setup

1. **Clone & install**  
   ```bash
   git clone https://github.com/your-org/project-management-app.git
   cd project-management-app
   pnpm install
Configure environment


cp apps/web/.env.example apps/web/.env.local
# Edit apps/web/.env.local with your DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL, SUPABASE_URL, SUPABASE_ANON_KEY
Database migrations


pnpm --filter web db:generate    # runs `prisma migrate dev` + generates client
Run locally

Infrastructure & API


cd infrastructure
npx sst dev --stage dev
Frontend


cd ../apps/web
pnpm dev
Visit http://localhost:3000 (frontend) which proxies tRPC calls to your SST-powered API.

Architecture

┌──────────────────┐      ┌─────────────────────────┐
│ StaticSite (S3)  │◀───▶│ Lambda API (tRPC + SST) │
│ – Next.js + CDN  │      │ – Prisma → PostgreSQL   │
└──────────────────┘      └─────────────────────────┘
Frontend: Next.js app deployed as a StaticSite (S3 + CloudFront).

API: tRPC handlers in Lambda, managed by SST, talking to PostgreSQL via Prisma.

Testing
Type-check


pnpm --filter web typecheck
Lint


pnpm --filter web lint
Format


pnpm --filter web format:write


Deployment
Deploy infra & API


cd infrastructure
npx sst deploy --stage production
Build & deploy frontend


pnpm --filter web build
# SST’s StaticSite construct will automatically upload the build.
After deploy you’ll get:

ApiEndpoint – production tRPC URL

SiteUrl – production frontend URL