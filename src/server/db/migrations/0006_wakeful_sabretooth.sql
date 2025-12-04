ALTER TABLE `player` RENAME COLUMN "peak_rating" TO "rating_peak";--> statement-breakpoint
ALTER TABLE `player` RENAME COLUMN "last_seen" TO "last_seen_at";--> statement-breakpoint
ALTER TABLE `player` ADD `rating_deviation` integer DEFAULT 350;--> statement-breakpoint
ALTER TABLE `player` ADD `rating_volatility` integer DEFAULT 0.06;--> statement-breakpoint
ALTER TABLE `player` ADD `rating_last_update_at` integer;--> statement-breakpoint
ALTER TABLE `players_to_tournaments` ADD `rating_change` integer;--> statement-breakpoint
ALTER TABLE `players_to_tournaments` ADD `rating_deviation_change` integer;--> statement-breakpoint
ALTER TABLE `players_to_tournaments` ADD `volatility_change` integer;