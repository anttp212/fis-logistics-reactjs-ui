// API Configuration Defaults
export const API_DEFAULTS = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://logistics-be.t2g.io.vn',
  timeout: 30000, // 30 seconds
  tokenRefreshThreshold: 5 // 5 minutes before token expires to refresh
} as const

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: 'api/v1/auth/login',
    logout: 'api/v1/auth/logout',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    refreshToken: '/auth/refresh-token',
    profile: '/auth/profile',
    changePassword: '/auth/change-password'
  },
  user: {
    getProfile: '/user/profile',
    updateProfile: '/user/profile',
    list: '/api/v1/api/users/search',
    detail: '/api/v1/api/users/:id'
  },
  userGroup: {
    list: '/user-groups',
    detail: '/user-groups/:id',
    create: '/user-groups',
    update: '/user-groups/:id',
    delete: '/user-groups/:id'
  },
  department: {
    list: '/departments',
    detail: '/departments/:id'
  },
  portal: {
    inboundRegistration: '/portal/inbound/registration'
  },
  dashboard: {
    overview: '/api/v1/api/dashboard/overview'
  },
  coordinator: {
    reports: '/api/v1/api/coordinator/reports'
  },
  security: {
    registrations: '/api/v1/api/security/registrations',
    registrationsExportExcel: '/api/v1/api/security/registrations/export-excel',
    stats: '/api/v1/api/security/stats'
  },
  logisticInformation: {
    list: '/api/v1/logistics-customers',
    detail: '/api/v1/logistics-customers/:id',
    create: '/api/v1/logistics-customers',
    update: '/api/v1/logistics-customers/:id'
  },
  vehicleFleet: {
    list: '/api/v1/vehicles',
    available: '/api/v1/vehicles/available',
    detail: '/api/v1/vehicles/:id',
    create: '/api/v1/vehicles',
    update: '/api/v1/vehicles/:id'
  },
  driverManagement: {
    list: '/api/v1/driver-management',
    detail: '/api/v1/driver-management/:id',
    create: '/api/v1/driver-management',
    update: '/api/v1/driver-management/:id'
  },
  vehicleDispatch: {
    list: '/api/v1/dispatch-orders',
    exportExcel: '/api/v1/dispatch-orders/export-excel',
    detail: '/api/v1/dispatch-orders/:id',
    create: '/api/v1/dispatch-orders',
    update: '/api/v1/dispatch-orders/:id',
    delete: '/api/v1/dispatch-orders/:id',
    cancel: '/api/v1/dispatch-orders/:id/cancel',
    assignDriver: '/vehicle-dispatch/:id/assign-driver',
    vehicleTypes: '/api/v1/vehicle-types',
    requestingUnits: '/api/v1/requesting-units',
    locations: '/api/v1/locations',
    drivers: '/api/v1/drivers',
    containerSizes: '/api/v1/container-sizes'
  },
  files: {
    presignedUploadUrl: '/api/v1/files/presigned-upload-url'
  }
} as const

// HTTP Status Codes
export const HTTP_STATUS = {
  ok: 200,
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  internalServerError: 500
} as const

// API Tags for RTK Query
export const API_TAGS = {
  auth: 'Auth',
  user: 'User',
  currentUser: 'CurrentUser',
  userGroup: 'UserGroup',
  department: 'Department',
  vehicleDispatch: 'VehicleDispatch',
  security: 'Security',
  logisticInformation: 'LogisticInformation',
  vehicleFleet: 'VehicleFleet',
  driverManagement: 'DriverManagement'
} as const
