# Star Festival Deployment Spec (Vercel)

## 1. Goal
Deploy the `star-festival` Next.js app to Vercel with:
- Public wish listing from Supabase
- Wish submission API working in production
- Stable environment variable setup
- Safe rollout and quick rollback path

## 2. Architecture
- Frontend/API: Next.js App Router on Vercel
- Database/Auth backend: Supabase project
- API route: `/api/wishes` (GET/POST) runs on Vercel server runtime

## 3. Required Environment Variables
Set these in Vercel Project Settings -> Environment Variables.

### Client + Server readable
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
  - Optional fallback supported in code: `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Server-only (must be secret)
- `SUPABASE_SERVICE_ROLE_KEY`

### Recommended
- `NODE_ENV=production` (Vercel sets this automatically for production)

## 4. Supabase Production Checklist
1. Ensure table `public.wishes` exists.
2. Required columns should match current app usage:
   - `id`
   - `wish_text`
   - `nickname`
   - `nickname_is_default`
   - `color`
   - `language`
   - `status`
   - `moderation_reason`
   - `approved_at`
   - `created_at`
3. Confirm approved wishes are queryable.
4. Confirm inserts from server role key succeed.
5. Keep service role key private and never expose it in client code.

## 5. Vercel Project Setup Plan
1. Push latest code to Git provider (`main` branch recommended for production).
2. In Vercel, create/import project from repository.
3. Framework preset: `Next.js` (auto-detected).
4. Add environment variables for:
   - `Production`
   - `Preview` (recommended for testing PRs)
5. Deploy.

## 6. Build & Runtime Settings
- Build command: default (`next build`)
- Install command: default (`npm install`)
- Output: Next.js standard output (auto)
- Node version: use project default or set explicitly in Vercel if needed

## 7. Domain & DNS Plan
1. Start with `*.vercel.app` domain.
2. Add custom domain in Vercel (optional).
3. Configure DNS records as provided by Vercel.
4. Verify HTTPS certificate is active.

## 8. Pre-Deploy Verification (Local)
Run:
```bash
npm install
npm run build
```
Optional:
```bash
npm run test:e2e
```

## 9. Post-Deploy Smoke Test
After deployment, verify:
1. Home page loads and background/hero render correctly.
2. Language switcher works (`မြန်မာ`, `日本語`, `English`).
3. Intro modal opens on first visit and closes properly.
4. Wish form opens and submits successfully.
5. Newly approved wish appears in Wish River.
6. Wish count badge displays.
7. Pagination loads additional wishes by horizontal scroll.
8. Footer links open correct destinations.
9. Non-existent routes redirect to `/`.

## 10. Observability & Troubleshooting
- Use Vercel Deployment logs for build/runtime errors.
- If wish submit fails:
  1. Check `SUPABASE_SERVICE_ROLE_KEY` in Vercel env.
  2. Confirm `public.wishes` table exists in Supabase.
  3. Confirm `NEXT_PUBLIC_SUPABASE_URL` and publishable key are correct.
- If wish list fails:
  1. Check public key + URL.
  2. Verify approved rows exist in `wishes`.

## 11. Rollback Plan
1. In Vercel, open Deployments.
2. Promote previous healthy deployment.
3. Re-check critical flows (list wishes, submit wish, modal interactions).

## 12. Release Workflow Recommendation
1. Develop on feature branches.
2. Auto-create Preview deployments for PRs.
3. Run manual QA checklist on Preview.
4. Merge to `main` for production deployment.

## 13. Security Notes
- Never commit `.env.local`.
- Keep `SUPABASE_SERVICE_ROLE_KEY` only on server environment.
- Rotate keys immediately if leaked.
