import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { baseUrl } from "~/app/sitemap";
import { cn } from "~/lib/utils";
import { HydrateClient } from "~/trpc/server";
import { TRPCReactProvider } from "~/trpc/react";
import { Header } from "~/components/header";
import { ThemeProvider } from "~/components/theme-provider";
import { Toaster } from "~/components/ui/sonner";
import { QueryProvider } from "~/components/providers/query";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const baseUrlObj = new URL(baseUrl);

export const metadata: Metadata = {
  title: "What's Up?",
  description: "Track your day from one place",
  keywords: [
    "dashboard",
    "notes",
    "notifications",
    "organization",
    "todo",
    "weather",
  ],
  icons: [{ rel: "icon", url: "/icon" }],
  metadataBase: baseUrlObj,
  openGraph: {
    images: [
      {
        url: "/api/og",
      },
    ],
    siteName: "What's Up?",
    url: baseUrlObj,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-gradient-to-b from-indigo-500 to-background font-sans antialiased dark:from-indigo-950",
            fontSans.variable,
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QueryProvider>
              <TRPCReactProvider>
                <HydrateClient>
                  <Header />
                  {children}
                  <Toaster />
                </HydrateClient>
              </TRPCReactProvider>
            </QueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
