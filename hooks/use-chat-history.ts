"use client"

import { useState, useEffect, useCallback } from "react"
import type { Chat } from "@/types/chat"
import type { AIFeature } from "@/types/ai-features"

export function useChatHistory(userId: string) {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  // Load chats from localStorage
  useEffect(() => {
    const savedChats = localStorage.getItem(`chats_${userId}`)
    if (savedChats) {
      const parsedChats = JSON.parse(savedChats)
      setChats(parsedChats)
      if (parsedChats.length > 0) {
        setCurrentChatId(parsedChats[0].id)
      }
    }
  }, [userId])

  // Save chats to localStorage
  const saveChats = useCallback(
    (updatedChats: Chat[]) => {
      localStorage.setItem(`chats_${userId}`, JSON.stringify(updatedChats))
      setChats(updatedChats)
    },
    [userId],
  )

  const createNewChat = useCallback(
    (feature: AIFeature) => {
      const newChat: Chat = {
        id: Date.now().toString(),
        title: `New ${feature} Chat`,
        feature,
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      const updatedChats = [newChat, ...chats]
      saveChats(updatedChats)
      setCurrentChatId(newChat.id)
      return newChat.id
    },
    [chats, saveChats],
  )

  const updateChatTitle = useCallback(
    (chatId: string, newTitle: string) => {
      const updatedChats = chats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle, updatedAt: Date.now() } : chat,
      )
      saveChats(updatedChats)
    },
    [chats, saveChats],
  )

  const deleteChat = useCallback(
    (chatId: string) => {
      const updatedChats = chats.filter((chat) => chat.id !== chatId)
      saveChats(updatedChats)
      if (currentChatId === chatId) {
        setCurrentChatId(updatedChats.length > 0 ? updatedChats[0].id : null)
      }
    },
    [chats, currentChatId, saveChats],
  )

  const updateChatMessages = useCallback(
    (chatId: string, messages: any[]) => {
      const updatedChats = chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: messages.map((msg) => ({
                id: msg.id,
                role: msg.role,
                content: msg.content,
                timestamp: Date.now(),
              })),
              updatedAt: Date.now(),
            }
          : chat,
      )
      saveChats(updatedChats)
    },
    [chats, saveChats],
  )

  const getCurrentChat = useCallback(() => {
    return chats.find((chat) => chat.id === currentChatId) || null
  }, [chats, currentChatId])

  const clearAllChats = useCallback(() => {
    localStorage.removeItem(`chats_${userId}`)
    setChats([])
    setCurrentChatId(null)
  }, [userId])

  return {
    chats,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    updateChatTitle,
    deleteChat,
    updateChatMessages,
    getCurrentChat,
    clearAllChats,
  }
}
