import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageCircle, 
  Users, 
  Bot, 
  UserPlus, 
  Archive, 
  Settings,
  Search,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Avatar } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

// interface SidebarProps {
//   className?: string
// }

// interface NavItem {
//   id: string
//   label: string
//   icon: React.ReactNode
//   count?: number
//   active?: boolean
// }

// export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
export const Sidebar= ({ className }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

//   const navItems: NavItem[] = [
  const navItems = [
    { id: 'chats', label: 'Chats', icon: <MessageCircle size={20} />, count: 3, active: true },
    { id: 'groups', label: 'Groups', icon: <Users size={20} />, count: 2 },
    { id: 'ai-chat', label: 'AI Assistant', icon: <Bot size={20} /> },
    { id: 'friends', label: 'Friends', icon: <UserPlus size={20} /> },
    { id: 'archived', label: 'Archived', icon: <Archive size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ]

  const recentChats = [
    { id: 1, name: 'John Doe', message: 'Hey, how are you?', time: '2m', unread: 2, online: true, avatar: '' },
    { id: 2, name: 'Jane Smith', message: 'Thanks for the help!', time: '1h', unread: 0, online: false, avatar: '' },
    { id: 3, name: 'Team Alpha', message: 'Mike: Great work everyone!', time: '3h', unread: 5, online: true, avatar: '' }
  ]

  return (
    <motion.aside
      initial={{ x: -280 }}
      animate={{ x: 0, width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xl font-bold text-neutral-900 dark:text-white"
            >
              Chatify
            </motion.h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="p-4">
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={16} />}
            className="w-full"
          />
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-2">
          {navItems.map((item) => (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors mb-1 ${
                item.active 
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300'
                  : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              {item.icon}
              {!isCollapsed && (
                <>
                  <span className="flex-1 font-medium">{item.label}</span>
                  {item.count && (
                    <Badge variant="primary" size="sm">
                      {item.count}
                    </Badge>
                  )}
                </>
              )}
            </motion.button>
          ))}
        </div>

        {/* Recent Chats */}
        {!isCollapsed && (
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Recent
              </h3>
              <Button variant="ghost" size="sm">
                <Plus size={16} />
              </Button>
            </div>
            
            <div className="space-y-2">
              <AnimatePresence>
                {recentChats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <Avatar
                      src={chat.avatar}
                      alt={chat.name}
                      size="sm"
                      status={chat.online ? 'online' : 'offline'}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {chat.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                        {chat.message}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {chat.time}
                      </span>
                      {chat.unread > 0 && (
                        <Badge variant="primary" size="sm">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </nav>
    </motion.aside>
  )
}