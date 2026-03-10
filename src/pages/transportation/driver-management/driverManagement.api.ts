import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS, API_TAGS } from '@constants/Api'
import type { DriverItemI } from './data'

export interface CreateDriverRequestI {
  logisticsId: string
  idCardNumber: string
  fullName: string
  phone: string
  email?: string
  password: string
  gender?: string
  status: string
  note?: string
}

export interface UpdateDriverRequestI {
  logisticsId: string
  idCardNumber: string
  fullName: string
  phone: string
  email?: string
  password?: string
  gender?: string
  status: string
  note?: string
}

export interface GetDriverListParamsI {
  page?: number
  size?: number
  search?: string
  status?: string
  logisticsId?: string
}

export interface DriverPaginationI {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  hasNext: boolean
  hasPrevious: boolean
}

export interface DriverListResponseI {
  code: string
  message: string
  data?: DriverItemI[]
  pagination?: DriverPaginationI
}

export const driverManagementApi = createApi({
  reducerPath: 'driverManagementApi',
  baseQuery,
  tagTypes: [API_TAGS.driverManagement],
  endpoints: (builder) => ({
    getDriverList: builder.query<{ data: DriverItemI[]; pagination: DriverPaginationI }, GetDriverListParamsI | void>({
      query: (params) => {
        const p = params || {}
        const searchParams = new URLSearchParams()
        if (p.page != null) searchParams.set('page', String(p.page))
        if (p.size != null) searchParams.set('size', String(p.size))
        if (p.search?.trim()) searchParams.set('search', p.search.trim())
        if (p.status?.trim()) searchParams.set('status', p.status.trim())
        if (p.logisticsId?.trim()) searchParams.set('logisticsId', p.logisticsId.trim())
        const qs = searchParams.toString()
        return { url: `${API_ENDPOINTS.driverManagement.list}${qs ? `?${qs}` : ''}`, method: 'GET' }
      },
      transformResponse: (response: DriverListResponseI) => ({
        data: response.data ?? [],
        pagination: response.pagination ?? {
          page: 1,
          size: 10,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true,
          hasNext: false,
          hasPrevious: false
        }
      }),
      providesTags: [API_TAGS.driverManagement]
    }),
    getDriverDetail: builder.query<DriverItemI, string>({
      query: (id) => ({ url: API_ENDPOINTS.driverManagement.detail.replace(':id', id), method: 'GET' }),
      transformResponse: (response: { data?: DriverItemI } | DriverItemI) =>
        (response && typeof response === 'object' && 'data' in response ? response.data : response) as DriverItemI,
      providesTags: (_result, _err, id) => [{ type: API_TAGS.driverManagement, id }]
    }),
    createDriver: builder.mutation<DriverItemI, CreateDriverRequestI>({
      query: (body) => ({ url: API_ENDPOINTS.driverManagement.create, method: 'POST', body }),
      transformResponse: (response: { data?: DriverItemI } | DriverItemI) =>
        (response && typeof response === 'object' && 'data' in response ? response.data : response) as DriverItemI,
      invalidatesTags: [API_TAGS.driverManagement]
    }),
    updateDriver: builder.mutation<DriverItemI, { id: string; body: UpdateDriverRequestI }>({
      query: ({ id, body }) => ({
        url: API_ENDPOINTS.driverManagement.update.replace(':id', id),
        method: 'PUT',
        body
      }),
      transformResponse: (response: { data?: DriverItemI } | DriverItemI) =>
        (response && typeof response === 'object' && 'data' in response ? response.data : response) as DriverItemI,
      invalidatesTags: (_result, _err, { id }) => [API_TAGS.driverManagement, { type: API_TAGS.driverManagement, id }]
    })
  })
})

export const { useGetDriverListQuery, useGetDriverDetailQuery, useCreateDriverMutation, useUpdateDriverMutation } =
  driverManagementApi
