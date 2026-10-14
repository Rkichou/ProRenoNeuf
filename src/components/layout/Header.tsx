import { useState } from 'react';
import { ArrowUpRight, Menu, X, MapPin, House } from 'lucide-react';

export function Header() {
  const [menu, setMenu] = useState(false);
  return (
    <>
<div className="topbar"><span><MapPin size={13}/> Une entreprise à La Rochelle</span><span>Maçonnerie · Rénovation · Couverture</span></div>
    <header className="header wrap">
      <a className="brand" href="#" aria-label="ProRenoNeuf, accueil"><span className="brand-icon"><House size={29} strokeWidth={1.5}/></span><span>ProReno<span className="copper">Neuf</span><small>BÂTIR. RÉNOVER. TRANSFORMER.</small></span></a>
      <button className="menu-button" aria-label={menu ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={menu} aria-controls="navigation" onClick={() => setMenu(!menu)}>{menu ? <X/> : <Menu/>}</button>
      <nav id="navigation" className={menu ? 'nav open' : 'nav'} aria-label="Navigation principale" onClick={() => setMenu(false)}><a href="#expertises">Nos expertises</a><a href="#entreprise">L’entreprise</a><a href="#parcours">Votre projet</a><a className="nav-contact" href="#contact">Parlons de vos travaux <ArrowUpRight size={17}/></a></nav>
    </header>
</>
  );
}
