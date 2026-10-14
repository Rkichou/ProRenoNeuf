import { useState } from 'react';

export function Footer() {
  const [legal, setLegal] = useState(false);
  return (
    <footer className="wrap"><div className="footer-top"><a className="brand" href="#">ProReno<span className="copper">Neuf</span></a><p>Bâtir aujourd’hui. Rénover pour demain.</p><a href="#main">Retour en haut ↑</a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ProRenoNeuf</span><div><a href="#expertises">Nos expertises</a><a href="#contact">Contact</a><button onClick={() => setLegal(!legal)} aria-expanded={legal} aria-controls="legal">Informations légales</button></div></div>{legal && <div id="legal" className="legal"><h3>Informations avant publication</h3><p>Les mentions légales et la politique de confidentialité restent à compléter : identité juridique de l’éditeur, directeur de publication, coordonnées de l’hébergeur et modalités de traitement des données si un service d’envoi est ajouté.</p><p>Cette version ne transmet pas le formulaire et n’utilise ni outil de suivi ni carte intégrée. Les photographies d’illustration sont chargées depuis Unsplash.</p></div>}</footer>
  );
}
