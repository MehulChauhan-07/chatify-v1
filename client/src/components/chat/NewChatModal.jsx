import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Search, Mail, Phone, UserPlus, Users, Loader } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Avatar } from '../ui/Avatar'
import { chatService, CreateChatData, Chat } from '../../services/chatService'
import toast from 'react-hot-toast'

// interface NewChatModalProps {
//   onClose: () => void
//   onChatCreated: (chat: Chat) => void
// }

// interface SearchResult {
//   _id: string
//   name: string
//   email: string
//   phone?: string
//   avatar?: string
//   isOnline: boolean
// }

export const NewChatModal = ({ onClose, onChatCreated }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [activeTab, setActiveTab] = useState('individual')

  const handleSearch = async (query  ) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await chatService.findUser(query)
      setSearchResults(results)
    } catch (error) {
      toast.error('Failed to search users')
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const createChat = async (participantId) => {
    setIsCreating(true)
    try {
      const participant = searchResults.find(user => user._id === participantId)
      const chatData = {
        participantEmail: participant?.email,
        isGroup: false
      }
      
      const newChat = await chatService.createChat(chatData)
      onChatCreated(newChat)
      toast.success('Chat created successfully!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create chat')
    } finally {
      setIsCreating(false)
    }
  }

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
            New Conversation
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveTab('individual')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'individual'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
            }`}
          >
            <UserPlus size={16} className="inline mr-2" />
            Individual
          </button>
          <button
            onClick={() => setActiveTab('group')}
            className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'group'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
            }`}
          >
            <Users size={16} className="inline mr-2" />
            Group
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'individual' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Find people by email or phone
                </label>
                <Input
                  placeholder="Enter email or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search size={16} />}
                />
              </div>

              {/* Search Results */}
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {isSearching && (
                  <div className="flex items-center justify-center py-8">
                    <Loader className="animate-spin" size={24} />
                  </div>
                )}

                {!isSearching && searchResults.length === 0 && searchQuery && (
                  <div className="text-center py-8">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      No users found
                    </p>
                  </div>
                )}

                {!isSearching && searchResults.map((user) => (
                  <motion.div
                    key={user._id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  >
                    <Avatar
                      src={user.avatar}
                      alt={user.name}
                      size="sm"
                      status={user.isOnline ? 'online' : 'offline'}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 dark:text-white truncate">
                        {user.name}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                        <div className="flex items-center gap-1">
                          <Mail size={12} />
                          {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-1">
                            <Phone size={12} />
                            {user.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => createChat(user._id)}
                      isLoading={isCreating}
                    >
                      Chat
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'group' && (
            <div className="text-center py-8">
              <Users size={48} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-4" />
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Group chat creation coming soon!
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}