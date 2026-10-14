import { ArcGalleryHero } from '../ui/arc-gallery-hero-component';

export function HeroSection() {

  return (
    <ArcGalleryHero
        images={[
          { src: '/images/hero-stone.jpg', alt: 'Façade de maison avec bardage et grandes ouvertures' },
          { src: '/images/hero-interior.jpg', alt: 'Pièce de vie aménagée et lumineuse' },
          { src: '/images/hero-facade.jpg', alt: 'Escalier, parement mural et finitions intérieures' },
          { src: '/images/hero-house.jpg', alt: 'Maison avec toiture et façade claire' },
          { src: '/images/hero-bathroom.jpg', alt: 'Salle de bain et finitions intérieures' },
          { src: '/images/hero-architecture.jpg', alt: 'Étude de plans architecturaux' },
          { src: '/images/hero-roof.jpg', alt: 'Toiture de maison et façade extérieure' },
        ]}
        eyebrow="MAÇONNERIE · RÉNOVATION · COUVERTURE"
        title="Vos idées."
        accent="Notre savoir-faire."
        description="À La Rochelle, ProRenoNeuf intervient pour vos travaux de maçonnerie, de rénovation et de couverture. Parlons de votre projet."
        primaryLink={{ label: 'Demander un devis', href: '#contact' }}
        secondaryLink={{ label: 'Appeler le 06 87 58 52 79', href: 'tel:+33687585279' }}
      />
  );
}
