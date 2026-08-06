import { ClipboardList, Truck, HardHat, Share2, AtSign } from "lucide-react";
import Reveal from "./Reveal";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Demande & devis",
    text: "Vous décrivez le besoin par téléphone, WhatsApp ou le formulaire — nous cadrons volumes, délais et accès au site.",
  },
  {
    icon: Truck,
    title: "Mobilisation",
    text: "Camions, engins et opérateurs sont affrétés pour le transport des matériaux jusqu'au chantier.",
  },
  {
    icon: HardHat,
    title: "Exécution & suivi",
    text: "Nos équipes prennent en charge le gros œuvre, le second œuvre ou les travaux publics jusqu'à la réception.",
  },
];

export default function Process() {
  return (
    <section className="bg-[var(--navy-deep)] relative">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Reveal className="max-w-xl">
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-white">
            Du premier appel à la réception
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 mt-8">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 0.1} className="relative pl-16">
              <span className="absolute left-0 top-0 font-mono text-[13px] text-[var(--amber)]">
                0{i + 1}
              </span>
              <div className="absolute left-0 top-6 h-11 w-11 flex items-center justify-center border border-[var(--amber)]/50 text-[var(--amber)]">
                <Icon size={20} />
              </div>
              <h3 className="font-display uppercase tracking-wide text-xl text-white mt-1">
                {title}
              </h3>
              <p className="text-[#b9c2d1] text-[14.5px] leading-relaxed mt-2">{text}</p>
            </Reveal>
          ))}
        </div>

        {/* social proof — grounded in the real Facebook presence, not invented figures */}
        <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8">
          <span className="font-display uppercase tracking-wide text-[13px] text-[#b9c2d1]">
            Suivez les chantiers en cours
          </span>
          <a
            href="https://www.facebook.com/search/top?q=Gosta%20Trans%20%26%20Logistique%20et%20BTP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-[var(--amber)] transition-colors font-mono text-sm"
          >
            <Share2 size={17} /> Gosta Trans &amp; Logistique et BTP
          </a>
          <a
            href="https://www.instagram.com/Gosta_trans_Logistique_et_BTP"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-white hover:text-[var(--amber)] transition-colors font-mono text-sm"
          >
            <AtSign size={17} /> @Gosta_trans_Logistique_et_BTP
          </a>
        </div>
      </div>
    </section>
  );
}
