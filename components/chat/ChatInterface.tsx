"use client"

import { useState, useRef, useEffect } from "react"
import type { ChatSession, ChatMessage, APIResponse } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, User, Bot } from "lucide-react"
import { format } from "date-fns"
import toast from 'react-hot-toast'

interface ChatInterfaceProps {
  session: ChatSession
  user: {
    id: string
    email?: string 
    name?: string
  }
}

export default function ChatInterface({ session, user }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [streamedText, setStreamedText] = useState("")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/chat/sessions/${session.id}/messages`)
        const result = await response.json() as APIResponse<ChatMessage[]>

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to load messages')
        }

        setMessages(result.data || [])
      } catch (error) {
        console.error('Failed to load messages:', error)
        toast.error('Failed to load messages')
      }
    }

    loadMessages()
  }, [session.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamedText])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async () => {
    if (isTyping || !input.trim()) return
    setIsTyping(true)
    setStreamedText("")

    const tempMessage: ChatMessage = {
      id: crypto.randomUUID(), 
      sessionId: session.id,
      userId: user.id,
      role: "user",
      content: input.trim(),
      createdAt: new Date().toISOString(),
      tokensUsed: 0,
      promptTokens: 0,
      completionTokens: 0,
      model: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
      metadata: JSON.stringify({
        isEdited: false,
        reactions: [],
        userName: user.name || user.email || 'Anonymous'  
      })
    }
    setMessages(prev => [...prev, tempMessage])
    setInput("")
    
    let accumulatedResponse = '';
    
    try {
      const response = await fetch('https://mychatapp-api.contact7664.workers.dev/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: 'user',
            content: tempMessage.content
          }],
          sessionId: session.id,
          userId: user.id
        })
      })
      
      if (!response.ok) throw new Error('Failed to send message')
      
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response stream');
      const decoder = new TextDecoder();
      
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.response) {
                accumulatedResponse += parsed.response;
                setStreamedText(accumulatedResponse);
              }
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }

      if (accumulatedResponse) {
        const aiMessage: ChatMessage = {
          id: crypto.randomUUID(),
          sessionId: session.id,
          userId: 'assistant',
          role: 'assistant',
          content: accumulatedResponse,
          createdAt: new Date().toISOString(), 
          tokensUsed: 0,
          promptTokens: 0,
          completionTokens: 0,
          model: "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
          metadata: JSON.stringify({
            isEdited: false,
            reactions: []
          })
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Message error:', error)
      toast.error('Failed to send message')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsTyping(false) 
      setStreamedText("")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage()
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold">{session.title}</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {user.name || user.email || 'Anonymous'}
          </span>
          {session.createdAt && (
            <span className="text-sm text-gray-500">
              {format(new Date(session.createdAt), "PPpp")}  
            </span>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-start space-x-2 max-w-[80%] lg:max-w-[70%] ${
                message.role === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
              }`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.role === "user" ? "bg-blue-500" : "bg-gray-300"
                }`}>
                  {message.role === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className={`p-3 rounded-lg ${
                  message.role === "user" ? "bg-blue-500 text-white" : "bg-white border border-gray-200"
                }`}>
                  <p className="text-sm break-words">{message.content}</p>
                  {message.createdAt && (
                    <p className="text-xs mt-1 opacity-70">
                      {format(new Date(message.createdAt), "p")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {streamedText && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%] lg:max-w-[70%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-300">
                  <Bot className="w-5 h-5 text-gray-600" />
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <p className="text-sm break-words">{streamedText}</p>
                </div>
              </div>
            </div>
          )}

          {isTyping && !streamedText && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-500 p-3 rounded-lg flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                </div>
                <span>AI is typing</span>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white border-t">
        <div className="flex items-center space-x-2">
          <Input
            ref={inputRef}
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..." 
            className="flex-1"
            disabled={isTyping}
          />
          <Button type="submit" size="icon" disabled={isTyping || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}