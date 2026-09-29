CREATE TABLE `billing_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invoice_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`mode` text NOT NULL,
	`payload` text NOT NULL,
	`status` text NOT NULL,
	`number` text,
	`error` text,
	`attempts` integer DEFAULT 0 NOT NULL,
	`lock_until` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `invoice_jobs_user_idx` ON `invoice_jobs` (`user_id`);--> statement-breakpoint
CREATE INDEX `invoice_jobs_status_idx` ON `invoice_jobs` (`status`);--> statement-breakpoint
CREATE TABLE `invoice_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`revision` integer NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_billing` (
	`order_id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL
);
