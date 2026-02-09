// ============================================
// ROUTE PATHS CONSTANTS
// ============================================

export const ROUTES = {
  // Protected routes (with layout)
  home: '/home',
  warehouse: '/warehouse',
  depot: '/depot',
  transportation: '/transportation',
  config: '/config',
  roleGroup: '/config/role-group',
  user: '/config/user',
  userManagement: '/user-management',
  userManagementUsers: '/user-management/users',
  userManagementRolesPermissions: '/user-management/roles-permissions',
  userManagementAuthSecurity: '/user-management/auth-security',
  userManagementProfile: '/user-management/profile',
  categoryManagement: '/category-management',
  categoryManagementCustomerProfile: '/category-management/customer-profile',
  categoryManagementPartnerProfile: '/category-management/partner-profile',
  categoryManagementLandAndPort: '/category-management/land-and-port',
  categoryManagementVehiclesAndEquipment: '/category-management/vehicles-and-equipment',
  categoryManagementGoodsAndStandards: '/category-management/goods-and-standards',
  categoryManagementLoadingPlan: '/category-management/loading-plan',
  categoryManagementWarehouseInfrastructure: '/category-management/warehouse-infrastructure',
  categoryManagementYardInfrastructure: '/category-management/yard-infrastructure',
  notificationManagement: '/notification-management',
  notificationManagementTemplateConfig: '/notification-management/template-config',
  systemConfig: '/system-config',
  systemConfigOperatingParams: '/system-config/operating-params',
  systemConfigNotificationTemplate: '/system-config/notification-template',

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
