import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import './AboutSection.css';

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches || !('IntersectionObserver' in window)) return;
    let revealed = false;
    let disposed = false;
    const reveal = () => {
      if (revealed || disposed) return;
      revealed = true;
      section.classList.remove('about-pending');
      section.classList.add('about-revealed');
      observer.disconnect();
    };
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) reveal();
    }, { threshold: 0.12 });
    const onMotionChange = () => { if (preference.matches) reveal(); };
    section.classList.add('about-pending');
    observer.observe(section);
    preference.addEventListener('change', onMotionChange);
    return () => {
      disposed = true;
      observer.disconnect();
      preference.removeEventListener('change', onMotionChange);
      section.classList.remove('about-pending', 'about-revealed');
    };
  }, []);

  return (
    <section id="entreprise" ref={sectionRef} className="about-section" aria-labelledby="about-title">
      <div className="wrap about-layout">
        <div className="about-copy">
          <div className="eyebrow">À PROPOS DE PRORENONEUF</div>
          <h2 id="about-title">Votre bâtiment,<br/><em>de nouvelles possibilités.</em></h2>
          <p>Basée à La Rochelle, ProRenoNeuf réunit des compétences en maçonnerie, rénovation et couverture. Agrandir, transformer ou entretenir : parlons des travaux qui donneront une nouvelle vie à votre bâtiment.</p>
          <div className="about-actions">
            <a className="button copper-bg" href="#contact">Parlons de votre projet <ArrowUpRight size={17} aria-hidden="true"/></a>
            <a className="text-link" href="#expertises">Découvrir nos expertises <ArrowUpRight size={16} aria-hidden="true"/></a>
          </div>
        </div>
        <figure className="about-gallery">
          <div className="about-photo-main">
            <img src="/images/hero-stone.jpg" alt="Maison contemporaine avec bardage et grandes ouvertures" width="480" height="600" loading="lazy" decoding="async"/>
          </div>
          <div className="about-photo-detail">
            <img src="/images/hero-facade.jpg" alt="Détail d’un escalier intérieur et de son parement mural" width="480" height="600" loading="lazy" decoding="async"/>
          </div>
          <figcaption>Photographies d’illustration</figcaption>
        </figure>
      </div>
    </section>
  );
}
