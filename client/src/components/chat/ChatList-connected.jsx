import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Plus, Users, MessageCircle } from 'lucide-react'
import { Avatar } from '../ui/Avatar'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { chatService, Chat } from '../../services/chatService'
import { useAuth } from '../../contexts/AuthContext'
import { useSocket } from '../../contexts/SocketContext'
import { format, isToday, isYesterday } from 'date-fns'
import toast from 'react-hot-toast'

// interface ChatListProps {
//   onChatSelect: (chat: Chat) => void
//   selectedChatId?: string
// }

export const ChatList = ({ onChatSelect, selectedChatId }) => {
  const [chats, setChats] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showNewChatModal, setShowNewChatModal] = useState(false)
  
  const { user } = useAuth()
  const { socket, onlineUsers } = useSocket()

  useEffect(() => {
    loadChats()
  }, [])

  useEffect(() => {
    if (socket) {
      socket.on('new-message', handleNewMessage)
      socket.on('message-read', handleMessageRead)
      
      return () => {
        socket.off('new-message')
        socket.off('message-read')
      }
    }
  }, [socket])

  const loadChats = async () => {
    try {
      setIsLoading(true)
      const chatData = await chatService.getChats()
      setChats(chatData)
    } catch (error) {
      toast.error('Failed to load chats')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewMessage = (message) => {
    setChats(prevChats => {
      const updatedChats = prevChats.map(chat => {
        if (chat._id === message.chatId) {
          return { ...chat, lastMessage: message }
        }
        return chat
      })
      
      // Sort chats by last message timestamp
      return updatedChats.sort((a, b) => {
        const aTime = a.lastMessage?.timestamp || a.updatedAt
        const bTime = b.lastMessage?.timestamp || b.updatedAt
        return new Date(bTime).getTime() - new Date(aTime).getTime()
      })
    })
  }

  const handleMessageRead = (data) => {
    // Update read status logic here
  }

  const filteredChats = chats.filter(chat => {
    const searchLower = searchQuery.toLowerCase()
    
    if (chat.isGroup) {
      return chat.groupName?.toLowerCase().includes(searchLower)
    } else {
      const otherParticipant = chat.participants.find(p => p !== user?._id)
      // You'll need to populate participant data from backend
      return true // Implement search logic based on participant name
    }
  })

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    if (isToday(date)) {
      return format(date, 'HH:mm')
    } else if (isYesterday(date)) {
      return 'Yesterday'
    } else {
      return format(date, 'MMM dd')
    }
  }

  const getUnreadCount = (chat) => {
    // Implement unread count logic
    return 0
  }

  const isUserOnline = (userId) => {
    return onlineUsers.includes(userId)
  }

  if (isLoading) {
    return (
      <div className="w-80 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="w-80 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Messages
          </h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm">
              <Filter size={16} />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowNewChatModal(true)}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
        
        <Input
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<Search size={16} />}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence>
          {filteredChats.map((chat) => {
            const unreadCount = getUnreadCount(chat)
            const isSelected = selectedChatId === chat._id
            
            return (
              <motion.div
                key={chat._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                onClick={() => onChatSelect(chat)}
                className={`p-4 cursor-pointer border-b border-neutral-100 dark:border-neutral-700 transition-colors ${
                  isSelected 
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-500' 
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <Avatar
                      src={chat.isGroup ? chat.groupAvatar : ''}
                      alt={chat.isGroup ? chat.groupName : 'User'}
                      size="md"
                      status={chat.isGroup ? null : 'online'} // You'll need to check participant status
                    />
                    {chat.isGroup && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                        <Users size={10} className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-neutral-900 dark:text-white truncate">
                        {chat.isGroup ? chat.groupName : 'User Name'} {/* Populate from backend */}
                      </h3>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {chat.lastMessage ? formatTimestamp(chat.lastMessage.timestamp) : ''}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 truncate">
                          {chat.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>

                      {unreadCount > 0 && (
                        <Badge variant="primary" size="sm" className="ml-2">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredChats.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <MessageCircle size={48} className="text-neutral-300 dark:text-neutral-600 mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
              No conversations
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mb-4">
              Start a new conversation to begin chatting
            </p>
            <Button onClick={() => setShowNewChatModal(true)}>
              <Plus size={16} className="mr-2" />
              New Chat
            </Button>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <NewChatModal
          onClose={() => setShowNewChatModal(false)}
          onChatCreated={(chat) => {
            setChats(prev => [chat, ...prev])
            onChatSelect(chat)
            setShowNewChatModal(false)
          }}
        />
      )}
    </div>
  )
}