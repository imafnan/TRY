"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/store/authStore";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60 * 1000, retry: 1 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0d2353",
              color: "#fff",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
            },
            success: { iconTheme: { primary: "#4ade80", secondary: "#fff" } },
            error: { iconTheme: { primary: "#f87171", secondary: "#fff" } },
          }}
        />
        <ReactQueryDevtools initialIsOpen={false} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
