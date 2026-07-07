'use client';

import { useState } from 'react';

// TodoItem renders a single task row backed by a Supabase record:
// { id, title, is_complete, user_id, created_at }.
// Toggling and deleting both ask the parent (TodoApp) to talk to
// Supabase, and show a small "working…" state while that happens.
export default function TodoItem({ todo, onToggle, onDelete }) {
  const [busy, setBusy] = useState(false);

  async function handleToggle() {
    setBusy(true);
    await onToggle(todo.id, todo.is_complete);
    setBusy(false);
  }

  async function handleDelete() {
    // Ask for confirmation before deleting, per the requirements.
    const confirmed = window.confirm(
      `Delete "${todo.title}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setBusy(true);
    await onDelete(todo.id);
    // No need to setBusy(false) on success — the row will unmount
    // once it's removed from the parent's state.
  }

  return (
    <li className="todo-item">
      <input
        type="checkbox"
        className="todo-item__checkbox"
        checked={todo.is_complete}
        onChange={handleToggle}
        disabled={busy}
        aria-label={`Mark "${todo.title}" as ${
          todo.is_complete ? 'incomplete' : 'complete'
        }`}
      />
      <span
        className={
          todo.is_complete
            ? 'todo-item__text todo-item__text--completed'
            : 'todo-item__text'
        }
        onClick={handleToggle}
      >
        {todo.title}
      </span>
      <button
        type="button"
        className="todo-item__delete"
        onClick={handleDelete}
        disabled={busy}
        aria-label={`Delete "${todo.title}"`}
      >
        Delete
      </button>
    </li>
  );
}
