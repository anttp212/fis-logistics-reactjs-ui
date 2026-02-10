import React from 'react'
import ReactDOM from 'react-dom/client'

import './index.css'
import './assets/styles/antd.scss'

import Router from './router'
import { Provider } from 'react-redux'
import { persistor, store } from './redux'
import { FISThemeProvider } from 'fis-component'
import 'fis-component/src/styles/fonts.css'
import theme from './assets/styles/design-system'
import { PersistGate } from 'redux-persist/integration/react'

// Suppress React DOM property warnings from third-party libraries
const originalError = console.error
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Invalid DOM property') || args[0].includes('stroke-linecap') || args[0].includes('stroke-linejoin'))
  ) {
    return
  }
  originalError.apply(console, args)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <FISThemeProvider theme={theme}>
          <Router />
        </FISThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)
