import { Ship, Building2, Construction, ChevronRight } from "lucide-react";
import Reveal from "./Reveal";

const MARITIME = [
  "Transport de matériaux de construction",
  "Livraison rapide et sécurisée",
  "Location d'engins avec opérateur",
  "Gestion logistique complète",
  "Approvisionnement de chantiers",
];

const DOMAINES = [
  "Maisons individuelles",
  "Immeubles résidentiels &amp; commerciaux",
  "Bâtiments industriels",
  "Gros œuvre (fondation, maçonnerie…)",
  "Second œuvre (électricité, plomberie, plafond staff…)",
];

const TRAVAUX = [
  "Voirie &amp; aménagement urbain",
  "Terrassement &amp; assainissement",
  "Rénovation &amp; réhabilitation",
];

function List({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3 mt-6">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-[15px] text-[var(--steel)]">
          <ChevronRight size={16} className="mt-0.5 shrink-0 text-[var(--red)]" />
          <span dangerouslySetInnerHTML={{ __html: item }} />
        </li>
      ))}
    </ul>
  );
}

export default function Services() {
  return (
    <section id="services" className="bg-[#F5F2EC]">
      {/* pt-32 sur mobile : laisse la place à la moitié basse de la barre de
          recherche de la hero (qui déborde de la section) sans masquer le titre */}
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-12 md:pt-20">
        <Reveal className="max-w-2xl">
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
            Un partenaire, deux métiers
          </h2>
          <p className="text-[var(--steel)] mt-4 leading-relaxed">
            Du quai au chantier, GOSTA TRANS coordonne le fret et la
            construction sous un même toit — moins d&apos;intermédiaires, plus
            de maîtrise sur les délais.
          </p>
        </Reveal>

        <div id="domaines" className="grid md:grid-cols-3 gap-px bg-[#dcd6c7] mt-8 border border-[#dcd6c7]">
          <Reveal delay={0} className="bg-white p-8">
            <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)]">
              <Ship size={24} />
            </div>
            <h3 className="font-display uppercase tracking-wide text-2xl text-[var(--navy-deep)] mt-5">
              Services maritimes &amp; transport
            </h3>
            <List items={MARITIME} />
          </Reveal>

          <Reveal delay={0.08} className="bg-white p-8">
            <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)]">
              <Building2 size={24} />
            </div>
            <h3 className="font-display uppercase tracking-wide text-2xl text-[var(--navy-deep)] mt-5">
              Domaines d&apos;intervention
            </h3>
            <List items={DOMAINES} />
          </Reveal>

          <Reveal delay={0.16} className="bg-white p-8">
            <div className="h-12 w-12 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)]">
              <Construction size={24} />
            </div>
            <h3 className="font-display uppercase tracking-wide text-2xl text-[var(--navy-deep)] mt-5">
              Travaux publics &amp; rénovation
            </h3>
            <List items={TRAVAUX} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
