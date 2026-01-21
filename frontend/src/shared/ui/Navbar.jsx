import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Logo, MenuIcon, ChevronDownIcon } from './Icons'
import { useAuth0 } from '@auth0/auth0-react'
import { site } from '../../config/site'
import { FiSun, FiMoon, FiX, FiHome, FiActivity, FiTrendingUp, FiUser, FiMenu, FiChevronLeft } from 'react-icons/fi'

const Navbar = ({ onLogout, isAuthenticated, isDark, onToggleTheme, sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate()
  const [userMenu, setUserMenu] = useState(false)
  const { user } = useAuth0()

  const isAdmin = useMemo(() => {
    // Auth0 can include roles in multiple places depending on configuration
    const roles = user?.['https://fitness-app/roles'] || 
                  user?.['fitness_auth/roles'] || 
                  user?.roles || 
                  user?.['https://fitness.app/roles'] || 
                  []
    return Array.isArray(roles) && (roles.includes('ADMIN') || roles.includes('admin'))
  }, [user])
  
  const initials = useMemo(() => {
    const n = user?.name || user?.nickname || ''
    if (!n) return 'U'
    const parts = n.split(' ').filter(Boolean)
    const first = parts[0]?.[0] || ''
    const last = parts[1]?.[0] || ''
    return (first + last || first).toUpperCase()
  }, [user])

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg border-b border-[var(--color-border)]/40" style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--color-surface) 96%, transparent) 0%, color-mix(in srgb, var(--color-surface) 92%, transparent) 100%)' }}>
      <div className="app-container">
        <div className="h-16 flex items-center justify-between">
          {/* Left - Logo only */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center group-hover:shadow-lg group-hover:scale-105 transition-all duration-300">
              <Logo className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent hidden sm:inline group-hover:opacity-80 transition-opacity">{site.name}</span>
          </div>

          {/* Center - Project Name */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 via-emerald-500 to-orange-500 dark:from-blue-400 dark:via-emerald-400 dark:to-orange-400 bg-clip-text text-transparent drop-shadow-sm">{site.name}</span>
          </div>
          {/* Right side - Menu button + Theme toggle + User menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Menu Button */}
            {isAuthenticated && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2.5 rounded-xl text-[var(--color-text)] bg-white/60 dark:bg-neutral-800/40 hover:bg-white/80 dark:hover:bg-neutral-700/60 transition-all duration-300 shadow-sm border border-[var(--color-border)]/50 hover:shadow-md hover:border-blue-400/50"
                aria-label="Toggle sidebar"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2.5 rounded-xl text-[var(--color-text-muted)] bg-white/60 dark:bg-neutral-800/40 hover:text-[var(--color-text)] hover:bg-white/80 dark:hover:bg-neutral-700/60 transition-all duration-300 shadow-sm border border-[var(--color-border)]/50 hover:shadow-md"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-full bg-white/70 dark:bg-neutral-800/50 border border-[var(--color-border)]/60 hover:border-blue-400/50 transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 grid place-items-center text-white text-xs font-bold shadow-sm">
                    {initials}
                  </div>
                  <ChevronDownIcon className={`w-4 h-4 text-[var(--color-text-muted)] transition-transform hidden sm:block ${userMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {userMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-3 w-64 rounded-xl py-2 z-50 shadow-xl backdrop-blur-lg border border-[var(--color-border)]/50 overflow-hidden" style={{ background: 'color-mix(in srgb, var(--color-surface) 96%, transparent)' }}>
                      <div className="px-4 py-4 border-b border-[var(--color-border)]/50 bg-gradient-to-r from-blue-500/5 to-emerald-500/5">
                        <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">
                          {user?.name || user?.nickname || 'User'}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-1">
                          {user?.email || ''}
                        </p>
                      </div>
                      <button
                        onClick={() => { setUserMenu(false); navigate('/profile') }}
                        className="w-full text-left px-4 py-3 text-sm text-[var(--color-text)] hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-colors font-medium"
                      >
                        👤 Profile Settings
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => { setUserMenu(false); navigate('/admin') }}
                          className="w-full text-left px-4 py-3 text-sm text-[var(--color-text)] hover:bg-purple-500/10 dark:hover:bg-purple-500/20 transition-colors font-medium"
                        >
                          ⚙️ Admin Dashboard
                        </button>
                      )}
                      <div className="border-t border-[var(--color-border)]/30 my-2"></div>
                      <button
                        onClick={() => { setUserMenu(false); navigate('/privacy') }}
                        className="w-full text-left px-4 py-3 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-slate-500/10 dark:hover:bg-slate-500/20 transition-colors"
                      >
                        🔒 Privacy Policy
                      </button>
                      <button
                        onClick={() => { setUserMenu(false); navigate('/terms') }}
                        className="w-full text-left px-4 py-3 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-slate-500/10 dark:hover:bg-slate-500/20 transition-colors"
                      >
                        📜 Terms of Service
                      </button>
                      <div className="border-t border-[var(--color-border)]/30 my-2"></div>
                      <button
                        onClick={() => { setUserMenu(false); onLogout?.() }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors font-medium"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
