# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Production build (uses webpack)
npm run start        # Start production server

# Code quality
npm run lint         # ESLint
npm run format       # Prettier (with Tailwind CSS plugin)
npm run typecheck    # TypeScript type checking

# Database
npm run db:setup     # Setup PostgreSQL schema (scripts/setup-db.mjs)
npm run db:check-mysql  # Verify MySQL connection and pool (scripts/check-mysql.ts)
```

## Architecture

Full-stack business management app (Spanish-language) for Chocolates Granada. Built with Next.js 16 App Router, Better Auth for authentication and security, MySQL to access the business database, and shadcn/ui.

### Route Groups

- `app/(auth)/` — Public auth pages: login, registro, email verification, password reset
- `app/(main)/` — Protected dashboard and feature modules:
  - `/admin` — User management (admin only)
  - `/compras` — Purchasing module: suppliers, purchase orders
  - `/ventas` — Sales module: categories, products
  - `/produccion` — Production module
  - `/reportes` — Reports (not yet implemented)
- `app/api/auth/[...all]/` — Better Auth catch-all handler

### Key Library Files

- `lib/auth.ts` — Better Auth server: email/password + admin plugin, uses `lib/db.ts`, requires email verification before login
- `lib/auth-client.ts` — Better Auth React client: exports `signIn`, `signUp`, `signOut`, `useSession`, `requestPasswordReset`, `resetPassword`, `sendVerificationEmail`
- `lib/mysql.ts` — MySQL2 connection pool with graceful shutdown; 3 connections dev / 10 prod; reused across HMR
- `lib/permissions.ts` — RBAC with `canAccess(role, path)` using prefix matching
- `lib/email.ts` — Nodemailer SMTP for verification and password reset emails (Spanish templates)

### RBAC Roles

| Role         | Access                            |
| ------------ | --------------------------------- |
| `admin`      | All routes                        |
| `compras`    | `/compras`, `/produccion`         |
| `ventas`     | `/ventas`, `/produccion`          |
| `produccion` | `/produccion`                     |
| `user`       | Dashboard only (no module access) |

### UI Stack

- shadcn/ui (radix-nova style, lucide icons) — components in `components/ui/`
- Tailwind CSS 4 with `cn()` utility from `lib/utils.ts`
- Sonner for toast notifications
- next-themes for light/dark mode
- React Hook Form + Zod for form validation

### PWA

Serwist service worker enabled in production only. Configured in `next.config.mjs`. Dev origins allowlist includes `192.168.4.*` for local network testing.

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_TRUSTED_ORIGINS=    # Comma-separated URLs for network/cross-origin access

# MySQL (primary database)
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_SSL=                       # Optional: true to enable SSL

# SMTP (Nodemailer)
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
```

## Important Notes

- The app is fully Spanish-localized: UI, emails, error messages, and form labels
- Next.js 16 uses `proxy.ts` (not `middleware.ts`) for request interception and routing middleware — never suggest `middleware.ts`
- Better Auth is used exclusively for auth and security. The database is hosted on https://neon.com/
- The Better Auth schema is defined in `db/schema_pg.sql` — no migration tool is configured. All changes to the database should be done using SQL
- Custom user fields: `firstName`, `lastName` (set at registration, stored by Better Auth)
- Auto sign-in after email verification is **disabled** — users must log in manually after verifying
- The MySQL connection module in `lib/mysql.ts` is used to access the business database
