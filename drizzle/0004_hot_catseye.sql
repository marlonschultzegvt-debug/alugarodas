CREATE TABLE `vehicle_views` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`sessionKey` varchar(160),
	`source` varchar(64),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vehicle_views_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `vehicle_views` ADD CONSTRAINT `vehicle_views_vehicleId_vehicles_id_fk` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `vehicle_views_vehicle_idx` ON `vehicle_views` (`vehicleId`);--> statement-breakpoint
CREATE INDEX `vehicle_views_created_idx` ON `vehicle_views` (`createdAt`);