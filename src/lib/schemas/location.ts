import { z } from "zod";

//
// Setup a schema for the location object
//
export const LocationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

// Infer the type from the schema
export type Location = z.infer<typeof LocationSchema>;
