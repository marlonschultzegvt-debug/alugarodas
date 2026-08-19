CREATE TABLE `companies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ownerUserId` int NOT NULL,
	`name` varchar(160) NOT NULL,
	`legalName` varchar(200),
	`document` varchar(32),
	`type` enum('anunciante','locadora') NOT NULL DEFAULT 'anunciante',
	`phone` varchar(32),
	`whatsapp` varchar(32),
	`email` varchar(320),
	`verified` boolean NOT NULL DEFAULT false,
	`status` enum('active','paused') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `companies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`companyId` int NOT NULL,
	`requesterUserId` int,
	`name` varchar(160) NOT NULL,
	`email` varchar(320),
	`phone` varchar(32),
	`message` text,
	`source` varchar(64),
	`utmSource` varchar(120),
	`utmMedium` varchar(120),
	`utmCampaign` varchar(120),
	`status` enum('new','contacted','qualified','closed') NOT NULL DEFAULT 'new',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leads_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicle_images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`vehicleId` int NOT NULL,
	`url` text NOT NULL,
	`storageKey` varchar(512),
	`altText` varchar(180),
	`sortOrder` int NOT NULL DEFAULT 0,
	`isCover` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `vehicle_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `vehicles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`companyId` int NOT NULL,
	`brand` varchar(80) NOT NULL,
	`model` varchar(120) NOT NULL,
	`version` varchar(120),
	`year` int NOT NULL,
	`category` enum('carro','moto','eletrico','hibrido','utilitario','van','caminhonete') NOT NULL,
	`fuel` enum('flex','gasolina','diesel','eletrico','hibrido','plug_in') NOT NULL,
	`transmission` enum('manual','automatico','automatizado') NOT NULL,
	`state` varchar(2) NOT NULL,
	`city` varchar(100) NOT NULL,
	`weeklyPrice` decimal(10,2),
	`monthlyPrice` decimal(10,2),
	`deposit` decimal(10,2),
	`kmLimitMonthly` int,
	`insuranceIncluded` boolean NOT NULL DEFAULT false,
	`acceptsApp` boolean NOT NULL DEFAULT false,
	`acceptsUberX` boolean NOT NULL DEFAULT false,
	`acceptsUberComfort` boolean NOT NULL DEFAULT false,
	`acceptsUberBlack` boolean NOT NULL DEFAULT false,
	`accepts99` boolean NOT NULL DEFAULT false,
	`description` text,
	`rentalRequirements` text,
	`status` enum('draft','active','paused','rented') NOT NULL DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `vehicles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `companies` ADD CONSTRAINT `companies_ownerUserId_users_id_fk` FOREIGN KEY (`ownerUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_vehicleId_vehicles_id_fk` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_companyId_companies_id_fk` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `leads` ADD CONSTRAINT `leads_requesterUserId_users_id_fk` FOREIGN KEY (`requesterUserId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicle_images` ADD CONSTRAINT `vehicle_images_vehicleId_vehicles_id_fk` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `vehicles` ADD CONSTRAINT `vehicles_companyId_companies_id_fk` FOREIGN KEY (`companyId`) REFERENCES `companies`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `companies_owner_idx` ON `companies` (`ownerUserId`);--> statement-breakpoint
CREATE INDEX `leads_vehicle_idx` ON `leads` (`vehicleId`);--> statement-breakpoint
CREATE INDEX `leads_company_status_idx` ON `leads` (`companyId`,`status`);--> statement-breakpoint
CREATE INDEX `leads_created_idx` ON `leads` (`createdAt`);--> statement-breakpoint
CREATE INDEX `vehicle_images_vehicle_idx` ON `vehicle_images` (`vehicleId`);--> statement-breakpoint
CREATE INDEX `vehicles_company_idx` ON `vehicles` (`companyId`);--> statement-breakpoint
CREATE INDEX `vehicles_location_idx` ON `vehicles` (`state`,`city`);--> statement-breakpoint
CREATE INDEX `vehicles_category_status_idx` ON `vehicles` (`category`,`status`);