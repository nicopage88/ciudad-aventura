CREATE TABLE `card_games` (
	`room` text PRIMARY KEY NOT NULL,
	`state` text NOT NULL,
	`revision` integer NOT NULL,
	`updated` integer NOT NULL
);
