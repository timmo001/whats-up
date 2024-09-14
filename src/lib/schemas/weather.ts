import { z } from "zod";

import { ValuesSchema } from "~/lib/schemas/tomorrow-io";

//
// Timelines
//
export const WeatherForecastTimelinesSchema = z.object({
  current: ValuesSchema.extend({
    time: z.string(),
  }),
});
export type WeatherForecastTimelines = z.infer<
  typeof WeatherForecastTimelinesSchema
>;

//
// Now
//
export const WeatherForecastNowSchema = z.object({
  time: z.string(),
  cloudBase: z.number().nullish(),
  cloudCeiling: z.number().nullish(),
  cloudCover: z.number().nullish(),
  dewPoint: z.number(),
  freezingRainIntensity: z.number(),
  humidity: z.number(),
  precipitationIntensity: z.number(),
  precipitationProbability: z.number(),
  precipitationType: z.number(),
  pressureSurfaceLevel: z.number(),
  rainIntensity: z.number(),
  sleetIntensity: z.number(),
  snowIntensity: z.number(),
  temperature: z.number(),
  temperatureApparent: z.number(),
  uvHealthConcern: z.number(),
  uvIndex: z.number(),
  visibility: z.number(),
  weatherCode: z.number(),
  windDirection: z.number(),
  windDirectionCardinal: z.string(),
  windGust: z.number(),
  windSpeed: z.number(),
});
export type WeatherForecastNow = z.infer<typeof WeatherForecastNowSchema>;

//
// Weather Code Map
//
export const WeatherCodeMapSchema = z.record(z.string());
export type WeatherCodeMap = z.infer<typeof WeatherCodeMapSchema>;
