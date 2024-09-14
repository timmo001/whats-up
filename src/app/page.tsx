import { SignedIn, SignedOut, SignUpButton } from "@clerk/nextjs";
import { MessageCircleQuestion } from "lucide-react";
import Link from "next/link";

import { Button } from "~/components/ui/button";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  return (
    <>
      <section className="flex w-full flex-col items-center gap-3">
        <h1 className="flex items-center gap-3 text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <MessageCircleQuestion size={82} />
          What&apos;s Up?
        </h1>
        <p className="text-xl">Track your day from one place</p>
      </section>
      <section className="flex flex-row items-center justify-center gap-8">
        <SignedOut>
          <Button variant="default">
            <SignUpButton mode="modal">Sign Up</SignUpButton>
          </Button>
        </SignedOut>
        <SignedIn>
          <Link href="/dashboard">
            <Button variant="default">Dashboard</Button>
          </Link>
        </SignedIn>
      </section>
      <section className="flex flex-col items-center justify-center gap-8">
        <h2 className="text-3xl font-semibold">Features</h2>
        <p className="text-xl font-light">TODO</p>
      </section>
    </>
  );
}
