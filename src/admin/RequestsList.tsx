import { useEffect, useState } from 'react';
import { collection, documentId, getDocsFromServer, limit, orderBy, query, startAfter, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
import { getFirestoreDb } from '../lib/firebase';

type Cursor = QueryDocumentSnapshot<DocumentData> | undefined;
type RequestRow = { id: string; name: string; contact: string; service: string; message: string; status: string; source: string; date: Date | null };
const pageSize = 20;
const format = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Paris' });
const string = (value: unknown) => typeof value === 'string' ? value : 'Non renseigné';
export function contactHref(contact: string) {
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) return `mailto:${encodeURIComponent(contact)}`;
  if (/^\+?[\d\s().-]{10,20}$/.test(contact) && contact.replace(/\D/g, '').length >= 10) return `tel:${contact.replace(/[^\d+]/g, '')}`;
  return undefined;
}

export function RequestsList() {
  const [navigation, setNavigation] = useState<{ after: Cursor; history: Cursor[] }>({ after: undefined, history: [] });
  const [reload, setReload] = useState(0);
  const [rows, setRows] = useState<RequestRow[]>([]);
  const [next, setNext] = useState<Cursor>();
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  useEffect(() => {
    let active = true;
    setState('loading'); setRows([]); setNext(undefined);
    async function load() {
      try {
        const db = getFirestoreDb();
        if (!db) throw new Error();
        const constraints = [orderBy('createdAt', 'desc'), orderBy(documentId(), 'desc'), ...(navigation.after ? [startAfter(navigation.after)] : []), limit(pageSize + 1)];
        const snapshot = await getDocsFromServer(query(collection(db, 'contactRequests'), ...constraints));
        if (!active) return;
        const docs = snapshot.docs.slice(0, pageSize);
        setRows(docs.map(doc => {
          const data = doc.data();
          const date = typeof data.createdAt?.toDate === 'function' ? data.createdAt.toDate() : null;
          return { id: doc.id, name: string(data.name), contact: string(data.contact), service: string(data['service']), message: string(data.message), status: string(data.status), source: string(data.source), date: date instanceof Date && !Number.isNaN(date.getTime()) ? date : null };
        }));
        setNext(snapshot.docs.length > pageSize ? docs[docs.length - 1] : undefined);
        setState('ready');
      } catch { if (active) { setRows([]); setState('error'); } }
    }
    void load();
    return () => { active = false; };
  }, [navigation, reload]);

  function refresh() { setRows([]); setState('loading'); setNavigation({ after: undefined, history: [] }); setReload(value => value + 1); }
  return <section aria-label="Liste des demandes" aria-busy={state === 'loading'}>
    <div className="admin-list-heading"><p>Page {navigation.history.length + 1} · 20 demandes maximum</p><button disabled={state === 'loading'} onClick={refresh}>Actualiser</button></div>
    <div role="status" aria-live="polite">{state === 'loading' && <p>Chargement des demandes…</p>}{state === 'ready' && rows.length === 0 && <p>Aucune demande sur cette page.</p>}</div>
    {state === 'error' && <div className="admin-error" role="alert"><p>Impossible de charger les demandes. Vérifiez votre connexion et vos droits d’accès.</p><button onClick={() => setReload(value => value + 1)}>Réessayer</button></div>}
    {state === 'ready' && <div className="admin-requests">{rows.map(row => <article className="admin-request" key={row.id}>
      <div className="admin-request-heading"><h2>{row.name}</h2><span className="admin-status">{row.status === 'new' ? 'Nouveau' : row.status}</span></div>
      <dl><div><dt>Contact</dt><dd>{contactHref(row.contact) ? <a href={contactHref(row.contact)}>{row.contact}</a> : row.contact}</dd></div><div><dt>Travaux</dt><dd>{row.service}</dd></div><div><dt>Réception · heure de Paris</dt><dd>{row.date ? <time dateTime={row.date.toISOString()}>{format.format(row.date)}</time> : 'Date indisponible'}</dd></div><div><dt>Origine</dt><dd>{row.source === 'website' ? 'Site internet' : row.source}</dd></div></dl>
      <details><summary>Lire le message complet</summary><p className="admin-message">{row.message}</p></details>
    </article>)}</div>}
    <nav className="admin-pagination" aria-label="Pagination des demandes"><button disabled={state === 'loading' || navigation.history.length === 0} onClick={() => { setRows([]); setState('loading'); setNavigation({ after: navigation.history[navigation.history.length - 1], history: navigation.history.slice(0, -1) }); }}>Précédent</button><span>Page {navigation.history.length + 1}</span><button disabled={state !== 'ready' || !next} onClick={() => { setRows([]); setState('loading'); setNavigation({ after: next, history: [...navigation.history, navigation.after] }); }}>Suivant</button></nav>
  </section>;
}
