import { useEffect, useMemo, useState } from 'react';
import { collection, onSnapshot, query, where, type DocumentData } from 'firebase/firestore';
import { getTestimonialsDb } from '../../lib/firebase';
import './TestimonialsSection.css';

type Testimonial = { id: string; name: string; score: number; review: string };

function readTestimonials(data: DocumentData, id: string): Testimonial | null {
  if (typeof data.name !== 'string' || typeof data.review !== 'string') return null;
  return { id, name: data.name, score: Number(data.score) || 0, review: data.review };
}

function splitColumns(items: Testimonial[]) {
  return [items.filter((_, i) => i % 3 === 0), items.filter((_, i) => i % 3 === 1), items.filter((_, i) => i % 3 === 2)].filter(Boolean);
}

export function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [state, setState] = useState<'loading' | 'ready' | 'empty' | 'error'>('loading');
  useEffect(() => {
    const db = getTestimonialsDb();
    if (!db) { setState('empty'); return; }
    const testimonialsQuery = query(collection(db, 'testimonials'), where('published', '==', true));
    return onSnapshot(testimonialsQuery, snapshot => {
      const next = snapshot.docs.map(doc => ({ item: readTestimonials(doc.data(), doc.id), createdAt: doc.data().createdAt?.toMillis?.() ?? 0 })).filter((entry): entry is { item: Testimonial; createdAt: number } => entry.item !== null).sort((a, b) => b.createdAt - a.createdAt).map(entry => entry.item);
      setItems(next); setState(next.length ? 'ready' : 'empty');
    }, () => setState('error'));
  }, []);

  const columns = useMemo(() => splitColumns(items), [items]);
  return <section id="avis" className="testimonials-section" aria-labelledby="testimonials-title">
    <div className="wrap">
      <div className="testimonials-heading">
        <div className="eyebrow">ILS NOUS FONT CONFIANCE</div>
        <h2 id="testimonials-title">Ce que nos clients<br/><em>pensent de leur projet.</em></h2>
        <p>Des retours partagés par les clients de ProRenoNeuf sur Google.</p>
      </div>
      {state === 'loading' && <p className="testimonials-status" role="status">Chargement des avis…</p>}
      {state === 'error' && <p className="testimonials-status" role="status">Les avis ne sont pas disponibles pour le moment.</p>}
      {state === 'empty' && <p className="testimonials-status" role="status">Les avis seront bientôt disponibles.</p>}
      {state === 'ready' && <div className="testimonials-mask" aria-label="Avis clients" aria-live="polite">
        <div className="testimonials-columns">
          {columns.map((column, columnIndex) => <div className={`testimonial-column testimonial-column-${columnIndex}`} key={columnIndex}>
            <div className="testimonial-track">
              {[...column, ...column].map((item, index) => <article className="testimonial-card" key={`${item.id}-${index}`} aria-hidden={index >= column.length}>
                <p>“{item.review}”</p><div className="testimonial-person"><span className="testimonial-avatar" aria-hidden="true">{item.name.trim().charAt(0).toUpperCase()}</span><div><strong>{item.name}</strong><span>{'★'.repeat(Math.min(5, item.score))} <small>{item.score}/5</small></span></div></div>
              </article>)}
            </div>
          </div>)}
        </div>
      </div>}
    </div>
  </section>;
}
