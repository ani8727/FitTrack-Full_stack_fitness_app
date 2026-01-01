import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiHome, FiActivity, FiTrendingUp, FiUser, FiX } from 'react-icons/fi'

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome },
    { path: '/activities', label: 'Activities', icon: FiActivity },
    { path: '/recommendations', label: 'Recommendations', icon: FiTrendingUp },
    { path: '/profile', label: 'Profile', icon: FiUser }
  ]

  const handleNavigation = (path) => {
    navigate(path)
    // Close on mobile after navigation
    if (window.innerWidth < 1024) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:fixed top-0 left-0 h-screen z-50 glass border-r border-[var(--color-border)] transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{ width: '260px', top: '64px', height: 'calc(100vh - 64px)' }}
      >
        {/* Close button (mobile only) */}
        <div className="lg:hidden flex justify-end items-center p-4 border-b border-[var(--color-border)]">
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Close sidebar">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActive(item.path)
              
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                    active
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-semibold shadow-sm'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <Icon 
                    className={`w-5 h-5 transition-transform ${
                      active ? 'scale-110' : 'group-hover:scale-110'
                    }`} 
                  />
                  <span className="text-[15px]">{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
