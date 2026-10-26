export type NotificationItem = {
  id: number;
  name: string;
  createdAt: string;
};

export type NotificationsPayload = {
  quotes: { count: number; items: NotificationItem[] };
  messages: { count: number; items: NotificationItem[] };
};
