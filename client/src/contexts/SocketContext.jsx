import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client'
import { useAuth } from './AuthContext'
// import { Message } from '../types'

// interface SocketContextType {
//   socket: Socket | null
//   isConnected: boolean
//   onlineUsers: string[]
//   sendMessage: (message: Omit<Message, '_id' | 'timestamp'>) => void
//   joinChat: (chatId: string) => void
//   leaveChat: (chatId: string) => void
//   emitTyping: (chatId: string, isTyping: boolean) => void
// }

const SocketContext = createContext(undefined)

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState([])
  const socketRef = useRef(null)

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001', {
        withCredentials: true,
        query: { userId: user.id },
        transports: ['websocket'],
      })

      newSocket.on('connect', () => {
        console.log('Connected to server')
        setIsConnected(true)
        newSocket.emit('user-online', user.id)
      })

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server')
        setIsConnected(false)
      })

      newSocket.on('online-users', (users) => {
        setOnlineUsers(users)
      })

      newSocket.on('user-online', (userId) => {
        setOnlineUsers(prev => [...prev.filter(id => id !== userId), userId])
      })

      newSocket.on('user-offline', (userId) => {
        setOnlineUsers(prev => prev.filter(id => id !== userId))
      })

      socketRef.current = newSocket
      setSocket(newSocket)

      return () => {
        newSocket.disconnect()
        setSocket(null)
        setIsConnected(false)
      }
    }
  }, [isAuthenticated, user])

  const sendMessage = (message) => {
    if (socket && isConnected) {
      socket.emit('send-message', message)
    }
  }

  const joinChat = (chatId) => {
    if (socket && isConnected) {
      socket.emit('join-chat', chatId)
    }
  }

  const leaveChat = (chatId) => {
    if (socket && isConnected) {
      socket.emit('leave-chat', chatId)
    }
  }

  const emitTyping = (chatId, isTyping) => {
    if (socket && isConnected) {
      socket.emit('typing', { chatId, isTyping, userId: user?.id })
    }
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        onlineUsers,
        sendMessage,
        joinChat,
        leaveChat,
        emitTyping,
      }}
    >
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}