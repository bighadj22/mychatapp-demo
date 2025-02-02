import { InferSelectModel, InferInsertModel } from 'drizzle-orm'
import { users, chatSessions, chatMessages, usageTracking } from '@/db/schema'

// Users types
export type User = InferSelectModel<typeof users>
export type NewUser = InferInsertModel<typeof users>

export interface UserSettings {
  theme?: 'light' | 'dark' | 'system'
  language?: string
  notifications?: {
    email?: boolean
    push?: boolean
  }
  // Add other settings as needed
}

// Chat sessions types
export type ChatSession = InferSelectModel<typeof chatSessions>
export type NewChatSession = InferInsertModel<typeof chatSessions>

export type ChatSessionStatus = 'active' | 'archived' | 'deleted'

// New type for creating a chat session
export interface CreateSessionRequest {
  userId: string
  title?: string
  initialMessage?: string
}

// New type for chat session with messages
export interface ChatSessionWithMessages extends ChatSession {
  messages: ChatMessage[]
}

// Chat messages types
export type ChatMessage = InferSelectModel<typeof chatMessages>
export type NewChatMessage = InferInsertModel<typeof chatMessages>

export type MessageRole = 'user' | 'assistant' | 'system'

export interface MessageMetadata {
  isEdited?: boolean
  editedAt?: string
  originalContent?: string
  reactions?: string[]
  attachments?: {
    type: string
    url: string
    name: string
  }[]
  // Add other metadata as needed
}

// Usage tracking types
export type UsageTracking = InferSelectModel<typeof usageTracking>
export type NewUsageTracking = InferInsertModel<typeof usageTracking>

// Common types used across the schema
export interface Timestamps {
  createdAt: string
  updatedAt?: string
}

// Model type for the AI model being used
export interface AIModel {
  id: string
  name: string
  provider: string
  maxTokens: number
  costPerToken: number
}

// Response types for common operations
export interface DatabaseResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// New generic API response type
export interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Query filters and options
export interface QueryOptions {
  limit?: number
  offset?: number
  orderBy?: string
  order?: 'asc' | 'desc'
}

export interface ChatSessionFilters {
  userId?: string
  status?: ChatSessionStatus
  fromDate?: string
  toDate?: string
}

export interface ChatMessageFilters {
  sessionId?: string
  userId?: string
  role?: MessageRole
  fromDate?: string
  toDate?: string
}

export interface UsageTrackingFilters {
  userId?: string
  sessionId?: string
  messageId?: string
  fromDate?: string
  toDate?: string
  model?: string
  success?: boolean
}

// Analytics and aggregation types
export interface UserUsageSummary {
  userId: string
  totalSessions: number
  totalMessages: number
  totalTokensUsed: number
  averageTokensPerMessage: number
  totalCost: number
  lastActiveAt: string
}

export interface ModelUsageStats {
  model: string
  totalUses: number
  totalTokens: number
  averageTokensPerUse: number
  totalCost: number
  successRate: number
}

// Error types
export interface DatabaseError extends Error {
  code?: string
  sqlMessage?: string
  sql?: string
}

// Utility type for partial updates
export type UpdateData<T> = {
  [P in keyof T]?: T[P] extends object ? Partial<T[P]> : T[P]
}