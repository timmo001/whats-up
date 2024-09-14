"use client";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from "@clerk/nextjs";
import { MessageCircleQuestion, User } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { ModeToggle } from "~/components/theme-toggle";
import { UpdateProfile } from "~/components/update-profile";

export function Header() {
  const pathname = usePathname();
  const { userId } = useAuth();

  const createProfile = api.profile.create.useMutation({
    onSuccess: () => {
      console.log("Profile created successfully");
      toast.success("Profile created successfully");
      setProfileDialogOpen(true);
    },
    onError: (error) => {
      console.error("Error creating profile:", error);
      toast.error("Error creating profile. See console for more details.");
    },
  });

  const initialProfile = api.profile.get.useQuery({ userId: userId! });

  const [profileDialogOpen, setProfileDialogOpen] = useState<boolean>(false);

  function onCreateProfile() {
    if (!userId) {
      const message = "Error create profile: User ID not found";
      console.error(message);
      toast.error(message);
      return;
    }

    if (initialProfile.data) {
      console.log("Profile already exists");
      setProfileDialogOpen(true);
      return;
    }

    createProfile.mutate({ userId: userId });
  }

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
      {/* Initialise Dialog */}
      <AlertDialog
        open={
          !initialProfile.isLoading &&
          initialProfile.isSuccess &&
          !initialProfile.data?.initialised
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Welcome!</AlertDialogTitle>
            <AlertDialogDescription>
              To get started, please create a profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={onCreateProfile}>
              Create Profile
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Profile Dialog */}
      <UpdateProfile
        open={profileDialogOpen}
        initialProfile={initialProfile.data}
        onClose={() => setProfileDialogOpen(false)}
      />
    </>
  );
}
