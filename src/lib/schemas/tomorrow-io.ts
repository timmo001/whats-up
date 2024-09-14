import { z } from "zod";

//
// Error
//
export const WeatherForecastErrorResponseSchema = z.object({
  code: z.number(),
  type: z.string(),
  message: z.string(),
});
export type WeatherForecastErrorResponse = z.infer<
  typeof WeatherForecastErrorResponseSchema
>;

//
// Timelines
//
export const ValuesSchema = z.object({
  // Now
  cloudBase: z.number().nullish(),
  cloudCeiling: z.number().nullish(),
  cloudCover: z.number().nullish(),
  dewPoint: z.number().nullish(),
  freezingRainIntensity: z.number().nullish(),
  humidity: z.number().nullish(),
  precipitationIntensity: z.number().nullish(),
  precipitationProbability: z.number().nullish(),
  precipitationType: z.number().nullish(),
  pressureSurfaceLevel: z.number().nullish(),
  rainIntensity: z.number().nullish(),
  sleetIntensity: z.number().nullish(),
  snowIntensity: z.number().nullish(),
  temperature: z.number().nullish(),
  temperatureApparent: z.number().nullish(),
  uvHealthConcern: z.number().nullish(),
  uvIndex: z.number().nullish(),
  visibility: z.number().nullish(),
  weatherCode: z.number().nullish(),
  windDirection: z.number().nullish(),
  windGust: z.number().nullish(),
  windSpeed: z.number().nullish(),
});
export type Values = z.infer<typeof ValuesSchema>;

export const MetaSchema = z.object({
  from: z.string(),
  to: z.string(),
  timestep: z.string(),
});
export type Meta = z.infer<typeof MetaSchema>;

export const IntervalSchema = z.object({
  startTime: z.coerce.string(),
  values: ValuesSchema.nullish(),
});
export type Interval = z.infer<typeof IntervalSchema>;

export const WarningSchema = z.object({
  code: z.number(),
  type: z.string(),
  message: z.string(),
  meta: MetaSchema,
});
export type Warning = z.infer<typeof WarningSchema>;

export const TimelineElementSchema = z.object({
  timestep: z.enum(["current", "1h", "1d"]),
  endTime: z.coerce.string(),
  startTime: z.coerce.string(),
  intervals: z.array(IntervalSchema),
});
export type TimelineElement = z.infer<typeof TimelineElementSchema>;

export const DataSchema = z.object({
  timelines: z.array(TimelineElementSchema),
  warnings: z.array(WarningSchema),
});
export type Data = z.infer<typeof DataSchema>;

export const TimelinesSchema = z.object({
  data: DataSchema,
});
export type Timelines = z.infer<typeof TimelinesSchema>;
