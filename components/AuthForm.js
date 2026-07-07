'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// AuthForm is shown whenever there is no signed-in user.
// It can switch between "sign in" and "sign up" modes.
export default function AuthForm() {
  const [mode, setMode] = useState('sign-in'); // 'sign-in' | 'sign-up'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');
    setLoading(true);

    if (mode === 'sign-up') {
      // Creates a new user in Supabase Auth (auth.users table).
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setInfoMsg(
          'Account created! If email confirmation is enabled on your ' +
            'Supabase project, check your inbox before signing in.'
        );
      }
    } else {
      // Signs an existing user in with email + password.
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        setErrorMsg(error.message);
      }
      // On success, App-level onAuthStateChange listener updates the UI.
    }

    setLoading(false);
  }

  function toggleMode() {
    setMode((prev) => (prev === 'sign-in' ? 'sign-up' : 'sign-in'));
    setErrorMsg('');
    setInfoMsg('');
  }

  return (
    <div className="auth-card">
      <h2 className="auth-card__title">
        {mode === 'sign-in' ? 'Sign In' : 'Create Your Account'}
      </h2>

      <form className="todo-form todo-form--column" onSubmit={handleSubmit}>
        <input
          type="email"
          className="todo-form__input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="todo-form__input"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading
            ? 'Please wait…'
            : mode === 'sign-in'
            ? 'Sign In'
            : 'Sign Up'}
        </button>
      </form>

      {errorMsg && <p className="auth-message auth-message--error">{errorMsg}</p>}
      {infoMsg && <p className="auth-message auth-message--info">{infoMsg}</p>}

      <button type="button" className="auth-toggle" onClick={toggleMode}>
        {mode === 'sign-in'
          ? "Don't have an account? Sign Up"
          : 'Already have an account? Sign In'}
      </button>
    </div>
  );
}
