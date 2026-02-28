# Registration Management Web App - Deployment Guide

This project is a Next.js 14 application ready for Vercel deployment.

## Prerequisites

1.  **PostgreSQL Database**: Use [Neon](https://neon.tech/) or [Supabase](https://supabase.com/) for a serverless PostgreSQL database.
2.  **Vercel Account**: For hosting.

## Environment Variables

Create a `.env` file (or set in Vercel Dashboard):

```env
DATABASE_URL="postgresql://user:password@hostname:5432/dbname?schema=public"
NEXTAUTH_URL="http://localhost:3000" (or your production URL)
NEXTAUTH_SECRET="a-random-secret-string"
```

## Setup & Local Development

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Database Migration**:
    ```bash
    npx prisma migrate dev --name init
    ```

3.  **Seed Initial Admin**:
    ```bash
    npx prisma db seed
    ```
    *Default Login: `admin@example.com` / `adminpassword123`*

4.  **Run Dev Server**:
    ```bash
    npm run dev
    ```

## Vercel Deployment

1.  Connect your GitHub repository to Vercel.
2.  Add the environment variables in the Vercel project settings.
3.  Vercel will automatically detect Next.js and deploy.
4.  The `postinstall` script in `package.json` ensures Prisma Client is generated on every build.

## Project Structure

- `/app/register`: Public registration portal.
- `/app/login`: Dashboard login.
- `/app/admin`: Admin dashboard for overview and subadmin management.
- `/app/subadmin`: Subadmin dashboard for their specific registrations.
- `/prisma`: Database schema and seed scripts.
- `/lib`: Server actions, auth config, and utilities.
- `/components`: Premium UI components and dashboard elements.
```
