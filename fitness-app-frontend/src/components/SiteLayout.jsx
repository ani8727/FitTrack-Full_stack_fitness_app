import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

const SiteLayout = ({ children, onLogout, isAuthenticated }) => {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem('ft_theme')
    if (saved === 'light') setIsDark(false)
  }, [])

  useEffect(() => {
    localStorage.setItem('ft_theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <div className={isDark
      ? 'min-h-screen flex flex-col bg-gradient-to-b from-[#071025] to-[#071428] text-white'
      : 'min-h-screen flex flex-col bg-gradient-to-b from-white to-slate-50 text-slate-800'}>
      <Navbar onLogout={onLogout} isAuthenticated={isAuthenticated} isDark={isDark} onToggleTheme={() => setIsDark((v) => !v)} />
      <main className="flex-1 container mx-auto px-4 pt-6 pb-8">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default SiteLayout
