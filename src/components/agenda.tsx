"use client";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { type ProfileFull } from "~/components/update-profile";
import { getCalendarEvents } from "~/lib/serverActions/calendar";

export function Agenda({ profile }: { profile: ProfileFull }) {
  const [now, setNow] = useState<dayjs.Dayjs>(dayjs());

  const {
    data: events,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["calendar"],
    queryFn: async () => {
      if (!profile.calendarURL) return [];
      const events = await getCalendarEvents(profile.calendarURL);
      const dateNow = dayjs();
      // Only return events that have not ended and are not in the past
      return events
        .map((e) => ({
          ...e,
          start: dayjs(e.start),
          end: dayjs(e.end),
        }))
        .filter(
          (event) =>
            // Only return events that have not ended and are not in the past
            event.end.isAfter(dateNow) || event.start.isAfter(dateNow),
        )
        .filter((event) =>
          // Return events for the next month
          event.start.isBefore(dateNow.add(1, "month")),
        )
        .sort((a, b) => a.start.diff(b.start));
    },
  });

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
      <h2 className="mb-1 w-full max-w-full text-center text-3xl font-semibold tracking-tight xl:max-w-[26rem]">
        Agenda
      </h2>
      {isLoading ? (
        <span>Loading agenda...</span>
      ) : isError ? (
        <span>Error loading agenda.</span>
      ) : !events ? (
        <span>No events found.</span>
      ) : (
        <div className="w-full max-w-full xl:max-w-[26rem]">
          <div className="custom-scrollbar flex flex-col gap-2 overflow-y-auto px-3 py-1 xl:max-h-[33vh]">
            {events?.map((event) => (
              <div
                key={event.summary}
                className="flex h-10 w-full flex-row justify-between whitespace-nowrap rounded-md border border-input bg-background/60 px-3 py-2 ring-offset-background"
              >
                <span className="max-w-[50%] flex-1 overflow-hidden overflow-ellipsis text-start text-base text-muted-foreground">
                  {event.summary}
                </span>
                <span className="overflow-hidden overflow-ellipsis text-end text-sm text-muted-foreground">
                  {!event.start.isSame(now, "day")
                    ? event.start.format(
                        `DD/MM${event.start.isAfter(now, "year") ? "/YY" : ""} `,
                      )
                    : ""}
                  {event.start.format("HH:mm") !== "00:00"
                    ? event.start.format("HH:mm")
                    : ""}
                  {" - "}
                  {!event.end.isSame(now, "day")
                    ? event.end.format(
                        `DD/MM${event.end.isAfter(now, "year") ? "/YY" : ""} `,
                      )
                    : ""}
                  {event.end.format("HH:mm") !== "00:00"
                    ? event.end.format("HH:mm")
                    : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
