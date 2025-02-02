import { redirect } from 'next/navigation'
import { requireAuth } from "@/lib/auth"
import { getRequestContext } from '@cloudflare/next-on-pages'
import { ChatClient } from "@/components/chat/client"

export const runtime = 'edge'

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { env } = getRequestContext()

  try {
    const authUser = await requireAuth()
    const user = {
      id: authUser.id,
      email: authUser.email || undefined,
      name: authUser.name || undefined
    }

    return (
      <ChatClient user={user}>
        {children}
      </ChatClient>
    )
  } catch (error) {
    console.error('Authentication error:', error)
    redirect('/')
  }
}