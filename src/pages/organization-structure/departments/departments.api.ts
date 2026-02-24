import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS, API_TAGS } from '@constants/Api'
import type { ApiResponseI } from '@app-types/api-response'

export interface DepartmentI {
  key: string
  name: string
  code: string
  branch?: string
  status?: string
}

export interface DepartmentListResponseI {
  data: DepartmentI[]
  total?: number
}

export const departmentsApi = createApi({
  reducerPath: 'departmentsApi',
  baseQuery: baseQuery,
  tagTypes: [API_TAGS.department],
  endpoints: (builder) => ({
    getDepartments: builder.query<ApiResponseI<DepartmentListResponseI>, void>({
      query: () => ({
        url: API_ENDPOINTS.department.list,
        method: 'GET'
      }),
      providesTags: [API_TAGS.department],
      transformErrorResponse: (response: unknown) => {
        console.error('❌ Get departments failed:', response)
        return response
      }
    })
  })
})

export const { useGetDepartmentsQuery, useLazyGetDepartmentsQuery } = departmentsApi
