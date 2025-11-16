import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Plus } from 'lucide-react'
import { Avatar } from '../ui/avatar.jsx'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useAppStore } from '../../store'
import { apiClient } from '../../lib/api-client'
import { GET_DM_CONTACTS_ROUTE, GET_USER_GROUPS_ROUTE } from '../../utils/constants'
import { formatDistanceToNow } from 'date-fns'

export const ChatList = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedChat, setSelectedChat] = useState(null)
  const [loading, setLoading] = useState(true)
  const { 
    directMessagesContacts, 
    setDirectMessagesContacts,
    groups,
    setGroups,
    setSelectedChatData,
    setSelectedChatType,
    refreshChatList,
  } = useAppStore()

  // Fetch contacts and groups from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log('Fetching chats from backend...')
        
        // Fetch direct message contacts
        console.log('Fetching contacts from:', GET_DM_CONTACTS_ROUTE)
        const contactsResponse = await apiClient.get(GET_DM_CONTACTS_ROUTE)
        console.log('Contacts response:', contactsResponse.data)
        
        if (contactsResponse.data?.contacts) {
          console.log('Setting contacts:', contactsResponse.data.contacts.length)
          setDirectMessagesContacts(contactsResponse.data.contacts)
        } else {
          console.warn('No contacts in response')
          setDirectMessagesContacts([])
        }

        // Fetch groups
        console.log('Fetching groups from:', GET_USER_GROUPS_ROUTE)
        const groupsResponse = await apiClient.get(GET_USER_GROUPS_ROUTE)
        console.log('Groups response:', groupsResponse.data)
        
        if (groupsResponse.data?.groups) {
          console.log('Setting groups:', groupsResponse.data.groups.length)
          setGroups(groupsResponse.data.groups)
        } else {
          console.warn('No groups in response')
          setGroups([])
        }
      } catch (error) {
        console.error('Failed to fetch chats:', error)
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        })
        // Set empty arrays on error to prevent UI issues
        setDirectMessagesContacts([])
        setGroups([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [refreshChatList, setDirectMessagesContacts, setGroups])

  // Format contacts and groups into a unified chat list
  const chats = useMemo(() => {
    console.log('Formatting chats - Contacts:', directMessagesContacts?.length || 0, 'Groups:', groups?.length || 0)
    
    const formattedContacts = (directMessagesContacts || []).map(contact => {
      let lastMessage = contact.lastMessage || ''
      // If it's a file message, show a file indicator
      if (contact.lastMessageType === 'file' || contact.lastMessageType === 'image') {
        lastMessage = contact.lastMessageType === 'image' ? '📷 Photo' : '📎 File'
      }
      
      return {
        id: contact._id,
        name: contact.firstName && contact.lastName 
          ? `${contact.firstName} ${contact.lastName}` 
          : contact.email || 'Unknown',
        lastMessage,
        timestamp: contact.lastMessageTime 
          ? formatDistanceToNow(new Date(contact.lastMessageTime), { addSuffix: true })
          : '',
        unreadCount: 0, // TODO: Add unread count from backend
        isOnline: false, // TODO: Add online status from socket
        isTyping: false, // TODO: Add typing indicator from socket
        avatar: contact.image || '',
        isGroup: false,
        type: 'contact',
        data: contact,
      }
    })

    const formattedGroups = (groups || []).map(group => ({
      id: group._id,
      name: group.name || 'Unnamed Group',
      lastMessage: group.lastMessage || '',
      timestamp: group.lastMessageTime 
        ? formatDistanceToNow(new Date(group.lastMessageTime), { addSuffix: true })
        : group.updatedAt
        ? formatDistanceToNow(new Date(group.updatedAt), { addSuffix: true })
        : '',
      unreadCount: 0, // TODO: Add unread count from backend
      isOnline: true,
      isTyping: false, // TODO: Add typing indicator from socket
      avatar: group.image || '',
      isGroup: true,
      type: 'group',
      data: group,
    }))

    // Combine and sort by last message time or updated time
    const combined = [...formattedContacts, ...formattedGroups].sort((a, b) => {
      const timeA = a.data?.lastMessageTime 
        ? new Date(a.data.lastMessageTime) 
        : a.data?.updatedAt 
        ? new Date(a.data.updatedAt) 
        : new Date(0)
      const timeB = b.data?.lastMessageTime 
        ? new Date(b.data.lastMessageTime) 
        : b.data?.updatedAt 
        ? new Date(b.data.updatedAt) 
        : new Date(0)
      return timeB - timeA
    })
    
    console.log('Formatted chats:', combined.length)
    return combined
  }, [directMessagesContacts, groups])

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleChatSelect = (chat) => {
    setSelectedChat(chat.id)
    setSelectedChatData(chat.data)
    setSelectedChatType(chat.type)
  }

  return (
    <div className="bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 w-80 flex flex-col">
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
            <Button variant="ghost" size="sm">
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
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-2"></div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading chats...</p>
            </div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-4">
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {searchQuery ? 'No chats found' : 'No conversations yet'}
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {filteredChats.map((chat) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                onClick={() => handleChatSelect(chat)}
                className={`p-4 cursor-pointer border-b border-neutral-100 dark:border-neutral-700 transition-colors ${
                  selectedChat === chat.id 
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-l-primary-500' 
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
              >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar
                    src={chat.avatar}
                    alt={chat.name}
                    size="md"
                    status={chat.isOnline ? 'online' : 'offline'}
                  />
                  {chat.isGroup && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">👥</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-neutral-900 dark:text-white truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {chat.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      {chat.isTyping ? (
                        <div className="flex items-center gap-2 text-primary-600 dark:text-primary-400">
                          <div className="typing-indicator">
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                            <div className="typing-dot"></div>
                          </div>
                          <span className="text-sm">typing...</span>
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-600 dark:text-neutral-300 truncate">
                          {chat.lastMessage}
                        </p>
                      )}
                    </div>

                    {chat.unreadCount > 0 && (
                      <Badge variant="primary" size="sm" className="ml-2">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}