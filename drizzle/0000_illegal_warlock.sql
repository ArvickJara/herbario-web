CREATE TABLE `benefits` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`plant_id` text NOT NULL,
	FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `plants` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`commonName` text NOT NULL,
	`scientificName` text,
	`description` text,
	`image_url` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `plants_slug_unique` ON `plants` (`slug`);--> statement-breakpoint
CREATE TABLE `usage_methods` (
	`id` text PRIMARY KEY NOT NULL,
	`description` text NOT NULL,
	`plant_id` text NOT NULL,
	FOREIGN KEY (`plant_id`) REFERENCES `plants`(`id`) ON UPDATE no action ON DELETE cascade
);
