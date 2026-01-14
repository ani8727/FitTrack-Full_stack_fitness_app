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
    <header className="sticky top-0 z-50 backdrop-blur-md" style={{ background: 'color-mix(in srgb, var(--color-surface) 94%, transparent)' }}>
      <div className="app-container">
        <div className="h-16 flex items-center justify-between">
          {/* Left - Logo only */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
            <Logo className="w-9 h-9 group-hover:scale-105 transition-transform" />
            <span className="text-lg font-semibold text-[var(--color-text)] hidden sm:inline">{site.name}</span>
          </div>

          {/* Center - Project Name */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:block">
            <span className="text-xl font-bold gradient-text drop-shadow-sm">{site.name}</span>
          </div>
          {/* Right side - Menu button + Theme toggle + User menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Menu Button */}
            {isAuthenticated && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-full text-[var(--color-text)] bg-white/70 dark:bg-neutral-900/50 hover:bg-white dark:hover:bg-neutral-800 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.06)] border"
                style={{ borderColor: 'color-mix(in srgb, var(--color-border) 90%, transparent)' }}
                aria-label="Toggle sidebar"
              >
                <FiMenu className="w-6 h-6" />
              </button>
            )}
            
            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-full text-[var(--color-text-muted)] bg-white/60 dark:bg-neutral-900/40 hover:text-[var(--color-text)] hover:bg-white dark:hover:bg-neutral-800 transition-all shadow-[0_4px_14px_rgba(0,0,0,0.06)] border"
              style={{ borderColor: 'color-mix(in srgb, var(--color-border) 90%, transparent)' }}
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 pl-2 pr-3 py-2 rounded-full bg-white/80 dark:bg-neutral-900/50 border hover:border-[var(--color-primary)] transition-all shadow-[0_8px_28px_rgba(0,0,0,0.08)]"
                  style={{ borderColor: 'color-mix(in srgb, var(--color-border) 80%, transparent)' }}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] grid place-items-center text-white text-sm font-semibold shadow-sm">
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
                    <div className="absolute right-0 mt-2 w-56 card py-2 z-50 shadow-xl">
                      <div className="px-4 py-3 border-b border-[var(--color-border)]">
                        <p className="text-sm font-semibold text-[var(--color-text)]">
                          {user?.name || user?.nickname || 'User'}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                          {user?.email || ''}
                        </p>
                      </div>
                      <button
                        onClick={() => { setUserMenu(false); navigate('/profile') }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[color-mix(in_srgb,var(--color-surface-muted)70%,var(--color-surface))] dark:hover:bg-neutral-700 transition-colors"
                      >
                        Profile Settings
                      </button>
                      {isAdmin && (
                        <button
                          onClick={() => { setUserMenu(false); navigate('/admin') }}
                          className="w-full text-left px-4 py-2 text-sm hover:bg-[color-mix(in_srgb,var(--color-surface-muted)70%,var(--color-surface))] dark:hover:bg-neutral-700 transition-colors"
                        >
                          Admin Dashboard
                        </button>
                      )}
                      <div className="border-t border-[var(--color-border)] my-1"></div>
                      <button
                        onClick={() => { setUserMenu(false); navigate('/privacy') }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[color-mix(in_srgb,var(--color-surface-muted)70%,var(--color-surface))] dark:hover:bg-neutral-700 transition-colors"
                      >
                        Privacy Policy
                      </button>
                      <button
                        onClick={() => { setUserMenu(false); navigate('/terms') }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[color-mix(in_srgb,var(--color-surface-muted)70%,var(--color-surface))] dark:hover:bg-neutral-700 transition-colors"
                      >
                        Terms of Service
                      </button>
                      <div className="border-t border-[var(--color-border)] my-1"></div>
                      <button
                        onClick={() => { setUserMenu(false); onLogout?.() }}
                        className="w-full text-left px-4 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                      >
                        Logout
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
