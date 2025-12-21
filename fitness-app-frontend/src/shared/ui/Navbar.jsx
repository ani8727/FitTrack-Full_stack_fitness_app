import React, { useContext, useMemo, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Logo, MenuIcon, ChevronDownIcon } from './Icons'
import { AuthContext } from 'react-oauth2-code-pkce'
import { site } from '../../config/site'

const Navbar = ({ onLogout, isAuthenticated, isDark, onToggleTheme }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const isActive = (path) => location.pathname === path
  const { tokenData } = useContext(AuthContext)
  const initials = useMemo(() => {
    const n = tokenData?.name || tokenData?.preferred_username || ''
    if (!n) return 'U'
    const parts = n.split(' ').filter(Boolean)
    const first = parts[0]?.[0] || ''
    const last = parts[1]?.[0] || ''
    return (first + last || first).toUpperCase()
  }, [tokenData])

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0b1220]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/') }>
          <Logo className="w-7 h-7" />
          <span className="font-semibold">{site.name}</span>
        </div>
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-3 text-sm text-gray-300">
            <button className={"px-2 py-1 hover:text-white " + (isActive('/dashboard') ? 'text-white' : '')} onClick={() => navigate('/dashboard')}>Dashboard</button>
            <button className={"px-2 py-1 hover:text-white " + (isActive('/activities') ? 'text-white' : '')} onClick={() => navigate('/activities')}>Activities</button>
            <button className={"px-2 py-1 hover:text-white " + (isActive('/recommendations') ? 'text-white' : '')} onClick={() => navigate('/recommendations')}>Recommendations</button>
            <button className={"px-2 py-1 hover:text-white " + (isActive('/profile') ? 'text-white' : '')} onClick={() => navigate('/profile')}>Profile</button>
            <button className="bg-secondary-500/20 text-secondary-300 hover:bg-secondary-500/30 px-3 py-1 rounded" onClick={() => navigate('/dashboard#quick-add')}>Quick Add</button>
            <button className="bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 px-3 py-1 rounded" onClick={() => navigate('/activities#add-activity')}>Add Activity</button>
          </nav>
        )}
        <div className="flex items-center gap-2 relative">
          <button onClick={onToggleTheme} className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded-md text-sm">
            {isDark ? 'Light' : 'Dark'}
          </button>
          {isAuthenticated ? (
            <div className="relative">
              <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white px-2 py-1 rounded-md text-sm">
                <div className="w-7 h-7 rounded-full bg-primary-500/20 grid place-items-center text-primary-300 text-xs font-semibold">
                  {initials}
                </div>
                <ChevronDownIcon />
              </button>
              {userMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-[#0b1220] border border-white/10 rounded-md shadow-xl overflow-hidden">
                  <button onClick={() => { setUserMenu(false); navigate('/profile') }} className="w-full text-left px-3 py-2 hover:bg-white/5 text-sm">Profile</button>
                  <button onClick={() => { setUserMenu(false); navigate('/privacy') }} className="w-full text-left px-3 py-2 hover:bg-white/5 text-sm">Privacy</button>
                  <button onClick={() => { setUserMenu(false); navigate('/terms') }} className="w-full text-left px-3 py-2 hover:bg-white/5 text-sm">Terms</button>
                  <button onClick={() => { setUserMenu(false); onLogout?.() }} className="w-full text-left px-3 py-2 hover:bg-white/5 text-sm text-red-300">Logout</button>
                </div>
              )}
            </div>
          ) : null}
          <button className="md:hidden bg-neutral-800 text-white px-2 py-1 rounded" onClick={() => setOpen(!open)}>
            <MenuIcon />
          </button>
        </div>
      </div>
      {isAuthenticated && open && (
        <div className="md:hidden border-t border-white/5 bg-[#0b1220]/95">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-2 text-sm">
            <button onClick={() => { setOpen(false); navigate('/dashboard') }} className="text-left">Dashboard</button>
            <button onClick={() => { setOpen(false); navigate('/activities') }} className="text-left">Activities</button>
            <button onClick={() => { setOpen(false); navigate('/recommendations') }} className="text-left">Recommendations</button>
            <button onClick={() => { setOpen(false); navigate('/profile') }} className="text-left">Profile</button>
            <button onClick={() => { setOpen(false); navigate('/dashboard#quick-add') }} className="text-left">Quick Add</button>
            <button onClick={() => { setOpen(false); navigate('/activities#add-activity') }} className="text-left">Add Activity</button>
            <button onClick={() => { setOpen(false); navigate('/privacy') }} className="text-left">Privacy</button>
            <button onClick={() => { setOpen(false); navigate('/terms') }} className="text-left">Terms</button>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
