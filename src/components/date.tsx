"use client";
import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";

import { type ProfileFull } from "~/components/update-profile";

export function TimeDate() {
  const [now, setNow] = useState<dayjs.Dayjs>(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      // Only update if the minute has changed
      if (now.isSame(dayjs(), "minute")) return;
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, [now]);

  return (
    <>
      <p className="text-8xl font-semibold tracking-tight">
        {now.format("h:mm")}
        <span className="ms-2 text-4xl font-normal">{now.format("A")}</span>
      </p>
      <p className="text-3xl font-semibold tracking-tight">
        {now.format("DD MMMM YYYY")}
      </p>
    </>
  );
}

export function TimeGreeting({ profile }: { profile: ProfileFull }) {
  const [now, setNow] = useState<dayjs.Dayjs>(dayjs());

  useEffect(() => {
    const interval = setInterval(() => {
      // Only update if the hour has changed
      if (now.isSame(dayjs(), "hour")) return;
      setNow(dayjs());
    }, 1000);
    return () => clearInterval(interval);
  }, [now]);

  const timeGreeting = useMemo<string>(() => {
    const hour = now.hour();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, [now]);

  return (
    <p className="text-4xl font-bold tracking-tight">
      {timeGreeting}, {profile.name}!
    </p>
  );
}
