import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  User, 
  Phone, 
  Video, 
  MoreVertical,
  FileText,
  Image,
  Download,
  Users,
  Settings,
  Search,
  Pin,
  Star,
  Archive,
  Trash2,
  Volume2,
  VolumeX,
  Shield,
  Crown,
  UserMinus,
  UserPlus,
  Calendar,
  Link2
} from 'lucide-react'
    import { Avatar } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

// interface RightPanelProps {
//   isOpen?: boolean
//   onClose?: () => void
//   type?: 'user' | 'group' | 'ai' | 'search'
// }

// interface SharedFile {
//   id: string
//   name: string
//   type: 'image' | 'document' | 'video' | 'audio'
//   size: string
//   date: string
//   url: string
// }

// interface GroupMember {
//   id: string
//   name: string
//   avatar?: string
//   role: 'owner' | 'admin' | 'member'
//   isOnline: boolean
//   lastSeen?: string
// }

const mockSharedFiles= [
  { id: '1', name: 'project-design.png', type: 'image', size: '2.4 MB', date: '2 hours ago', url: '' },
  { id: '2', name: 'meeting-notes.pdf', type: 'document', size: '1.2 MB', date: '1 day ago', url: '' },
  { id: '3', name: 'demo-video.mp4', type: 'video', size: '45.8 MB', date: '3 days ago', url: '' },
]

const mockGroupMembers= [
  { id: '1', name: 'John Doe', role: 'owner', isOnline: true, avatar: '' },
  { id: '2', name: 'Sarah Wilson', role: 'admin', isOnline: true, avatar: '' },
  { id: '3', name: 'Mike Johnson', role: 'member', isOnline: false, lastSeen: '2 hours ago', avatar: '' },
  { id: '4', name: 'Emily Davis', role: 'member', isOnline: true, avatar: '' },
]

 const RightPanel = ({ 
  isOpen = true, 
  onClose,
  type = 'user' 
}) => {
  const [activeTab, setActiveTab] = useState('info')
  const [searchQuery, setSearchQuery] = useState('')
  const [isMuted, setIsMuted] = useState(false)

  const tabs = [
    { id: 'info', label: 'Info', show: true },
    { id: 'files', label: 'Files', show: type !== 'ai' },
    { id: 'members', label: 'Members', show: type === 'group' },
    { id: 'settings', label: 'Settings', show: true },
  ].filter(tab => tab.show)

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'image': return <Image size={16} className="text-blue-500" />
      case 'document': return <FileText size={16} className="text-red-500" />
      case 'video': return <Video size={16} className="text-purple-500" />
      case 'audio': return <Volume2 size={16} className="text-green-500" />
      default: return <FileText size={16} className="text-neutral-500" />
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner': return <Crown size={14} className="text-yellow-500" />
      case 'admin': return <Shield size={14} className="text-blue-500" />
      default: return null
    }
  }

  const filteredFiles = mockSharedFiles.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ x: 320, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 320, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="w-80 bg-white dark:bg-neutral-800 border-l border-neutral-200 dark:border-neutral-700 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
            {type === 'user' && 'Contact Info'}
            {type === 'group' && 'Group Info'}
            {type === 'ai' && 'AI Assistant'}
            {type === 'search' && 'Search Results'}
          </h3>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={18} />
            </Button>
          )}
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-6 border-b border-neutral-200 dark:border-neutral-700 text-center">
        <Avatar
          src=""
          alt={type === 'group' ? 'Project Team' : type === 'ai' ? 'AI Assistant' : 'John Doe'}
          size="xl"
          status={type === 'ai' ? 'online' : 'online'}
          className="mx-auto mb-4"
        />
        
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-1">
          {type === 'group' ? 'Project Team' : type === 'ai' ? 'AI Assistant' : 'John Doe'}
        </h2>
        
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
          {type === 'group' && '12 members • Active 2 hours ago'}
          {type === 'ai' && 'Always ready to help • Powered by GPT-4'}
          {type === 'user' && 'Online • Last seen recently'}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-center gap-2">
          {type !== 'ai' && (
            <>
              <Button variant="outline" size="sm">
                <Phone size={16} className="mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm">
                <Video size={16} className="mr-2" />
                Video
              </Button>
            </>
          )}
          <Button variant="outline" size="sm">
            <MoreVertical size={16} />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
                onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {/* Info Tab */}
          {activeTab === 'info' && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-6"
            >
              {type === 'user' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Contact Details
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700">
                        <User size={16} className="text-neutral-500" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-300">john.doe@email.com</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg bg-neutral-50 dark:bg-neutral-700">
                        <Phone size={16} className="text-neutral-500" />
                        <span className="text-sm text-neutral-600 dark:text-neutral-300">+1 (555) 123-4567</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      About
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Product Designer at TechCorp. Love creating beautiful and functional user experiences.
                    </p>
                  </div>
                </>
              )}

              {type === 'group' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Group Description
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      Project collaboration space for the Alpha team. Share updates, files, and coordinate tasks here.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Created
                    </h4>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-neutral-500" />
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">March 15, 2024</span>
                    </div>
                  </div>
                </>
              )}

              {type === 'ai' && (
                <>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Capabilities
                    </h4>
                    <div className="space-y-2">
                      {[
                        'Answer questions and provide information',
                        'Help with writing and editing',
                        'Analyze documents and images',
                        'Generate creative content',
                        'Assist with coding and technical tasks'
                      ].map((capability, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                          <span className="text-sm text-neutral-600 dark:text-neutral-400">{capability}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Model Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Model:</span>
                        <span className="text-sm font-medium">GPT-4 Turbo</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600 dark:text-neutral-400">Version:</span>
                        <span className="text-sm font-medium">Latest</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Quick Actions */}
              <div>
                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Quick Actions
                </h4>
                <div className="space-y-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Star size={16} className="mr-2" />
                    {type === 'user' ? 'Add to Favorites' : 'Star Conversation'}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Pin size={16} className="mr-2" />
                    Pin Chat
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <Volume2 size={16} className="mr-2" /> : <VolumeX size={16} className="mr-2" />}
                    {isMuted ? 'Unmute' : 'Mute Notifications'}
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    <Archive size={16} className="mr-2" />
                    Archive Chat
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Files Tab */}
          {activeTab === 'files' && (
            <motion.div
              key="files"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4"
            >
              <div className="mb-4">
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search size={16} />}
                />
              </div>

              <div className="space-y-3">
                {filteredFiles.map((file) => (
                  <motion.div
                    key={file.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 cursor-pointer"
                  >
                    {getFileIcon(file.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {file.size} • {file.date}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download size={14} />
                    </Button>
                  </motion.div>
                ))}
              </div>

              {filteredFiles.length === 0 && (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-neutral-300 dark:text-neutral-600 mb-2" />
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {searchQuery ? 'No files found' : 'No shared files yet'}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* Members Tab */}
          {activeTab === 'members' && type === 'group' && (
            <motion.div
              key="members"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  {mockGroupMembers.length} Members
                </h4>
                <Button variant="outline" size="sm">
                  <UserPlus size={16} className="mr-2" />
                  Add
                </Button>
              </div>

              <div className="space-y-3">
                {mockGroupMembers.map((member) => (
                  <motion.div
                    key={member.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  >
                    <Avatar
                      src={member.avatar}
                      alt={member.name}
                      size="sm"
                      status={member.isOnline ? 'online' : 'offline'}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                          {member.name}
                        </p>
                        {getRoleIcon(member.role)}
                      </div>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {member.isOnline ? 'Online' : member.lastSeen}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreVertical size={14} />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-4"
            >
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Chat Settings
                </h4>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Settings size={16} className="mr-2" />
                  Chat Settings
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Link2 size={16} className="mr-2" />
                  Shared Links
                </Button>
              </div>

              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 space-y-2">
                <h4 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Privacy
                </h4>
                <Button variant="ghost" size="sm" className="w-full justify-start text-error-600">
                  <UserMinus size={16} className="mr-2" />
                  {type === 'group' ? 'Leave Group' : 'Block User'}
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-error-600">
                  <Trash2 size={16} className="mr-2" />
                  Delete Chat
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

export { RightPanel }