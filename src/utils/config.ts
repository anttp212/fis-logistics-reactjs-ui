import { API_DEFAULTS } from '@constants/Api'

export interface ConfigI {
  apiUrl: string
  environment: 'development' | 'staging' | 'production'
  debugMode: boolean
  apiTimeout: number
  tokenRefreshThreshold: number // minutes before token expires to refresh
}

const createConfig = (): ConfigI => {
  const env = (import.meta.env.VITE_APP_ENV || 'development') as ConfigI['environment']

  return {
    apiUrl: API_DEFAULTS.baseUrl,
    environment: env,
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true' || env === 'development',
    apiTimeout: API_DEFAULTS.timeout,
    tokenRefreshThreshold: API_DEFAULTS.tokenRefreshThreshold
  }
}

export const config = createConfig()

// Type-safe environment check
export const isDev = config.environment === 'development'
export const isStaging = config.environment === 'staging'
export const isProd = config.environment === 'production'
