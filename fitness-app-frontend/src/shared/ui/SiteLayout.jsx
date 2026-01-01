import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

const SiteLayout = ({ children, isAuthenticated, onLogout }) => {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme === 'dark'
    // Default to light theme for better appearance
    return false
  })
  
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  return (
    <div className="min-h-screen app-shell">
      <Navbar 
        isAuthenticated={isAuthenticated} 
        onLogout={onLogout} 
        isDark={isDark} 
        onToggleTheme={() => setIsDark(!isDark)}
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
