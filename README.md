# ToDo App — Stage 1 Advanced (Next.js + Supabase Auth + Database)

This upgrades the basic ToDo App with:
- Email + password **authentication** (sign up / sign in / sign out) via Supabase Auth
- A real **database** table (`todos`) via Supabase
- **Per-user data isolation** using `user_id` + Row Level Security (RLS)

Still: no TypeScript, no Tailwind — plain JavaScript and plain CSS.

No group / shared-list feature yet — that's Stage 2.

## What's new compared to the basic version

| Concept | Where it lives |
|---|---|
| Supabase client | `lib/supabaseClient.js` |
| Sign in / sign up | `components/AuthForm.js` |
| Sign out + current user email | `components/UserBar.js` |
| Database reads/writes (CRUD) | `components/TodoApp.js` |
| Auth session management | `app/page.js` |

See **`docs/database_implement.md`** for a full explanation of every
file, why `user_id` and RLS matter, and which environment variables
you need. See **`docs/Database_init.md`** for the SQL to set up your
Supabase table.

## 1. Set up Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the SQL in `docs/Database_init.md`.
   This creates the `todos` table, enables Row Level Security, and
   adds the select/insert/update/delete policies.
3. Go to **Project Settings → API** and copy your **Project URL** and
   **anon/public key**.

## 2. Configure environment variables locally

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in the two values from step 1:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 3. Install dependencies and run locally

Dependencies were **not** installed for you — install them first:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You should see a
sign in / sign up card. Create an account, sign in, and start adding
todos.

> Note: depending on your Supabase project's Auth settings, email
> confirmation may be required after sign up before you can sign in.
> You can turn this off for local testing under **Authentication →
> Providers → Email → Confirm email**.

## 4. Deploy to Vercel

1. Push this project to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) → **New Project** → import
   your repository.
3. Before deploying, add the environment variables under **Settings →
   Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel runs `npm install` and `npm run build` for
   you automatically.

## mXGINlntt9r9Px1u
## Stage 1 acceptance criteria

- [x] Users can sign up
- [x] Users can sign in
- [x] Users can sign out
- [x] The ToDo App is only visible after signing in
- [x] Todos are saved to Supabase
- [x] Todos still exist after refreshing
- [x] Different accounts cannot see each other's todos
- [x] The app can be deployed correctly to Vercel

## What's next (Stage 2 preview)

Stage 2 will introduce shared/group todo lists (a `groups` table and a
`group_id` column). Nothing in this stage needs to change to support
that later — it's intentionally left out for now so the auth + RLS
fundamentals stay easy to follow.
