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
};

export default async function News() {
  const t = await getTranslations("home.news");
  const posts = t.raw("posts") as NewsPost[];

  return (
    <section id="actualites" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <Reveal>
          <span className="block font-mono text-[12.5px] uppercase tracking-[0.25em] text-[var(--red)]">
            {t("eyebrow")}
          </span>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)] mt-3">
            {t("title")}
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {posts.map(({ date, title }, i) => {
            const Icon = POST_ICONS[i % POST_ICONS.length];
            // Chaque article affiche ses vraies photos en carrousel
            const gallery = GALLERIES[i % GALLERIES.length];
            const image =
              i % 2 === 0
                ? U("photo-1521737604893-d14cc237f11d")
                : U("photo-1560448204-e02f11c3d0e2");

            return (
              <Reveal key={title} delay={i * 0.1} className="h-full">
                <div className="group h-full bg-white border border-black/[0.06] shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_28px_-18px_rgba(0,0,0,0.22)] hover:-translate-y-[3px] hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_24px_44px_-22px_rgba(0,0,0,0.34)] transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.7,0.2,1)] rounded-2xl overflow-hidden">
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
                    <Calendar size={14} className="text-[var(--red)]" />
                    {date}
                  </div>
                  <div className="flex items-start gap-4 mt-4">
                    <div className="shrink-0 h-10 w-10 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-xl">
                      <Icon size={18} />
                    </div>
                    <h3 className="font-display uppercase tracking-wide text-xl text-[var(--navy-deep)] leading-snug">
                      {title}
                    </h3>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[13px] text-[var(--red)] mt-5">
                    {t("readMore")}
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
