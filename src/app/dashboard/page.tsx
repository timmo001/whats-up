import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect("/");

  return (
    <>
      <section className="flex w-full flex-col items-center gap-3">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          TODO
        </h1>
      </section>
      <section className="flex w-full flex-col items-center gap-3"></section>
    </>
  );
}
