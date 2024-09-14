import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { api } from "~/trpc/server";
import { TimeDate, TimeGreeting } from "~/components/date";

export const dynamic = "force-dynamic";

// TODO: Get additonal data from client queries (tanstack query)

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const profile = await api.profile.get({ userId: user.id });
  void api.profile.get.prefetch({ userId: user.id });
  if (!profile) redirect("/");

  return (
    <>
      {/* Greeting */}
      <section className="flex w-full flex-col items-center gap-3">
        <TimeGreeting profile={profile} />
      </section>
      {/* Time/Date */}
      <section className="flex w-full flex-col items-center gap-3">
        <TimeDate />
      </section>
      {/* Tasks */}
      <section className="flex w-full flex-col items-center gap-3">
        <p className="text-3xl font-semibold tracking-tight">Tasks</p>
      </section>
    </>
  );
}
