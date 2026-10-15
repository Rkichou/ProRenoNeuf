import { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import './Header.css';
import { useEffect } from 'react';

export function Header() {
  const [menu, setMenu] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      if (y <= 100) {
        setHidden(false);
        previousY = y;
      } else if (Math.abs(y - previousY) >= 6) {
        setHidden(y > previousY);
        previousY = y;
      }
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className={`header-sticky${hidden && !menu ? ' header-sticky-hidden' : ''}`}>
    <header className="header wrap">
      <a className="brand" href="#" aria-label="ProRenoNeuf, accueil"><img className="brand-logo" src="/images/Logo.png" alt="ProRenoNeuf" /></a>
      <button className="menu-button" aria-label={menu ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
      <nav id="navigation" className={menu ? 'nav open' : 'nav'} aria-label="Navigation principale" onClick={() => setMenu(false)}><a href="#expertises">Nos expertises</a><a href="#entreprise">L’entreprise</a><a href="#realisations">Nos réalisations</a><a href="#avis">Avis clients</a><a href="#localisation">Localisation</a><a href="#parcours">Votre projet</a><a className="nav-contact" href="#contact">Parlons de vos travaux <ArrowUpRight size={17}/></a></nav>
    </header>
</div>
  );
}

