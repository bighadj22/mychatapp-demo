import { NextRequest } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createChatSession, getChatSessions } from '@/utils/chat';
import { requireAuth } from '@/lib/auth';
import { CreateSessionRequest } from '@/types';

export const runtime = 'edge';

interface RequestBody {
  title?: string;
  initialMessage?: string;
}

export async function GET() {
  console.log('[GET /api/chat/sessions] Received request');

  try {
    const { env } = getRequestContext();
    
    // Verify authentication
    const authUser = await requireAuth();
    
    // Fetch sessions
    const result = await getChatSessions(env, authUser.id);

    if (!result.success) {
      console.error('[GET /api/chat/sessions] Failed to fetch sessions:', result.error);
      return Response.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    console.log(`[GET /api/chat/sessions] Successfully fetched ${result.data?.length} sessions`);

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('[GET /api/chat/sessions] Error:', error);
    
    // Handle authentication errors
    if (error instanceof Error && error.message.includes('auth')) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return Response.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  console.log('[POST /api/chat/sessions] Received request');

  try {
    const { env } = getRequestContext();
    
    // Verify authentication
    const authUser = await requireAuth();
    
    // Parse and validate request body
    const body = await request.json() as RequestBody;
    
    if (!body || (typeof body !== 'object')) {
      console.error('[POST /api/chat/sessions] Invalid request body');
      return Response.json(
        { 
          success: false, 
          error: 'Invalid request body' 
        },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!body.title && !body.initialMessage) {
      console.error('[POST /api/chat/sessions] Missing required fields');
      return Response.json(
        { 
          success: false, 
          error: 'Title or initial message is required' 
        },
        { status: 400 }
      );
    }

    const sessionData: CreateSessionRequest = {
      userId: authUser.id,
      title: body.title || body.initialMessage?.slice(0, 50) || 'New Chat',
      initialMessage: body.initialMessage
    };

    // Create session
    const result = await createChatSession(env, sessionData);

    if (!result.success) {
      console.error('[POST /api/chat/sessions] Failed to create session:', result.error);
      return Response.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    console.log('[POST /api/chat/sessions] Successfully created session:', result.data?.id);

    return Response.json(result, { status: 201 });
  } catch (error) {
    console.error('[POST /api/chat/sessions] Error:', error);
    
    // Handle authentication errors
    if (error instanceof Error && error.message.includes('auth')) {
      return Response.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return Response.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}