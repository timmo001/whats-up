ALTER TABLE `whats-up_profile` ADD `created_at` integer DEFAULT (unixepoch()) NOT NULL;--> statement-breakpoint
ALTER TABLE `whats-up_profile` ADD `updated_at` integer;