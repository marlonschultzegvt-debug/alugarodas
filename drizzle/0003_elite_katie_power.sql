CREATE TABLE `client_interests` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`vehicleKey` varchar(160) NOT NULL,
	`vehicleLabel` varchar(220) NOT NULL,
	`message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `client_interests_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `favorites` DROP INDEX `favorites_user_vehicle_unique`;--> statement-breakpoint
ALTER TABLE `favorites` DROP FOREIGN KEY `favorites_vehicleId_vehicles_id_fk`;
--> statement-breakpoint
ALTER TABLE `favorites` MODIFY COLUMN `vehicleId` int;--> statement-breakpoint
ALTER TABLE `favorites` ADD `vehicleKey` varchar(160) NOT NULL;--> statement-breakpoint
ALTER TABLE `favorites` ADD CONSTRAINT `favorites_user_vehicle_key_unique` UNIQUE(`userId`,`vehicleKey`);--> statement-breakpoint
ALTER TABLE `client_interests` ADD CONSTRAINT `client_interests_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `client_interests_user_idx` ON `client_interests` (`userId`);--> statement-breakpoint
CREATE INDEX `client_interests_created_idx` ON `client_interests` (`createdAt`);