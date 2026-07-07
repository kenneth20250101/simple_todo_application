'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import TodoStats from './TodoStats';

// TodoApp is only ever rendered when there is a signed-in user.
// It owns the "todos" state and is responsible for every database
// call: reading, inserting, updating (toggle), and deleting.
//
// Because Row Level Security (RLS) is enabled on the todos table,
// Supabase automatically restricts every one of these queries to
// rows where user_id matches the signed-in user — but we still set
// user_id explicitly on insert so the row can be created at all.
export default function TodoApp({ user }) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchTodos();
    // We intentionally only run this once, when the component mounts
    // for a given signed-in user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  async function fetchTodos() {
    setLoading(true);
    setErrorMsg('');

    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      setErrorMsg(`Could not load todos: ${error.message}`);
    } else {
      setTodos(data);
    }

    setLoading(false);
  }

  async function handleAdd(title) {
    setErrorMsg('');

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title, user_id: user.id }])
      .select()
      .single();

    if (error) {
      setErrorMsg(`Could not add todo: ${error.message}`);
      return;
    }

    setTodos((prev) => [data, ...prev]);
  }

  async function handleToggle(id, currentValue) {
    setErrorMsg('');

    const { data, error } = await supabase
      .from('todos')
      .update({ is_complete: !currentValue })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      setErrorMsg(`Could not update todo: ${error.message}`);
      return;
    }

    setTodos((prev) => prev.map((todo) => (todo.id === id ? data : todo)));
  }

  async function handleDelete(id) {
    setErrorMsg('');

    const { error } = await supabase.from('todos').delete().eq('id', id);

    if (error) {
      setErrorMsg(`Could not delete todo: ${error.message}`);
      return;
    }

    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  return (
    <div className="todo-card">
      {errorMsg && <p className="auth-message auth-message--error">{errorMsg}</p>}

      <TodoForm onAdd={handleAdd} />
      <TodoStats todos={todos} />

      {loading ? (
        <p className="todo-empty">Loading your tasks…</p>
      ) : (
        <TodoList todos={todos} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </div>
  );
}
