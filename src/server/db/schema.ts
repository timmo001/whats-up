// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `whats-up_${name}`);

export const todos = createTable(
  "todo",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    completed: int("completed", { mode: "boolean" }).default(false),
    content: text("content", {}),
    position: int("position", { mode: "number" }).default(0),
    userId: text("user_id", { length: 256 }),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    userIdIndex: index("user_id_idx").on(example.userId),
  }),
);
