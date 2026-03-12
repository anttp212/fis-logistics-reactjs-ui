import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS } from '@constants/Api'
import { LogisticCustomerTypeT } from '../logistic-information/data'

// ============================================
// TYPES - Master data API response
// ============================================

export interface VehicleTypeI {
  id: string
  code: string
  name: string
  sortOrder?: number
}
export interface GetLogisticListParamsI {
  page?: number
  size?: number
  keyword?: string
  phone?: string
  customerType?: string
  paymentType?: string
  dateFrom?: string
  dateTo?: string
}
export interface LogisticInformationI {
  id: string
  customerType: LogisticCustomerTypeT
  companyName?: string
  fullName?: string
}

export interface LogisticPaginationI {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  hasNext: boolean
  hasPrevious: boolean
}

export interface LogisticListResponseI {
  code: string
  message: string
  data?: LogisticInformationI[]
  pagination?: LogisticPaginationI
}

export interface LocationI {
  id: string
  code: string
  name: string
  address?: string | null
  province?: string
  locationType?: string
  sortOrder?: number
}

export interface DriverI {
  id: string
  name: string
  phone?: string
  code?: string
  sortOrder?: number
  fullName?: string
  employeeCode?: string
  vehiclePlateNo?: string
}

export interface ContainerSizeI {
  id: string
  code: string
  name?: string
  sortOrder?: number
}

// ============================================
// API
// ============================================

export const vehicleDispatchMasterApi = createApi({
  reducerPath: 'vehicleDispatchMasterApi',
  baseQuery: baseQuery,
  endpoints: (builder) => ({
    getVehicleTypes: builder.query<VehicleTypeI[], void>({
      query: () => ({ url: API_ENDPOINTS.vehicleDispatch.vehicleTypes, method: 'GET' }),
      transformResponse: (response: { data?: VehicleTypeI[] } | VehicleTypeI[]) =>
        Array.isArray(response) ? response : (response?.data ?? [])
    }),
    getLogisticList: builder.query<
      { data: LogisticInformationI[]; pagination: LogisticPaginationI },
      GetLogisticListParamsI | void
    >({
      query: (params) => {
        const p = params || {}
        const searchParams = new URLSearchParams()
        if (p.page != null) searchParams.set('page', String(p.page))
        if (p.size != null) searchParams.set('size', String(p.size))
        if (p.keyword?.trim()) searchParams.set('keyword', p.keyword.trim())
        if (p.phone?.trim()) searchParams.set('phone', p.phone.trim())
        if (p.customerType?.trim()) searchParams.set('customerType', p.customerType.trim())
        if (p.paymentType?.trim()) searchParams.set('paymentType', p.paymentType.trim())
        if (p.dateFrom?.trim()) searchParams.set('dateFrom', p.dateFrom.trim())
        if (p.dateTo?.trim()) searchParams.set('dateTo', p.dateTo.trim())
        const qs = searchParams.toString()
        return { url: `${API_ENDPOINTS.logisticInformation.list}${qs ? `?${qs}` : ''}`, method: 'GET' }
      },
      transformResponse: (response: LogisticListResponseI) => ({
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
      })
    }),
    getLocations: builder.query<LocationI[], void>({
      query: () => ({ url: API_ENDPOINTS.vehicleDispatch.locations, method: 'GET' }),
      transformResponse: (response: { data?: LocationI[] } | LocationI[]) =>
        Array.isArray(response) ? response : (response?.data ?? [])
    }),
    getDrivers: builder.query<DriverI[], void>({
      query: () => ({ url: API_ENDPOINTS.vehicleDispatch.drivers, method: 'GET' }),
      transformResponse: (response: { data?: DriverI[] } | DriverI[]) =>
        Array.isArray(response) ? response : (response?.data ?? [])
    }),
    getContainerSizes: builder.query<ContainerSizeI[], void>({
      query: () => ({ url: API_ENDPOINTS.vehicleDispatch.containerSizes, method: 'GET' }),
      transformResponse: (response: { data?: ContainerSizeI[] } | ContainerSizeI[]) =>
        Array.isArray(response) ? response : (response?.data ?? [])
    })
  })
})

export const {
  useGetVehicleTypesQuery,
  useGetLogisticListQuery,
  useGetLocationsQuery,
  useGetDriversQuery,
  useGetContainerSizesQuery
} = vehicleDispatchMasterApi
