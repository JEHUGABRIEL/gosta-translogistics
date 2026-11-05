import { ChevronDown } from "lucide-react";

/**
 * « Bosse » de défilement des héros : un prolongement du bord bas de la hero
 * (dégradé noir, comme le bas voilé de la photo — pas de bleu, sans liseré) dont
 * le haut est noyé dans la section.
 * Seule la partie arrondie dépasse (`translate-y-[calc(100%-20px)]`, ~28 px) et
 * recouvre la section suivante, vers laquelle elle amène l'ancre.
 *
 * Le parent doit être `relative` (et au-dessus de la section suivante) ; la
 * section visée porte `scroll-mt-[var(--header-h)]`.
 */
export default function HeroScrollBump({
  target,
  label,
}: {
  /** Id de la section cible, sans `#`. */
  target: string;
  /** Libellé accessible du lien. */
  label: string;
}) {
  return (
    <a
      href={`#${target}`}
      aria-label={label}
      className="group absolute bottom-0 left-1/2 z-20 flex w-20 -translate-x-1/2 translate-y-[calc(100%-20px)] items-end justify-center rounded-b-full bg-gradient-to-b from-[#15191e] via-[#0b0e12] to-black pb-4 pt-3 text-white/70 shadow-[0_18px_28px_-18px_rgba(0,0,0,0.9)] transition-colors duration-300 hover:text-[var(--amber)] focus-visible:text-[var(--amber)]"
    >
      <ChevronDown
        size={20}
        strokeWidth={2}
        className="transition-transform duration-300 group-hover:translate-y-0.5"
      />
    </a>
  );
}
