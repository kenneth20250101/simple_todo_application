'use client';

// TodoItem renders a single task: a checkbox to toggle completion,
// the task text (strikethrough when completed), and a delete button.
export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        className="todo-item__checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      <span
        className={
          todo.completed ? 'todo-item__text todo-item__text--completed' : 'todo-item__text'
        }
        onClick={() => onToggle(todo.id)}
      >
        {todo.text}
      </span>
      <button
        type="button"
        className="todo-item__delete"
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.text}"`}
      >
        Delete
      </button>
    </li>
  );
}
