const keycloakBaseUrl = import.meta.env.VITE_KEYCLOAK_BASE_URL || 'http://localhost:8181'
const keycloakRealm = import.meta.env.VITE_KEYCLOAK_REALM || 'fitness-oauth2'
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'fitness-client'
const redirectUri = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5173'

const oidcBase = `${keycloakBaseUrl}/realms/${keycloakRealm}/protocol/openid-connect`

export const authConfig = {
    clientId,
    authorizationEndpoint: `${oidcBase}/auth`,
    tokenEndpoint: `${oidcBase}/token`,
    userInfoEndpoint: `${oidcBase}/userinfo`,
    endSessionEndpoint: `${oidcBase}/logout`,
    redirectUri,
    scope: 'openid profile email',
    onRefreshTokenExpire: (event) => event.logIn(),
    autoLogin: false, // Prevent automatic login redirect
    // PKCE is enabled by default
  }