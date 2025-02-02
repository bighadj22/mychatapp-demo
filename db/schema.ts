import { sqliteTable, AnySQLiteColumn, text, numeric, foreignKey, integer, real } from "drizzle-orm/sqlite-core"
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

export const chatSessions = sqliteTable("chat_sessions", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	title: text("title").default("New Chat").notNull(),
	createdAt: numeric("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	updatedAt: numeric("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
	lastMessageAt: numeric("last_message_at").default(sql`(CURRENT_TIMESTAMP)`),
	status: text("status").default("active"),
	messageCount: integer("message_count").default(0),
	totalTokens: integer("total_tokens").default(0),
});

export const chatMessages = sqliteTable("chat_messages", {
	id: text("id").primaryKey(),
	sessionId: text("session_id").notNull().references(() => chatSessions.id, { onDelete: "cascade" } ),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	role: text("role").notNull(),
	content: text("content").notNull(),
	createdAt: numeric("created_at").default(sql`(CURRENT_TIMESTAMP)`),
	tokensUsed: integer("tokens_used").default(0),
	promptTokens: integer("prompt_tokens").default(0),
	completionTokens: integer("completion_tokens").default(0),
	model: text("model").default("@cf/deepseek-ai/deepseek-r1-distill-qwen-32b"),
	metadata: text("metadata"),
});

export const usageTracking = sqliteTable("usage_tracking", {
	id: text("id").primaryKey(),
	userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	sessionId: text("session_id").notNull().references(() => chatSessions.id, { onDelete: "cascade" } ),
	messageId: text("message_id").notNull().references(() => chatMessages.id, { onDelete: "cascade" } ),
	timestamp: numeric("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
	tokensUsed: integer("tokens_used").default(0).notNull(),
	promptTokens: integer("prompt_tokens").default(0).notNull(),
	completionTokens: integer("completion_tokens").default(0).notNull(),
	model: text("model").notNull(),
	success: numeric("success"),
	errorMessage: text("error_message"),
	cost: real("cost"),
});