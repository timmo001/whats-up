import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { api } from "~/trpc/server";
import { TimeDate, TimeGreeting } from "~/components/date";
import { Tasks } from "~/components/tasks";

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
      <section className="flex w-full flex-col items-center">
        <TimeGreeting profile={profile} />
      </section>
      {/* Time/Date */}
      <section className="flex w-full flex-col items-center gap-1">
        <TimeDate />
      </section>
      {/* Agenda */}
      <section className="flex w-full flex-col items-center gap-3">
        {/* <Agenda /> */}
      </section>
      {/* Weather */}
      <section className="flex w-full flex-col items-center gap-3">
        {/* <Weather /> */}
      </section>
      {/* Tasks */}
      <section className="flex w-full flex-col items-center gap-1">
        <Tasks userId={user.id} />
      </section>
    </>
  );
}
