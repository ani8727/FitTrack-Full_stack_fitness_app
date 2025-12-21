import React from 'react'
import { Logo, GitHubIcon, LinkedInIcon, XIcon, MailIcon } from './Icons'
import { site } from '../../config/site'

const Footer = () => {
  return (
    <footer className="border-t border-white/5 mt-10 bg-[#0b1220]/60">
      <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Logo className="w-7 h-7" />
            <div>
              <div className="text-sm font-medium">{site.name}</div>
              <div className="text-xs text-gray-400">{site.tagline}</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <a className="hover:text-white" href={site.links.privacy}>Privacy</a>
            <a className="hover:text-white" href={site.links.terms}>Terms</a>
            <a className="hover:text-white" href={site.links.support}>Support</a>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-gray-400">© {site.year} {site.name}. All rights reserved.</span>
          <div className="flex items-center gap-3 text-gray-300">
            <a href={site.links.github} target="_blank" rel="noreferrer" className="hover:text-white" aria-label="GitHub"><GitHubIcon /></a>
            <a href={site.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-white" aria-label="LinkedIn"><LinkedInIcon /></a>
            <a href={site.links.twitter} target="_blank" rel="noreferrer" className="hover:text-white" aria-label="X"><XIcon /></a>
            <a href={site.links.support} className="hover:text-white" aria-label="Email"><MailIcon /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
