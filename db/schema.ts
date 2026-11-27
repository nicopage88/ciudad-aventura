import { sqliteTable, text, real, integer, primaryKey } from "drizzle-orm/sqlite-core";
export const players = sqliteTable("players", {
  room: text("room").notNull(), player: text("player").notNull(),
  name: text("name").notNull(), lat: real("lat").notNull(), lng: real("lng").notNull(),
  updated: integer("updated").notNull(), avatar: text("avatar").notNull().default('{}')
}, t => [primaryKey({ columns: [t.room, t.player] })]);
export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(), room: text("room").notNull(), player: text("player").notNull(),
  name: text("name").notNull(), body: text("body").notNull(), created: integer("created").notNull()
});
export const cardGames = sqliteTable("card_games", {
  room: text("room").primaryKey(), state: text("state").notNull(),
  revision: integer("revision").notNull(), updated: integer("updated").notNull()
});
export const rides = sqliteTable("rides", {
  room: text("room").notNull(), player: text("player").notNull(),
  origin: text("origin").notNull(), destination: text("destination").notNull(),
  seats: integer("seats").notNull(), contribution: text("contribution").notNull(),
  updated: integer("updated").notNull()
}, t => [primaryKey({ columns: [t.room, t.player] })]);
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(), nickname: text("nickname").notNull(), nicknameKey: text("nickname_key").notNull().unique(),
  passwordHash: text("password_hash").notNull(), salt: text("salt").notNull(), avatar: text("avatar").notNull().default('{}'),
  created: integer("created").notNull()
});
export const sessions = sqliteTable("sessions", {
  tokenHash: text("token_hash").primaryKey(), accountId: text("account_id").notNull(), expires: integer("expires").notNull()
});
export const authLimits = sqliteTable("auth_limits", {
  key: text("key").primaryKey(), attempts: integer("attempts").notNull(), reset: integer("reset").notNull()
});
