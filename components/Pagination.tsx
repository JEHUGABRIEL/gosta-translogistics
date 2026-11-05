import { ArrowLeft, ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/**
 * Barre de pagination des pages index (`/actualites`, `/realisations`) :
 * `?page=` borné par l'appelant, liens `rel=prev|next` et états désactivés
 * quand on est à la première ou à la dernière page. Rien ne s'affiche s'il
 * n'y a qu'une page.
 */
export default async function Pagination({
  basePath,
  current,
  total,
}: {
  basePath: string;
  current: number;
  total: number;
}) {
  if (total <= 1) return null;

  const t = await getTranslations("pagination");
  const base =
    "inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] px-4 py-2 font-display uppercase tracking-wide text-[13px]";
  const enabled =
    "text-[var(--navy-deep)] hover:border-[var(--red)] hover:text-[var(--red)] transition-colors";
  const disabled = "text-[var(--steel)]/50";

  return (
    <nav
      aria-label={t("label")}
      className="mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {current > 1 ? (
        <Link
          href={`${basePath}?page=${current - 1}`}
          rel="prev"
          className={`${base} ${enabled}`}
        >
          <ArrowLeft size={14} strokeWidth={2} />
          {t("previous")}
        </Link>
      ) : (
        <span aria-disabled="true" className={`${base} ${disabled}`}>
          <ArrowLeft size={14} strokeWidth={2} />
          {t("previous")}
        </span>
      )}

      <span className="mx-2 font-mono text-[11.5px] uppercase tracking-[0.16em] text-[var(--steel)]">
        {t("page", { current, total })}
      </span>

      {current < total ? (
        <Link
          href={`${basePath}?page=${current + 1}`}
          rel="next"
          className={`${base} ${enabled}`}
        >
          {t("next")}
          <ArrowRight size={14} strokeWidth={2} />
        </Link>
      ) : (
        <span aria-disabled="true" className={`${base} ${disabled}`}>
          {t("next")}
          <ArrowRight size={14} strokeWidth={2} />
        </span>
      )}
    </nav>
  );
}
