import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { RightPanel } from './RightPanel'
import { MobileNav, MobileMoreMenu } from './MobileNav'
import { useResponsive } from '../../hooks/useResponsive'

export const MainLayout = ({ children }) => {
  const { isMobile, isTablet } = useResponsive()
  const [activeTab, setActiveTab] = useState('chats')
  const [showRightPanel, setShowRightPanel] = useState(!isMobile)
  const [rightPanelType, setRightPanelType] = useState('user')

  // Handle responsive right panel
  useEffect(() => {
    setShowRightPanel(!isMobile)
  }, [isMobile])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    // Handle navigation logic here
    console.log('Navigate to:', tabId)
  }

  const handleRightPanelToggle = (type) => {
    if (type) setRightPanelType(type)
    setShowRightPanel(!showRightPanel)
  }

  return (
    <div className="h-screen bg-neutral-50 dark:bg-neutral-900 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <TopBar />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar - Hidden on mobile, collapsible on tablet */}
        <AnimatePresence>
          {!isMobile && (
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
            >
              <Sidebar />
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex overflow-hidden"
          >
            {/* Mobile-specific content rendering */}
            {isMobile && activeTab === 'more' ? (
              <div className="flex-1 overflow-y-auto">
                <MobileMoreMenu />
              </div>
            ) : (
              children
            )}
          </motion.div>
        </main>
        
        {/* Right Panel - Responsive behavior */}
        <AnimatePresence>
          {showRightPanel && (
            <RightPanel
              isOpen={showRightPanel}
              onClose={() => setShowRightPanel(false)}
              type={rightPanelType}
            />
          )}
        </AnimatePresence>
      </div>
      
      {/* Mobile Navigation - Only on mobile devices */}
      {isMobile && (
        <MobileNav 
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}
    </div>
  )
}