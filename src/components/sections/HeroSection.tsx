import { useEffect, useRef } from 'react';
import { ArrowUpRight, Phone } from 'lucide-react';
import './HeroSection.css';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce), (max-width: 780px)');
    let visible = false;
    let frame = 0;
    let listening = false;
    const update = () => {
      frame = 0;
      if (!visible || preference.matches) return;
      const offset = Math.max(-48, Math.min(48, -section.getBoundingClientRect().top * 0.12));
      image.style.transform = 'translate3d(0,' + offset + 'px,0)';
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      const enabled = visible && !preference.matches;
      if (enabled && !listening) {
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
      } else if (!enabled && listening) {
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
      }
      listening = enabled;
      if (preference.matches) image.style.transform = '';
      if (enabled) schedule();
    };
    // Without IntersectionObserver, keep a static, fully visible hero.
    const observer = 'IntersectionObserver' in window ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }) : null;
    observer?.observe(section);
    preference.addEventListener('change', sync);
    return () => {
      observer?.disconnect();
      preference.removeEventListener('change', sync);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      cancelAnimationFrame(frame);
      image.style.transform = '';
    };
  }, []);

  return (
    <section className="photo-hero" ref={sectionRef} aria-labelledby="hero-title">
      <div className="photo-hero-visual" aria-hidden="true">
        <img ref={imageRef} src="/images/hero-couvreur.jpg" alt="" width="1672" height="941"
          fetchPriority="high" loading="eager" decoding="async"
          onError={event => {
            if (event.currentTarget.dataset.fallback) return;
            event.currentTarget.dataset.fallback = 'true';
            event.currentTarget.src = '/images/herotest.png';
          }} />
      </div>
      <div className="wrap photo-hero-content">
        <p className="photo-hero-eyebrow">MAÇONNERIE · RÉNOVATION · COUVERTURE</p>
        <h1 id="hero-title">Vos idées.<br /><span>Notre savoir-faire.</span></h1>
        <p className="photo-hero-description">À La Rochelle, ProRenoNeuf intervient pour vos travaux de maçonnerie, de rénovation et de couverture. Parlons de votre projet.</p>
        <div className="photo-hero-actions">
          <a className="button photo-hero-primary" href="#contact">Demander un devis <ArrowUpRight size={18} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}