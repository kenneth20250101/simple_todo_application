# ToDo App (Next.js, App Router, JavaScript)

A simple, beginner-friendly ToDo app built to help you learn:
- React **components** (breaking UI into small reusable pieces)
- React **state** (`useState`)
- **Event handling** (form submit, click, checkbox change)
- Basic **deployment** to Vercel

No database, no login, no TypeScript, no Tailwind — just plain JavaScript
and plain CSS, so it's easy to read and modify.

## Project structure

```
todo-app/
├── app/
│   ├── layout.js       # Root layout, wraps every page, loads global CSS
│   ├── page.js         # Main page: holds the todos state, ties everything together
│   └── globals.css     # All styling (colors, layout, buttons, responsive rules)
├── components/
│   ├── TodoForm.js      # Input field + "Add" button
│   ├── TodoList.js      # Renders the list of tasks, or an empty-state message
│   ├── TodoItem.js      # A single task row (checkbox, text, delete button)
│   └── TodoStats.js     # Shows total task count and completed count
├── package.json         # Project dependencies and scripts
├── next.config.js       # Next.js configuration (default settings)
└── .gitignore           # Files/folders git should ignore (node_modules, .next, etc.)
```

## How the pieces fit together

1. **`app/page.js`** is a client component (`'use client'`) that owns the
   list of todos in state: `const [todos, setTodos] = useState([])`.
   It defines three functions — `handleAdd`, `handleToggle`, `handleDelete`
   — and passes them down as props to the child components.
2. **`TodoForm`** manages its own local state for the text being typed.
   When the form is submitted, it calls `onAdd(text)`, which was passed
   down from `page.js`.
3. **`TodoStats`** simply reads the `todos` array it's given and computes
   the total count and completed count — it has no state of its own.
4. **`TodoList`** decides whether to show the empty-state message or map
   over `todos` and render a `TodoItem` for each one.
5. **`TodoItem`** renders one task. Clicking the checkbox or the text
   calls `onToggle(id)`; clicking "Delete" calls `onDelete(id)`.

This is the standard React pattern: **state lives in one place (the
parent), and data + functions flow down through props.**

## Running the project locally

Dependencies were **not** installed for you, so the first thing you need
to do is install them:

```bash
npm install
```

Then start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The
page will hot-reload as you edit files.

## Deploying to Vercel

You have two easy options:

**Option A — Vercel CLI**
```bash
npm install -g vercel
vercel
```
Follow the prompts (you can accept all the defaults). Vercel will build
and deploy the app and give you a live URL.

**Option B — GitHub + Vercel dashboard**
1. Push this project to a new GitHub repository.
2. Go to [vercel.com](https://vercel.com), click "New Project", and
   import your repository.
3. Vercel automatically detects it's a Next.js app — no configuration
   needed. Click "Deploy".

Either way, Vercel runs `npm install` and `npm run build` for you, so you
don't need to build anything locally first.

## Ideas for extending this app (next steps for students)

- Persist todos in `localStorage` so they survive a page refresh.
- Add an "edit task" feature (double-click to rename).
- Add filters: "All / Active / Completed".
- Add a "Clear completed" button.
- Once comfortable, connect a real database (e.g. with a backend API
  route or a service like Supabase) for a "stage two" version of the app.
