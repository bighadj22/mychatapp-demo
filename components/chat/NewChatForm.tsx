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
  const [input, setInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isSubmitting) return

    setIsSubmitting(true)
    const toastId = toast.loading('Creating new chat...')
    const messageContent = input.trim() // Store input content

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
      router.push(`/chat/${sessionId}?initialMessage=${encodeURIComponent(messageContent)}`) // Pass initial message as URL param
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
      <Input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="w-full p-4 text-lg"
        disabled={isSubmitting}
        minLength={1}
        maxLength={1000}
        required
      />
      <Button
        type="submit"
        className="w-full p-6 text-lg"
        disabled={isSubmitting || !input.trim()}
      >
        {isSubmitting ? 'Creating Chat...' : 'Start New Chat'}
      </Button>
    </form>
  )
}