// Auth0 Configuration for FitTrack
const domain = import.meta.env.VITE_AUTH0_DOMAIN
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const audience = import.meta.env.VITE_AUTH0_AUDIENCE
// Use the current deployed origin for redirects (works on localhost, Vercel, Render, custom domains).
// If you hardcode this via env and it doesn't match the site origin, Auth0 login/callback will break.
const redirectUri = window.location.origin

if (!domain || !clientId) {
  // Surface a clear configuration error early
  console.warn('[Auth0] Missing required environment variables VITE_AUTH0_DOMAIN or VITE_AUTH0_CLIENT_ID')
}

export const auth0Config = {
  domain,
  clientId,
  authorizationParams: {
    redirect_uri: redirectUri,
    audience,
    scope: 'openid profile email roles'
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
}

export const apiBaseUrl = import.meta.env.VITE_API_URL
if (!apiBaseUrl) {
  console.warn('[API] Missing VITE_API_URL – set it in your .env file')
}