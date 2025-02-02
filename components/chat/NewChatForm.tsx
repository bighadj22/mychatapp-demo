"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { APIResponse, ChatSession } from "@/types"
import toast from 'react-hot-toast'

interface NewChatFormProps {
  user: {
    id: string
    email?: string
    name?: string
  }
}

export default function NewChatForm({ user }: NewChatFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return

    setIsSubmitting(true)
    const toastId = toast.loading('Creating new chat...')

    try {
      const sessionResponse = await fetch('/api/chat/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Chat ${new Date().toLocaleString()}`,
          userId: user.id
        })
      })

      const sessionResult = await sessionResponse.json() as APIResponse<ChatSession>

      if (!sessionResponse.ok || !sessionResult.success || !sessionResult.data) {
        throw new Error(sessionResult.error || 'Failed to create chat session')
      }

      const sessionId = sessionResult.data.id

      toast.success('Chat created successfully', { id: toastId })
      router.push(`/chat/${sessionId}`)
    } catch (error) {
      console.error('Failed to create chat session:', error)
      toast.error(
        error instanceof Error ? error.message : "Failed to create chat session",
        { id: toastId }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Button
        type="submit"
        className="w-full p-6 text-lg"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating Chat...' : 'Start New Chat'}
      </Button>
    </form>
  )
}