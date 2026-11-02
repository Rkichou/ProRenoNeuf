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
  { id: 'terrasse-piscine', image: '/images/projects/terrasse-dallee-piscine.png', alt: 'Terrasse en dalles claires autour d’un bassin de piscine devant une maison', title: 'Construction de piscine & terrasse en travertin', caption: 'Réalisation d’une piscine et aménagement de ses abords avec une terrasse en travertin, alliant élégance, durabilité et harmonie avec l’extérieur.' },
  { id: 'construction-maison', image: '/images/projects/construction-maison-parpaings.webp', alt: 'Maison en construction avec murs en parpaings apparents, ouvertures et échafaudage', title: 'Maçonnerie & gros œuvre', caption: 'Une maison en cours de construction, avec sa maçonnerie apparente et ses ouvertures.' },
  { id: 'douche-carrelage', image: '/images/projects/douche-carrelage-noir.jpg', alt: 'Espace douche avec carrelage mural noir, joints clairs et colonne de douche chromée', title: 'Aménagement de douche', caption: 'Carrelage noir et joints contrastés pour cet espace douche.' },
  { id: 'couverture', image: '/images/projects/couverture-tuiles-faitage.jpeg', alt: 'Toiture en tuiles terre cuite avec une ligne de faîtage au centre', title: 'Couverture en tuiles', caption: 'Vue sur les pans de toiture et le faîtage en tuiles terre cuite.' },
  { id: 'ecran', image: '/images/projects/ecran-sous-toiture.jpeg', alt: 'Écran de sous-toiture noir avec des supports en bois avant la pose des tuiles', title: 'Préparation de la toiture', caption: 'Mise en place de l’écran de sous-toiture et des supports en bois.' },
  { id: 'pose', image: '/images/projects/pose-tuiles-liteaux.jpeg', alt: 'Toiture partiellement couverte de tuiles avec le liteaunage encore visible', title: 'Pose des tuiles', caption: 'La couverture prend forme, rangée après rangée, sur le liteaunage.' },
  { id: 'cheminees', image: '/images/projects/raccords-cheminees-toiture.jpeg', alt: 'Raccords métalliques autour de deux souches de cheminée sur une toiture en tuiles', title: 'Raccords de cheminées', caption: 'Détail des raccords entre les souches de cheminée et la couverture.' },
];
