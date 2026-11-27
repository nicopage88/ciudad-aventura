CREATE TABLE `rides` (
	`room` text NOT NULL,
	`player` text NOT NULL,
	`origin` text NOT NULL,
	`destination` text NOT NULL,
	`seats` integer NOT NULL,
	`contribution` text NOT NULL,
	`updated` integer NOT NULL,
	PRIMARY KEY(`room`, `player`)
);
