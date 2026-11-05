/**
 * Réalisations présentées sur la home : source unique des cartes de la section
 * « Nos réalisations » et des pages de détail `/realisations/[slug]`.
 *
 * Les textes reprennent uniquement des contenus déjà publiés sur le site
 * (catalogue de prestations et messages) : aucune date, aucun chiffre ni aucun
 * lieu de chantier n'est inventé. Les visuels vivent dans `public/realisations/`.
 */

export type ProjectItem = {
  /** Identifiant d'URL, identique en FR et en EN. */
  slug: string;
  title: string;
  /** Famille de travaux affichée au-dessus du titre. */
  tag: string;
  /** Visuel de la carte et bannière de la page de détail. */
  image: string;
  /** Galerie de la page de détail (au moins `image`). */
  gallery: string[];
  /** Paragraphes de la page de détail. */
  body: string[];
};

const PLAFONDS = [
  "/realisations/plafonds/plafond-1.png",
  "/realisations/plafonds/plafond-2.png",
  "/realisations/realisations-3.png",
];

const PROJECTS_FR: ProjectItem[] = [
  {
    slug: "plafond-staff",
    title: "Plafond staff",
    tag: "Second œuvre",
    image: PLAFONDS[0],
    gallery: PLAFONDS,
    body: [
      "Le plafond staff fait partie des prestations les plus demandées de l'équipe. Le second œuvre couvre les finitions qui rendent un bâtiment habitable et fonctionnel : pose de plafonds suspendus, installations électriques et plomberie de base.",
      "Cloisons, enduits et finitions intérieures complètent le chantier. Ces travaux sont réalisables en complément d'un gros œuvre existant, avec les mêmes équipes du début à la fin.",
    ],
  },
  {
    slug: "immeubles-residentiels-commerciaux",
    title: "Immeubles résidentiels & commerciaux",
    tag: "Gros œuvre",
    image: "/realisations/realisations-1.png",
    gallery: ["/realisations/realisations-1.png"],
    body: [
      "De la fondation à la structure porteuse, l'équipe GOSTA TRANS prend en charge le gros œuvre des maisons individuelles, immeubles résidentiels et commerciaux, en coordination directe avec l'approvisionnement en matériaux.",
      "Fondations et terrassement de départ, maçonnerie et élévation des murs porteurs, coulage de dalles et structures en béton armé : le chantier est conduit dans la continuité, du gros œuvre aux finitions.",
    ],
  },
  {
    slug: "voirie-amenagement-urbain",
    title: "Voirie & aménagement urbain",
    tag: "Travaux publics",
    image: "/realisations/realisations-5.png",
    gallery: ["/realisations/realisations-5.png"],
    body: [
      "GOSTA TRANS intervient sur les chantiers de voirie et d'aménagement urbain, un prolongement naturel de son activité de transport, qui lui permet de mobiliser rapidement matériaux et engins sur les axes de circulation.",
      "Ouverture et remise en état de voies, aménagement de trottoirs et espaces publics, signalisation et sécurisation de chantier : le parc de véhicules propre de l'entreprise permet une mobilisation rapide.",
    ],
  },
  {
    slug: "batiments-industriels",
    title: "Bâtiments industriels",
    tag: "Gros œuvre",
    image: "/realisations/pergolats/pergola-1.jpg",
    gallery: ["/realisations/pergolats/pergola-1.jpg"],
    body: [
      "Le gros œuvre des bâtiments industriels fait partie des chantiers conduits par l'équipe : fondations, maçonnerie, élévation des murs porteurs et structures en béton armé.",
      "De la maison individuelle au bâtiment industriel, GOSTA TRANS conduit le projet du terrassement à la remise des clés, avec les mêmes équipes pour le gros œuvre et les finitions.",
    ],
  },
  {
    slug: "approvisionnement-chantiers",
    title: "Approvisionnement de chantiers",
    tag: "Transport",
    image: "/realisations/pergolats/pergola-2.jpg",
    gallery: ["/realisations/pergolats/pergola-2.jpg"],
    body: [
      "Le cœur historique de GOSTA TRANS : l'acheminement de matériaux de construction depuis le point d'approvisionnement jusqu'au chantier, avec un parc de véhicules adapté aux routes centrafricaines.",
      "Ciment, fer à béton, agrégats, bois : chargement et déchargement sont encadrés, les itinéraires adaptés à Bangui et ses environs, et la marchandise suivie jusqu'à la livraison sur site.",
    ],
  },
  {
    slug: "renovation-rehabilitation",
    title: "Rénovation & réhabilitation",
    tag: "BTP",
    image: "/realisations/realisations-5.png",
    gallery: ["/realisations/realisations-5.png"],
    body: [
      "Pour les bâtiments existants, l'équipe intervient sur la réhabilitation structurelle comme sur la remise à niveau des finitions (électricité, plomberie, plafonds) afin de prolonger la durée de vie d'un bien.",
      "Diagnostic avant travaux, reprise de structure et de maçonnerie, remise à niveau de l'électricité et de la plomberie, finitions et plafonds staff : un seul interlocuteur pour l'ensemble du chantier.",
    ],
  },
];

const PROJECTS_EN: ProjectItem[] = [
  {
    slug: "plafond-staff",
    title: "Coffered ceiling",
    tag: "Finishing works",
    image: PLAFONDS[0],
    gallery: PLAFONDS,
    body: [
      "Coffered ceilings are among the team's most requested services. Finishing works cover the details that make a building liveable and functional: suspended ceiling installation, basic electrical and plumbing installations.",
      "Partitions, plastering and interior finishes complete the project. This work can be added to an existing structural project, with the same teams from start to finish.",
    ],
  },
  {
    slug: "immeubles-residentiels-commerciaux",
    title: "Residential & commercial buildings",
    tag: "Structural works",
    image: "/realisations/realisations-1.png",
    gallery: ["/realisations/realisations-1.png"],
    body: [
      "From the foundations to the load-bearing structure, the GOSTA TRANS team handles the structural works of individual houses, residential and commercial buildings, in direct coordination with the materials supply.",
      "Foundations and initial earthworks, masonry and raising of load-bearing walls, pouring of slabs and reinforced concrete structures: the project runs continuously, from structural to finishing works.",
    ],
  },
  {
    slug: "voirie-amenagement-urbain",
    title: "Roadworks & urban development",
    tag: "Public works",
    image: "/realisations/realisations-5.png",
    gallery: ["/realisations/realisations-5.png"],
    body: [
      "GOSTA TRANS works on roadworks and urban development projects, a natural extension of its transport activity that allows it to mobilise materials and machinery quickly on traffic routes.",
      "Opening and reinstating roads, pavements and public spaces, signage and site safety: the company's in-house fleet allows fast mobilisation.",
    ],
  },
  {
    slug: "batiments-industriels",
    title: "Industrial buildings",
    tag: "Structural works",
    image: "/realisations/pergolats/pergola-1.jpg",
    gallery: ["/realisations/pergolats/pergola-1.jpg"],
    body: [
      "The structural works of industrial buildings are part of the projects led by the team: foundations, masonry, raising of load-bearing walls and reinforced concrete structures.",
      "From a single house to an industrial building, GOSTA TRANS runs the project from earthworks to handover, with the same teams for structural and finishing works.",
    ],
  },
  {
    slug: "approvisionnement-chantiers",
    title: "Site supply",
    tag: "Transport",
    image: "/realisations/pergolats/pergola-2.jpg",
    gallery: ["/realisations/pergolats/pergola-2.jpg"],
    body: [
      "GOSTA TRANS's historic core: moving construction materials from the supply point to the site, with a fleet suited to Central African roads.",
      "Cement, rebar, aggregates, timber: loading and unloading are supervised, routes are suited to Bangui and its surroundings, and goods are tracked through to delivery on site.",
    ],
  },
  {
    slug: "renovation-rehabilitation",
    title: "Renovation & rehabilitation",
    tag: "BTP",
    image: "/realisations/realisations-5.png",
    gallery: ["/realisations/realisations-5.png"],
    body: [
      "For existing buildings, the team handles structural refurbishment as well as upgrading finishes (electrical, plumbing, ceilings) to extend the life of the property.",
      "Pre-work survey, structural and masonry repairs, electrical and plumbing upgrades, finishes and coffered ceilings: one contact for the whole project.",
    ],
  },
];

/** Réalisations, dans l'ordre d'affichage de la section « Nos réalisations ». */
export function getProjects(locale: string): ProjectItem[] {
  return locale === "en" ? PROJECTS_EN : PROJECTS_FR;
}

export function getProject(
  locale: string,
  slug: string
): ProjectItem | undefined {
  return getProjects(locale).find((project) => project.slug === slug);
}
