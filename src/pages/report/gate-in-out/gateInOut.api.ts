import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS, API_TAGS } from '@constants/Api'

export interface SecurityRegistrationI {
  id: string
  registrationCode: string
  createdAt: string
  updatedAt: string
  status: 'CHECKED_IN' | 'CHECKED_OUT'
  driverName: string
  driverPhone: string
  plateNo: string
  vehicleType: string
  purpose: string
  notes?: string
  estimatedArrival?: string
  expectedDeparture?: string
  dispatchOrderId?: string | null
}

export interface GetSecurityRegistrationsParamsI {
  dateFrom?: string
  dateTo?: string
  status?: 'CHECKIN' | 'CHECKOUT'
  search?: string
  page?: number
  size?: number
  vehicleType?: string
}

export interface ApiListResponseI<T> {
  code: string
  message: string
  data: T[]
}

export interface SecurityRegistrationPaginationI {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  hasNext: boolean
  hasPrevious: boolean
}

export interface SecurityRegistrationListResponseI {
  code: string
  message: string
  data: SecurityRegistrationI[]
  pagination: SecurityRegistrationPaginationI
}

export interface SecurityDailyStatI {
  date: string
  checkIn: number
  checkOut: number
  incidents: number
}

export interface SecurityStatsResponseI {
  dailyStats: SecurityDailyStatI[]
  totalCheckIn: number
  totalCheckOut: number
  totalIncidents: number
  totalRegistrations: number
  totalPending: number
  period?: string
  incidentsByType?: Record<string, number>
}

export interface GetSecurityStatsParamsI {
  fromDate?: string
  toDate?: string
}

export const gateInOutApi = createApi({
  reducerPath: 'gateInOutApi',
  baseQuery: baseQuery,
  tagTypes: [API_TAGS.security],
  endpoints: (builder) => ({
    getSecurityRegistrations: builder.query<
      { data: SecurityRegistrationI[]; pagination: SecurityRegistrationPaginationI },
      GetSecurityRegistrationsParamsI | void
    >({
      query: (params) => {
        const p = params || {}
        const searchParams = new URLSearchParams()
        if (p.dateFrom) searchParams.set('fromDate', p.dateFrom)
        if (p.dateTo) searchParams.set('toDate', p.dateTo)
        if (p.status) searchParams.set('status', p.status)
        if (p.vehicleType) searchParams.set('vehicleType', p.vehicleType)
        if (p.page != null) searchParams.set('page', String(p.page))
        if (p.size != null) searchParams.set('size', String(p.size))
        const query = searchParams.toString()

        return {
          url: `${API_ENDPOINTS.security.registrations}${query ? `?${query}` : ''}`,
          method: 'GET'
        }
      },
      transformResponse: (response: SecurityRegistrationListResponseI) => ({
        data: response?.data ?? [],
        pagination: response?.pagination ?? {
          page: 1,
          size: 10,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true,
          hasNext: false,
          hasPrevious: false
        }
      })
    }),
    exportSecurityRegistrations: builder.mutation<Blob, GetSecurityRegistrationsParamsI | void>({
      query: (params) => {
        const p = params || {}
        const searchParams = new URLSearchParams()
        if (p.dateFrom) searchParams.set('fromDate', p.dateFrom)
        if (p.dateTo) searchParams.set('toDate', p.dateTo)
        if (p.status) searchParams.set('status', p.status)
        if (p.vehicleType) searchParams.set('vehicleType', p.vehicleType)
        const query = searchParams.toString()
        return {
          url: `${API_ENDPOINTS.security.registrationsExportExcel}${query ? `?${query}` : ''}`,
          method: 'GET',
          responseHandler: (response) => response.blob()
        }
      }
    }),
    getSecurityStats: builder.query<SecurityStatsResponseI, GetSecurityStatsParamsI | void>({
      query: (params) => {
        const p = params || {}
        const searchParams = new URLSearchParams()
        if (p.fromDate) searchParams.set('from', p.fromDate)
        if (p.toDate) searchParams.set('to', p.toDate)
        const query = searchParams.toString()
        return {
          url: `${API_ENDPOINTS.security.stats}${query ? `?${query}` : ''}`,
          method: 'GET'
        }
      },
      transformResponse: (response: { code?: string; data?: SecurityStatsResponseI }) => {
        const d = response?.data
        return (
          d ?? {
            dailyStats: [],
            totalCheckIn: 0,
            totalCheckOut: 0,
            totalIncidents: 0,
            totalRegistrations: 0,
            totalPending: 0
          }
        )
      }
    })
  })
})

export const { useGetSecurityRegistrationsQuery, useExportSecurityRegistrationsMutation, useGetSecurityStatsQuery } =
  gateInOutApi
