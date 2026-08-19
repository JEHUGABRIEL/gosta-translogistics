import Link from "next/link";
import { MessageSquareText, Newspaper, Star, Clock } from "lucide-react";
import { requireAdmin } from "./actions";
import AdminShell from "@/components/admin/AdminShell";
import { listQuoteRequests, listTestimonials, listNewsPosts } from "@/lib/db/queries";

export default async function AdminHomePage() {
  await requireAdmin();

  const [quotes, testimonials, news] = await Promise.all([
    listQuoteRequests(),
    listTestimonials(),
    listNewsPosts(),
  ]);

  const newQuotes = quotes.filter((q) => q.status === "new").length;

  const stats = [
    {
      label: "Demandes de devis",
      value: quotes.length,
      hint: newQuotes > 0 ? `${newQuotes} nouvelle${newQuotes > 1 ? "s" : ""}` : "à jour",
      icon: MessageSquareText,
      href: "/admin/quotes",
    },
    {
      label: "Témoignages",
      value: testimonials.length,
      hint: `${testimonials.filter((t) => t.published).length} publiés`,
      icon: Star,
      href: "/admin/testimonials",
    },
    {
      label: "Actualités",
      value: news.length,
      hint: `${news.filter((n) => n.published).length} publiées`,
      icon: Newspaper,
      href: "/admin/news",
    },
  ];

  return (
    <AdminShell title="Vue d'ensemble">
      <div className="grid sm:grid-cols-3 gap-5">
        {stats.map(({ label, value, hint, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="block bg-white border border-[var(--line-soft)] rounded-2xl p-6 hover:-translate-y-[2px] hover:shadow-[0_12px_28px_-18px_rgba(0,0,0,0.3)] transition-all"
          >
            <div className="h-11 w-11 flex items-center justify-center bg-[var(--navy-deep)] text-[var(--amber)] rounded-xl">
              <Icon size={20} />
            </div>
            <p className="font-display font-extrabold text-3xl text-[var(--navy-deep)] mt-4">
              {value}
            </p>
            <p className="text-[14px] text-[var(--steel)] mt-1">{label}</p>
            <p className="font-mono text-[11.5px] uppercase tracking-wide text-[var(--red)] mt-2">
              {hint}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-white border border-[var(--line-soft)] rounded-2xl p-6">
        <h2 className="font-display uppercase text-[15px] text-[var(--navy-deep)] flex items-center gap-2">
          <Clock size={16} className="text-[var(--red)]" /> Dernières demandes de devis
        </h2>
        {quotes.length === 0 ? (
          <p className="text-[14px] text-[var(--steel)] mt-4">
            Aucune demande reçue pour le moment.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--line-soft)]">
            {quotes.slice(0, 5).map((q) => (
              <li key={q.id} className="py-3 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[14.5px] text-[var(--navy-deep)] font-medium truncate">
                    {q.name} · {q.phone}
                  </p>
                  <p className="text-[13px] text-[var(--steel)] truncate">
                    {q.service ?? "—"}
                  </p>
                </div>
                <span
                  className={`shrink-0 font-mono text-[11px] uppercase tracking-wide px-2.5 py-1 rounded-full ${
                    q.status === "new"
                      ? "bg-[var(--red)]/10 text-[var(--red)]"
                      : "bg-[var(--sand-deep)] text-[var(--steel)]"
                  }`}
                >
                  {q.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AdminShell>
  );
}
