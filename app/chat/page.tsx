import { redirect } from 'next/navigation'
import { requireAuth } from "@/lib/auth"
import { getRequestContext } from '@cloudflare/next-on-pages'
import NewChatForm from "@/components/chat/NewChatForm"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export const runtime = 'edge'

export default async function ChatPage() {
  const { env } = getRequestContext()

  try {
    const authUser = await requireAuth()
    const user = {
      id: authUser.id,
      email: authUser.email || undefined,
      name: authUser.name || undefined
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">Welcome to AI Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-center mb-6">Start a new conversation by typing your message below.</p>
            <NewChatForm user={user} />
          </CardContent>
        </Card>
      </div>
    )
  } catch (error) {
    console.error('Authentication error:', error)
    redirect('/')
  }
}