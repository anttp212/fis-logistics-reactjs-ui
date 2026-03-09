// ============================================
// AUTH TYPES & INTERFACES
// ============================================

export interface UserInfoI {
  id: string
  name: string
  email: string
  avatar?: string
  role?: string
  username?: string
  fullName?: string
}

export interface LoginRequestI {
  username: string
  password: string
}

export interface LoginResponseI {
  accessToken: string
  tokenType: string
  expiresIn?: number
  refreshToken?: string
  user?: UserInfoI
}

export interface RefreshTokenRequestI {
  refreshToken: string
}

export interface RefreshTokenResponseI {
  access_token: string
  token_type: string
  expires_in?: number
  refresh_token?: string
}

export interface LogoutResponseI {
  message: string
}
