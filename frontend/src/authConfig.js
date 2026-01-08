const keycloakBaseUrl = 'http://gateway:8085/auth'
const keycloakRealm = 'fitness-oauth2'
const clientId = 'fitness-client'
const redirectUri = 'http://localhost:5173'

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