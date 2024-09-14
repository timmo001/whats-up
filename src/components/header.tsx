"use client";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

import { ModeToggle } from "~/components/theme-toggle";
import { Button } from "~/components/ui/button";

export function Header() {
  const pathname = usePathname();

  const title = useMemo<
    Array<{
      name: string;
      href?: string;
    }>
  >(() => {
    switch (pathname) {
      case "/":
        return [];
      // case "/dashboard":
      default:
        return [{ name: "What's Up?", href: "/" }];
    }
  }, [pathname]);

  return (
    <header className="flex w-full items-center justify-between gap-2 px-4 py-3">
      <h1 className="flex flex-1 select-none flex-row gap-4 text-xl font-semibold">
        {title.map((t, i) => (
          <span key={i}>
            {i > 0 && <span className="mr-4 text-gray-400">/</span>}
            {t.href ? <Link href={t.href}>{t.name}</Link> : t.name}
          </span>
        ))}
      </h1>
      <ModeToggle />
      <SignedIn>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <Button>
          <SignInButton mode="modal" />
        </Button>
      </SignedOut>
    </header>
  );
}
