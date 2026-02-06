// ============================================
// ROUTE PATHS CONSTANTS
// ============================================

export const ROUTES = {
  // Protected routes (with layout)
  home: '/home',
  profile: '/profile',
  warehouse: '/warehouse',
  depot: '/depot',
  transportation: '/transportation',
  config: '/config',
  roleGroup: '/config/role-group',
  user: '/config/user',
  userManagement: '/user-management',
  userManagementUsers: '/user-management/users',
  userManagementUserGroup: '/user-management/user-group',
  userManagementAuthSecurity: '/user-management/auth-security',
  userManagementRolesPermissions: '/user-management/roles-permissions',
  categoryManagement: '/category-management',
  categoryManagementLandAndPort: '/category-management/land-and-port',
  categoryManagementGoodsAndStandards: '/category-management/goods-and-standards',
  categoryManagementFeesAndVas: '/category-management/fees-and-vas',
  categoryManagementCustomerProfile: '/category-management/customer-profile',
  categoryManagementEmployeeProfile: '/category-management/employee-profile',
  categoryManagementVehiclesAndEquipment: '/category-management/vehicles-and-equipment',
  categoryManagementLoadingPlan: '/category-management/loading-plan',
  categoryManagementWarehouseAndYardLayout: '/category-management/warehouse-and-yard-layout',
  categoryManagementShifts: '/category-management/shifts',
  notificationManagement: '/notification-management',
  notificationManagementTemplateConfig: '/notification-management/template-config',
  systemConfig: '/system-config',
  systemConfigOperatingParams: '/system-config/operating-params',

  // Auth routes (no layout)
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

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
