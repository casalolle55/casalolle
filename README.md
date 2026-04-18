# Casa Lolle

Vacation rental website for Casa Lolle, a restored stone cottage in Fabbriche di Casabasciana, Bagni di Lucca, Tuscany.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS
- next-intl (NL default, EN, DE, FR)
- Google Calendar API for availability
- Resend for booking emails
- Deployed on Vercel

## Local development

```bash
npm install
npm run dev
```

Requires `.env.local` with:

- `GOOGLE_CALENDAR_ID`
- `GOOGLE_SERVICE_ACCOUNT_KEY` (base64-encoded service account JSON)
- `RESEND_API_KEY`
- `CONTACT_EMAIL`
- `RESEND_FROM` (optional — defaults to Resend's onboarding sender)
