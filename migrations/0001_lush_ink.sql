CREATE TABLE `whats-up_profile` (
	`user_id` text(256) PRIMARY KEY NOT NULL,
	`name` text(256)
);
--> statement-breakpoint
DROP INDEX IF EXISTS `user_id_idx`;--> statement-breakpoint
CREATE INDEX `profile_name_idx` ON `whats-up_profile` (`name`);--> statement-breakpoint
CREATE INDEX `todo_user_id_idx` ON `whats-up_todo` (`user_id`);