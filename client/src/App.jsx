import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { SocketProvider } from './contexts/SocketContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { ChatPage } from './pages/ChatPage'
import ProfileLandingPage from './pages/ProfileLandingPage'
import './styles/globals.css'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <SocketProvider>
          <div className="App">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <ProfileLandingPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/chat" 
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/chat" replace />} />
            </Routes>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'var(--color-bg-primary)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-border-primary)',
                },
              }}
            />
          </div>
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
