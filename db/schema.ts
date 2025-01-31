import { sqliteTable, AnySQLiteColumn, text, numeric } from "drizzle-orm/sqlite-core"
  import { sql } from "drizzle-orm"

export const users = sqliteTable("users", {
	id: text("id").primaryKey(),
	email: text("email"),
	firstName: text("first_name"),
	lastName: text("last_name"),
	logtoId: text("logto_id"),
	createdAt: numeric("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	role: text("role").default("user"),
	settings: text("settings"),
});