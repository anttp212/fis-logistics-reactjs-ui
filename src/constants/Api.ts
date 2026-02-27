// API Configuration Defaults
export const API_DEFAULTS = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.example.com',
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
    list: '/vehicle-dispatch',
    detail: '/vehicle-dispatch/:id',
    create: '/vehicle-dispatch',
    update: '/vehicle-dispatch/:id',
    delete: '/vehicle-dispatch/:id',
    assignDriver: '/vehicle-dispatch/:id/assign-driver'
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
