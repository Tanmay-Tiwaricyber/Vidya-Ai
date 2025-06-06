"use client"

import { useState, useEffect } from "react"
import type { User } from "firebase/auth"
import { useChat } from "ai/react"
import Sidebar from "@/components/sidebar"
import ChatArea from "@/components/chat-area"
import type { AIFeature } from "@/types/ai-features"
import { useChatHistory } from "@/hooks/use-chat-history"
import ChatHistorySidebar from "@/components/chat-history-sidebar"
import SettingsPage from "@/components/settings-page"

interface ChatInterfaceProps {
  user: User
}

export default function ChatInterface({ user }: ChatInterfaceProps) {
  const [selectedFeature, setSelectedFeature] = useState<AIFeature>("chat")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showHistory, setShowHistory] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const {
    chats,
    currentChatId,
    setCurrentChatId,
    createNewChat,
    updateChatTitle,
    deleteChat,
    updateChatMessages,
    getCurrentChat,
  } = useChatHistory(user.uid)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    body: {
      feature: selectedFeature,
      userId: user.uid,
    },
    onFinish: (message) => {
      if (currentChatId) {
        const updatedMessages = [...messages, message]
        updateChatMessages(currentChatId, updatedMessages)
      }
    },
  })

  useEffect(() => {
    const currentChat = getCurrentChat()
    if (currentChat) {
      setMessages(currentChat.messages)
    } else {
      setMessages([])
    }
  }, [currentChatId, getCurrentChat, setMessages])

  const handleNewChat = () => {
    const newChatId = createNewChat(selectedFeature)
    setCurrentChatId(newChatId)
    setMessages([])
  }

  const handleFeatureSelect = (feature: AIFeature) => {
    setSelectedFeature(feature)
    if (!currentChatId || getCurrentChat()?.feature !== feature) {
      handleNewChat()
    }
  }

  if (showSettings) {
    return <SettingsPage user={user} onBack={() => setShowSettings(false)} />
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {showHistory && (
        <ChatHistorySidebar
          chats={chats}
          currentChatId={currentChatId}
          onChatSelect={setCurrentChatId}
          onChatRename={updateChatTitle}
          onChatDelete={deleteChat}
          onNewChat={handleNewChat}
        />
      )}

      <Sidebar
        user={user}
        selectedFeature={selectedFeature}
        onFeatureSelect={handleFeatureSelect}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSettingsClick={() => setShowSettings(true)}
        onHistoryToggle={() => setShowHistory(!showHistory)}
        showHistory={showHistory}
      />

      <ChatArea
        messages={messages}
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        selectedFeature={selectedFeature}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        currentChatTitle={getCurrentChat()?.title}
      />
    </div>
  )
}
