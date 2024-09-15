import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { api } from "~/trpc/server";
import { Agenda } from "~/components/agenda";
import { Tasks } from "~/components/tasks";
import { TimeDate, TimeGreeting } from "~/components/date";
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
      className="grid min-h-screen w-full grid-cols-1 gap-3 xl:grid-cols-9"
      style={{
        minHeight: "calc(100vh - 64px)",
      }}
    >
      {/* Greeting */}
      <section className="col-span-1 flex w-full flex-col items-center justify-start gap-1 p-6 text-center xl:col-span-9">
        <TimeGreeting profile={profile} />
      </section>
      {/* Time/Date */}
      <section className="col-span-1 flex w-full flex-col items-center justify-start gap-1 p-6 text-center xl:col-span-9">
        <TimeDate />
      </section>
      {/* Weather */}
      <section className="col-span-1 flex w-full flex-col items-start justify-end gap-1 p-6 px-6 pb-6 xl:col-span-3 xl:p-0 xl:px-0 xl:pb-6 xl:ps-6">
        <Weather profile={profile} />
      </section>
      {/* Agenda */}
      <section className="col-span-1 flex w-full flex-col items-center justify-end gap-1 px-6 pb-6 xl:col-span-3 xl:px-0">
        {profile.calendarURL && <Agenda profile={profile} />}
      </section>
      {/* Tasks */}
      <section className="col-span-1 flex w-full flex-col items-end justify-end gap-2 px-6 pb-6 xl:col-span-3 xl:px-0 xl:pe-6">
        <Tasks userId={user.id} />
      </section>
    </main>
  );
}
