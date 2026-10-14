import { ArrowUpRight } from 'lucide-react';

const steps = [['Échangeons', 'Vous nous présentez votre projet et vos attentes.'], ['Étudions votre projet', 'Les besoins et les contraintes de votre bâtiment sont examinés.'], ['Définissons les travaux', 'Une proposition précise les interventions envisagées.'], ['Passons aux travaux', 'Le chantier prend forme selon les modalités convenues.']];

export function ProcessSection() {

  return (
    <section id="parcours" className="section wrap"><div className="section-heading"><div><div className="eyebrow">03 / VOTRE PROJET</div><h2>Tout commence<br/>par une conversation.</h2></div><a className="button outline" href="#contact">Présentez-nous votre projet <ArrowUpRight size={18}/></a></div><div className="steps">{steps.map(([title,text],i) => <article key={title}><span className="step-number">0{i+1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></section>
  );
}
