import { ArrowUpRight } from 'lucide-react';
import { services } from '../../data/services';
import './ServicesSection.css';

export function ServicesSection() {
  return (
    <section id="expertises" className="section wrap">
      <div className="section-heading">
        <div><div className="eyebrow">01 / NOS EXPERTISES</div><h2>Du gros œuvre<br/>aux derniers détails.</h2></div>
        <p>Construire, rénover, protéger : des compétences complémentaires pour les différentes étapes de votre projet.</p>
      </div>
      <div className="services">
        {services.map((service, index) => (
          <article className="service" key={service.title}>
            <div className="service-photo">
              <img
                src={service.image}
                alt={service.imageAlt}
                style={{ objectPosition: service.imagePosition }}
                width="640"
                height="480"
                loading="lazy"
                decoding="async"
                onError={event => {
                  const image = event.currentTarget;
                  if (image.dataset.fallback) return;
                  image.dataset.fallback = 'true';
                  image.src = '/images/building-fallback.svg';
                  image.alt = 'Illustration de bâtiment, image de remplacement';
                }}
              />
            </div>
            <div className="service-top"><service.icon size={32} strokeWidth={1.3}/><span>0{index + 1}</span></div>
            <h3>{service.title}</h3>
            <p className="service-tag">{service.text}</p>
            <p>{service.items}</p>
          </article>
        ))}
      </div>
      <p className="services-photo-note">Photographies d’illustration</p>
    </section>
  );
}
