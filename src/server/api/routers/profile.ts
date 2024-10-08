import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { profiles } from "~/server/db/schema";

export const profileRouter = createTRPCRouter({
  //
  // Create
  //
  create: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(profiles).values({
        userId: input.userId,
      });
    }),

  //
  // Read
  //
  get: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.profiles.findFirst({
        where: (profiles, { eq }) => eq(profiles.userId, input.userId),
      });

      return post ?? null;
    }),

  //
  // Update
  //
  updateProfile: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
        name: z.string().min(1).optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        calendarURL: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(profiles)
        .set({
          initialised: true,
          name: input.name,
          latitude: input.latitude,
          longitude: input.longitude,
          calendarURL: input.calendarURL,
        })
        .where(eq(profiles.userId, input.userId));
    }),

  //
  // Delete
  //
  delete: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(profiles).where(eq(profiles.userId, input.userId));
    }),
});
