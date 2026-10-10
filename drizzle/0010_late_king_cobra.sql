CREATE TABLE `plan_shares` (
	`id` text PRIMARY KEY NOT NULL,
	`token_hash` text NOT NULL,
	`owner_id` text NOT NULL,
	`project_id` text NOT NULL,
	`project_key` text NOT NULL,
	`label` text DEFAULT '' NOT NULL,
	`allow_pdf` integer DEFAULT 0 NOT NULL,
	`auth_version` integer NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	`last_viewed_at` integer,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `plan_shares_token_unique` ON `plan_shares` (`token_hash`);--> statement-breakpoint
CREATE INDEX `plan_shares_owner_project_idx` ON `plan_shares` (`owner_id`,`project_key`);--> statement-breakpoint
CREATE INDEX `plan_shares_expiry_idx` ON `plan_shares` (`expires_at`);