ALTER TABLE `whats-up_todo` RENAME TO `whats-up_task`;--> statement-breakpoint
DROP INDEX IF EXISTS `todo_user_id_idx`;--> statement-breakpoint
CREATE INDEX `task_user_id_idx` ON `whats-up_task` (`user_id`);