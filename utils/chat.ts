import { eq,and, asc  } from 'drizzle-orm';
import { createDb } from "@/db";
import { chatMessages, chatSessions } from "@/db/schema";
import type { 
  APIResponse, 
  ChatMessage, 
  ChatSession,
  CreateSessionRequest
} from '@/types';
import { desc } from 'drizzle-orm';

export async function createChatSession(
  env: any,
  data: CreateSessionRequest
): Promise<APIResponse<ChatSession>> {
  console.log('[createChatSession] Starting creation with data:', {
    userId: data.userId,
    title: data.title
  });

  try {
    const db = createDb(env.DB);
    const timestamp = new Date().toISOString();
    const sessionId = crypto.randomUUID();

    const newSession = {
      id: sessionId,
      userId: data.userId,
      title: data.title || "New Chat",
      createdAt: timestamp,
      updatedAt: timestamp,
      lastMessageAt: timestamp,
      status: 'active' as const,
      messageCount: 0,
      totalTokens: 0
    };

    console.log('[createChatSession] Inserting new session:', newSession);

    const result = await db.insert(chatSessions)
      .values(newSession)
      .returning()
      .get();

    if (!result) {
      console.error('[createChatSession] Failed to create session - no result returned');
      return {
        success: false,
        error: 'Failed to create chat session',
      };
    }

    console.log('[createChatSession] Successfully created session:', result.id);

    return {
      success: true,
      data: {
        id: result.id,
        userId: result.userId,
        title: result.title,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
        lastMessageAt: result.lastMessageAt,
        status: result.status as ChatSession['status'],
        messageCount: result.messageCount,
        totalTokens: result.totalTokens
      },
    };
  } catch (error) {
    console.error('[createChatSession] Error creating session:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create chat session',
    };
  }
}

export async function getChatSessions(
  env: any,
  userId: string
): Promise<APIResponse<ChatSession[]>> {
  console.log('[getChatSessions] Fetching sessions for user:', userId);

  try {
    const db = createDb(env.DB);

    const sessions = await db.select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.updatedAt))
      .all();

    console.log(`[getChatSessions] Found ${sessions.length} sessions`);

    return {
      success: true,
      data: sessions.map(session => ({
        id: session.id,
        userId: session.userId,
        title: session.title,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        lastMessageAt: session.lastMessageAt,
        status: session.status as ChatSession['status'],
        messageCount: session.messageCount,
        totalTokens: session.totalTokens
      }))
    };
  } catch (error) {
    console.error('[getChatSessions] Error fetching sessions:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch chat sessions'
    };
  }
}




export async function getChatMessages(
  env: any,
  sessionId: string,
  userId: string
): Promise<APIResponse<ChatMessage[]>> {
  console.log('[getChatMessages] Fetching messages for session:', sessionId);

  try {
    const db = createDb(env.DB);

    // First verify the user has access to this session
    const session = await db.select()
      .from(chatSessions)
      .where(
        and(
          eq(chatSessions.id, sessionId),
          eq(chatSessions.userId, userId)
        )
      )
      .get();

    if (!session) {
      console.error('[getChatMessages] User does not have access to this session');
      return {
        success: false,
        error: 'Session not found or access denied'
      };
    }

    // Fetch messages
    const messages = await db.select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(asc(chatMessages.createdAt))
      .all();

    console.log(`[getChatMessages] Found ${messages.length} messages`);

    return {
      success: true,
      data: messages.map(message => ({
        id: message.id,
        sessionId: message.sessionId,
        userId: message.userId,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt,
        tokensUsed: message.tokensUsed,
        promptTokens: message.promptTokens,
        completionTokens: message.completionTokens,
        model: message.model,
        metadata: message.metadata
      }))
    };
  } catch (error) {
    console.error('[getChatMessages] Error fetching messages:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch chat messages'
    };
  }
}
