import Link from "next/link";
import {
  ArrowRight,
  Clock,
  HelpCircle,
  History,
  Inbox,
  MessageSquareText,
  Newspaper,
  ShieldCheck,
  Star,
  UserPlus,
  Users,
} from "lucide-react";
import { requireAdmin } from "../actions";
import AdminShell from "@/components/admin/AdminShell";
import { AdminBadge, AdminCard } from "@/components/admin/ui";
import { ADMIN_ACTION_LABELS } from "@/lib/admin-activity";
import {
  listAdminUsers,
  listContactMessages,
  listFaqs,
  listNewsPosts,
  listQuoteRequests,
  listRecentActivity,
  listTestimonials,
} from "@/lib/db/queries";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Africa/Bangui",
});

const QUOTE_STATUS: Record<string, { label: string; tone: "red" | "amber" | "green" }> = {
  new: { label: "Nouveau", tone: "red" },
  contacted: { label: "Contacté", tone: "amber" },
  done: { label: "Traité", tone: "green" },
};

const MESSAGE_STATUS: Record<string, { label: string; tone: "red" | "amber" | "steel" }> = {
  new: { label: "Nouveau", tone: "red" },
  read: { label: "Lu", tone: "amber" },
  archived: { label: "Archivé", tone: "steel" },
};

export default async function AdminHomePage() {
  await requireAdmin();

  const [quotes, messages, testimonials, news, faqs, admins, activity] =
    await Promise.all([
      listQuoteRequests(),
      listContactMessages(),
      listTestimonials(),
      listNewsPosts(),
      listFaqs(),
      listAdminUsers(),
      listRecentActivity(6),
    ]);

  const newQuotes = quotes.filter((quote) => quote.status === "new").length;
  const newMessages = messages.filter((message) => message.status === "new").length;

  const stats = [
    {
      label: "Demandes de devis",
      value: quotes.length,
      hint: newQuotes > 0 ? `${newQuotes} nouvelle${newQuotes > 1 ? "s" : ""}` : "à jour",
      icon: MessageSquareText,
      href: "/admin/quotes",
    },
    {
      label: "Messages de contact",
      value: messages.length,
      hint: newMessages > 0 ? `${newMessages} non lu${newMessages > 1 ? "s" : ""}` : "à jour",
      icon: Inbox,
      href: "/admin/messages",
    },
    {
      label: "Témoignages",
      value: testimonials.length,
      hint: `${testimonials.filter((item) => item.published).length} publiés`,
      icon: Star,
      href: "/admin/testimonials",
    },
    {
      label: "Actualités",
      value: news.length,
      hint: `${news.filter((item) => item.published).length} publiées`,
      icon: Newspaper,
      href: "/admin/news",
    },
    {
      label: "Questions FAQ",
      value: faqs.length,
      hint: `${faqs.filter((item) => item.published).length} publiées`,
      icon: HelpCircle,
      href: "/admin/faq",
    },
    {
      label: "Comptes admin",
      value: admins.length,
      hint: "équipe active",
      icon: Users,
      href: "/admin/team",
    },
  ];

  const quickActions = [
    { label: "Voir les devis", href: "/admin/quotes", icon: MessageSquareText },
    { label: "Répondre aux messages", href: "/admin/messages", icon: Inbox },
    { label: "Publier une actualité", href: "/admin/news", icon: Newspaper },
    { label: "Gérer la FAQ", href: "/admin/faq", icon: HelpCircle },
    { label: "Inviter un admin", href: "/admin/team", icon: UserPlus },
    { label: "Sécuriser mon compte", href: "/admin/account", icon: ShieldCheck },
  ];

  return (
    <AdminShell title="Vue d'ensemble">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map(({ label, value, hint, icon: Icon, href }) => (
          <Link key={label} href={href} className="group">
            <AdminCard className="h-full p-5 transition-transform duration-200 group-hover:-translate-y-0.5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--navy-deep)] text-[var(--amber)]">
                  <Icon size={19} />
                </div>
                <ArrowRight
                  size={16}
                  className="mt-1 text-[var(--steel)] transition-colors group-hover:text-[var(--red)]"
                />
              </div>
              <p className="mt-4 font-display text-3xl font-extrabold text-[var(--navy-deep)]">
                {value}
              </p>
              <p className="mt-0.5 text-[13.5px] text-[var(--steel)]">{label}</p>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-wide text-[var(--red)]">
                {hint}
              </p>
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-[14px] uppercase tracking-wide text-[var(--navy-deep)]">
              <Clock size={16} className="text-[var(--red)]" />
              Dernières demandes de devis
            </h2>
            <Link
              href="/admin/quotes"
              className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--red)] hover:text-[var(--red-dark)]"
            >
              Tout voir →
            </Link>
          </div>

          {quotes.length === 0 ? (
            <p className="mt-4 text-[13.5px] text-[var(--steel)]">
              Aucune demande reçue pour le moment.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--line-soft)]">
              {quotes.slice(0, 5).map((quote) => {
                const status = QUOTE_STATUS[quote.status];
                return (
                  <li key={quote.id} className="flex items-start justify-between gap-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-[14px] font-medium text-[var(--navy-deep)]">
                        {quote.name} · {quote.phone}
                      </p>
                      <p className="truncate text-[12.5px] text-[var(--steel)]">
                        {quote.service ?? "—"}
                      </p>
                    </div>
                    <AdminBadge tone={status.tone}>{status.label}</AdminBadge>
                  </li>
                );
              })}
            </ul>
          )}
        </AdminCard>

        <AdminCard className="p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 font-display text-[14px] uppercase tracking-wide text-[var(--navy-deep)]">
              <Inbox size={16} className="text-[var(--red)]" />
              Messages récents
            </h2>
            <Link
              href="/admin/messages"
              className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--red)] hover:text-[var(--red-dark)]"
            >
              Tout voir →
            </Link>
          </div>

          {messages.length === 0 ? (
            <p className="mt-4 text-[13.5px] text-[var(--steel)]">
              Aucun message reçu pour le moment.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--line-soft)]">
              {messages.slice(0, 4).map((message) => {
                const status = MESSAGE_STATUS[message.status];
                return (
                  <li key={message.id} className="py-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="truncate text-[14px] font-medium text-[var(--navy-deep)]">
                        {message.name}
                      </p>
                      <AdminBadge tone={status.tone}>{status.label}</AdminBadge>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-[12.5px] text-[var(--steel)]">
                      {message.message}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </AdminCard>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <AdminCard className="p-6">
          <h2 className="flex items-center gap-2 font-display text-[14px] uppercase tracking-wide text-[var(--navy-deep)]">
            <History size={16} className="text-[var(--red)]" />
            Activité récente
          </h2>

          {activity.length === 0 ? (
            <p className="mt-4 text-[13.5px] text-[var(--steel)]">
              Aucune action enregistrée.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-[var(--line-soft)]">
              {activity.map((entry) => (
                <li key={entry.id} className="py-2.5">
                  <p className="text-[13px] text-[var(--navy-deep)]">
                    {ADMIN_ACTION_LABELS[entry.action] ?? entry.action}
                    {entry.target && (
                      <span className="text-[var(--steel)]"> · {entry.target}</span>
                    )}
                  </p>
                  <p className="font-mono text-[11px] text-[var(--steel)]">
                    {entry.email ?? "compte supprimé"} ·{" "}
                    {dateFormat.format(new Date(entry.created_at))}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </AdminCard>

        <AdminCard className="p-6">
          <h2 className="font-display text-[14px] uppercase tracking-wide text-[var(--navy-deep)]">
            Actions rapides
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {quickActions.map(({ label, href, icon: Icon }) => (
              <Link
                key={href + label}
                href={href}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--line-soft)] px-3.5 py-3 text-[13px] text-[var(--navy-deep)] transition-colors hover:border-[var(--red)] hover:text-[var(--red)]"
              >
                <Icon size={16} className="shrink-0 text-[var(--red)]" />
                {label}
              </Link>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
