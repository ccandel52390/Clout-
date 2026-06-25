CREATE TABLE `clout_account` (
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`provider` text NOT NULL,
	`providerAccountId` text NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` integer,
	`token_type` text,
	`scope` text,
	`id_token` text,
	`session_state` text,
	PRIMARY KEY(`provider`, `providerAccountId`),
	FOREIGN KEY (`userId`) REFERENCES `clout_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `clout_content_item` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`url` text NOT NULL,
	`type` text NOT NULL,
	`hook` text,
	`viralScore` integer,
	`nicheId` text NOT NULL,
	`metadata` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	FOREIGN KEY (`nicheId`) REFERENCES `clout_niche`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `clout_niche` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `clout_niche_slug_unique` ON `clout_niche` (`slug`);--> statement-breakpoint
CREATE TABLE `clout_session` (
	`sessionToken` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `clout_user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `clout_user_niche` (
	`userId` text NOT NULL,
	`nicheId` text NOT NULL,
	PRIMARY KEY(`userId`, `nicheId`),
	FOREIGN KEY (`userId`) REFERENCES `clout_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`nicheId`) REFERENCES `clout_niche`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `clout_user_pick` (
	`userId` text NOT NULL,
	`contentItemId` text NOT NULL,
	`status` text DEFAULT 'picked',
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)),
	PRIMARY KEY(`userId`, `contentItemId`),
	FOREIGN KEY (`userId`) REFERENCES `clout_user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`contentItemId`) REFERENCES `clout_content_item`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `clout_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text,
	`role` text DEFAULT 'free',
	`stripeCustomerId` text,
	`stripeSubscriptionId` text
);
--> statement-breakpoint
CREATE TABLE `clout_verificationToken` (
	`identifier` text NOT NULL,
	`token` text NOT NULL,
	`expires` integer NOT NULL,
	PRIMARY KEY(`identifier`, `token`)
);
