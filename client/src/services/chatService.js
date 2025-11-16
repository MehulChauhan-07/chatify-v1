import api from './authService'

// export interface Chat {
//   _id: string
//   participants: string[]
//   lastMessage?: Message
//   isGroup: boolean
//   groupName?: string
//   groupAvatar?: string
//   createdAt: Date
//   updatedAt: Date
// }

// export interface Message {
//   _id: string
//   chatId: string
//   senderId: string
//   senderName: string
//   senderAvatar?: string
//   content: string
//   messageType: 'text' | 'image' | 'file' | 'voice'
//   fileUrl?: string
//   fileName?: string
//   fileSize?: number
//   timestamp: Date
//   readBy: Array<{
//     userId: string
//     readAt: Date
//   }>
//   reactions: Array<{
//     userId: string
//     emoji: string
//     createdAt: Date
//   }>
// }

// export interface CreateChatData {
//   participantEmail?: string
//   participantPhone?: string
//   isGroup?: boolean
//   groupName?: string
// }

class ChatService {
  // Get all chats for current user
  async getChats() {
    const response = await api.get('/api/chats')
    return response.data.chats
  }

  // Get messages for a specific chat
  async getMessages(chatId, page, limit){
    const response = await api.get(`/api/chats/${chatId}/messages`, {
      params: { page, limit }
    })
    return response.data
  }

  // Send a new message
  async sendMessage(chatId, content, messageType = 'text', fileData) {
    if (fileData) {
      fileData.append('chatId', chatId)
      fileData.append('messageType', messageType)
      const response = await api.post('/api/messages/file', fileData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data.message
    } else {
      const response = await api.post('/api/messages', {
        chatId,
        content,
        messageType
      })
      return response.data.message
    }
  }

  // Create new chat
  async createChat(data) {
    const response = await api.post('/api/chats', data)
    return response.data.chat
  }

  // Find user by email or phone
  async findUser(query) {
    const response = await api.get('/api/users/search', {
      params: { q: query }
    })
    return response.data.users
  }

  // Mark message as read
  async markAsRead(messageId) {
    await api.post(`/api/messages/${messageId}/read`)
  }

  // Add reaction to message
  async addReaction(messageId, emoji) {
    await api.post(`/api/messages/${messageId}/reactions`, { emoji })
  }

  // Remove reaction from message
  async removeReaction(messageId, emoji) {
    await api.delete(`/api/messages/${messageId}/reactions`, { data: { emoji } })
  }
}

export const chatService = new ChatService()