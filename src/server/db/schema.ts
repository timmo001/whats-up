// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  int,
  real,
  sqliteTableCreator,
  text,
} from "drizzle-orm/sqlite-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `whats-up_${name}`);

export const profiles = createTable(
  "profile",
  {
    userId: text("user_id", { length: 256 }).primaryKey(),
    name: text("name", { length: 256 }),
    latitude: real("latitude"),
    longitude: real("longitude"),
    initialised: int("initialised", { mode: "boolean" }).default(false),
    createdAt: int("created_at", { mode: "timestamp" })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: int("updated_at", { mode: "timestamp" }).$onUpdate(
      () => new Date(),
    ),
  },
  (example) => ({
    nameIndex: index("profile_name_idx").on(example.name),
  }),
);

export const tasks = createTable(
  "task",
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
    userIdIndex: index("task_user_id_idx").on(example.userId),
  }),
);
