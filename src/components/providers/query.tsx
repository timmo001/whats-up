"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a new instance of the tanstack react query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
      retryDelay: (attemptIndex) => Math.min(5000 * 2 ** attemptIndex, 60000), // 5s, 10s, 20s, 40s, 60s
    },
  },
});

// Wrap the app in the query provider
export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
