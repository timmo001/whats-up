"use client";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import dayjs, { type Dayjs } from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import { type WeatherForecastErrorResponse } from "~/lib/schemas/tomorrow-io";
import { type WeatherForecastNow } from "~/lib/schemas/weather";
import { getWeatherForecastNow } from "~/lib/serverActions/tomorrow-io";
import { LocationSchema } from "~/lib/schemas/location";
import { weatherCode } from "~/lib/tomorrowio/weather-codes";
import { WeatherIcon } from "~/components/weather-icon";
import { type ProfileFull } from "~/components/update-profile";

dayjs.extend(relativeTime);

export function Weather({ profile }: { profile: ProfileFull }) {
  const forecastNow = useQuery({
    queryKey: [`${profile.latitude},${profile.longitude}`, "forecast", "now"],
    queryFn: async (): Promise<
      WeatherForecastErrorResponse | WeatherForecastNow
    > => {
      const location = LocationSchema.parse({
        latitude: profile.latitude,
        longitude: profile.longitude,
      });
      console.log("Get forecast now for location:", location);
      return getWeatherForecastNow(location);
    },
  });

  const dateTime = useMemo<Dayjs | null>(() => {
    if (
      forecastNow.isLoading ||
      forecastNow.isError ||
      !forecastNow.data ||
      "code" in forecastNow.data
    )
      return null;

    return dayjs(forecastNow.data.time);
  }, [forecastNow.data, forecastNow.isLoading, forecastNow.isError]);

  return (
    <>
      {forecastNow.isLoading ? (
        <span>Loading current forecast...</span>
      ) : forecastNow.isError ? (
        <span>Error loading current forecast.</span>
      ) : !forecastNow.data ? (
        <span>No current forecast data.</span>
      ) : "code" in forecastNow.data ? (
        <span>
          An error occured when loading current forecast data
          {String(forecastNow.data.code).startsWith("429") &&
            ": Too many requests to the API. Please try again later."}
        </span>
      ) : (
        <>
          <div className="flex w-full flex-row justify-between gap-1">
            <div className="flex flex-row items-start justify-center gap-1">
              <WeatherIcon
                className="h-24 w-24"
                code={forecastNow.data.weatherCode}
                night={
                  dateTime
                    ? dateTime.hour() < 6 || dateTime.hour() >= 18
                    : false
                }
              />
              <div className="flex flex-col items-start justify-center gap-1">
                <span className="text-4xl font-bold">
                  {weatherCode[forecastNow.data.weatherCode] ?? "Unknown"}
                </span>
                <div className="flex flex-row items-start gap-1">
                  <span className="text-3xl font-semibold">
                    {forecastNow.data.temperature.toFixed(1)}
                  </span>
                  <span className="text-lg font-semibold">°C</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end justify-center text-base">
              <div className="flex flex-row items-center gap-1">
                <span className="font-semibold">Humidity:</span>
                <span className="font-normal">
                  {forecastNow.data.humidity.toFixed(1)}
                </span>
                <span className="font-normal">%</span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="font-semibold">Pressure:</span>
                <span className="font-normal">
                  {forecastNow.data.pressureSurfaceLevel.toFixed(1)}
                </span>
                <span className="font-normal">hPa</span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="font-semibold">Wind Speed:</span>
                <span className="font-normal">
                  {forecastNow.data.windSpeed.toFixed(1)}
                </span>
                <span className="font-normal">m/s</span>
              </div>
              <div className="flex flex-row items-center gap-1">
                <span className="font-semibold">Wind Direction:</span>
                <span className="font-normal">
                  {forecastNow.data.windDirectionCardinal}
                </span>
                <span className="text-base font-normal">
                  ({forecastNow.data.windDirection}°)
                </span>
              </div>
            </div>
          </div>
          {dateTime && (
            <div className="flex w-full flex-row items-center justify-center gap-1">
              <span className="text-xs font-semibold">Last updated:</span>
              <span className="text-xs font-normal">{dateTime.fromNow()}</span>
            </div>
          )}
        </>
      )}
    </>
  );
}
