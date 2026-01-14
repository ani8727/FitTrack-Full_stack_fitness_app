// Auth0 Configuration for FitTrack
export const auth0Config = {
  domain: import.meta.env.VITE_AUTH0_DOMAIN || 'dev-5s2csl8rpq2phx88.us.auth0.com',
  clientId: import.meta.env.VITE_AUTH0_CLIENT_ID || 'qnXHlMOmUhSTiQx0ohzneAvZWtTm8IuS',
  authorizationParams: {
    redirect_uri: import.meta.env.VITE_AUTH0_REDIRECT_URI || window.location.origin,
    audience: import.meta.env.VITE_AUTH0_AUDIENCE || 'fitness_auth',
    scope: 'openid profile email roles'
  },
  cacheLocation: 'localstorage',
  useRefreshTokens: true
}

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082'