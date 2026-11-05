import { getTranslations } from "next-intl/server";
import { ArrowUpRight, Boxes, Building2, Timer, UserRound } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Reveal from "./Reveal";

const ICONS = [Building2, Boxes, UserRound, Timer];

type IntroPart = { text: string; strong?: boolean };

/**
 * Bandeau « chiffres clés » (maquette de référence) : un paragraphe de
 * présentation dont quelques groupes de mots ressortent en navy, puis les
 * repères de l'entreprise en colonnes.
 *
 * `variant="figures"` reprend le même bloc dépouillé (chiffres + libellés,
 * sans icône ni bouton), comme sur la page À propos du modèle.
 *
 * Les valeurs viennent de `messages/*.json` et ne reprennent que des faits
 * déjà affirmés ailleurs sur le site (sept pôles, un interlocuteur unique,
 * réponse sous 24h ouvrées) : aucun chiffre n'est inventé ici.
 */
export default async function KeyFigures({
  variant = "editorial",
  id,
}: {
  variant?: "editorial" | "figures";
  /** Ancre de section (cible de la pastille de défilement de la hero). */
  id?: string;
}) {
  const t = await getTranslations("home.figures");
  const intro = t.raw("intro") as IntroPart[];
  const items = t.raw("items") as { value: string; label: string }[];
  const plain = variant === "figures";

  return (
    <section
      id={id}
      className="bg-[var(--white-warm)] scroll-mt-[var(--header-h)]"
    >
      <div
        className={
          plain
            ? "mx-auto max-w-5xl px-6 py-16 md:py-24"
            : "mx-auto max-w-5xl px-6 pt-14 md:pt-16 pb-16 md:pb-20"
        }
      >
        {plain ? null : (
        <Reveal>
          <p className="mx-auto max-w-4xl text-center font-display text-[clamp(1.4rem,2.35vw,2.15rem)] leading-[1.5] text-[var(--steel)]">
            {intro.map((part, i) =>
              part.strong ? (
                <strong
                  key={i}
                  className="font-extrabold text-[var(--navy-deep)]"
                >
                  {part.text}
                </strong>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </p>
        </Reveal>
        )}

        <ul
          className={
            plain
              ? "grid grid-cols-2 gap-x-5 gap-y-14"
              : "mt-14 grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12"
          }
        >
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <Reveal key={item.label} delay={i * 0.06}>
                <li className="flex flex-col items-center text-center">
                  {plain ? null : (
                    <span
                      aria-hidden="true"
                      className="h-14 w-14 flex items-center justify-center rounded-2xl bg-[var(--sand)] border border-black/[0.05] text-[var(--red)]"
                    >
                      <Icon size={24} strokeWidth={1.7} />
                    </span>
                  )}
                  <span
                    className={
                      plain
                        ? "font-display font-extrabold text-5xl md:text-6xl leading-none text-[var(--red)]"
                        : "font-display font-extrabold text-4xl md:text-5xl leading-none text-[var(--red)] mt-5"
                    }
                  >
                    {item.value}
                  </span>
                  <span className="text-[13.5px] md:text-[14.5px] text-[var(--steel)] leading-snug mt-2.5 max-w-[13rem]">
                    {item.label}
                  </span>
                </li>
              </Reveal>
            );
          })}
        </ul>

        {plain ? null : (
          <Reveal delay={0.15} className="mt-14 text-center">
            <Link
              href="/a-propos"
              className="btn-liquid [--liquid-fill:var(--red-dark)] inline-flex items-center gap-2 bg-[var(--red)] text-white font-display uppercase tracking-wide text-[13.5px] px-7 py-3.5"
            >
              <span className="relative z-10 flex items-center gap-2">
                {t("more")}
                <ArrowUpRight size={17} strokeWidth={2} />
              </span>
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
