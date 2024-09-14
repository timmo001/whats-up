import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import Link from "next/link";

import { Button } from "~/components/ui/button";

export default async function HomePage() {
  return (
    <>
      <section className="flex w-full flex-col items-center gap-3">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          What's Up?
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
    </>
  );
}
