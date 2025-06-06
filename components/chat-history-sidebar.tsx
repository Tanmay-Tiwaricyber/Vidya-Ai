"use client"

import { useState } from "react"
import type { Chat } from "@/types/chat"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MessageSquare, MoreVertical, Edit2, Trash2, Check, X, Plus, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { aiFeatures } from "@/types/ai-features"

interface ChatHistorySidebarProps {
  chats: Chat[]
  currentChatId: string | null
  onChatSelect: (chatId: string) => void
  onChatRename: (chatId: string, newTitle: string) => void
  onChatDelete: (chatId: string) => void
  onNewChat: () => void
}

export default function ChatHistorySidebar({
  chats,
  currentChatId,
  onChatSelect,
  onChatRename,
  onChatDelete,
  onNewChat,
}: ChatHistorySidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const handleStartEdit = (chat: Chat) => {
    setEditingId(chat.id)
    setEditTitle(chat.title)
  }

  const handleSaveEdit = () => {
    if (editingId && editTitle.trim()) {
      onChatRename(editingId, editTitle.trim())
    }
    setEditingId(null)
    setEditTitle("")
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditTitle("")
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const groupedChats = chats.reduce(
    (groups, chat) => {
      const date = new Date(chat.updatedAt)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const lastWeek = new Date(today)
      lastWeek.setDate(lastWeek.getDate() - 7)

      let group = "Older"
      if (date.toDateString() === today.toDateString()) {
        group = "Today"
      } else if (date.toDateString() === yesterday.toDateString()) {
        group = "Yesterday"
      } else if (date > lastWeek) {
        group = "Last 7 days"
      }

      if (!groups[group]) {
        groups[group] = []
      }
      groups[group].push(chat)
      return groups
    },
    {} as Record<string, Chat[]>,
  )

  return (
    <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <Button onClick={onNewChat} className="w-full justify-start">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-4">
          {Object.entries(groupedChats).map(([group, groupChats]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">{group}</h3>
              <div className="space-y-1">
                {groupChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      "group relative rounded-lg p-3 cursor-pointer transition-colors",
                      currentChatId === chat.id ? "bg-white shadow-sm border border-gray-200" : "hover:bg-white/50",
                    )}
                    onClick={() => onChatSelect(chat.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {editingId === chat.id ? (
                          <div className="flex items-center space-x-2">
                            <Input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="h-6 text-sm"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleSaveEdit()
                                if (e.key === "Escape") handleCancelEdit()
                              }}
                              autoFocus
                            />
                            <Button size="sm" variant="ghost" onClick={handleSaveEdit}>
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={handleCancelEdit}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center space-x-2 mb-1">
                              <MessageSquare className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              <h4 className="text-sm font-medium truncate">{chat.title}</h4>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span className="truncate">
                                {aiFeatures[chat.feature as keyof typeof aiFeatures]?.name || chat.feature}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{formatDate(chat.updatedAt)}</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-400 mt-1">{chat.messages.length} messages</div>
                          </>
                        )}
                      </div>

                      {editingId !== chat.id && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0">
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleStartEdit(chat)}>
                              <Edit2 className="h-4 w-4 mr-2" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onChatDelete(chat.id)} className="text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {chats.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No chats yet</p>
              <p className="text-xs">Start a conversation to see your history</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
