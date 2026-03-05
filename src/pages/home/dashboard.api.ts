import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
// import { API_ENDPOINTS } from '@constants/Api'

// ============================================
// TYPES
// ============================================

export interface DashboardOrdersI {
  total: number
  pending: number
  inProgress: number
  completed: number
  cancelled: number
  incident: number
  rejected: number
  completionRate: number
}

export interface DashboardDriversI {
  total: number
  available: number
  busy: number
  offline: number
}

export interface DashboardSecurityI {
  todayCheckIn: number
  todayCheckOut: number
  pendingRegistrations: number
  openIncidents: number
}

export interface DashboardOverviewI {
  orders: DashboardOrdersI
  drivers: DashboardDriversI
  security: DashboardSecurityI
}

const DUMP_OVERVIEW: DashboardOverviewI = {
  orders: {
    total: 20,
    pending: 11,
    inProgress: 2,
    completed: 5,
    cancelled: 2,
    incident: 0,
    rejected: 0,
    completionRate: 25
  },
  drivers: {
    total: 10,
    available: 6,
    busy: 3,
    offline: 1
  },
  security: {
    todayCheckIn: 15,
    todayCheckOut: 12,
    pendingRegistrations: 3,
    openIncidents: 1
  }
}

// ============================================
// API
// ============================================

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery,
  tagTypes: ['Dashboard'],
  endpoints: (builder) => ({
    getDashboardOverview: builder.query<DashboardOverviewI, void>({
      queryFn: async (_arg, _api, _extraOptions, _baseQuery) => {
        // const _result = await _baseQuery({ url: API_ENDPOINTS.dashboard.overview, method: 'GET' })
        // if (result.data) {
        //   const res = result.data as { data?: DashboardOverviewI } & DashboardOverviewI
        //   const data = res?.data ?? res
        //   if (data?.orders && data?.drivers && data?.security) {
        //     return { data }
        //   }
        // }
        return { data: DUMP_OVERVIEW }
      },
      providesTags: ['Dashboard']
    })
  })
})

export const { useGetDashboardOverviewQuery } = dashboardApi
