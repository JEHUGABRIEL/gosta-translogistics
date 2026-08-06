import Image from "next/image";
import { Calendar, ChevronRight, PaintRoller, Users } from "lucide-react";
import Reveal from "./Reveal";

const U = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=70`;

const POSTS = [
  {
    image: U("photo-1521737604893-d14cc237f11d"),
    icon: Users,
    date: "Fin juillet 2026",
    title: "Visite à Mme le Maire de Bangui",
  },
  {
    image: U("photo-1560448204-e02f11c3d0e2"),
    icon: PaintRoller,
    date: "10 juillet 2026",
    title: "Le plafond staff, une spécialité maison",
  },
];

export default function News() {
  return (
    <section id="actualites" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Reveal>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl text-[var(--navy-deep)]">
            Actualités
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {POSTS.map(({ image, icon: Icon, date, title }, i) => (
            <Reveal
              key={title}
              delay={i * 0.1}
              className="group border border-[#e4e0d5] hover:border-[var(--red)] transition-colors overflow-hidden"
            >
              <div className="overflow-hidden">
                <Image
                  src={image}
                  alt={title}
                  width={900}
                  height={506}
                  className="h-64 w-full object-cover"
                />
              </div>
              <div className="p-7">
                <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-wide text-[var(--steel)]">
                  <Calendar size={14} className="text-[var(--red)]" />
                  {date}
                </div>
                <div className="flex items-start gap-4 mt-4">
                  <div className="shrink-0 h-11 w-11 flex items-center justify-center bg-[var(--sand-deep)] text-[var(--navy-deep)]">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display uppercase tracking-wide text-xl text-[var(--navy-deep)] leading-snug">
                    {title}
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1.5 font-display uppercase tracking-wide text-[13px] text-[var(--red)] mt-5">
                  Lire la suite
                  <ChevronRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
