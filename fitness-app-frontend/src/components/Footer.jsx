import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-white/5 mt-10 bg-[#0b1220]/60">
      <div className="container mx-auto px-4 py-6 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© {new Date().getFullYear()} FitTrack. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a className="hover:text-white" href="#">Privacy</a>
          <a className="hover:text-white" href="#">Terms</a>
          <a className="hover:text-white" href="#">Support</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
