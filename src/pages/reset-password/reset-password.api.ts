import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS } from '@constants/Api'
import type { ApiResponseI } from '@app-types/api-response'

export interface ResetPasswordRequestI {
  token: string
  newPassword: string
  confirmPassword: string
}

export interface ResetPasswordResponseI {
  message: string
}

export const resetPasswordApi = createApi({
  reducerPath: 'resetPasswordApi',
  baseQuery: baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({
    // 🔑 RESET_PASSWORD - Đặt lại mật khẩu
    resetPassword: builder.mutation<ApiResponseI<ResetPasswordResponseI>, ResetPasswordRequestI>({
      query: (data: ResetPasswordRequestI) => ({
        url: API_ENDPOINTS.auth.resetPassword,
        method: 'POST',
        body: data
      })
    })
  })
})

// ============================================
// EXPORT HOOKS
// ============================================

export const { useResetPasswordMutation } = resetPasswordApi
