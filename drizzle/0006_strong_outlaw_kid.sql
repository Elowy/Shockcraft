ALTER TABLE `plans` ADD `state` text DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE `plans` ADD `state_changed_at` text;