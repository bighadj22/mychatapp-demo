import { NextRequest } from 'next/server';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { getChatMessages } from '@/utils/chat';
import { requireAuth } from '@/lib/auth';

export const runtime = 'edge';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('[GET /api/chat/sessions/[id]/messages] Received request');

  try {
    const { env } = getRequestContext();
    
    // Verify authentication
    const authUser = await requireAuth();

    if (!params.id) {
      console.error('[GET /api/chat/sessions/[id]/messages] Missing session ID');
      return Response.json(
        { 
          success: false, 
          error: 'Session ID is required' 
        },
        { status: 400 }
      );
    }
    
    // Fetch messages
    const result = await getChatMessages(env, params.id, authUser.id);

    if (!result.success) {
      console.error('[GET /api/chat/sessions/[id]/messages] Failed to fetch messages:', result.error);
      return Response.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    console.log(`[GET /api/chat/sessions/[id]/messages] Successfully fetched ${result.data?.length} messages`);

    return Response.json(result, { status: 200 });
  } catch (error) {
    console.error('[GET /api/chat/sessions/[id]/messages] Error:', error);
    
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