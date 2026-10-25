import {
  Building2,
  PaintRoller,
  Route,
  Shovel,
  Wrench,
  Truck,
  Zap,
  Wrench as WrenchIcon,
  ClipboardList,
  Anchor,
  Warehouse,
  HardHat,
  Snowflake,
  Sun,
  SprayCan,
  Package,
  PackageCheck,
  Container,
  CarFront,
  ShieldCheck,
  Lightbulb,
  Wind,
  PanelsTopLeft,
  Droplets,
  Hammer,
  MapPin as MapPinIcon,
} from "lucide-react";

import type { Pole, Service } from "./services";

export const POLES_EN: Pole[] = [
  {
    id: "transport",
    label: "Road transport",
    tagline: "Goods, tippers and international freight",
    icon: Truck,
    image: "/hero_section/hero-6.png",
  },
  {
    id: "logistique",
    label: "Logistics",
    tagline: "Storage, handling and traceability",
    icon: Warehouse,
    image: "/hero_section/hero-7.png",
  },
  {
    id: "btp",
    label: "Construction",
    tagline: "Earthworks, buildings and renovation",
    icon: HardHat,
    image: "/hero_section/hero-2.png",
  },
  {
    id: "electricite",
    label: "Electrical",
    tagline: "Installation, compliance upgrades and repairs",
    icon: Zap,
    image: "/realisations/plafonds/plafond-1.png",
  },
  {
    id: "climatisation",
    label: "Air conditioning",
    tagline: "Installation, servicing and repairs",
    icon: Snowflake,
    image: "/realisations/realisations-2.png",
  },
  {
    id: "solaire",
    label: "Solar panels",
    tagline: "Survey, installation and maintenance",
    icon: Sun,
    image: "/hero_section/hero-3.png",
  },
  {
    id: "nettoyage",
    label: "Facility cleaning",
    tagline: "Offices, residences and shared spaces",
    icon: SprayCan,
    image: "/actualites/lutte_contre_insalubrite/salubrite-1.png",
  },
];

export const btpServicesEn: Service[] = [
  {
    slug: "gros-oeuvre",
    pole: "btp",
    title: "Structural works",
    short: "Foundations, masonry and structure",
    icon: Building2,
    description:
      "From the foundations to the load-bearing structure, the GOSTA TRANS team handles the structural works of individual houses, residential, commercial and industrial buildings, with direct coordination with the materials supply.",
    bullets: [
      "Foundations and initial earthworks",
      "Masonry and raising of load-bearing walls",
      "Pouring of slabs and reinforced concrete structures",
      "Direct coordination with materials transport",
    ],
  },
  {
    slug: "second-oeuvre",
    pole: "btp",
    title: "Finishing works",
    short: "Coffered ceilings, electrical, plumbing",
    icon: PaintRoller,
    description:
      "Finishing works cover the details that make a building liveable and functional, including coffered ceilings, one of the team's most requested services, as well as basic electrical and plumbing installations.",
    bullets: [
      "Suspended ceiling installation (coffered ceilings)",
      "Electrical and plumbing installations",
      "Partitions, plastering and interior finishes",
      "Can be added to an existing structural project",
    ],
  },
  {
    slug: "voirie-amenagement-urbain",
    pole: "btp",
    title: "Roadworks & urban development",
    short: "Roads, pavements, public spaces",
    icon: Route,
    description:
      "GOSTA TRANS works on roadworks and urban development projects, a natural extension of its transport activity that allows it to mobilise materials and machinery quickly on traffic routes.",
    bullets: [
      "Opening and reinstating roads",
      "Pavements and public spaces",
      "Signage and site safety",
      "Fast mobilisation thanks to an in-house fleet",
    ],
  },
  {
    slug: "terrassement-assainissement",
    pole: "btp",
    title: "Earthworks & drainage",
    short: "Levelling, drainage, networks",
    icon: Shovel,
    description:
      "Before any construction or road repair, earthworks prepare the ground and drainage secures water evacuation: two stages GOSTA TRANS runs with its own machinery.",
    bullets: [
      "Levelling and site preparation",
      "Excavation and drainage networks",
      "Rainwater management on urban sites",
      "Machine rental with operator when needed",
    ],
  },
  {
    slug: "renovation-rehabilitation",
    pole: "btp",
    title: "Renovation & refurbishment",
    short: "Upgrading existing buildings",
    icon: Wrench,
    description:
      "For existing buildings, the team handles structural refurbishment as well as upgrading finishes (electrical, plumbing, ceilings) to extend the life of the property.",
    bullets: [
      "Pre-work survey",
      "Structural and masonry repairs",
      "Electrical and plumbing upgrades",
      "Finishes and coffered ceilings",
    ],
  },
  {
    slug: "construction-batiments",
    pole: "btp",
    title: "Building construction",
    short: "Houses, apartment blocks, industrial units",
    icon: Hammer,
    description:
      "From a single house to an industrial building, GOSTA TRANS runs the project from earthworks to handover, with the same teams for structural and finishing works.",
    bullets: [
      "Individual houses and apartment blocks",
      "Commercial and industrial buildings",
      "A single contact from start to finish",
      "Integrated materials supply",
    ],
  },
  {
    slug: "maconnerie-vrd",
    pole: "btp",
    title: "Masonry & utilities networks",
    short: "Structures, service networks, slabs",
    icon: Building2,
    description:
      "Beyond buildings, the team delivers masonry and utilities-network works: slabs, low walls, inspection chambers, channels and connections needed for a functional site.",
    bullets: [
      "Concrete slabs and structures",
      "Low walls, chambers and channels",
      "Service networks and connections",
      "Small development structures",
    ],
  },
];

export const logistiqueServicesEn: Service[] = [
  {
    slug: "transport-materiaux",
    pole: "logistique",
    title: "Construction materials transport",
    short: "Cement, rebar, aggregates, timber…",
    icon: Truck,
    description:
      "GOSTA TRANS's historic core: moving construction materials from the supply point to the site, with a fleet suited to Central African roads.",
    bullets: [
      "Cement, rebar, aggregates, timber",
      "Supervised loading and unloading",
      "Routes suited to Bangui and its surroundings",
      "Tracking through to delivery on site",
    ],
  },
  {
    slug: "livraison-rapide",
    pole: "logistique",
    title: "Fast & secure delivery",
    short: "Short lead times, tracked goods",
    icon: Zap,
    description:
      "For urgent site needs, GOSTA TRANS prioritises speed without compromising the safety of the goods, from the departure point to receipt.",
    bullets: [
      "Mobilisation on short notice",
      "Secured and tracked goods",
      "One contact from departure to arrival",
      "Suited to unexpected site issues",
    ],
  },
  {
    slug: "location-engins",
    pole: "logistique",
    title: "Machine rental with operator",
    short: "Site machinery, operator included",
    icon: WrenchIcon,
    description:
      "GOSTA TRANS provides site machinery with a qualified operator: a solution for companies and individuals without their own equipment.",
    bullets: [
      "Machines for earthworks, levelling, handling",
      "Qualified operator included",
      "One-off rental or for the whole project",
      "Can be combined with materials transport",
    ],
  },
  {
    slug: "gestion-logistique",
    pole: "logistique",
    title: "Supply chain management",
    short: "One contact, the whole flow",
    icon: ClipboardList,
    description:
      "Rather than multiplying providers, GOSTA TRANS centralises a project's logistics: delivery planning, machinery coordination and tracking through to the site.",
    bullets: [
      "Materials flow planning",
      "Transport + machinery + labour coordination",
      "Single contact point for the client",
      "Suited to multi-phase projects",
    ],
  },
  {
    slug: "approvisionnement-chantiers",
    pole: "logistique",
    title: "Site supply",
    short: "From port to site, without breaks",
    icon: Anchor,
    description:
      "Together with the company's maritime side, GOSTA TRANS organises site supply from freight receipt to final delivery, limiting transhipment.",
    bullets: [
      "Freight tracking from port receipt",
      "Direct routing to the site",
      "Fewer supply interruptions",
      "Coordination with site teams",
    ],
  },
  {
    slug: "stockage-entreposage",
    pole: "logistique",
    title: "Storage & warehousing",
    short: "Goods kept until delivery",
    icon: Warehouse,
    description:
      "Goods can be received and stored before being delivered at the site's pace, keeping the site clear and limiting material losses.",
    bullets: [
      "Receiving and put-away",
      "Staggered deliveries to suit the site",
      "Handling with lifting equipment",
      "Inbound and outbound inventory",
    ],
  },
  {
    slug: "manutention-distribution",
    pole: "logistique",
    title: "Handling & distribution",
    short: "Loading, sorting and dispatch",
    icon: PackageCheck,
    description:
      "Loading, unloading, sorting and dispatch across several destinations: handling is carried out by equipped operators, alongside transport.",
    bullets: [
      "Loading and unloading on site",
      "Sorting and dispatch by destination",
      "Operators and lifting equipment",
      "Fewer handling damages",
    ],
  },
  {
    slug: "suivi-tracabilite",
    pole: "logistique",
    title: "Goods tracking & traceability",
    short: "Knowing where each shipment stands",
    icon: MapPinIcon,
    description:
      "Every shipment is tracked from pick-up to delivery, with quantity checks and a report to the client: exactly what left, what arrived and what is outstanding.",
    bullets: [
      "Status tracking for each shipment",
      "Quantity checks at departure and arrival",
      "Delivery report to the client",
      "Immediate reporting of discrepancies",
    ],
  },
];

export const NEW_SERVICES_EN: {
  transport: Service[];
  electricite: Service[];
  climatisation: Service[];
  solaire: Service[];
  nettoyage: Service[];
} = {
  transport: [
    {
      slug: "marchandises-generales",
      pole: "transport",
      title: "General goods transport",
      short: "Trucks, tippers and containers",
      icon: Truck,
      description:
        "GOSTA TRANS moves general goods across the Central African Republic with a fleet of trucks and tippers suited to local tracks and roads, from loading to delivery.",
      bullets: [
        "Flatbed trucks, tippers and rigids",
        "Supervised loading and securing",
        "Routes suited to CAR roads",
        "Tracked delivery to the consignee",
      ],
    },
    {
      slug: "liaison-camions-bennes",
      pole: "transport",
      title: "Truck and tipper shuttles",
      short: "Continuous rotation between two points",
      icon: Container,
      description:
        "For regular flows — quarries, depots, sites — the team runs a continuous rotation of trucks and tippers, with a single contact tracking each trip.",
      bullets: [
        "Rotations planned for the project duration",
        "Tippers for aggregates, soil and rubble",
        "On-site loading coordination",
        "Rotation and volume tracking",
      ],
    },
    {
      slug: "livraison-internationale",
      pole: "transport",
      title: "Delivery in CAR and internationally",
      short: "From port to delivery point",
      icon: MapPinIcon,
      description:
        "GOSTA TRANS handles haulage from the country's entry points to the delivery address, including goods arriving from abroad and intercity consignments.",
      bullets: [
        "Haulage from port or border",
        "Delivery in Bangui and upcountry",
        "Coordination with freight forwarders",
        "Freight documentation tracking",
      ],
    },
    {
      slug: "dedouanement",
      pole: "transport",
      title: "Customs clearance",
      short: "Customs formalities and transit",
      icon: ShieldCheck,
      description:
        "Customs formalities are handled so goods do not get stuck at the border: file preparation, exchanges with the authorities and tracking through to release.",
      bullets: [
        "Customs file preparation",
        "Transit tracking through to release",
        "Coordination with road transport",
        "Client updates at every stage",
      ],
    },
    {
      slug: "transport-vehicules",
      pole: "transport",
      title: "Vehicle transport in CAR",
      short: "Cars, vans, light machinery",
      icon: CarFront,
      description:
        "Vehicle transport — cars, vans, light machinery — is carried out on car carriers or flatbeds, with the bodywork secured during transit.",
      bullets: [
        "Cars, vans and light machinery",
        "Flatbed or car-carrier loading",
        "Vehicle secured during transit",
        "Delivery in the destination city",
      ],
    },
    {
      slug: "messagerie",
      pole: "transport",
      title: "Parcels and small consignments",
      short: "Parcels and documents upcountry",
      icon: Package,
      description:
        "For small consignments, the parcel service groups packages and documents and forwards them with departing convoys, avoiding the cost of dedicated transport.",
      bullets: [
        "Parcels, parts and documents",
        "Grouped with departing convoys",
        "Drop-off and collection in Bangui",
        "Handover confirmation to the recipient",
      ],
    },
  ],
  electricite: [
    {
      slug: "installation-electrique",
      pole: "electricite",
      title: "Building and industrial electrical installation",
      short: "Panels, circuits, lighting",
      icon: Lightbulb,
      description:
        "Electrical installation is delivered for residential and commercial buildings: panels, circuits, lighting and sockets, sized for how the premises are actually used.",
      bullets: [
        "Distribution panels and circuits",
        "Indoor and outdoor lighting",
        "Sockets, switches and protection",
        "Industrial building installation",
      ],
    },
    {
      slug: "renovation-armoires-normes",
      pole: "electricite",
      title: "Panel upgrades to standard",
      short: "Bringing boards into compliance",
      icon: ShieldCheck,
      description:
        "Old boards and panels are reworked to meet safety rules: circuit identification, residual-current protection and clear labelling of outgoing ways.",
      bullets: [
        "Survey of the existing installation",
        "Replacing ageing protection devices",
        "Circuit identification and labelling",
        "Panel compliance upgrades",
      ],
    },
    {
      slug: "depannage-electrique",
      pole: "electricite",
      title: "24/7 electrical repairs",
      short: "Faults, short circuits, outages",
      icon: Zap,
      description:
        "When a fault occurs — outage, short circuit, tripping board — the team responds quickly to restore supply and identify the root cause.",
      bullets: [
        "Fast 24/7 response",
        "Fault finding and restoration",
        "Replacing failed components",
        "Advice to prevent recurrence",
      ],
    },
  ],
  climatisation: [
    {
      slug: "installation-entretien-clim",
      pole: "climatisation",
      title: "Installation and servicing",
      short: "Mounting, charging and routine service",
      icon: Snowflake,
      description:
        "Air-conditioner installation covers mounting the units, charging the circuit and commissioning tests, followed by regular servicing to keep performance over time.",
      bullets: [
        "Indoor and outdoor unit mounting",
        "Refrigerant charging and checks",
        "Commissioning tests",
        "Periodic servicing and cleaning",
      ],
    },
    {
      slug: "depannage-climatisation",
      pole: "climatisation",
      title: "Fast repairs",
      short: "When the unit stops cooling",
      icon: Wind,
      description:
        "When a unit stops cooling, leaks or trips the supply, the repair identifies the cause — gas, filter, board, power — and returns the unit to service.",
      bullets: [
        "On-site diagnosis",
        "Gas leak detection",
        "Replacing failed parts",
        "Restoration and verification",
      ],
    },
    {
      slug: "climatisation-residentielle",
      pole: "climatisation",
      title: "Residential and commercial air conditioning",
      short: "Homes, offices, shops",
      icon: Snowflake,
      description:
        "Sizing is based on floor area, exposure and use: homes, offices, shops or plant rooms, with equipment suited to the actual load.",
      bullets: [
        "Cooling load assessment",
        "Homes, offices and shops",
        "Single and multi-split systems",
        "Service contracts for businesses",
      ],
    },
  ],
  solaire: [
    {
      slug: "etude-dimensionnement",
      pole: "solaire",
      title: "Survey and sizing",
      short: "Load calculation and array sizing",
      icon: PanelsTopLeft,
      description:
        "Before installing, the team measures the site's actual needs — consumption, required autonomy, sunlight — and sizes the panel array, batteries and inverter accordingly.",
      bullets: [
        "Consumption assessment",
        "Panel and battery sizing",
        "Inverter and protection selection",
        "Detailed equipment quote",
      ],
    },
    {
      slug: "installation-systemes-solaires",
      pole: "solaire",
      title: "Solar system installation",
      short: "Mounting, wiring, commissioning",
      icon: Sun,
      description:
        "Installation covers mounting panels, wiring, connecting batteries and commissioning, with the actual output verified before handover.",
      bullets: [
        "Panel mounting and orientation",
        "DC/AC wiring and protection",
        "Battery and inverter connection",
        "Commissioning and output measurement",
      ],
    },
    {
      slug: "maintenance-suivi",
      pole: "solaire",
      title: "Maintenance and follow-up",
      short: "Cleaning, checks, replacement",
      icon: Droplets,
      description:
        "A solar array loses output if it is not maintained: cleaning modules, checking connections and replacing end-of-life batteries are part of the follow-up.",
      bullets: [
        "Module cleaning",
        "Connection and protection checks",
        "Output measurement",
        "Replacing used batteries",
      ],
    },
  ],
  nettoyage: [
    {
      slug: "nettoyage-bureaux",
      pole: "nettoyage",
      title: "Office and premises cleaning",
      short: "Regular or one-off visits",
      icon: SprayCan,
      description:
        "Cleaning for offices and business premises is organised as regular visits or one-off interventions, depending on the client's operating hours.",
      bullets: [
        "Offices, meeting rooms, washrooms",
        "Regular or one-off visits",
        "Work outside opening hours",
        "Team and equipment provided",
      ],
    },
    {
      slug: "entretien-espaces-communs",
      pole: "nettoyage",
      title: "Shared space upkeep",
      short: "Residences, yards, surroundings",
      icon: SprayCan,
      description:
        "Shared areas — yards, corridors, staircases, surroundings — are maintained so they stay clean and usable, including on sites open to the public.",
      bullets: [
        "Yards, corridors and staircases",
        "Surroundings and walkways",
        "Removal of everyday waste",
        "Frequency matched to footfall",
      ],
    },
    {
      slug: "produits-materiels",
      pole: "nettoyage",
      title: "Professional products and equipment",
      short: "Consumables and equipment included",
      icon: ShieldCheck,
      description:
        "Services include the professional products and equipment required: no consumables to supply on the client side, with products chosen for the surface type.",
      bullets: [
        "Products suited to each surface",
        "Professional equipment provided",
        "Written working procedure",
        "Rework if the service falls short",
      ],
    },
  ],
};
