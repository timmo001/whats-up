import { eq } from "drizzle-orm";
import { type LibSQLDatabase } from "drizzle-orm/libsql";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { todos } from "~/server/db/schema";

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
  const item = await db.query.todos.findFirst({
    where: (todos, { eq }) => eq(todos.id, input.id),
  });
  return item?.userId === input.userId || false;
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
      SingleItemSchema.extend({
        completed: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!(await canAccessItem({ db: ctx.db, input }))) return;

      await ctx.db
        .update(todos)
        .set({ completed: input.completed })
        .where(eq(todos.id, input.id));
    }),

  updateContent: publicProcedure
    .input(
      SingleItemSchema.extend({
        content: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!(await canAccessItem({ db: ctx.db, input }))) return;

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
      if (!(await canAccessItem({ db: ctx.db, input }))) return;

      await ctx.db
        .update(todos)
        .set({ position: input.position })
        .where(eq(todos.id, input.id));
    }),

  //
  // Delete
  //
  delete: publicProcedure
    .input(SingleItemSchema)
    .mutation(async ({ ctx, input }) => {
      if (!(await canAccessItem({ db: ctx.db, input }))) return;

      await ctx.db.delete(todos).where(eq(todos.id, input.id));
    }),
});
