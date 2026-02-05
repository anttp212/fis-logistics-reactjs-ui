import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS } from '@constants/Api'
import type { ApiResponseI } from '@app-types/api-response'

export interface ForgotPasswordRequestI {
  email: string
}

export interface ForgotPasswordResponseI {
  message: string
}

export const forgotPasswordApi = createApi({
  reducerPath: 'forgotPasswordApi',
  baseQuery: baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({
    // 📧 FORGOT_PASSWORD - Gửi email đặt lại mật khẩu
    forgotPassword: builder.mutation<ApiResponseI<ForgotPasswordResponseI>, ForgotPasswordRequestI>({
      query: (data: ForgotPasswordRequestI) => ({
        url: API_ENDPOINTS.auth.forgotPassword,
        method: 'POST',
        body: data
      })
    })
  })
})

// ============================================
// EXPORT HOOKS
// ============================================

export const { useForgotPasswordMutation } = forgotPasswordApi
