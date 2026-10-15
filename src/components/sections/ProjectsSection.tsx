import { ArrowUpRight } from 'lucide-react';
import CardDeckCarousel from '../ui/card-deck-carousel';
import { projects, projectsIllustrative } from '../../data/projects';
import './ProjectsSection.css';

export function ProjectsSection() {
  return <section id="realisations" className="section wrap projects-section" aria-labelledby="projects-title">
    <div className="projects-copy">
      <div className="eyebrow">EN IMAGES</div>
      <h2 id="projects-title">Nos réalisations</h2>
      <p>Façades, terrasses, rénovation intérieure et couverture : découvrez nos projets en images.</p>
      {projectsIllustrative && <p className="projects-notice">Aperçu de la galerie — photographies d’illustration, à remplacer par nos chantiers.</p>}
      <a className="button copper-bg" href="#contact">Parlons de votre projet <ArrowUpRight size={17}/></a>
      <p className="projects-help">Parcourez les photos avec les flèches ou faites glisser la carte.</p>
    </div>
    <CardDeckCarousel slides={projects}/>
  </section>;
}
