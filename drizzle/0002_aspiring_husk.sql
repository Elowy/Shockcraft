CREATE TABLE `billing_grants` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`project_id` text,
	`mode` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `billing_grants_project_unique` ON `billing_grants` (`user_id`,`project_id`);--> statement-breakpoint
CREATE INDEX `billing_grants_user_idx` ON `billing_grants` (`user_id`);--> statement-breakpoint
CREATE TABLE `billing_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`amount` integer NOT NULL,
	`currency` text NOT NULL,
	`mode` text NOT NULL,
	`status` text NOT NULL,
	`session_id` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `billing_orders_session_unique` ON `billing_orders` (`session_id`);--> statement-breakpoint
CREATE INDEX `billing_orders_user_idx` ON `billing_orders` (`user_id`);--> statement-breakpoint
CREATE TABLE `billing_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL
);
