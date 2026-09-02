"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useNotificationStream } from "@/hooks/useNotificationStream";
import { useAuthStore } from "@/stores/authStore";

export function GlobalNotificationListener() {
  const { user } = useAuthStore();
  const { latestNotification } = useNotificationStream(user?.id);

  useEffect(() => {
    if (latestNotification) {
      toast(latestNotification.title || "Notifikasi Baru", {
        description: latestNotification.message || "Anda mendapat pesan baru.",
        action: {
          label: "Lihat",
          onClick: () => console.log("Lihat notifikasi", latestNotification)
        }
      });
    }
  }, [latestNotification]);

  return null;
}
