"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Bell, Inbox, MessageSquareText } from "lucide-react";
import type { NotificationsPayload } from "@/lib/admin-notifications";

const REFRESH_MS = 30_000;

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
});

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data, refetch } = useQuery<NotificationsPayload>({
    queryKey: ["admin", "notifications"],
    queryFn: async () => {
      const response = await fetch("/api/admin/notifications", {
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Notifications indisponibles");
      return (await response.json()) as NotificationsPayload;
    },
    refetchInterval: REFRESH_MS,
    refetchOnWindowFocus: true,
    staleTime: 15_000,
    retry: false,
  });

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const total = data ? data.quotes.count + data.messages.count : 0;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((current) => !current);
          void refetch();
        }}
        aria-label={`Notifications${total > 0 ? ` (${total})` : ""}`}
        aria-expanded={open}
        className="relative flex h-9 w-9 items-center justify-center text-[var(--steel)] transition-colors hover:bg-[var(--sand)] hover:text-[var(--navy-deep)]"
      >
        <Bell size={18} />
        {total > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--red)] px-1 font-mono text-[10px] font-bold text-white">
            {total > 9 ? "9+" : total}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[var(--line-soft)] bg-[var(--surface)] shadow-2xl">
          <div className="border-b border-[var(--line-soft)] px-4 py-3">
            <p className="font-display text-[13px] uppercase tracking-wide text-[var(--navy-deep)]">
              Notifications
            </p>
          </div>

          <div className="divide-y divide-[var(--line-soft)]">
            <NotificationSection
              href="/admin/quotes"
              icon={<MessageSquareText size={15} />}
              label="Demandes de devis"
              count={data?.quotes.count ?? 0}
              items={data?.quotes.items ?? []}
              onNavigate={() => setOpen(false)}
            />
            <NotificationSection
              href="/admin/messages"
              icon={<Inbox size={15} />}
              label="Messages de contact"
              count={data?.messages.count ?? 0}
              items={data?.messages.items ?? []}
              onNavigate={() => setOpen(false)}
            />
          </div>

          {data && total === 0 && (
            <p className="px-4 py-4 text-center text-[12.5px] text-[var(--steel)]">
              Tout est à jour.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function NotificationSection({
  href,
  icon,
  label,
  count,
  items,
  onNavigate,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  count: number;
  items: { id: number; name: string; createdAt: string }[];
  onNavigate: () => void;
}) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[12.5px] font-medium text-[var(--navy-deep)]">
          <span className="text-[var(--red)]">{icon}</span>
          {label}
        </p>
        <span className="font-mono text-[10.5px] uppercase tracking-wide text-[var(--steel)]">
          {count} nouveau{count > 1 ? "x" : ""}
        </span>
      </div>

      {items.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={href}
                onClick={onNavigate}
                className="flex items-baseline justify-between gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-[var(--sand)]"
              >
                <span className="truncate text-[12.5px] text-[var(--navy-deep)]">
                  {item.name}
                </span>
                <span className="shrink-0 font-mono text-[10.5px] text-[var(--steel)]">
                  {dateFormat.format(new Date(item.createdAt))}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1.5 text-[12px] text-[var(--steel)]">Rien de neuf.</p>
      )}

      <Link
        href={href}
        onClick={onNavigate}
        className="mt-2 inline-block font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--red)] transition-colors hover:text-[var(--red-dark)]"
      >
        Tout voir →
      </Link>
    </div>
  );
}
