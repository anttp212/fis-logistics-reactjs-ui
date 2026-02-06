import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS } from '@constants/Api'
import type { ApiResponseI } from '@app-types/api-response'

export interface RegisterRequestI {
  username: string
  email: string
  password: string
}

export interface RegisterResponseI {
  message: string
  user?: {
    id: string
    username: string
    email: string
  }
}

export const registerApi = createApi({
  reducerPath: 'registerApi',
  baseQuery: baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({
    // 📝 REGISTER - Đăng ký tài khoản mới
    register: builder.mutation<ApiResponseI<RegisterResponseI>, RegisterRequestI>({
      query: (data: RegisterRequestI) => ({
        url: API_ENDPOINTS.auth.register,
        method: 'POST',
        body: data
      })
    })
  })
})

// ============================================
// EXPORT HOOKS
// ============================================

export const { useRegisterMutation } = registerApi
