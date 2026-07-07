'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import AuthForm from '../components/AuthForm';
import TodoApp from '../components/TodoApp';
import UserBar from '../components/UserBar';

// Home is the only route in this app. It is responsible for:
// 1. Checking whether a user is currently signed in (on load)
// 2. Listening for auth changes (sign in / sign up / sign out)
// 3. Rendering AuthForm when signed out, or UserBar + TodoApp when signed in
export default function Home() {
  // `undefined` = "we haven't checked yet" (show a loading state)
  // `null`      = "checked, and nobody is signed in"
  // an object   = "the current session"
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    // Check for an existing session when the app first loads
    // (e.g. the user refreshed the page but was already signed in).
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Subscribe to future auth changes: sign in, sign up, sign out,
    // and token refreshes are all reported here.
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    // Clean up the subscription when this component unmounts.
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const user = session?.user;

  return (
    <main className="page">
      <div className="todo-app">
        <h1 className="todo-app__title">📝 ToDo App</h1>
        <p className="todo-app__subtitle">Stage 1 Advanced — with accounts &amp; a database.</p>

        {session === undefined && (
          <p className="todo-empty">Checking your session…</p>
        )}

        {session === null && <AuthForm />}

        {user && (
          <>
            <UserBar user={user} />
            <TodoApp user={user} />
          </>
        )}
      </div>
    </main>
  );
}
