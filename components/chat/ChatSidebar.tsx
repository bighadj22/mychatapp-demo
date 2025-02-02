"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, MessageCircle, Search, User } from "lucide-react"
import type { ChatSession, APIResponse } from "@/types"
import toast from 'react-hot-toast'

interface ChatSidebarProps {
  user: {
    id: string
    email?: string
    name?: string
  }
}

export default function ChatSidebar({ user }: ChatSidebarProps) {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()

  // Load sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('/api/chat/sessions', {
          cache: 'no-store' // Ensure fresh data
        })
        const result = await response.json() as APIResponse<ChatSession[]>

        if (!response.ok || !result.success || !result.data) {
          throw new Error(result.error || 'Failed to fetch chat sessions')
        }

        setChatSessions(result.data)
      } catch (error) {
        console.error('Failed to fetch chat sessions:', error)
        toast.error(error instanceof Error ? error.message : 'Failed to fetch chat sessions')
      } finally {
        setIsLoading(false)
      }
    }

    if (user.id) {
      fetchSessions()
    }
  }, [user.id, pathname]) // Re-fetch when path changes

  const filteredSessions = chatSessions.filter((session) =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <aside className="w-64 bg-gray-900 text-white p-4 flex flex-col h-full">
      <div className="mb-6">
        <div className="flex items-center space-x-2 px-2 py-3">
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
            <User className="w-4 h-4 text-gray-300" />
          </div>
          <span className="text-sm truncate">
            {user.name || user.email || 'Anonymous'}
          </span>
        </div>
      </div>
      <Link href="/chat" className="mb-6">
        <Button variant="outline" className="w-full justify-start">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </Link>
      <div className="relative mb-4">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 pl-8"
        />
      </div>
      <nav className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="text-center text-gray-400 py-4">
            <div className="animate-pulse flex flex-col space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        ) : filteredSessions.length > 0 ? (
          <ul className="space-y-2">
            {filteredSessions.map((session) => (
              <li key={session.id}>
                <Link
                  href={`/chat/${session.id}`}
                  className="flex items-center p-2 rounded hover:bg-gray-800 transition-colors"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <span className="truncate">{session.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-400 py-4">
            {searchTerm ? 'No matching chats found' : 'No chats yet'}
          </div>
        )}
      </nav>
    </aside>
  )
}