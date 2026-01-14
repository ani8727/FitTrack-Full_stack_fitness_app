import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import { store } from './store/store'

import './index.css'
import App from './App'
import { Auth0Provider } from '@auth0/auth0-react'
import { auth0Config } from './authConfig'
import { ThemeProvider } from './context/ThemeContext'

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ThemeProvider>
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={auth0Config.authorizationParams}
      cacheLocation={auth0Config.cacheLocation}
      useRefreshTokens={auth0Config.useRefreshTokens}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </Auth0Provider>
  </ThemeProvider>,
)