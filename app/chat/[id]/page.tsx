import { redirect } from 'next/navigation'
import type { ChatSession } from "@/types"
import ChatInterface from "@/components/chat/ChatInterface"
import { requireAuth } from "@/lib/auth"
import { getRequestContext } from '@cloudflare/next-on-pages'

export const runtime = 'edge'

export default async function ChatSessionPage({ params }: { params: { id: string } }) {
  const { env } = getRequestContext()
  
  try {
    const authUser = await requireAuth()
    const user = {
      id: authUser.id,
      email: authUser.email || undefined,
      name: authUser.name || undefined
    }

    // Create basic session info from URL params
    const session: ChatSession = {
      id: params.id,
      userId: user.id,
      title: `Chat ${params.id}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMessageAt: new Date().toISOString(),
      status: "active",
      messageCount: 0,
      totalTokens: 0,
    }

    return <ChatInterface session={session} user={user} />
  } catch (error) {
    console.error('Authentication error:', error)
    redirect('/')
  }
}