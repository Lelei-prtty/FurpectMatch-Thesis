import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './App'
import { initAuth } from './Data/Accounts.jsx'

const root = ReactDOM.createRoot(document.getElementById('root'))

function render() {
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

// Restore the saved login first, then render, so guards see the user on refresh.
// If restoring fails for any reason, still render the app (as signed out).
initAuth().catch(console.error).finally(render)