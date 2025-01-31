-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `users` (
	`id` text PRIMARY KEY,
	`email` text,
	`first_name` text,
	`last_name` text,
	`logto_id` text,
	`created_at` numeric DEFAULT (CURRENT_TIMESTAMP),
	`role` text DEFAULT 'user',
	`settings` text
);

*/