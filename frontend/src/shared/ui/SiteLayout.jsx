import React, { useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'
import { useTheme } from '../../context/ThemeContext'

const SiteLayout = ({ children, isAuthenticated, onLogout }) => {
  const { theme, toggleTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen app-shell">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onLogout={onLogout} 
        isDark={theme === 'dark'} 
        onToggleTheme={toggleTheme}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      <div className="flex">
        {/* Sidebar - only show when authenticated */}
        {isAuthenticated && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
          />
        )}
        
        {/* Main Content */}
        <main 
          className={`flex-1 flex flex-col min-h-[calc(100vh-64px)] transition-all duration-300 ${
            isAuthenticated && sidebarOpen ? 'lg:ml-0' : ''
          }`}
        >
          <div className="app-container py-8 flex-1">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default SiteLayout
