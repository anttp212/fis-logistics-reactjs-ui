import React from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { routes } from './routes'
import '../i18n'

// ============================================
// ROUTER CONFIGURATION
// ============================================

const router = createBrowserRouter(routes)

const Router: React.FC = () => {
  return <RouterProvider router={router} />
}

export default Router
