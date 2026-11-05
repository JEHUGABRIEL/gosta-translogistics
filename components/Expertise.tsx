import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Reveal from "./Reveal";
import BrushUnderline from "./BrushUnderline";
import ExpertiseCards from "./ExpertiseCards";

// Page pôle correspondant à chaque carte (catalogue réel du site)
const CARD_HREFS = [
  "/services/logistique",
  "/services/transport",
  "/services/btp",
  "/services/btp",
  "/services/btp",
  "/services/electricite",
];

type Card = { title: string; text: string };

/**
 * Section « savoir-faire » de la maquette de référence : titre sur deux lignes
 * souligné au pinceau, chapeau à droite, puis six cartes photo. La carte active
 * s'agrandit et découvre le détail de la prestation, suivie d'un accès à
 * l'ensemble du catalogue.
 */
export default async function Expertise() {
  const t = await getTranslations("home.expertise");
  const cards = (t.raw("cards") as Card[]).map((card, i) => ({
    ...card,
    href: CARD_HREFS[i % CARD_HREFS.length],
  }));

  return (
    <section className="bg-[var(--white-warm)]">
      <div className="mx-auto max-w-7xl px-6 pb-16 md:pb-20">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-16 items-end">
          <Reveal>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)] leading-[1.08]">
              {t("titleTop")}
              <br />
              {t("titleBottom")}
            </h2>
            <BrushUnderline className="mt-3 block h-3 w-44 md:w-56 text-[var(--red)]" />
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-[var(--steel)] leading-relaxed lg:pb-1">
              {t("intro")}
            </p>
          </Reveal>
        </div>

        <ExpertiseCards cards={cards} actionLabel={t("cardAction")} />

        <Reveal delay={0.15} className="mt-12 flex justify-center">
          <Link
            href="/services"
            className="btn-liquid inline-flex items-center gap-2 bg-[var(--red)] text-white font-display uppercase tracking-wide text-[13.5px] px-7 py-3.5"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t("seeAll")}
              <ArrowUpRight size={17} strokeWidth={2} />
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
