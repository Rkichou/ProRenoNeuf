export type ProjectSlide = {
  id: string;
  image: string;
  alt: string;
  title: string;
  caption: string;
};

// Photos de projets fournies par l’utilisateur pour la galerie.
export const projectsIllustrative = false;
export const projects: ProjectSlide[] = [
  { id: 'construction-maison', image: '/images/projects/construction-maison-parpaings.webp', alt: 'Maison en construction avec murs en parpaings apparents, ouvertures et échafaudage', title: 'Maçonnerie & gros œuvre', caption: 'Une maison en cours de construction, avec sa maçonnerie apparente et ses ouvertures.' },
  { id: 'facade-pierre', image: '/images/projects/renovation-facade-pierre.png', alt: 'Façade en pierre avec encadrements de fenêtres enduits, derrière un échafaudage', title: 'Rénovation de façade', caption: 'Pierre apparente et encadrements de fenêtres : une façade en cours de rénovation.' },
  { id: 'terrasse-piscine', image: '/images/projects/terrasse-dallee-piscine.png', alt: 'Terrasse en dalles claires autour d’un bassin de piscine devant une maison', title: 'Aménagement de terrasse', caption: 'Un dallage clair autour de la piscine et au pied de la maison.' },
  { id: 'douche-carrelage', image: '/images/projects/douche-carrelage-noir.jpg', alt: 'Espace douche avec carrelage mural noir, joints clairs et colonne de douche chromée', title: 'Aménagement de douche', caption: 'Carrelage noir et joints contrastés pour cet espace douche.' },
  { id: 'couverture', image: '/images/projects/couverture-tuiles-faitage.jpeg', alt: 'Toiture en tuiles terre cuite avec une ligne de faîtage au centre', title: 'Couverture en tuiles', caption: 'Vue sur les pans de toiture et le faîtage en tuiles terre cuite.' },
  { id: 'ecran', image: '/images/projects/ecran-sous-toiture.jpeg', alt: 'Écran de sous-toiture noir avec des supports en bois avant la pose des tuiles', title: 'Préparation de la toiture', caption: 'Mise en place de l’écran de sous-toiture et des supports en bois.' },
  { id: 'pose', image: '/images/projects/pose-tuiles-liteaux.jpeg', alt: 'Toiture partiellement couverte de tuiles avec le liteaunage encore visible', title: 'Pose des tuiles', caption: 'La couverture prend forme, rangée après rangée, sur le liteaunage.' },
  { id: 'cheminees', image: '/images/projects/raccords-cheminees-toiture.jpeg', alt: 'Raccords métalliques autour de deux souches de cheminée sur une toiture en tuiles', title: 'Raccords de cheminées', caption: 'Détail des raccords entre les souches de cheminée et la couverture.' },
  { id: 'preparation', image: '/images/projects/preparation-couverture-tuiles.jpeg', alt: 'Lots de tuiles disposés sur une toiture équipée de liteaux et d’un écran de sous-toiture', title: 'Un chantier en cours', caption: 'Tuiles réparties sur le toit pour préparer la pose de la couverture.' },
];
