import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Reveal from "./Reveal";

export type RelatedCard = {
  href: string;
  title: string;
  /** Date (actualité) ou famille de travaux (réalisation). */
  meta: string;
  image: string;
};

/**
 * Bloc « Autres réalisations » / « Autres actualités » posé au bas d'une page
 * de détail : trois cartes vers les contenus voisins.
 */
export default function RelatedCards({
  heading,
  items,
  cta,
}: {
  heading: string;
  items: RelatedCard[];
  cta: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className="bg-[var(--sand)]">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <Reveal>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[var(--navy-deep)]">
            {heading}
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.href} delay={i * 0.08} className="h-full">
              <article className="group h-full">
                <div className="overflow-hidden rounded-2xl">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={900}
                    height={506}
                    className="h-52 w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05]"
                  />
                </div>
                <p className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-[var(--steel)] mt-5">
                  {item.meta}
                </p>
                <h3 className="font-display font-bold text-[19px] text-[var(--navy-deep)] leading-snug mt-2">
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-[var(--red)]"
                  >
                    {item.title}
                  </Link>
                </h3>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 font-display tracking-wide text-[14px] text-[var(--red)] mt-3"
                >
                  {cta}
                  <ArrowRight size={15} strokeWidth={2} />
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
