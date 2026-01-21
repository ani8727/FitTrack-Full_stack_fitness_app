export const site = {
  name: 'FitTrack',
  tagline: 'Your Personal Fitness Companion',
  year: new Date().getFullYear(),
  links: {
    terms: '/terms',
    privacy: '/privacy',
    linkedin: import.meta.env.VITE_SITE_LINKEDIN || '#',
  },
}
