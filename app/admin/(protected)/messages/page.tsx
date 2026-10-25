import { requireAdmin } from "../../actions";
import AdminShell from "@/components/admin/AdminShell";
import MessagesManager, { type MessageItem } from "@/components/admin/MessagesManager";
import { listContactMessages } from "@/lib/db/queries";

const dateFormat = new Intl.DateTimeFormat("fr-FR", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Africa/Bangui",
});

export default async function AdminMessagesPage() {
  await requireAdmin();
  const messages = await listContactMessages();

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
      <MessagesManager items={items} />
    </AdminShell>
  );
}
