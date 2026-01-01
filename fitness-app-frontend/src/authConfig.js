export const authConfig = {
    clientId: 'fitness-client',
    authorizationEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/auth',
    tokenEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/token',
    userInfoEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/userinfo',
    endSessionEndpoint: 'http://localhost:8181/realms/fitness-oauth2/protocol/openid-connect/logout',
    redirectUri: 'http://localhost:5173',
    scope: 'openid profile email',
    onRefreshTokenExpire: (event) => event.logIn(),
    autoLogin: false, // Prevent automatic login redirect
    // PKCE is enabled by default
  }