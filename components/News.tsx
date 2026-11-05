import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ImageCarousel from "./ImageCarousel";
import Reveal from "./Reveal";
import BrushUnderline from "./BrushUnderline";
import { getNewsPosts } from "@/lib/news";

export type NewsCard = {
  slug: string;
  date: string;
  title: string;
  /** Visuel publié depuis le dashboard (upload Cloudinary) — sinon, visuel de repli. */
  image?: string | null;
  gallery?: string[];
};

/**
 * Actualités de la home, en trois cartes : visuel arrondi, date discrète, titre
 * navy et lien orange. Chaque carte mène à sa page `/actualites/[slug]`.
 */
export default async function News({ extra = [] }: { extra?: NewsCard[] }) {
  const t = await getTranslations("home.news");
  const locale = await getLocale();
  // Les actualités éditoriales d'abord, puis celles publiées depuis le
  // dashboard admin — trois cartes en tout, pas plus.
  const posts: NewsCard[] = [...getNewsPosts(locale), ...extra].slice(0, 3);

  return (
    <section id="actualites" className="bg-[var(--white-warm)]">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Reveal>
            <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
              {t("title")}
            </h2>
            <BrushUnderline className="mt-2.5 h-3 w-32 md:w-40 text-[var(--red)]" />
          </Reveal>

          <Reveal delay={0.05}>
            <Link
              href="/actualites"
              className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[13px] text-[var(--red)]"
            >
              {t("all")}
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
          </Reveal>
        </div>

        {/* Slider mobile/tablette, grid desktop */}
        <div className="mt-8 -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0">
            {posts.map(({ slug, date, title, image, gallery }, i) => (
              <Reveal
                key={slug}
                delay={i * 0.1}
                className="h-full shrink-0 w-[85vw] snap-center md:shrink md:w-auto"
              >
                <article className="group h-full">
                  <div className="overflow-hidden rounded-2xl">
                    {gallery && gallery.length > 0 ? (
                      <ImageCarousel
                        images={gallery}
                        alt={title}
                        heightClass="h-56 md:h-64"
                      />
                    ) : (
                      <Image
                        src={image ?? "/hero_section/hero-3.png"}
                        alt={title}
                        width={900}
                        height={506}
                        className="h-56 md:h-64 w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.05]"
                      />
                    )}
                  </div>

                  <p className="font-mono text-[11.5px] uppercase tracking-[0.16em] text-[var(--steel)] mt-6">
                    {date}
                  </p>
                  <h3 className="font-display font-bold text-[20px] md:text-[22px] text-[var(--navy-deep)] leading-snug mt-2.5">
                    <Link
                      href={`/actualites/${slug}`}
                      className="transition-colors hover:text-[var(--red)]"
                    >
                      {title}
                    </Link>
                  </h3>
                  <Link
                    href={`/actualites/${slug}`}
                    className="inline-flex items-center gap-1.5 font-display tracking-wide text-[14px] text-[var(--red)] mt-4"
                  >
                    {t("readMore")}
                    <ArrowRight size={15} strokeWidth={2} />
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
