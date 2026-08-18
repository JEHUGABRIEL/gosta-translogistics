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
} from "lucide-react";

import type { Service } from "./services";

export const btpServicesEn: Service[] = [
  {
    slug: "gros-oeuvre",
    category: "btp",
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
    category: "btp",
    title: "Finishing works",
    short: "Coffered ceilings, electrical, plumbing",
    icon: PaintRoller,
    description:
      "Finishing works cover the details that make a building liveable and functional, including coffered ceilings, one of the team's most requested services, as well as basic electrical and plumbing installations.",
    bullets: [
      "Installation of suspended ceilings (coffered ceilings)",
      "Electrical installations and plumbing",
      "Partitions, plastering and interior finishes",
      "Can be combined with an existing structural works project",
    ],
  },
  {
    slug: "voirie-amenagement-urbain",
    category: "btp",
    title: "Roadworks & urban development",
    short: "Roads, sidewalks, public spaces",
    icon: Route,
    description:
      "GOSTA TRANS works on roadworks and urban development projects, a natural extension of its transport activity, allowing it to quickly mobilise materials and equipment on road networks.",
    bullets: [
      "Opening and restoration of roads",
      "Development of sidewalks and public spaces",
      "Signage and site security",
      "Fast mobilisation thanks to its own vehicle fleet",
    ],
  },
  {
    slug: "terrassement-assainissement",
    category: "btp",
    title: "Earthworks & sanitation",
    short: "Grading, drainage, networks",
    icon: Shovel,
    description:
      "Before any construction or road refurbishment, earthworks prepare the ground and sanitation secures water drainage: two stages that GOSTA TRANS manages with its own equipment.",
    bullets: [
      "Grading and land preparation",
      "Excavation and installation of drainage networks",
      "Stormwater management on urban sites",
      "Equipment rental with operator for occasional needs",
    ],
  },
  {
    slug: "renovation-rehabilitation",
    category: "btp",
    title: "Renovation & rehabilitation",
    short: "Upgrading existing buildings",
    icon: Wrench,
    description:
      "For existing buildings, the team handles structural rehabilitation as well as the upgrade of finishes (electrical, plumbing, ceilings) to extend the lifespan of a property.",
    bullets: [
      "Pre-works assessment",
      "Structural and masonry repairs",
      "Electrical and plumbing upgrades",
      "Finishes and coffered ceilings",
    ],
  },
];

export const logistiqueServicesEn: Service[] = [
  {
    slug: "transport-materiaux",
    category: "logistique",
    title: "Transport of construction materials",
    short: "Cement, rebar, aggregates, timber…",
    icon: Truck,
    description:
      "The historical core of GOSTA TRANS: moving construction materials from the supply point to the site, with a vehicle fleet suited to Central African roads.",
    bullets: [
      "Cement, rebar, aggregates, timber",
      "Supervised loading and unloading",
      "Routes adapted to Bangui and its surroundings",
      "Tracking until delivery on site",
    ],
  },
  {
    slug: "livraison-rapide",
    category: "logistique",
    title: "Fast & secure delivery",
    short: "Short lead times, tracked goods",
    icon: Zap,
    description:
      "For urgent site needs, GOSTA TRANS prioritises speed without compromising the safety of the goods transported, from departure point to delivery.",
    bullets: [
      "Mobilisation within short lead times",
      "Secured and tracked goods",
      "Single point of contact from departure to arrival",
      "Made for site emergencies",
    ],
  },
  {
    slug: "location-engins",
    category: "logistique",
    title: "Equipment rental with operator",
    short: "Site equipment, operator included",
    icon: WrenchIcon,
    description:
      "GOSTA TRANS provides construction equipment accompanied by a qualified operator: a solution for companies and individuals who do not have their own fleet.",
    bullets: [
      "Equipment for earthworks, grading, handling",
      "Qualified operator included",
      "Occasional rental or for the duration of the site",
      "Can be combined with materials transport",
    ],
  },
  {
    slug: "gestion-logistique",
    category: "logistique",
    title: "Complete logistics management",
    short: "One single contact, the whole flow",
    icon: ClipboardList,
    description:
      "Instead of multiplying providers, GOSTA TRANS centralises a project's logistics organisation: delivery planning, equipment coordination and follow-up until the site.",
    bullets: [
      "Planning of materials flows",
      "Coordination of transport + equipment + labour",
      "Single point of contact for the client",
      "Suitable for multi-phase projects",
    ],
  },
  {
    slug: "approvisionnement-chantiers",
    category: "logistique",
    title: "Site supply",
    short: "From the port to the site, without breaks",
    icon: Anchor,
    description:
      "In line with the company's maritime activity, GOSTA TRANS organises site supply from freight reception to final delivery, limiting breaks in transit.",
    bullets: [
      "Freight tracking from port reception",
      "Direct routing to the site",
      "Fewer supply breaks",
      "Coordination with site teams",
    ],
  },
];
