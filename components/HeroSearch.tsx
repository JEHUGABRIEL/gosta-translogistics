"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { allServices, type Service } from "@/lib/services";

const CATEGORIES = [
  { label: "Tous les services", value: "all" },
  { label: "Maritime", value: "logistique" },
  { label: "Transport", value: "logistique" },
  { label: "BTP", value: "btp" },
];

export default function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = query.trim().toLowerCase();
    const cat = category === "all" ? null : category; // "logistique" | "btp"

    const pool = cat
      ? allServices.filter((s) => s.category === cat)
      : allServices;

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
        return;
      }
    }

    if (cat) {
      router.push(`/services/${cat}`);
      return;
    }

    document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
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
            placeholder="Rechercher un service… ciment, engins, construction"
            aria-label="Rechercher un service"
            className="w-full border border-[#dcd6c7] bg-[#F5F2EC] pl-11 pr-4 py-3.5 text-[15px] text-[var(--navy-deep)] placeholder:text-[var(--steel)]/70 focus:outline-none focus:border-[var(--red)]"
          />
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Catégorie de service"
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
          <Search size={17} /> Rechercher
        </button>
      </div>
    </form>
  );
}
