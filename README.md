# CampaignFlow

Timeline-based bulk email SaaS built with Next.js App Router, Tailwind, Prisma, and queue-ready email delivery helpers.

## What is included

- Timeline-first dashboard covering April 7, 2026 through August 16, 2026
- Auth screens with lightweight API-backed demo flow
- Template management with merge-variable detection
- CSV/XLSX contact upload parser
- Campaign creation flow wired to a BullMQ-ready queue wrapper
- Recipient-level email logs UI
- Prisma schema and Neon Postgres-backed data access

## Quick start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env`:

   ```bash
   DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require"
   REDIS_URL="redis://<username>:<password>@<host>:<port>"
   RESEND_API_KEY=""
   EMAIL_FROM="CampaignFlow <noreply@example.com>"
   DEMO_USER_EMAIL="demo@example.com"
   DEMO_USER_PASSWORD="<strong-password>"
   ```

3. Generate Prisma client:

   ```bash
   npm run prisma:generate
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

## Notes

- Server pages and route handlers use Prisma against the configured Neon/Postgres database.
- The app bootstraps a demo workspace in the database on first access so the dashboard has real seed data.
- Connection credentials and seeded demo credentials are expected in `.env`.
- When `REDIS_URL` is present, BullMQ enqueues jobs into the configured Redis instance.
- When `REDIS_URL` is missing, queue operations return mock metadata instead of enqueuing BullMQ jobs.
- When `RESEND_API_KEY` or `EMAIL_FROM` is missing, mail sending falls back to a mock provider response.
