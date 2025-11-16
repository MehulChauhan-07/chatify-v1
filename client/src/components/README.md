# Component Organization

This directory contains the React components for the Chatify application.

## Directory Structure

### `/components/chat/` - Modern UI Components (Active)
Modern, redesigned chat components using:
- Shadcn/ui components (from `/components/ui/`)
- Framer Motion animations
- Tailwind CSS
- Connected to backend via existing API routes

**Active Components:**
- `ChatList.jsx` - Main chat list view (currently in use)
- `ChatList-connected.jsx` - Alternative implementation with different service layer
- `NewChatModal.jsx` - Modal for creating new chats

### `/components/ui/` - Shared UI Components (Active)
Reusable UI components built with Radix UI primitives:
- `avatar.jsx` - Avatar component with status indicator
- `badge.jsx` - Badge component for notifications/counts
- `button.jsx` - Button component with variants
- `input.jsx` - Input component with icon support

### `/components/ChatPageComponents/` - Legacy UI Components (Partially Active)
Original chat page components with traditional styling.

**Still Active (Used by ChatPage):**
- `LeftSidebar/` - Navigation sidebar with chat/requests/profile icons
- `SingleChat/` - Main chat conversation view
- Related components: `SingleChatHeader/`, `SingleChatMessageBar/`, `SingleChatMessageContainer/`
- `LeftSidebarProfile/` - User profile panel
- `FriendRequests/` - Friend requests management

**Replaced:**
- `ChatList/` - ~~Old chat list~~ → Replaced by `/components/chat/ChatList.jsx`
- `Chats/` - Helper component for old ChatList

**Supporting Components:**
- `LeftSidebarContactOrGroupProfile/` - Contact/group info panel
- `RequestChat/`, `RequestChats/` - Friend request chat views
- `ResetApp/` - App reset functionality
- `ScrollToBottom/` - Auto-scroll helper

### `/components/layout/` - Modern Layout Components (Not Yet Active)
Modern layout components that can be used in future iterations:
- `MainLayout.jsx` - Main app layout wrapper
- `Sidebar.jsx` - Modern sidebar navigation
- `TopBar.jsx` - Top navigation bar
- `RightPanel.jsx` - Right panel for additional info
- `MobileNav.jsx` - Mobile navigation

### `/components/Notification/` - Notification Components
Toast notification components for user feedback.

## Migration Status

### ✅ Completed
- Modern ChatList component integrated and working with backend
- Fixed import case sensitivity issues (Avatar, Badge, Button, Input)
- Modern ChatList connected to Zustand store and existing API routes

### 🔄 In Progress / Future Work
- Gradually migrate remaining ChatPageComponents to modern equivalents
- Consider integrating modern layout components (Sidebar, TopBar, etc.)
- Remove or archive fully replaced legacy components

## Backend Integration

All components (both old and new) use:
- **State Management**: Zustand store (`useAppStore` from `/store`)
- **API Client**: Axios instance (`apiClient` from `/lib/api-client`)
- **API Routes**: Constants from `/utils/constants.js`
- **Socket**: Real-time updates via Socket.IO (`useSocket` from `/context/SocketContext`)

## Development Guidelines

1. **New Features**: Use modern components from `/components/chat/` and `/components/ui/`
2. **Existing Features**: Gradually migrate from ChatPageComponents to modern equivalents
3. **Styling**: Use Tailwind CSS classes for consistency
4. **Animations**: Use Framer Motion for smooth transitions
5. **Backend Integration**: Always use existing API routes and store structure
