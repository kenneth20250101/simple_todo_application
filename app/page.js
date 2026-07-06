'use client';

import { useState } from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import TodoStats from '../components/TodoStats';

// This is the top-level page component. It owns the "source of truth"
// state (the todos array) and passes data + handler functions down to
// the smaller components (TodoForm, TodoStats, TodoList/TodoItem).
export default function Home() {
  const [todos, setTodos] = useState([]);

  // Add a new todo to the top of the list.
  function handleAdd(text) {
    const newTodo = {
      id: Date.now(), // simple unique id, good enough without a database
      text,
      completed: false,
    };
    setTodos((prev) => [newTodo, ...prev]);
  }

  // Flip a todo's completed state by id.
  function handleToggle(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // Remove a todo by id.
  function handleDelete(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <main className="page">
      <div className="todo-app">
        <h1 className="todo-app__title">📝 ToDo App</h1>
        <p className="todo-app__subtitle">Stay organized, one task at a time.</p>

        <div className="todo-card">
          <TodoForm onAdd={handleAdd} />
          <TodoStats todos={todos} />
          <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
        </div>
      </div>
    </main>
  );
}
