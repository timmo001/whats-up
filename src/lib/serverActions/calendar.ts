"use server";
import "server-only";
import dayjs from "dayjs";
import ICAL from "ical.js";

export async function getCalendarEvents(calendarURL: string) {
  const response = await fetch(calendarURL);
  const icalData = await response.text();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const jcalData = ICAL.parse(icalData);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const comp = new ICAL.Component(jcalData);
  return comp.getAllSubcomponents("vevent").map((vevent) => {
    const event = new ICAL.Event(vevent);
    return {
      summary: event.summary,
      start: event.startDate.toJSDate(),
      end: event.endDate.toJSDate(),
    };
  });
}
