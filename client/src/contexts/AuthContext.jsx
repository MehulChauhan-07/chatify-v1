import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authService } from '../services/authService'

// interface AuthState {
//   user: User | null
//   token: string | null
//   isAuthenticated: boolean
//   isLoading: boolean
// }

// type AuthAction =
//   | { type: 'LOGIN'; payload: { user: User; token: string } }
//   | { type: 'LOGOUT' }
//   | { type: 'SET_LOADING'; payload: boolean }
//   | { type: 'UPDATE_USER'; payload: User }

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      }
    default:
      return state
  }
}

// interface AuthContextType extends AuthState {
//   login: (user: User, token: string) => void
//   logout: () => void
//   updateUser: (user: User) => void
// }

export const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initAuth = async () => {
      const token = authService.getToken()
      const storedUser = authService.getStoredUser()

      if (token && storedUser) {
        try {
          // Verify token is still valid
          const currentUser = await authService.getCurrentUser()
          dispatch({ type: 'LOGIN', payload: { user: currentUser, token } })
        } catch (error) {
          // Token is invalid
          authService.logout()
          dispatch({ type: 'LOGOUT' })
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initAuth()
  }, [])

  const login = (user, token) => {
    dispatch({ type: 'LOGIN', payload: { user, token } })
  }

  const logout = async () => {
    await authService.logout()
    dispatch({ type: 'LOGOUT' })
  }

  const updateUser = (user) => {
    dispatch({ type: 'UPDATE_USER', payload: user })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

