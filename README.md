# Star Festival

Starter scaffold for the Tanabata multilingual experience.

## Stack
- Next.js + React + TypeScript
- Tailwind CSS
- Framer Motion
- Supabase
- next-intl
- Zod
- Vitest + Playwright

## Quick Start
```bash
cp .env.example .env.local
npm install
npm run dev
```

## Environment
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Next Steps
1. Apply `supabase/migrations/20260224173000_init_wishes.sql`.
2. Set `.env.local` with real Supabase keys.
3. Replace placeholder blocked-word list in `lib/moderation/moderate.ts`.
4. Install dependencies and run `npm run dev`.
