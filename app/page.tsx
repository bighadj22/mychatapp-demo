// app/page.tsx
import { Metadata } from "next";
import { requireAuth } from "@/lib/auth";
import { getRequestContext } from '@cloudflare/next-on-pages';
import { WelcomeChat } from "@/components/home-page/welcome-chat";

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
  }
  
  return (
    <div className="h-full flex flex-col">
      <WelcomeChat 
        userId={user?.id}
        userName={user?.name} 
      />
    </div>
  );
}