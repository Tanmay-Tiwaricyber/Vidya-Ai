"use client"

import type React from "react"

import type { FormEvent } from "react"
import type { Message } from "ai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Menu, Send, User, Bot, Plus } from "lucide-react"
import { type AIFeature, aiFeatures } from "@/types/ai-features"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

interface ChatAreaProps {
  messages: Message[]
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  selectedFeature: AIFeature
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onNewChat: () => void
  currentChatTitle?: string
}

export default function ChatArea({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
  selectedFeature,
  sidebarOpen,
  onToggleSidebar,
  onNewChat,
  currentChatTitle,
}: ChatAreaProps) {
  const currentFeature = aiFeatures[selectedFeature]

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onToggleSidebar} className="lg:hidden">
              <Menu className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900">{currentFeature.name}</h2>
                {currentChatTitle && <span className="text-sm text-gray-500">• {currentChatTitle}</span>}
              </div>
              <p className="text-sm text-gray-500">{currentFeature.description}</p>
            </div>
          </div>
          <Button onClick={onNewChat} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Bot className="h-12 w-12 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to help with {currentFeature.name}</h3>
              <p className="text-gray-500 max-w-md mx-auto">{currentFeature.prompt}</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn("flex space-x-3", message.role === "user" ? "justify-end" : "justify-start")}
            >
              {message.role === "assistant" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Bot className="h-4 w-4 text-purple-600" />
                  </div>
                </div>
              )}

              <Card
                className={cn(
                  "max-w-3xl p-4",
                  message.role === "user" ? "bg-purple-600 text-white" : "bg-white border-gray-200",
                )}
              >
                {message.role === "user" ? (
                  <p>{message.content}</p>
                ) : (
                  <ReactMarkdown
                    className="prose prose-sm max-w-none"
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
                      li: ({ children }) => <li className="mb-1">{children}</li>,
                      code: ({ children }) => (
                        <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
                      ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto mb-2">{children}</pre>
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </Card>

              {message.role === "user" && (
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-purple-600" />
                </div>
              </div>
              <Card className="bg-white border-gray-200 p-4">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder={`Ask me to ${currentFeature.name.toLowerCase()}...`}
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
