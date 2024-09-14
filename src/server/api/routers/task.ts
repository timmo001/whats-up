import { eq } from "drizzle-orm";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { tasks } from "~/server/db/schema";

const SingleItemSchema = z.object({
  id: z.number().min(1),
  userId: z.string().min(1),
});
type SingleItem = z.infer<typeof SingleItemSchema>;

async function canAccessItem({
  db,
  input,
}: {
  // eslint-disable-next-line @typescript-eslint/consistent-type-imports
  db: LibSQLDatabase<typeof import("~/server/db/schema")>;
  input: SingleItem;
}): Promise<boolean> {
  const item = await db.query.tasks.findFirst({
    where: (tasks, { eq }) => eq(tasks.id, input.id),
  });
  return item?.userId === input.userId || false;
}

export const taskRouter = createTRPCRouter({
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
      await ctx.db.insert(tasks).values({
        content: "",
        userId: input.userId,
      });
    }),

  //
  // Read
  //
  getAll: publicProcedure
    .input(
      z.object({
        userId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db.query.tasks.findMany({
        where: (tasks, { eq }) => eq(tasks.userId, input.userId),
        orderBy: (tasks, { asc, desc }) => [
          desc(tasks.position),
          asc(tasks.createdAt),
        ],
      });

      return items ?? null;
    }),

  //
  // Update
  //
  updateCompletion: publicProcedure
    .input(
      SingleItemSchema.extend({
        completed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!(await canAccessItem({ db: ctx.db, input }))) return;

      await ctx.db
        .update(tasks)
        .set({ completed: input.completed })
        .where(eq(tasks.id, input.id));
    }),

  updateContent: publicProcedure
    .input(
      SingleItemSchema.extend({
        content: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!(await canAccessItem({ db: ctx.db, input }))) return;

      await ctx.db
        .update(tasks)
        .set({ content: input.content })
        .where(eq(tasks.id, input.id));
    }),

  updatePosition: publicProcedure
    .input(
      z.object({
        id: z.number().min(1),
        position: z.number().min(0),
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!(await canAccessItem({ db: ctx.db, input }))) return;

      await ctx.db
        .update(tasks)
        .set({ position: input.position })
        .where(eq(tasks.id, input.id));
    }),

  //
  // Delete
  //
  delete: publicProcedure
    .input(SingleItemSchema)
    .mutation(async ({ ctx, input }) => {
      if (!(await canAccessItem({ db: ctx.db, input }))) return;

      await ctx.db.delete(tasks).where(eq(tasks.id, input.id));
    }),
});
