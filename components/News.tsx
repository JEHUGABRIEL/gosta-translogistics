import Image from "next/image";
import { Calendar, ArrowRight, Shovel, Users } from "lucide-react";
import { getTranslations } from "next-intl/server";
import ImageCarousel from "./ImageCarousel";
import Reveal from "./Reveal";

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

const POST_ICONS = [Users, Shovel];

// Vraies photos de la visite à Mme le Maire de Bangui (portrait 3:4)
const VISIT_GALLERY = [
  "/actualites/visite_le_maire/759752022_122106265874483606_7580724467324769210_n.jpg",
  "/actualites/visite_le_maire/760105526_122106265904483606_6123224770020097206_n.jpg",
];

// Vraies photos de la lutte contre l'insalubrité axe Gbenguewé–Marché KM5
const CLEANUP_GALLERY = [
  "/actualites/lutte_contre_insalubrite/salubrite-1.png",
  "/actualites/lutte_contre_insalubrite/salubrite-2.png",
];

// Chaque article affiche sa propre galerie de photos
const GALLERIES = [VISIT_GALLERY, CLEANUP_GALLERY];

type NewsPost = {
  date: string;
  title: string;
  /** Visuel publié depuis le dashboard (upload Cloudinary) — sinon, visuel de repli. */
  image?: string | null;
};

export default async function News({ extra = [] }: { extra?: NewsPost[] }) {
  const t = await getTranslations("home.news");
  // Actualités ajoutées depuis le dashboard admin, affichées à la suite des
  // articles d'origine — n'affecte rien si `extra` est vide (par défaut).
  const posts = [...(t.raw("posts") as NewsPost[]), ...extra];

  return (
    <section id="actualites" className="bg-[var(--white-warm)]">
      <div className="mx-auto max-w-7xl px-6 py-10 md:py-14">
        <Reveal>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
            {t("title")}
          </h2>
        </Reveal>

        {/* Slider mobile/tablette, grid desktop */}
        <div className="mt-8 -mx-6 px-6 md:mx-0 md:px-0">
          <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide md:grid md:grid-cols-2 md:gap-8 md:overflow-visible md:pb-0">
            {posts.map(({ date, title, image: customImage }, i) => {
              const Icon = POST_ICONS[i % POST_ICONS.length];
              const gallery = i < GALLERIES.length ? GALLERIES[i] : undefined;
              const image =
                customImage ??
                (i % 2 === 0
                  ? U("photo-1521737604893-d14cc237f11d")
                  : U("photo-1560448204-e02f11c3d0e2"));

              return (
                <Reveal key={title} delay={i * 0.1} className="h-full shrink-0 w-[85vw] snap-center md:shrink md:w-auto">
                  <div className="h-full bg-[var(--surface)] border border-black/[0.06] rounded-2xl overflow-hidden">
                  {gallery ? (
                    <ImageCarousel images={gallery} alt={title} />
                  ) : (
                    <div className="overflow-hidden">
                      <Image
                        src={image}
                        alt={title}
                        width={900}
                        height={506}
                        className="h-64 w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-7">
                    <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-wide text-[var(--steel)]">
                      <Calendar size={16} strokeWidth={2} className="text-[var(--red)]" />
                      {date}
                    </div>
                    <div className="flex items-start gap-4 mt-4">
                      <div className="shrink-0 h-10 w-10 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-md">
                        <Icon size={20} strokeWidth={1.8} />
                      </div>
                      <h3 className="font-display uppercase tracking-wide text-xl text-[var(--navy-deep)] leading-snug">
                        {title}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[13px] text-[var(--red)] mt-5">
                      {t("readMore")}
                      <ArrowRight size={15} />
                    </span>
                  </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
