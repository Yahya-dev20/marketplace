export type Notification = {
  id: number;
  orderId: number | null;
  message: string;
  read: boolean;
  createdAt: string;
};

const API = "/api/notifications";

async function readResponse<T>(response: Response): Promise<T> {
  if (!response.ok) throw new Error(`Erreur notifications HTTP ${response.status}`);
  return response.json();
}

export async function getNotifications(userId: number): Promise<Notification[]> {
  return readResponse(await fetch(`${API}/users/${userId}`));
}

export async function markNotificationRead(id: number): Promise<Notification> {
  return readResponse(await fetch(`${API}/${id}/read`, { method: "PUT" }));
}
