"use client";

import { useEffect, useState } from "react";

export interface NotificationPayload {
  id?: string;
  userId?: string;
  type?: string;
  title?: string;
  message?: string;
  isRead?: boolean;
  createdAt?: string;
  [key: string]: unknown;
}

export function useNotificationStream(userId?: string) {
  const [latestNotification, setLatestNotification] = useState<NotificationPayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    const eventSource = new EventSource(`${baseUrl}/notifications/stream/${userId}`);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.addEventListener("notification", (event) => {
      try {
        const data = JSON.parse(event.data) as NotificationPayload;
        setLatestNotification(data);
      } catch (err) {
        console.error("Failed to parse notification SSE event:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("Notification SSE connection error:", err);
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [userId]);

  return { latestNotification, isConnected };
}
