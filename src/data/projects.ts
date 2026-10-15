export type ProjectSlide = {
  id: string;
  image: string;
  alt: string;
  title: string;
  caption: string;
};

// Replace these stock illustrations with approved project photographs and captions.
export const projectsIllustrative = true;
export const projects: ProjectSlide[] = [
  { id: 'interieur', image: '/images/hero-interior.jpg', alt: 'Salon lumineux avec mobilier et grandes ouvertures', title: 'Espaces de vie', caption: 'Lumière naturelle et aménagement intérieur.' },
  { id: 'facade', image: '/images/hero-stone.jpg', alt: 'Maison contemporaine avec bardage vertical', title: 'Façades & matières', caption: 'Bardage et ouvertures d’une maison contemporaine.' },
  { id: 'bain', image: '/images/hero-bathroom.jpg', alt: 'Salle de bain avec baignoire et vasque', title: 'La salle de bain', caption: 'Volumes, équipements et finitions intérieures.' },
  { id: 'couverture', image: '/images/services/couverture.jpg', alt: 'Artisan intervenant sur une toiture', title: 'Le travail en toiture', caption: 'Une intervention sur la couverture d’un bâtiment.' },
];
