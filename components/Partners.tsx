import { Landmark, Truck, Building2, Package, HardHat, Ship } from "lucide-react";
import Reveal from "./Reveal";

const PARTNERS = [
  { icon: Landmark, label: "Institutions locales" },
  { icon: Truck, label: "Transporteurs sous-traitants" },
  { icon: Building2, label: "Promoteurs immobiliers" },
  { icon: Package, label: "Fournisseurs de matériaux" },
  { icon: HardHat, label: "Entreprises BTP" },
  { icon: Ship, label: "Opérateurs portuaires" },
];

export default function Partners() {
  const loop = [...PARTNERS, ...PARTNERS];

  return (
    <section className="bg-white border-y border-[#e4e0d5] overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 pt-16">
        <Reveal className="text-center">
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy-deep)]">
            Nos partenaires
          </h2>
        </Reveal>
      </div>

      <div className="relative mt-10 py-8">
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10" />
        <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-16">
          {loop.map(({ icon: Icon, label }, i) => (
            <div
              key={`${label}-${i}`}
              className="flex items-center gap-3 text-[var(--steel)] shrink-0"
            >
              <Icon size={22} className="text-[var(--navy-deep)]" />
              <span className="font-display uppercase tracking-wide text-[15px] whitespace-nowrap">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
