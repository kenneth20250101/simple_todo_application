'use client';

import TodoItem from './TodoItem';

// TodoList shows either the empty-state message (no tasks yet)
// or the list of TodoItem rows.
export default function TodoList({ todos, onToggle, onDelete }) {
  if (todos.length === 0) {
    return (
      <p className="todo-empty">No tasks yet. Add your first task above! 🎉</p>
    );
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </ul>
  );
}
