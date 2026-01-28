import { redirect } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import SmartRedirect from './SmartRedirect'
import { ROUTES, buildLoginWithRedirect } from '@constants'
import { store } from '@redux/index'
import { AppLayout } from '@components'

// ============================================
// UTILITIES
// ============================================

// ✅ Safe auth check utility - Works with redux-persist
const isAuthenticated = (): boolean => {
  try {
    const state = store.getState()

    // Check if redux-persist has loaded (_persist.rehydrated = true)
    // If not rehydrated yet, assume not authenticated for safety
    if (!state._persist?.rehydrated) {
      return false
    }

    const hasToken = !!state.auth?.accessToken
    return hasToken
  } catch (error) {
    console.error('Error checking auth state:', error)
    return false
  }
}

// Protected route loader - redirects to login with intended URL
const protectedLoader = async ({ request }: { request: Request }) => {
  // Wait a bit for redux-persist to potentially rehydrate
  let attempts = 0
  const maxAttempts = 20 // Max 1 second wait (20 * 50ms)

  while (attempts < maxAttempts) {
    const state = store.getState()

    // If rehydrated, we can make the auth decision
    if (state._persist?.rehydrated) {
      const authenticated = isAuthenticated()

      if (!authenticated) {
        // Save the intended URL that user wanted to access
        const url = new URL(request.url)
        const intendedPath = url.pathname + url.search

        // URL approach: Pass redirect in query parameter (recommended)
        const redirectUrl = buildLoginWithRedirect(intendedPath)
        throw redirect(redirectUrl)
      }
      return null
    }

    // Wait a bit more for rehydration
    await new Promise((resolve) => setTimeout(resolve, 50))
    attempts++
  }

  // If we timeout waiting for rehydration, assume not authenticated for security
  const url = new URL(request.url)
  const intendedPath = url.pathname + url.search
  const redirectUrl = buildLoginWithRedirect(intendedPath)
  throw redirect(redirectUrl)
}

// Auth route loader - redirects authenticated users away from login
const authLoader = async () => {
  // Wait a bit for redux-persist to potentially rehydrate
  // This is a fallback - ideally PersistGate should handle this
  let attempts = 0
  const maxAttempts = 20 // Max 1 second wait (20 * 50ms)

  while (attempts < maxAttempts) {
    const state = store.getState()

    // If rehydrated, we can make the auth decision
    if (state._persist?.rehydrated) {
      const authenticated = isAuthenticated()

      if (authenticated) {
        // User is already logged in, redirect to home
        throw redirect(ROUTES.home)
      }
      return null
    }

    // Wait a bit more for rehydration
    await new Promise((resolve) => setTimeout(resolve, 50))
    attempts++
  }

  // If we timeout waiting for rehydration, assume not authenticated
  return null
}

// ============================================
// ROUTES CONFIGURATION
// ============================================

export const routes: RouteObject[] = [
  // 🔄 Root redirect first
  {
    index: true,
    element: <SmartRedirect />
  },

  // 🔐 Protected routes with layout
  {
    path: ROUTES.root,
    element: <AppLayout />,
    loader: protectedLoader,
    children: [
      {
        path: ROUTES.home,
        lazy: async () => {
          const HomeComponent = await import('../pages/home')
          return { Component: HomeComponent.default }
        }
      },
      {
        path: ROUTES.profile,
        lazy: async () => {
          const ProfileComponent = await import('../pages/profile')
          return { Component: ProfileComponent.default }
        }
      },
      {
        path: ROUTES.costGroup,
        lazy: async () => {
          const CostGroupComponent = await import('../pages/cost-group')
          return { Component: CostGroupComponent.default }
        }
      }
    ]
  },

  // 🔐 Auth routes (no layout)
  {
    path: ROUTES.login,
    lazy: async () => {
      const LoginComponent = await import('../pages/login')
      return { Component: LoginComponent.default }
    },
    loader: authLoader
  },

  // 🔄 Wildcard redirect
  {
    path: ROUTES.wildcard,
    element: <SmartRedirect />
  }
]
