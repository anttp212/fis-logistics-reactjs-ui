// Common API response types

export interface ApiResponseI<T> {
  status: 'success' | 'error'
  message: string
  data: T | null
}

export interface RefreshTokenResponseI {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
  user?: any
}
