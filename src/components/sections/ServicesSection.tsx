import { ArrowUpRight } from 'lucide-react';
import { services } from '../../data/services';

export function ServicesSection() {

  return (
    <section id="expertises" className="section wrap"><div className="section-heading"><div><div className="eyebrow">01 / NOS EXPERTISES</div><h2>Du gros œuvre<br/>aux derniers détails.</h2></div><p>Construire, rénover, protéger : des compétences complémentaires pour les différentes étapes de votre projet.</p></div><div className="services">{services.map((s,i) => <article className="service" key={s.title}><div className="service-top"><s.icon size={32} strokeWidth={1.3}/><span>0{i+1}</span></div><h3>{s.title}</h3><p className="service-tag">{s.text}</p><p>{s.items}</p><a href="#contact">Parlons de votre projet <ArrowUpRight size={18}/></a></article>)}</div></section>
  );
}
