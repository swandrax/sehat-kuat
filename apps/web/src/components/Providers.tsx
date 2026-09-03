"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "sonner";
import { GlobalNotificationListener } from "./GlobalNotificationListener";
import { ThemeProvider } from "./ThemeProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" richColors />
        <GlobalNotificationListener />
        {children}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
