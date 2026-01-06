import React, { useState } from 'react'
import { Logo } from './Icons'
import { site } from '../../config/site'
import { FiLinkedin } from 'react-icons/fi'
import ContactModal from './ContactModal'

const Footer = () => {
  const [contactOpen, setContactOpen] = useState(false)

  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-[var(--color-surface)]/92 backdrop-blur-sm shadow-[0_-8px_30px_rgba(15,23,42,0.06)] mt-auto">
      <div className="w-full px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-2">
            <Logo className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            <span className="text-sm text-[var(--color-text-muted)]">
              © {site.year} {site.name}
            </span>
          </div>

          {/* Center: Tagline */}
          <div className="text-sm text-[var(--color-text-muted)] text-center">
            Track your activities daily for better insights!
          </div>

          {/* Right: LinkedIn + Links */}
          <div className="flex items-center gap-4 text-sm">
            <a 
              href={site.links.linkedin} 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1.5 text-[var(--color-text-muted)] hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <FiLinkedin className="w-4 h-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>
            <span className="text-[var(--color-border)]">|</span>
            <button
              type="button"
              onClick={() => setContactOpen(true)}
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors px-0 py-0"
            >
              Contact
            </button>
            <a 
              href={site.links.privacy} 
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            >
              Privacy
            </a>
            <a 
              href={site.links.terms} 
              className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
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
