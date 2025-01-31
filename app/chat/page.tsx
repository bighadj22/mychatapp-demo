// app/chat/page.tsx
import { getRequestContext } from '@cloudflare/next-on-pages';
import { requireAuth } from "@/lib/auth";
import { ChatClient } from "@/components/chat/client";

export const runtime = 'edge';

export default async function ChatPage() {
  let user = null;
  const { env } = getRequestContext();

  try {
    const authUser = await requireAuth();
    user = {
      id: authUser.id,
      email: authUser.email || undefined,
      name: authUser.name || undefined
    };
  } catch (error) {
    console.log('User not authenticated');
    return null;
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      <ChatClient 
        user={user}
      />
    </div>
  );
}