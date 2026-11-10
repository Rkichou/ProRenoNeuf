import { useEffect, useState, type FormEvent } from 'react';
import { onIdTokenChanged, signInWithEmailAndPassword, signOut, type User } from 'firebase/auth';
import { getAdminAuth } from './auth';
import { RequestsList } from './RequestsList';
import './admin.css';

type Session = { state: 'checking' | 'signedOut' | 'denied' | 'error' } | { state: 'allowed'; user: User };

export default function AdminPage() {
  const [session, setSession] = useState<Session>({ state: 'checking' });
  const [attempt, setAttempt] = useState(0);
  const [logoutError, setLogoutError] = useState(false);
  useEffect(() => {
    let active = true;
    let version = 0;
    let unsubscribe: (() => void) | undefined;
    setSession({ state: 'checking' });
    try {
      const auth = getAdminAuth();
      if (!auth) { setSession({ state: 'error' }); return; }
      unsubscribe = onIdTokenChanged(auth, async user => {
        const current = ++version;
        setSession({ state: 'checking' });
        if (!user) { setSession({ state: 'signedOut' }); return; }
        try {
          const token = await user.getIdTokenResult();
          if (active && current === version) setSession(token.claims.admin === true ? { state: 'allowed', user } : { state: 'denied' });
        } catch {
          if (active && current === version) setSession({ state: 'error' });
        }
      }, () => { version++; if (active) setSession({ state: 'error' }); });
    } catch { setSession({ state: 'error' }); }
    return () => { active = false; version++; unsubscribe?.(); };
  }, [attempt]);

  async function logout() {
    setSession({ state: 'checking' });
    setLogoutError(false);
    try {
      const auth = getAdminAuth();
      if (!auth) throw new Error();
      await signOut(auth);
      setSession({ state: 'signedOut' });
    } catch { setLogoutError(true); setSession({ state: 'error' }); }
  }

  return <main className="admin-page">
    <header className="admin-header"><a href="/" aria-label="Retour au site ProRenoNeuf">ProReno<span>Neuf</span></a><span>Administration</span></header>
    {session.state === 'checking' && <p role="status">Vérification de votre session…</p>}
    {session.state === 'signedOut' && <Login />}
    {session.state === 'denied' && <section className="admin-panel"><h1>Accès réservé</h1><p>Ce compte ne possède pas les droits administrateur.</p><button onClick={logout}>Se déconnecter</button></section>}
    {session.state === 'error' && <section className="admin-panel"><h1>Session indisponible</h1><p role="alert">{logoutError ? 'La déconnexion a échoué. Les demandes ont été masquées.' : 'Impossible de vérifier votre accès. Vérifiez la configuration Firebase ou réessayez.'}</p><div className="admin-actions"><button onClick={() => setAttempt(value => value + 1)}>Réessayer</button><button onClick={logout}>Se déconnecter</button></div></section>}
    {session.state === 'allowed' && <><div className="admin-toolbar"><div><h1>Demandes de contact</h1><p>Consultation des messages reçus depuis le site.</p></div><button onClick={logout}>Se déconnecter</button></div><RequestsList key={session.user.uid} /></>}
  </main>;
}

function Login() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    setBusy(true); setError('');
    try {
      const auth = getAdminAuth();
      if (!auth) throw new Error();
      await signInWithEmailAndPassword(auth, email, password);
    } catch { setError('Connexion impossible. Vérifiez vos identifiants ou réessayez plus tard.'); }
    finally { setBusy(false); }
  }
  return <section className="admin-panel admin-login"><div className="admin-kicker">ESPACE RÉSERVÉ</div><h1>Connexion administrateur</h1><p>Connectez-vous pour consulter les demandes de projets.</p><form onSubmit={submit} aria-busy={busy}><label htmlFor="admin-email">Adresse e-mail</label><input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={254} disabled={busy} /><label htmlFor="admin-password">Mot de passe</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required disabled={busy} />{error && <p className="admin-error" role="alert">{error}</p>}<button disabled={busy} type="submit">{busy ? 'Connexion…' : 'Se connecter'}</button></form><a className="admin-back" href="/">← Retour au site</a></section>;
}
