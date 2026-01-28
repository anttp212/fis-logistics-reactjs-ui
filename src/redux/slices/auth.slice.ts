import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import SliceName from './slice.name'
import type { UserInfoI, LoginResponseI } from '@app-types/auth'
import type { ApiResponseI } from '@app-types/api-response'
import { loginApi } from '../../pages/login/login.api'

// ============================================
// AUTH STATE INTERFACE
// ============================================

export interface AuthStateI {
  accessToken: string | null
  refreshToken: string | null
  tokenType: string | null
  expiresIn: number | null
  user: UserInfoI | null
  isLoading: boolean
  error: string | null
}

const initialState: AuthStateI = {
  accessToken: null,
  refreshToken: null,
  tokenType: null,
  expiresIn: null,
  user: null,
  isLoading: false,
  error: null
}

const authSlice = createSlice({
  name: SliceName.Auth,
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
      state.error = null
    },
    setTokenData(
      state,
      action: PayloadAction<{
        accessToken: string
        refreshToken?: string | null
        tokenType?: string | null
        expiresIn?: number | null
      }>
    ) {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken || null
      state.tokenType = action.payload.tokenType || null
      state.expiresIn = action.payload.expiresIn || null
      state.error = null
    },
    setRefreshToken(state, action: PayloadAction<string>) {
      state.refreshToken = action.payload
    },
    setUser(state, action: PayloadAction<UserInfoI | null>) {
      state.user = action.payload
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload
    },
    clearAuth(_state) {
      // Reset state to initial values
      return initialState
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    }
  },
  extraReducers: (builder) => {
    // ============================================
    // 🔐 LOGIN API MATCHERS
    // ============================================

    // Login Pending - Show loading
    builder
      .addMatcher(loginApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true
        state.error = null
      })

      // Login Success - Save auth data automatically
      .addMatcher(
        loginApi.endpoints.login.matchFulfilled,
        (state, action: PayloadAction<ApiResponseI<LoginResponseI>>) => {
          state.isLoading = false
          state.error = null

          const loginData = action.payload.data
          if (loginData) {
            state.accessToken = loginData.accessToken
            state.refreshToken = loginData.refreshToken || null
            state.tokenType = loginData.tokenType
            state.expiresIn = loginData.expiresIn || null
            state.user = loginData.user || null
          }
        }
      )

      // Login Error - Show error message
      .addMatcher(loginApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false
        state.error = action.error?.message || 'Đăng nhập thất bại'
      })

      // ============================================
      // 🚪 LOGOUT API MATCHERS
      // ============================================

      // Logout Success - Clear all auth data
      .addMatcher(loginApi.endpoints.logout.matchFulfilled, (state) => {
        // Clear Redux state (Redux-persist auto-clears localStorage)
        Object.assign(state, initialState)
      })

      // Logout Error - Still clear local data for security
      .addMatcher(loginApi.endpoints.logout.matchRejected, (state) => {
        // Even if logout API fails, clear local data for security
        Object.assign(state, initialState)
      })
  }
})

export const { setToken, setTokenData, setRefreshToken, setUser, setError, clearAuth, setAuthLoading } =
  authSlice.actions

export default authSlice
