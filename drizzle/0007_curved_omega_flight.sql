CREATE TABLE `plan_versions` (
	`project_id` text NOT NULL,
	`revision` integer NOT NULL,
	`data` text NOT NULL,
	`saved_at` text NOT NULL,
	PRIMARY KEY(`project_id`, `revision`)
);
