import { requireAdmin } from "@/lib/admin-guard";
import AdminShell from "@/components/admin/AdminShell";
import MessagesManager, { type MessageItem } from "@/components/admin/MessagesManager";
import { countContactMessages, listContactMessages } from "@/lib/db/queries";
import type { ContactMessage } from "@/lib/db/queries";

const PAGE_SIZE = 6;
const STATUSES: readonly ContactMessage["status"][] = ["new", "read", "archived"];

type SearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Africa/Bangui",
});

export default async function AdminMessagesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  await requireAdmin();

  const params = await searchParams;
  const rawPage = Number(first(params.page));
  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const query = (first(params.q) ?? "").slice(0, 80);
  const rawStatus = first(params.status) ?? "all";
  const status = STATUSES.includes(rawStatus as ContactMessage["status"])
    ? (rawStatus as ContactMessage["status"])
    : "all";

  const [messages, total] = await Promise.all([
    listContactMessages({
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
      query,
      status,
    }),
    countContactMessages({ query, status }),
  ]);

  // Formatage côté serveur : la date reste identique après hydratation.
  const items: MessageItem[] = messages.map((message) => ({
    id: message.id,
    name: message.name,
    email: message.email,
    phone: message.phone,
    message: message.message,
    status: message.status,
    createdAt: dateFormat.format(new Date(message.created_at)),
  }));

  return (
    <AdminShell title="Messages de contact">
      <MessagesManager
        items={items}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        query={query}
        status={status}
      />
    </AdminShell>
  );
}
