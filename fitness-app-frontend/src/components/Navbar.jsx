import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'

const Navbar = ({ onLogout, isAuthenticated, isDark, onToggleTheme }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0b1220]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/') }>
          <div className="h-7 w-7 rounded-md bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold">F</div>
          <span className="font-semibold">FitTrack</span>
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
        <div className="flex items-center gap-2">
          <button onClick={onToggleTheme} className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded-md text-sm">
            {isDark ? 'Light' : 'Dark'}
          </button>
          {isAuthenticated ? (
            <button onClick={onLogout} className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded-md text-sm">Logout</button>
          ) : null}
          <button className="md:hidden bg-neutral-800 text-white px-2 py-1 rounded" onClick={() => setOpen(!open)}>Menu</button>
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
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
