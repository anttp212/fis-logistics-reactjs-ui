// Common API response types

export interface ApiResponseI<T> {
  status: 'success' | 'error'
  message: string
  data: T | null
}

export interface RefreshTokenResponseI {
  // camelCase — backend (Spring Boot / Jackson mặc định)
  accessToken?: string
  tokenType?: string
  expiresIn?: number
  refreshToken?: string
  // snake_case — fallback nếu backend khác trả về
  access_token?: string
  token_type?: string
  expires_in?: number
  refresh_token?: string
}
