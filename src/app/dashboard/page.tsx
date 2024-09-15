import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { api } from "~/trpc/server";
import { TimeDate, TimeGreeting } from "~/components/date";
import { Tasks } from "~/components/tasks";
import { Weather } from "~/components/weather";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  const profile = await api.profile.get({ userId: user.id });
  void api.profile.get.prefetch({ userId: user.id });
  if (!profile) redirect("/");

  return (
    <main
      className="grid min-h-screen w-full grid-cols-1 gap-6 lg:grid-cols-8"
      style={{
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Greeting */}
      <section className="flex w-full flex-col items-center justify-end p-6 lg:col-span-8">
        <TimeGreeting profile={profile} />
      </section>
      {/* Time/Date */}
      <section className="flex w-full flex-col items-center justify-end gap-1 px-6 pt-6 lg:col-span-8">
        <TimeDate />
      </section>
      {/* Tasks */}
      <section className="flex w-full flex-col items-start justify-end gap-1 px-6 pb-6 lg:col-span-3 lg:px-0 lg:ps-6">
        <Tasks userId={user.id} />
      </section>
      {/* Agenda */}
      <section className="flex w-full flex-col items-center justify-end gap-1 px-6 pb-6 lg:col-span-2 lg:px-0">
        {/* <Agenda /> */}
      </section>
      {/* Weather */}
      <section className="flex w-full flex-col items-end justify-end gap-2 px-6 pb-6 lg:col-span-3 lg:px-0 lg:pe-6">
        <Weather profile={profile} />
      </section>
    </main>
  );
}
