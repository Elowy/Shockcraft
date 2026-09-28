CREATE TABLE `billing_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`mode` text NOT NULL,
	`order_id` text NOT NULL,
	`customer_id` text NOT NULL,
	`status` text NOT NULL,
	`paid_until` integer DEFAULT 0 NOT NULL,
	`cancel_at_period_end` integer DEFAULT 0 NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `billing_subscriptions_order_id_unique` ON `billing_subscriptions` (`order_id`);--> statement-breakpoint
CREATE INDEX `billing_subscriptions_user_mode_idx` ON `billing_subscriptions` (`user_id`,`mode`);--> statement-breakpoint
CREATE TABLE `subscription_checkouts` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `billing_orders` ADD `kind` text DEFAULT 'project' NOT NULL;