import type { CSSProperties } from 'react';
import { ArrowUpRight, Phone } from 'lucide-react';
import './arc-gallery-hero.css';

export type HeroImage = { src: string; alt: string; position?: string };
type ArcGalleryHeroProps = {
  images: HeroImage[];
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  primaryLink: { label: string; href: string };
  secondaryLink: { label: string; href: string };
};

export function ArcGalleryHero({ images, eyebrow, title, accent, description, primaryLink, secondaryLink }: ArcGalleryHeroProps) {
  // Seven cards keep the arc legible. Small screens show the first, middle and last.
  const cards = images.slice(0, 7);
  const middle = Math.floor((cards.length - 1) / 2);
  return <section className="arc-hero" aria-labelledby="hero-title">
    <div className="arc-gallery">
      {cards.map((image, index) => {
        const progress = cards.length === 1 ? 0.5 : index / (cards.length - 1);
        const angle = (progress - 0.5) * Math.PI * 2 / 3;
        const style = {
          '--card-x': `${50 + 40 * Math.sin(angle) / Math.sin(Math.PI / 3)}%`,
          '--card-y': `${30 + 49 * (1 - Math.cos(angle)) / 0.5}%`,
          '--card-rotation': `${(progress - 0.5) * 28}deg`,
          '--card-delay': `${index * 65}ms`,
        } as CSSProperties;
        const mobilePosition = index === 0 ? 'first' : index === cards.length - 1 ? 'last' : index === middle ? 'middle' : 'hidden';
        return <div className="arc-card" data-mobile={mobilePosition} style={style} key={`${image.src}-${index}`}>
          <div className="arc-card-frame">
            <img src={image.src} alt={image.alt} width="320" height="400" decoding="async" draggable={false} style={{objectPosition: image.position}}
              onError={event => {
                const imageElement = event.currentTarget;
                if (imageElement.dataset.fallback) return;
                imageElement.dataset.fallback = 'true';
                imageElement.src = '/images/building-fallback.svg';
                imageElement.alt = 'Illustration de maison, image de remplacement';
              }}/>
          </div>
        </div>;
      })}
    </div>
    <div className="arc-content">
      <div className="eyebrow">{eyebrow}</div>
      <h1 id="hero-title">{title}<br/><em>{accent}</em></h1>
      <p>{description}</p>
      <div className="arc-actions">
        <a className="button copper-bg" href={primaryLink.href}>{primaryLink.label}<ArrowUpRight size={18} aria-hidden="true"/></a>
        <a className="button outline" href={secondaryLink.href}><Phone size={16} aria-hidden="true"/>{secondaryLink.label}</a>
      </div>
      <p className="arc-caption">Photographies d’illustration · Architecture, matières et espaces de vie</p>
    </div>
  </section>;
}
