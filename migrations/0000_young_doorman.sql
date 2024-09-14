CREATE TABLE `whats-up_todo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`completed` integer DEFAULT false,
	`content` text,
	`position` integer DEFAULT 0,
	`user_id` text(256),
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `user_id_idx` ON `whats-up_todo` (`user_id`);