// ============================================
// ROUTE PATHS CONSTANTS
// ============================================

export const ROUTES = {
  // Protected routes (with layout)
  home: '/home',
  // Public portal (no login required)
  portal: '/portal',
  portalRequest: '/portal/request',
  portalInbound: '/portal/inbound',
  portalOutbound: '/portal/outbound',
  portalStorage: '/portal/storage',
  portalVas: '/portal/vas',
  portalCrossDocking: '/portal/cross-docking',
  warehouse: '/warehouse',
  warehouseServiceRegistrationPortal: '/warehouse/service-registration-portal',
  warehouseAssessmentApproval: '/warehouse/assessment-approval',
  warehousePaymentManagement: '/warehouse/payment-management',
  warehouseYcdvListTracking: '/warehouse/ycdv-list-tracking',
  warehouseStockApprovalLock: '/warehouse/stock-approval-lock',
  warehouseYcdvExecutionTracking: '/warehouse/ycdv-execution-tracking',
  warehousePlanningReceiveYcdv: '/warehouse/planning-receive-ycdv',
  warehousePlanningOperations: '/warehouse/planning-operations',
  warehousePlanningApproval: '/warehouse/planning-approval',
  warehouseExecutionOperations: '/warehouse/execution-operations',
  warehouseExecutionReconciliation: '/warehouse/execution-reconciliation',
  warehouseExecutionConfirmLock: '/warehouse/execution-confirm-lock',
  warehouseStorageFee: '/warehouse/storage-fee',
  warehouseVasFee: '/warehouse/vas-fee',
  warehouseTallyJobSheet: '/warehouse/tally-job-sheet',
  warehouseBillingErpSync: '/warehouse/billing-erp-sync',
  warehouseExecutionResult: '/warehouse/execution-result',
  warehouseReportWms: '/warehouse/report-wms',
  warehouseLogAudit: '/warehouse/log-audit',
  depot: '/depot',
  depotServiceRegistration: '/depot/service-registration',
  depotFeeConfig: '/depot/fee-config',
  depotBorrowEmpty: '/depot/borrow-empty',
  depotReturnEmpty: '/depot/return-empty',
  depotBorrowReturnOrders: '/depot/borrow-return-orders',
  depotContainerLifecycle: '/depot/container-lifecycle',
  depotPaymentGateway: '/depot/payment-gateway',
  depotInvoiceDocs: '/depot/invoice-docs',
  depotYardPlanning: '/depot/yard-planning',
  depotOperationalSchedule: '/depot/operational-schedule',
  depotStaffEquipment: '/depot/staff-equipment',
  depotJobOrder: '/depot/job-order',
  depotRecognitionReconciliation: '/depot/recognition-reconciliation',
  depotBarrierDisplay: '/depot/barrier-display',
  depotDmsConfirmation: '/depot/dms-confirmation',
  depotOutputBilling: '/depot/output-billing',
  depotVehicleServiceLog: '/depot/vehicle-service-log',
  depotPerformanceStats: '/depot/performance-stats',
  depotOperationsDashboard: '/depot/operations-dashboard',
  reportGateInOut: '/report/gate-in-out',
  reportTransportation: '/report/transportation',
  transportation: '/transportation',
  transportationVehicleDispatch: '/transportation/vehicle-dispatch',
  transportationVehicleDispatchDetail: '/transportation/vehicle-dispatch/:id',
  transportationVehicleApproval: '/transportation/vehicle-approval',
  transportationServiceRequestPortal: '/transportation/service-request-portal',
  transportationReceptionAssessment: '/transportation/reception-assessment',
  transportationDispatchPlanning: '/transportation/dispatch-planning',
  transportationTripMonitoring: '/transportation/trip-monitoring',
  transportationTripSettlement: '/transportation/trip-settlement',
  transportationTallyBilling: '/transportation/tally-billing',
  config: '/config',
  roleGroup: '/config/role-group',
  user: '/config/user',
  userManagement: '/user-management',
  userManagementUsers: '/user-management/users',
  userManagementUserDetail: '/user-management/users/:id',
  userManagementRolesPermissions: '/user-management/roles-permissions',
  userManagementRoleDetail: '/user-management/roles-permissions/:id',
  userManagementAuthSecurity: '/user-management/auth-security',
  userManagementProfile: '/user-management/profile',
  organizationStructure: '/organization-structure',
  organizationStructureBranches: '/organization-structure/branches',
  organizationStructureBranchDetail: '/organization-structure/branches/:id',
  organizationStructureDepartments: '/organization-structure/departments',
  organizationStructureDepartmentDetail: '/organization-structure/departments/:id',
  employeeProfile: '/employee-profile',
  employeeProfileList: '/employee-profile/list',
  employeeProfileDetail: '/employee-profile/:id',
  categoryManagement: '/category-management',
  categoryManagementCustomerProfile: '/category-management/customer-profile',
  categoryManagementCustomerProfileDetail: '/category-management/customer-profile/:id',
  categoryManagementPartnerProfile: '/category-management/partner-profile',
  categoryManagementPartnerProfileDetail: '/category-management/partner-profile/:id',
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
  landing: '/',
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

export const buildUserDetailPath = (userId: string): string => {
  return `/user-management/users/${userId}`
}

export const buildRoleDetailPath = (roleId: string): string => {
  return `/user-management/roles-permissions/${roleId}`
}

export const buildBranchDetailPath = (branchId: string): string => {
  return `/organization-structure/branches/${branchId}`
}

export const buildDepartmentDetailPath = (departmentId: string): string => {
  return `/organization-structure/departments/${departmentId}`
}

export const buildEmployeeDetailPath = (employeeId: string): string => {
  return `/employee-profile/${employeeId}`
}

export const buildCustomerDetailPath = (customerId: string): string => {
  return `/category-management/customer-profile/${customerId}`
}

export const buildPartnerDetailPath = (partnerId: string): string => {
  return `/category-management/partner-profile/${partnerId}`
}

export const buildVehicleDispatchDetailPath = (id: string): string => {
  return `/transportation/vehicle-dispatch/${id}`
}

// Type for route paths (for TypeScript safety)
export type RouteKeyT = keyof typeof ROUTES
export type RoutePathT = (typeof ROUTES)[RouteKeyT]
