'use client';

import { useState } from 'react';

// TodoForm handles the input field and "Add" button.
// It keeps its own local state for the text being typed,
// and calls onAdd(title) from the parent when the user submits.
// onAdd is async here because it talks to Supabase, so we disable
// the button while the request is in flight to avoid double-submits.
export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const trimmed = text.trim();
    if (trimmed === '') {
      return; // ignore empty submissions
    }

    setSubmitting(true);
    await onAdd(trimmed);
    setSubmitting(false);
    setText(''); // clear the input after adding
  }

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        className="todo-form__input"
        type="text"
        placeholder="What do you need to do?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        aria-label="New task"
        disabled={submitting}
      />
      <button
        type="submit"
        className="btn btn-primary"
        disabled={text.trim() === '' || submitting}
      >
        {submitting ? 'Adding…' : 'Add'}
      </button>
    </form>
  );
}
