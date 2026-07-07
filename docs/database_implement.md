# database_implement.md — Stage 1 Advanced Implementation Notes

This document explains **how** the Stage 1 Advanced ToDo App is built,
**why** each piece exists, and what students should take away from it.

Stage 1 Advanced adds three things on top of the basic ToDo App:

1. Email + password authentication (sign up / sign in / sign out) via
   **Supabase Auth**
2. A real database table (`todos`) via **Supabase Database**
3. Per-user data isolation, so each signed-in user only ever sees
   their own todos

It deliberately does **not** include any multi-user "group" or
"shared list" feature — no `groups` table, no `group_id` column.
That is planned for Stage 2.

---

## 1. Purpose of each file

```
todo-app-stage1-advanced/
├── app/
│   ├── layout.js         # Root layout, loads global CSS for every page
│   ├── page.js           # Owns the auth session state; shows AuthForm
│   │                       # OR (UserBar + TodoApp) depending on sign-in status
│   └── globals.css        # All styling: colors, auth card, user bar, todo list
├── components/
│   ├── AuthForm.js        # Sign in / sign up form (toggles between modes)
│   ├── UserBar.js         # Shows the signed-in user's email + Sign Out button
│   ├── TodoApp.js         # Owns the todos state; does every Supabase query
│   │                       # (select, insert, update, delete)
│   ├── TodoForm.js        # Input field + "Add" button (calls onAdd(title))
│   ├── TodoList.js        # Renders the list, or the empty-state message
│   ├── TodoItem.js        # One task row: checkbox, text, delete (with confirm)
│   └── TodoStats.js       # Shows total / completed counts
├── lib/
│   └── supabaseClient.js  # Creates the single shared Supabase client
├── docs/
│   ├── Database_init.md      # SQL to create the table + RLS policies
│   └── database_implement.md # This file
├── .env.example           # Template showing which env vars are required
├── package.json           # Dependencies, including @supabase/supabase-js
└── next.config.js         # Default Next.js configuration
```

### Why the logic is split this way

- **`lib/supabaseClient.js`** is the *only* place that calls
  `createClient(...)`. Every component imports `supabase` from here,
  so there is exactly one client instance for the whole app.
- **`app/page.js`** is the only component that listens for auth state
  changes (`supabase.auth.onAuthStateChange`). It decides, at the top
  level, whether to show `AuthForm` or the signed-in view. This keeps
  the "am I logged in?" logic in one place instead of scattered across
  components.
- **`components/TodoApp.js`** is the only component that talks to the
  `todos` table. `TodoForm`, `TodoList`, `TodoItem`, and `TodoStats`
  don't know Supabase exists — they just receive data and callback
  functions as props. This is the same "state lives in one place, data
  flows down through props" pattern from the basic version, just with
  Supabase as the source of truth instead of local `useState`.

---

## 2. Where to put the Supabase URL and Anon Key

1. In your Supabase project dashboard, go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon / public** key.
3. In your project folder, copy `.env.example` to a new file named
   `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
4. Fill in the two values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```
5. Restart the dev server (`npm run dev`) so Next.js picks up the new
   environment variables.

`.env.local` is already listed in `.gitignore`, so it will **not** be
committed to git — this keeps your keys out of your repository history.

The `NEXT_PUBLIC_` prefix matters: Next.js only exposes environment
variables to the browser if their name starts with `NEXT_PUBLIC_`.
The anon key is *designed* to be used in the browser — it's not a
secret — as long as Row Level Security is configured correctly (see
below). Never put your Supabase **service_role** key in a
`NEXT_PUBLIC_` variable; that key bypasses RLS entirely and must only
ever be used in trusted server-side code (not part of this stage).

---

## 3. Why `user_id` is needed

Every row in the `todos` table has a `user_id` column that stores the
id of the Supabase Auth user who created it (`auth.uid()`).

Without `user_id`, there would be no way to know *which* signed-in
user a given todo belongs to — the database would just be one giant
shared list. Storing `user_id` on every row is what makes "each user
has their own list" possible at all:

- When adding a todo, the app sets `user_id: user.id` on insert.
- When reading, updating, or deleting, the database (via RLS policies)
  compares `user_id` against the currently authenticated user before
  allowing the operation.

This is the same idea as a `foreign key` linking orders to a
customer in any traditional multi-user application — it's how a
shared table supports many independent users.

---

## 4. Why Row Level Security (RLS) is needed

The Supabase **anon key** used in the browser is not a secret — anyone
who opens your app's dev tools can see it. That's fine *only if* the
database itself refuses to let that key do anything it shouldn't.

Row Level Security is the mechanism that enforces this at the database
level, not just in your JavaScript code:

- Without RLS: any signed-in (or even anonymous) user with the anon
  key could `select * from todos` and see **everyone's** tasks, or
  delete rows that aren't theirs, no matter what the frontend code
  tries to prevent.
- With RLS **enabled** and correct policies: even if someone bypasses
  your UI entirely and calls the Supabase API directly, the database
  itself will only return or accept rows where `auth.uid() = user_id`.

In short: **your React code enforces the UI experience, but RLS
enforces actual data security.** Never rely on frontend code alone to
protect user data.

---

## 5. Environment variables needed on Vercel

When deploying to Vercel, open your project's **Settings →
Environment Variables** and add:

| Name                              | Value                                   |
|------------------------------------|------------------------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`         | Your Supabase Project URL                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY`    | Your Supabase anon/public key             |

Add them for all environments you plan to use (Production, Preview,
Development). After adding or changing environment variables, you must
**redeploy** the project for the change to take effect (Vercel does
not hot-reload env vars into an existing deployment).

No other environment variables are required for Stage 1 Advanced.

---

## Data flow summary (for students)

1. **Sign up / sign in** → `AuthForm` calls
   `supabase.auth.signUp(...)` or
   `supabase.auth.signInWithPassword(...)`.
2. Supabase Auth creates/validates the user and returns a session.
   `page.js`'s `onAuthStateChange` listener picks this up automatically
   and re-renders the app.
3. **Reading todos** → `TodoApp` calls
   `supabase.from('todos').select('*')` on mount. RLS silently filters
   this to only the signed-in user's rows.
4. **Adding a todo** → `TodoApp` calls
   `supabase.from('todos').insert([{ title, user_id: user.id }])`.
   RLS's `insert` policy checks that `user_id` matches the caller
   before allowing the row to be created.
5. **Toggling complete** → `TodoApp` calls
   `supabase.from('todos').update({ is_complete: !current }).eq('id', id)`.
   RLS's `update` policy makes sure you can only update your own rows.
6. **Deleting** → `TodoItem` first asks for confirmation with
   `window.confirm(...)`; if confirmed, `TodoApp` calls
   `supabase.from('todos').delete().eq('id', id)`. RLS's `delete`
   policy makes sure you can only delete your own rows.
7. **Sign out** → `UserBar` calls `supabase.auth.signOut()`, which
   clears the session; the `onAuthStateChange` listener switches the
   UI back to `AuthForm`.

## Stage 1 acceptance checklist

- [ ] Users can sign up with email + password
- [ ] Users can sign in with email + password
- [ ] Users can sign out
- [ ] The ToDo App is only visible after signing in
- [ ] Todos are saved to Supabase (visible in Table Editor)
- [ ] Todos still exist after refreshing the page
- [ ] Two different accounts cannot see each other's todos
- [ ] The app deploys and runs correctly on Vercel with the two
      `NEXT_PUBLIC_SUPABASE_*` environment variables set
