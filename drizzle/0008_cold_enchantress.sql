ALTER TABLE `users` ADD `accountType` enum('pf','pj');--> statement-breakpoint
ALTER TABLE `users` ADD `document` varchar(18);--> statement-breakpoint
ALTER TABLE `users` ADD `displayName` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `birthDate` varchar(10);--> statement-breakpoint
ALTER TABLE `users` ADD `legalName` varchar(200);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_document_unique` UNIQUE(`document`);