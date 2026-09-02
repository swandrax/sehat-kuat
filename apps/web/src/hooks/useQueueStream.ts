"use client";

import { useEffect, useState } from "react";

export interface QueuePayload {
  action?: string;
  queue?: {
    id: string;
    queueNumber: number;
    status: string;
    date: string;
    calledAt?: string | null;
    completedAt?: string | null;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export function useQueueStream(doctorId?: string) {
  const [liveQueue, setLiveQueue] = useState<QueuePayload | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!doctorId) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";
    const eventSource = new EventSource(`${baseUrl}/queues/stream/${doctorId}`);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.addEventListener("queue-update", (event) => {
      try {
        const data = JSON.parse(event.data) as QueuePayload;
        setLiveQueue(data);
      } catch (err) {
        console.error("Failed to parse queue SSE event:", err);
      }
    });

    eventSource.onerror = (err) => {
      console.error("Queue SSE connection error:", err);
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, [doctorId]);

  return { liveQueue, isConnected };
}
