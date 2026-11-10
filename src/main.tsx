import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { lazy, Suspense } from 'react';
import './style.css';
import './section-atmosphere.css';

const isAdmin = /^\/admin(?:\/|$)/.test(window.location.pathname);
const Page = isAdmin ? lazy(() => import('./admin/AdminPage')) : lazy(() => import('./App'));
if (isAdmin) {
  document.title = 'Administration — ProRenoNeuf';
  const robots = document.createElement('meta');
  robots.name = 'robots';
  robots.content = 'noindex, nofollow';
  document.head.appendChild(robots);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<p role="status">Chargement…</p>}><Page /></Suspense>
  </StrictMode>,
);
