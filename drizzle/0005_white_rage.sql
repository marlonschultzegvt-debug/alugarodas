ALTER TABLE `vehicles` ADD `isFeatured` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `vehicles` ADD `featuredOrder` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `vehicles` ADD `featuredAt` timestamp;