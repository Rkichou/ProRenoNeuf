import { ArrowUpRight, House, Check } from 'lucide-react';

export function AboutSection() {

  return (
    <section id="entreprise" className="about"><div className="wrap about-grid"><figure><img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1100&q=85" alt="Architecture contemporaine aux lignes épurées" loading="lazy" width="1100" height="900"/><figcaption>Architecture — photographie d’illustration</figcaption><div className="image-label"><House size={25}/><span>Implantés à<br/><strong>La Rochelle</strong></span></div></figure><div className="about-content"><div className="eyebrow">02 / L’ENTREPRISE</div><h2>Faire évoluer votre bâti.<br/><em>Donner forme à vos idées.</em></h2><p>Basée à La Rochelle, ProRenoNeuf intervient dans la construction et la rénovation immobilière, avec des compétences en maçonnerie, couverture et façades.</p><p>Agrandir une maison, rénover une salle de bain ou entretenir une toiture : chaque projet commence par comprendre le bâtiment et ce que vous souhaitez en faire.</p><div className="about-points"><span><Check size={17}/> Des métiers complémentaires</span><span><Check size={17}/> Des travaux adaptés à votre bâtiment</span><span><Check size={17}/> Un échange direct sur votre projet</span></div><a className="text-link" href="#contact">Faisons connaissance <ArrowUpRight size={19}/></a></div></div></section>
  );
}
