DROP INDEX "club_lichess_team_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "user_username_unique";--> statement-breakpoint
DROP INDEX "affiliation_user_club_unique_idx";--> statement-breakpoint
DROP INDEX "player_nickname_club_unique_idx";--> statement-breakpoint
DROP INDEX "player_user_club_unique_idx";--> statement-breakpoint
ALTER TABLE `player` ALTER COLUMN "rating_peak" TO "rating_peak" integer;--> statement-breakpoint
CREATE UNIQUE INDEX `club_lichess_team_unique` ON `club` (`lichess_team`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_username_unique` ON `user` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `affiliation_user_club_unique_idx` ON `affiliation` (`user_id`,`club_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `player_nickname_club_unique_idx` ON `player` (`nickname`,`club_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `player_user_club_unique_idx` ON `player` (`user_id`,`club_id`);