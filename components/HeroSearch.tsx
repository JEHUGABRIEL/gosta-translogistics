"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { getServices, type Service } from "@/lib/services";

export default function HeroSearch({
  autoFocus = false,
  onSubmitted,
}: {
  autoFocus?: boolean;
  onSubmitted?: () => void;
}) {
  const router = useRouter();
  const t = useTranslations("search");
  const locale = useLocale();
  const [query, setQuery] = useState("");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    const all = getServices(locale).all;

    if (q) {
      // Score les résultats : le titre prime, puis le sous-titre, puis le corps
      const score = (s: Service): number =>
        (s.title.toLowerCase().includes(q) ? 3 : 0) +
        (s.short.toLowerCase().includes(q) ? 2 : 0) +
        (s.description.toLowerCase().includes(q) ||
        s.bullets.some((b) => b.toLowerCase().includes(q))
          ? 1
          : 0);

      let best: Service | null = null;
      let bestScore = 0;
      for (const s of all) {
        const sc = score(s);
        if (sc > bestScore) {
          best = s;
          bestScore = sc;
        }
      }
      if (best) {
        router.push(`/services/${best.category}/${best.slug}`);
        onSubmitted?.();
        return;
      }
    }

    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    onSubmitted?.();
  };

  return (
    <form
      onSubmit={handleSearch}
      className="bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl"
    >
      <div className="grid md:grid-cols-[1fr_auto] gap-3 p-5 md:p-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--amber)] pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("inputLabel")}
            autoFocus={autoFocus}
            className="w-full border border-white/15 bg-white/5 pl-11 pr-4 py-3.5 text-[15px] text-white placeholder:text-[#8a93a5] focus:outline-none focus:border-[var(--red)] transition-colors"
          />
        </div>


        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 bg-[var(--red)] hover:bg-[var(--red-dark)] transition-colors text-white font-display uppercase tracking-wide text-base px-8 py-3.5 cursor-pointer"
        >
          <Search size={17} /> {t("submit")}
        </button>
      </div>
    </form>
  );
}
