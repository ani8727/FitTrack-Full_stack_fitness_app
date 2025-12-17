import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const SiteLayout = ({ children, isAuthenticated, onLogout }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

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
    <div className={"min-h-dvh " + (isDark ? 'bg-[#070c16] text-white' : 'bg-white text-black')}>
      <Navbar isAuthenticated={isAuthenticated} onLogout={onLogout} isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default SiteLayout
