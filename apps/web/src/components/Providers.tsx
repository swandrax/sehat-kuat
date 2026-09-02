"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { GlobalNotificationListener } from "./GlobalNotificationListener";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" richColors />
      <GlobalNotificationListener />
      {children}
    </QueryClientProvider>
  );
}
