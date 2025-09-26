# UMKM Studio

A production-ready MVP built with Next.js 14, Supabase Auth, Tailwind CSS, shadcn/ui and Firebase Hosting. Users can sign in, upload an image with a caption, and trigger an n8n workflow.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set environment variables by copying `.env.example` to `.env.local` and filling in your credentials:
   ```bash
   cp .env.example .env.local
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the app.

## Building & Exporting

To create a production build and attempt a static export:

```bash
npm run build && npm run export
```

If static export is not fully supported for your use case, deploy using dynamic hosting (e.g., Cloud Run) instead of static hosting.

## Firebase Hosting Deployment

1. Install the Firebase CLI if you haven't already and log in:
   ```bash
   npm install -g firebase-tools
   firebase login
   ```
2. Initialize hosting (only needed once):
   ```bash
   firebase init hosting
   ```
   - Select **Use an existing project** or create a new one.
   - Set the public directory to `out` if you're using static export or `.` if deploying a server build.
   - Configure as a single-page app when prompted.
3. Set environment variables for your hosting target. For Firebase Hosting with Cloud Run or SSR, configure them using:
   ```bash
   firebase functions:config:set supabase.url="<your-url>" supabase.anon_key="<your-key>" n8n.webhook_url="<your-webhook>"
   ```
   For static hosting, ensure `.env.local` values are baked into the build step before deploying.
4. Deploy your site:
   ```bash
   firebase deploy
   ```

## Environment Variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous public API key |
| `N8N_WEBHOOK_URL` | Fully qualified URL to your n8n webhook |

Ensure these variables are available during build and runtime. For Firebase Hosting static deployments, they must be defined before running `npm run build`.

## Tech Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS + shadcn/ui
- Supabase Auth
- Framer Motion animations
- react-hot-toast notifications
- Firebase Hosting ready

## Project Structure

```
app/
  (auth)/login
  api/generate
  dashboard
components/
  auth/
  dashboard/
  providers/
  ui/
lib/
types/
```

## Notes

- Authenticated routes are protected via `middleware.ts`.
- `getUser()` helper fetches the user session on the server.
- `/api/generate` validates the Supabase JWT and forwards uploads to the configured n8n webhook.
