export interface Chat {
  id: string
  title: string
  feature: string
  messages: Array<{
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: number
  }>
  createdAt: number
  updatedAt: number
}

export interface ChatState {
  chats: Chat[]
  currentChatId: string | null
  isLoading: boolean
}
