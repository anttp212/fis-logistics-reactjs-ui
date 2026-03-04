// API Configuration Defaults
export const API_DEFAULTS = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://logistics-be.t2g.io.vn',
  timeout: 30000, // 30 seconds
  tokenRefreshThreshold: 5 // 5 minutes before token expires to refresh
} as const

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    refreshToken: '/auth/refresh-token',
    profile: '/auth/profile',
    changePassword: '/auth/change-password'
  },
  user: {
    getProfile: '/user/profile',
    updateProfile: '/user/profile'
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
  vehicleDispatch: {
    list: '/api/v1/dispatch-orders',
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
  vehicleDispatch: 'VehicleDispatch'
} as const
