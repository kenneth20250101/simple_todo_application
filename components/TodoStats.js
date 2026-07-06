'use client';

// TodoStats shows a small summary bar: total tasks and how many are completed.
export default function TodoStats({ todos }) {
  const total = todos.length;
  const completed = todos.filter((todo) => todo.completed).length;

  return (
    <div className="todo-stats">
      <span className="todo-stats__item">
        Total: <strong>{total}</strong>
      </span>
      <span className="todo-stats__item">
        Completed: <strong>{completed}</strong>
      </span>
    </div>
  );
}
