import React from 'react'
import { useNavigate } from 'react-router'

const Navbar = ({ onLogout, isAuthenticated, isDark, onToggleTheme }) => {
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0b1220]/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/') }>
          <div className="h-7 w-7 rounded-md bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold">F</div>
          <span className="font-semibold">FitTrack</span>
        </div>
        {isAuthenticated && (
          <nav className="hidden sm:flex items-center gap-3 text-sm text-gray-300">
            <button className="hover:text-white px-2 py-1" onClick={() => navigate('/activities')}>Activities</button>
            <button
              className="bg-primary-500/20 text-primary-300 hover:bg-primary-500/30 px-3 py-1 rounded"
              onClick={() => navigate('/activities#add-activity')}
            >
              Add Activity
            </button>
            <button className="hover:text-white px-2 py-1" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Top</button>
          </nav>
        )}
        <div className="flex items-center gap-2">
          <button onClick={onToggleTheme} className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded-md text-sm">
            {isDark ? 'Light' : 'Dark'}
          </button>
          {isAuthenticated ? (
            <button onClick={onLogout} className="bg-neutral-800 hover:bg-neutral-700 text-white px-3 py-1 rounded-md text-sm">Logout</button>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Navbar
