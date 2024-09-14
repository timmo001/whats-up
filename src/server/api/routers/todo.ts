import { eq } from "drizzle-orm";
import { LibSQLDatabase } from "drizzle-orm/libsql";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { todos } from "~/server/db/schema";

async function canAccessItem(
  db: LibSQLDatabase<
    typeof import("/home/aidan/projects/whats-up/src/server/db/schema")
  >,
  { id, userId }: { id: number; userId: string },
) {
  const item = await db.query.todos.findFirst({
    where: (todos, { eq }) => eq(todos.id, id),
  });
  return item && item.userId === userId;
}

export const todoRouter = createTRPCRouter({
  //
  // Create
  //
  create: publicProcedure
    .input(
      z.object({
        content: z.string().min(1),
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(todos).values({
        content: input.content,
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
      const post = await ctx.db.query.todos.findMany({
        where: (todos, { eq }) => eq(todos.userId, input.userId),
        orderBy: (todos, { desc }) => [desc(todos.position)],
      });

      return post ?? null;
    }),

  //
  // Update
  //
  updateCompletion: publicProcedure
    .input(
      z.object({
        id: z.number().min(1),
        completed: z.boolean(),
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        !(await canAccessItem(ctx.db, { id: input.id, userId: input.userId }))
      )
        return;

      await ctx.db
        .update(todos)
        .set({ completed: input.completed })
        .where(eq(todos.id, input.id));
    }),

  updateContent: publicProcedure
    .input(
      z.object({
        id: z.number().min(1),
        content: z.string().min(1),
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        !(await canAccessItem(ctx.db, { id: input.id, userId: input.userId }))
      )
        return;

      await ctx.db
        .update(todos)
        .set({ content: input.content })
        .where(eq(todos.id, input.id));
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
      if (
        !(await canAccessItem(ctx.db, { id: input.id, userId: input.userId }))
      )
        return;

      await ctx.db
        .update(todos)
        .set({ position: input.position })
        .where(eq(todos.id, input.id));
    }),

  //
  // Delete
  //
  delete: publicProcedure
    .input(
      z.object({
        id: z.number().min(1),
        userId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (
        !(await canAccessItem(ctx.db, { id: input.id, userId: input.userId }))
      )
        return;

      await ctx.db.delete(todos).where(eq(todos.id, input.id));
    }),
});
