import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS, API_TAGS } from '@constants/Api'
import type { LoginRequestI, LoginResponseI, LogoutResponseI } from '@app-types/auth'
import type { ApiResponseI } from '@app-types/api-response'

export const loginApi = createApi({
  reducerPath: 'loginApi',
  baseQuery: baseQuery,
  tagTypes: [API_TAGS.currentUser],
  endpoints: (builder) => ({
    // 🔐 LOGIN - Đăng nhập
    login: builder.mutation<ApiResponseI<LoginResponseI>, LoginRequestI>({
      query: (credentials: LoginRequestI) => ({
        url: API_ENDPOINTS.auth.login,
        method: 'POST',
        body: credentials
      }),
      invalidatesTags: [API_TAGS.currentUser],
      transformResponse: (response: ApiResponseI<LoginResponseI> | any) => {
        // Backend format: { code, message, data: { accessToken, expiresIn, refreshToken, roleCode, tokenType } }
        if (response?.data) {
          const d = response.data
          if (typeof d === 'object') {
            const roleCode = d.roleCode ?? d.role
            const roleMap: Record<string, string> = { ADMIN: 'Admin', DRIVER: 'Tài xế', GUARD: 'Bảo vệ' }
            const roleName = roleCode ? (roleMap[String(roleCode).toUpperCase()] ?? roleCode) : undefined
            const user = d.user ?? d.userInfo ?? (roleName ? { role: roleName } : undefined)
            return {
              status: response.code === 'SUCCESS' ? 'success' : 'error',
              message: response.message ?? '',
              data: {
                accessToken: d.accessToken ?? d.access_token,
                tokenType: d.tokenType ?? d.token_type ?? 'Bearer',
                expiresIn: d.expiresIn ?? d.expires_in,
                refreshToken: d.refreshToken ?? d.refresh_token,
                user: user
                  ? { ...user, role: user.role ?? roleName }
                  : roleName
                    ? { id: '', name: '', email: '', role: roleName }
                    : undefined
              }
            }
          }
        }
        return response
      }
    }),

    // 🚪 LOGOUT - Đăng xuất
    logout: builder.mutation<ApiResponseI<LogoutResponseI>, void>({
      query: () => ({
        url: API_ENDPOINTS.auth.logout,
        method: 'POST'
      }),
      // Optimistic update - clear auth state immediately
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled
        } catch (error) {
          console.error('❌ Logout failed:', error)
        }
      }
    }),

    // 🔄 GET_PROFILE - Lấy thông tin user hiện tại
    getCurrentUser: builder.query<ApiResponseI<any>, void>({
      query: () => ({
        url: API_ENDPOINTS.auth.profile,
        method: 'GET'
      }),
      providesTags: [API_TAGS.currentUser]
    })
  })
})

// ============================================
// EXPORT HOOKS
// ============================================

export const {
  // Mutations
  useLoginMutation,
  useLogoutMutation,

  // Queries
  useGetCurrentUserQuery,

  // Lazy queries
  useLazyGetCurrentUserQuery
} = loginApi
