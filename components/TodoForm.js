'use client';

import { useState } from 'react';

// TodoForm handles the input field and "Add" button.
// It keeps its own local state for the text being typed,
// and calls onAdd(text) from the parent when the user submits.
export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const trimmed = text.trim();
    if (trimmed === '') {
      return; // ignore empty submissions
    }

    onAdd(trimmed);
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
      />
      <button type="submit" className="btn btn-primary" disabled={text.trim() === ''}>
        Add
      </button>
    </form>
  );
}
