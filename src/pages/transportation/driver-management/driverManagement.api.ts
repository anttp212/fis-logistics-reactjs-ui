import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS, API_TAGS } from '@constants/Api'
import type { DriverItemI } from './data'

export interface CreateDriverRequestI {
  logisticsCustomerId: string
  primaryVehicleId?: string
  trailerVehicleId?: string
  userId: string
  gender?: string
  idCardNumber: string
  note?: string
  drivingLicenseAttachments: string[]
}

export type UpdateDriverRequestT = CreateDriverRequestI

export interface GetDriverListParamsI {
  page?: number
  size?: number
  keyword?: string
  status?: string
  logisticsId?: string
  createdDateFrom?: string
  createdDateTo?: string
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

export interface UserListItemI {
  id: string
  username: string
  email?: string
  fullName?: string
  phone?: string
  avatarPath?: string
  status?: boolean
}

export interface UserListResponseI {
  code: string
  message: string
  data?: UserListItemI[]
}

export interface GetUserListRequestI {
  page: number
  size: number
  search: string
  roleCode: string
}

export interface UserDetailResponseI {
  code: string
  message: string
  data?: UserListItemI
}

export const driverManagementApi = createApi({
  reducerPath: 'driverManagementApi',
  baseQuery,
  tagTypes: [API_TAGS.driverManagement, API_TAGS.user],
  endpoints: (builder) => ({
    getDriverList: builder.query<{ data: DriverItemI[]; pagination: DriverPaginationI }, GetDriverListParamsI | void>({
      query: (params) => {
        const p = params || {}
        const searchParams = new URLSearchParams()
        if (p.page != null) searchParams.set('page', String(p.page))
        if (p.size != null) searchParams.set('size', String(p.size))
        if (p.keyword?.trim()) searchParams.set('keyword', p.keyword.trim())
        if (p.status?.trim()) searchParams.set('status', p.status.trim())
        if (p.logisticsId?.trim()) searchParams.set('logisticsId', p.logisticsId.trim())
        if (p.createdDateFrom?.trim()) searchParams.set('createdDateFrom', p.createdDateFrom.trim())
        if (p.createdDateTo?.trim()) searchParams.set('createdDateTo', p.createdDateTo.trim())
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
    getUserList: builder.query<UserListItemI[], GetUserListRequestI>({
      query: (body) => ({ url: API_ENDPOINTS.user.list, method: 'POST', body }),
      transformResponse: (response: UserListResponseI) => response.data ?? [],
      providesTags: [API_TAGS.user]
    }),
    getUserDetail: builder.query<UserListItemI, string>({
      query: (id) => ({ url: API_ENDPOINTS.user.detail.replace(':id', id), method: 'GET' }),
      transformResponse: (response: UserDetailResponseI, _meta, id) =>
        response.data ?? ({ id, username: '' } as UserListItemI),
      providesTags: (_result, _err, id) => [{ type: API_TAGS.user, id }]
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
    updateDriver: builder.mutation<DriverItemI, { id: string; body: UpdateDriverRequestT }>({
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

export const {
  useGetDriverListQuery,
  useGetUserListQuery,
  useGetUserDetailQuery,
  useGetDriverDetailQuery,
  useCreateDriverMutation,
  useUpdateDriverMutation
} = driverManagementApi
