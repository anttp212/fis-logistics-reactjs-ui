// ============================================
// ROUTE PATHS CONSTANTS
// ============================================

export const ROUTES = {
  // Protected routes (with layout)
  home: '/home',
  profile: '/profile',
  costGroup: '/cost-group',

  // Auth routes (no layout)
  login: '/login',

  // Root and fallback
  root: '/',
  wildcard: '*'

  // Future routes (examples)
  // DASHBOARD: '/dashboard',
  // SETTINGS: '/settings',
  // ADMIN: '/admin',
  // UNAUTHORIZED: '/unauthorized'
} as const

// Helper functions for building URLs
export const buildLoginWithRedirect = (redirectPath: string): string => {
  return `${ROUTES.login}?redirect=${encodeURIComponent(redirectPath)}`
}

// Type for route paths (for TypeScript safety)
export type RouteKeyT = keyof typeof ROUTES
export type RoutePathT = (typeof ROUTES)[RouteKeyT]
