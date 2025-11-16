import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MessageCircle, 
  Users, 
  Bot, 
  UserPlus, 
  Search,
  Settings,
  Phone,
  Archive,
  MoreHorizontal
} from 'lucide-react'
import { Badge } from '../ui/badge'

const NavItem = {
  id: 'chats', 
  label: 'Chats', 
  icon: <MessageCircle size={20} />, 
  count: 5 
}

const MobileNav = ({ 
  activeTab = 'chats', 
  onTabChange 
}) => {
  const [selectedTab, setSelectedTab] = useState(activeTab)

  const navItems = [
    { 
      id: 'chats', 
      label: 'Chats', 
      icon: <MessageCircle size={20} />, 
      count: 5 
    },
    { 
      id: 'groups', 
      label: 'Groups', 
      icon: <Users size={20} />, 
      count: 2 
    },
    { 
      id: 'ai', 
      label: 'AI', 
      icon: <Bot size={20} /> 
    },
    { 
      id: 'calls', 
      label: 'Calls', 
      icon: <Phone size={20} /> 
    },
    { 
      id: 'more', 
      label: 'More', 
      icon: <MoreHorizontal size={20} /> 
    }
  ]

  const handleTabPress = (tabId) => {
    setSelectedTab(tabId)
    onTabChange?.(tabId)
  }

  return (
    <motion.nav
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      className="bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 px-2 py-1 safe-area-bottom"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = selectedTab === item.id
          
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleTabPress(item.id)}
              className={`relative flex flex-col items-center justify-center py-2 px-3 rounded-lg min-w-[60px] transition-colors ${
                isActive 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary-50 dark:bg-primary-900/20 rounded-lg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              {/* Icon with Badge */}
              <div className="relative z-10 mb-1">
                {item.icon}
                {item.count && item.count > 0 && (
                  <Badge 
                    variant="error" 
                    size="sm"
                    className="absolute -top-2 -right-2 min-w-[18px] h-[18px] text-xs flex items-center justify-center p-0"
                  >
                    {item.count > 99 ? '99+' : item.count}
                  </Badge>
                )}
              </div>
              
              {/* Label */}
              <span className={`text-xs font-medium z-10 transition-colors ${
                isActive 
                  ? 'text-primary-600 dark:text-primary-400' 
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}>
                {item.label}
              </span>
            </motion.button>
          )
        })}
      </div>
    </motion.nav>
  )
}

// More Menu Component for Mobile
const MobileMoreMenu = () => {
  const moreItems = [
    { id: 'friends', label: 'Friends', icon: <UserPlus size={20} />, href: '/friends' },
    { id: 'archived', label: 'Archived', icon: <Archive size={20} />, href: '/archived' },
    { id: 'search', label: 'Search', icon: <Search size={20} />, href: '/search' },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} />, href: '/settings' },
  ]

  return (
    <div className="p-4 space-y-2">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
        More Options
      </h3>
      
      {moreItems.map((item) => (
        <motion.button
          key={item.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
        >
          <div className="text-neutral-600 dark:text-neutral-400">
            {item.icon}
          </div>
          <span className="text-neutral-900 dark:text-white font-medium">
            {item.label}
          </span>
        </motion.button>
      ))}
    </div>
  )
}   

export { MobileNav, MobileMoreMenu }