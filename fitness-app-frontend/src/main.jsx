import React from 'react'
import ReactDOM from 'react-dom/client'

import { Provider } from 'react-redux'
import { store } from './store/store'

import './index.css'
import App from './App'
import { AuthProvider } from 'react-oauth2-code-pkce'
import { authConfig } from './authConfig'
import { ThemeProvider } from './context/ThemeContext'

// As of React 18
const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <ThemeProvider>
    <AuthProvider authConfig={authConfig}
                  loadingComponent={<div>Loading...</div>}>
      <Provider store={store}>
        <App />
      </Provider>
    </AuthProvider>
  </ThemeProvider>,
)