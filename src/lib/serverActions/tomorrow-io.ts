"use server";
import "server-only";
import { unstable_cache } from "next/cache";

import { env } from "~/env";
import { type Location } from "~/lib/schemas/location";
import {
  type WeatherForecastErrorResponse,
  type Timelines,
  ValuesSchema,
} from "~/lib/schemas/tomorrow-io";
import {
  getWindDirectionCardinalFromDegrees,
  getZodSchemaFieldsShallow,
} from "~/lib/utils";
import {
  type WeatherForecastNow,
  type WeatherForecastTimelines,
  WeatherForecastNowSchema,
  WeatherForecastTimelinesSchema,
} from "~/lib/schemas/weather";

//
// Get the current weather data for a location
//
export async function getWeatherForecastTimelines(
  location: Location,
  timezone = "auto",
  units = "metric",
): Promise<WeatherForecastErrorResponse | WeatherForecastTimelines> {
  const cachedResponseData = await unstable_cache(
    async (): Promise<WeatherForecastErrorResponse | Timelines> => {
      const url = new URL("https://api.tomorrow.io/v4/timelines");
      url.searchParams.append("apikey", env.WEATHER_API_KEY);
      url.searchParams.append(
        "location",
        `${location.latitude},${location.longitude}`,
      );
      url.searchParams.append(
        "fields",
        Object.keys(getZodSchemaFieldsShallow(ValuesSchema)).join(","),
      );
      url.searchParams.append("units", units);
      url.searchParams.append("timesteps", "current");
      url.searchParams.append("startTime", "now");
      url.searchParams.append("endTime", "nowPlus5d");
      url.searchParams.append("timezone", timezone);

      console.log("Get weather timelines for location:", location, url);
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Accept-Encoding": "gzip",
        },
      });

      const responseData = (await response.json()) as
        | WeatherForecastErrorResponse
        | Timelines;
      console.log("New response:", JSON.stringify(responseData));

      return responseData;
    },
    [`${location.latitude},${location.longitude}`],
    {
      tags: ["timelines"],
      revalidate: 60 * 4, // 4 minutes
    },
  )();

  // If there is an error, return it so the client can handle it
  if ("code" in cachedResponseData) return cachedResponseData;

  console.log(
    "Got weather forecast timelines:",
    JSON.stringify({
      data: {
        timelines: cachedResponseData.data.timelines.map((timeline) => ({
          timestep: timeline.timestep,
          startTime: timeline.startTime,
          endTime: timeline.endTime,
          intervals: timeline.intervals.length,
        })),
        warnings: cachedResponseData.data.warnings,
      },
    }),
  );

  const currentData = cachedResponseData.data.timelines.find(
    (timeline) => timeline.timestep === "current",
  );
  if (!currentData?.intervals?.[0]?.values) {
    console.error("No current data in response:", currentData);
    return {
      code: 500,
      message: "No current data in response",
      type: "error",
    };
  }

  return WeatherForecastTimelinesSchema.parse({
    current: {
      time: currentData.intervals[0].startTime,
      ...currentData.intervals[0].values,
    },
  });
}

//
// Get the current weather forecast for a location
//
export async function getWeatherForecastNow(
  location: Location,
  timezone = "auto",
  units = "metric",
): Promise<WeatherForecastErrorResponse | WeatherForecastNow> {
  const timelines = await getWeatherForecastTimelines(
    location,
    timezone,
    units,
  );
  // If there is an error, return it so the client can handle it
  if ("code" in timelines) return timelines;

  console.log("Got weather forecast now:", JSON.stringify(timelines.current));

  if (!timelines.current.windDirection) {
    console.error(
      "No wind direction in current weather data:",
      timelines.current,
    );
    return {
      code: 500,
      message: "No wind direction in current weather data",
      type: "error",
    };
  }

  return WeatherForecastNowSchema.parse({
    ...timelines.current,
    windDirectionCardinal: getWindDirectionCardinalFromDegrees(
      timelines.current.windDirection,
    ),
  });
}
