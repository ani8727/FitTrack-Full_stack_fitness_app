import React from 'react'

export const Logo = ({ className = 'w-8 h-8' }) => (
	<svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
		<defs>
			<linearGradient id="fit-gradient" x1="4" y1="6" x2="44" y2="42" gradientUnits="userSpaceOnUse">
				<stop offset="0" stopColor="var(--color-primary)" stopOpacity="0.95" />
				<stop offset="1" stopColor="var(--color-accent)" stopOpacity="0.9" />
			</linearGradient>
		</defs>
		<rect x="4" y="4" width="40" height="40" rx="12" fill="color-mix(in srgb, var(--color-surface-muted) 80%, transparent)" />
		<path d="M12.5 32.5c7-2.2 8.8-10.1 11.5-17 2.3 6.4 4.6 13.5 11.5 17.8" fill="none" stroke="url(#fit-gradient)" strokeWidth="3.3" strokeLinecap="round" />
		<circle cx="13" cy="31" r="3" fill="var(--color-primary)" />
		<circle cx="35" cy="33" r="3" fill="var(--color-accent)" />
		<circle cx="24" cy="15" r="3.4" fill="url(#fit-gradient)" stroke="var(--color-surface)" strokeWidth="1.6" />
	</svg>
)

export const GitHubIcon = ({ className = 'w-5 h-5' }) => (
	<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.486 2 12.02c0 4.424 2.865 8.175 6.839 9.497.5.094.683-.217.683-.483 0-.237-.009-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.465-1.11-1.465-.908-.62.069-.607.069-.607 1.004.071 1.533 1.035 1.533 1.035.892 1.532 2.341 1.09 2.91.834.091-.648.35-1.09.636-1.341-2.221-.253-4.555-1.114-4.555-4.957 0-1.095.39-1.992 1.03-2.694-.103-.253-.447-1.272.098-2.65 0 0 .84-.27 2.75 1.029A9.56 9.56 0 0 1 12 6.844a9.56 9.56 0 0 1 2.505.337c1.909-1.298 2.748-1.029 2.748-1.029.547 1.378.203 2.397.1 2.65.64.702 1.03 1.6 1.03 2.694 0 3.852-2.338 4.701-4.566 4.949.36.311.68.921.68 1.857 0 1.34-.012 2.419-.012 2.748 0 .268.18.58.688.481A10.02 10.02 0 0 0 22 12.02C22 6.486 17.523 2 12 2Z" clipRule="evenodd"/></svg>
)

export const LinkedInIcon = ({ className = 'w-5 h-5' }) => (
	<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5C1.11 6 0 4.881 0 3.5 0 2.12 1.11 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V23h-4V8zM8.5 8h3.8v2.041h.054c.53-1.005 1.828-2.064 3.762-2.064 4.023 0 4.764 2.65 4.764 6.093V23h-4v-6.664c0-1.59-.028-3.63-2.213-3.63-2.215 0-2.555 1.73-2.555 3.52V23h-4V8z"/></svg>
)

export const XIcon = ({ className = 'w-5 h-5' }) => (
	<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.74 10.66 20.79 3h-1.67l-6.15 6.73L8.06 3H2l7.39 10.64L2 21h1.67l6.51-7.13L15.94 21H22l-8.26-10.34ZM10.2 12.96l-.75-1.08L4.43 4.3h2.64l3.9 5.6.75 1.08 5.25 7.56h-2.64l-4.13-5.58Z"/></svg>
)

export const MailIcon = ({ className = 'w-5 h-5' }) => (
	<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 4-8 5L4 8V6l8 5 8-5v2Z"/></svg>
)

export const UserIcon = ({ className = 'w-7 h-7' }) => (
	<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12a5 5 0 1 0-5-5 5.006 5.006 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 4v2h16v-2c0-1.83-3.67-4-8-4Z"/></svg>
)

export const MenuIcon = ({ className = 'w-5 h-5' }) => (
	<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z"/></svg>
)

export const ChevronDownIcon = ({ className = 'w-4 h-4' }) => (
	<svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.41 8.59 12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41Z"/></svg>
)

