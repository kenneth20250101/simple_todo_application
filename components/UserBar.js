'use client';

import { supabase } from '../lib/supabaseClient';

// UserBar shows who is signed in, and lets them sign out.
export default function UserBar({ user }) {
  async function handleSignOut() {
    await supabase.auth.signOut();
    // The onAuthStateChange listener in page.js will pick this up
    // and automatically switch the UI back to the AuthForm.
  }

  return (
    <div className="user-bar">
      <span className="user-bar__email" title={user.email}>
        Signed in as <strong>{user.email}</strong>
      </span>
      <button type="button" className="btn btn-secondary" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}
