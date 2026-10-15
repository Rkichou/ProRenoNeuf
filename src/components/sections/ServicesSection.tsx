import { ArrowUpRight } from 'lucide-react';
import { services } from '../../data/services';
import { useEffect, useRef, type CSSProperties } from 'react';
import './ServicesSection.css';

export function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = Array.from(section.querySelectorAll<HTMLElement>('[data-service-reveal]'));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('service-pending');
        entry.target.classList.add('service-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08 });
    const showAll = () => {
      observer.disconnect();
      elements.forEach(element => element.classList.remove('service-pending', 'service-revealed'));
    };
    const onPreference = () => { if (preference.matches) showAll(); };
    const onFocus = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const element = event.target.closest('[data-service-reveal]');
      if (!element) return;
      element.classList.remove('service-pending', 'service-revealed');
      observer.unobserve(element);
    };
    if (!preference.matches) elements.forEach(element => {
      if (element.contains(document.activeElement)) return;
      element.classList.add('service-pending');
      observer.observe(element);
    });
    preference.addEventListener('change', onPreference);
    section.addEventListener('focusin', onFocus);
    return () => {
      showAll();
      preference.removeEventListener('change', onPreference);
      section.removeEventListener('focusin', onFocus);
    };
  }, []);

  return (
    <section id="expertises" ref={sectionRef} className="section wrap services-section">
      <div className="section-heading" data-service-reveal>
        <div><div className="eyebrow">01 / NOS EXPERTISES</div><h2>Du gros œuvre<br/>aux derniers détails.</h2></div>
        <p>Construire, rénover, protéger : des compétences complémentaires pour les différentes étapes de votre projet.</p>
      </div>
      <div className="services">
        {services.map((service, index) => (
          <article className="service" key={service.title} data-service-reveal
            style={{ '--service-delay': `${120 + index * 80}ms` } as CSSProperties}>
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
