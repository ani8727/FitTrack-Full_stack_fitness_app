import React, { useState } from 'react'
import { Logo } from './Icons'
import { site } from '../../config/site'
import { FiLinkedin } from 'react-icons/fi'
import ContactModal from './ContactModal'

const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <footer className="w-full border-t border-[var(--color-border)]/50 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-neutral-900/80 dark:to-blue-950/20 backdrop-blur-sm shadow-[0_-8px_30px_rgba(15,23,42,0.06)] mt-auto">
      <div className="w-full px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center">
              <Logo className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-[var(--color-text)]">
              © {site.year} <span className="bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-400 dark:to-emerald-400 bg-clip-text text-transparent">{site.name}</span>
            </span>
          </div>

          {/* Center: Tagline */}
          <div className="text-sm text-[var(--color-text-muted)] text-center italic font-medium">
            Track your activities daily for better insights!
          </div>

          {/* Right: LinkedIn + Links */}
          <div className="flex items-center gap-4 text-sm flex-wrap justify-center md:justify-end">
            <a 
              href={site.links.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium hover:scale-105 duration-300"
            >
              <FiLinkedin className="w-4 h-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <span className="text-[var(--color-border)]">|</span>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors px-0 py-0 font-medium hover:scale-105 duration-300"
            >
              Contact
            </button>
            <span className="text-[var(--color-border)]">|</span>
            <a 
              href={site.links.privacy} 
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors font-medium hover:scale-105 duration-300"
            >
              Privacy
            </a>
            <span className="text-[var(--color-border)]">|</span>
            <a 
              href={site.links.terms} 
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors font-medium hover:scale-105 duration-300"
            >
              Terms
            </a>
          </div>
        </div>
      </div>

      <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
    </footer>
  )
}

export default Footer
