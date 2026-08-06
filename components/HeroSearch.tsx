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
  const [category, setCategory] = useState("all");

  const CATEGORIES = [
    { label: t("all"), value: "all" },
    { label: t("maritime"), value: "logistique" },
    { label: t("transport"), value: "logistique" },
    { label: t("btp"), value: "btp" },
  ];

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    const cat = category === "all" ? null : category; // "logistique" | "btp"

    const all = getServices(locale).all;
    const pool = cat ? all.filter((s) => s.category === cat) : all;

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
      for (const s of pool) {
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

    if (cat) {
      router.push(`/services/${cat}`);
      onSubmitted?.();
      return;
    }

    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
    onSubmitted?.();
  };

  return (
    <form onSubmit={handleSearch} className="bg-white shadow-2xl">
      <div className="grid md:grid-cols-[1fr_230px_auto] gap-3 p-5 md:p-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--steel)] pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            aria-label={t("inputLabel")}
            autoFocus={autoFocus}
            className="w-full border border-[#dcd6c7] bg-[#F5F2EC] pl-11 pr-4 py-3.5 text-[15px] text-[var(--navy-deep)] placeholder:text-[var(--steel)]/70 focus:outline-none focus:border-[var(--red)]"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label={t("categoryLabel")}
          className="w-full border border-[#dcd6c7] bg-[#F5F2EC] px-4 py-3.5 text-[15px] text-[var(--navy-deep)] focus:outline-none focus:border-[var(--red)] cursor-pointer"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value + c.label} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

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
