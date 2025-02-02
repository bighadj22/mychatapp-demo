"use client"

import { type ReactNode, useState } from "react"
import ChatSidebar from "@/components/chat/ChatSidebar"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface ChatClientProps {
  user: {
    id: string
    email?: string
    name?: string
  }
}

export function ChatClient({ user, children }: ChatClientProps & { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0 transition duration-200 ease-in-out z-30`}
      >
        <ChatSidebar user={user} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b md:hidden">
          <div className="p-4 flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
            <span className="text-sm text-gray-500">{user.name || user.email || 'Anonymous'}</span>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto">{children}</main>
      </div>
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  )
}