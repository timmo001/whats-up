"use client";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { MessageCircleQuestion, User } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { ModeToggle } from "~/components/theme-toggle";
import { UpdateProfile } from "~/components/update-profile";

export function Header() {
  const pathname = usePathname();
  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);

  const title = useMemo<
    Array<{
      name: string;
      href?: string;
      icon?: React.ReactNode;
    }>
  >(() => {
    switch (pathname) {
      case "/":
        return [];
      // case "/dashboard":
      default:
        return [
          {
            name: "What's Up?",
            href: "/",
            icon: <MessageCircleQuestion size={22} />,
          },
        ];
    }
  }, [pathname]);

  return (
    <>
      <header className="flex w-full items-center justify-between gap-2 px-4 py-3">
        <h1 className="flex flex-1 select-none flex-row gap-4 text-xl font-semibold">
          {title.map((t, i) => (
            <span key={i}>
              {i > 0 && <span className="mr-4 text-gray-400">/</span>}
              {t.href ? (
                <Link href={t.href}>
                  <span className="flex items-center gap-1">
                    {t.icon}
                    {t.name}
                  </span>
                </Link>
              ) : (
                t.name
              )}
            </span>
          ))}
        </h1>
        <ModeToggle />
        <SignedIn>
          <UserButton>
            <UserButton.MenuItems>
              <UserButton.Action
                label="Update Profile"
                labelIcon={<User size={16} />}
                onClick={() => setProfileDialogOpen(true)}
              />
            </UserButton.MenuItems>
          </UserButton>
        </SignedIn>
        <SignedOut>
          <Button>
            <SignInButton mode="modal" />
          </Button>
        </SignedOut>
      </header>
      <UpdateProfile
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
      />
    </>
  );
}
