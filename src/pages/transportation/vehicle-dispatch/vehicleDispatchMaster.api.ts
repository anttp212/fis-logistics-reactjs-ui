import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS } from '@constants/Api'

// ============================================
// TYPES - Master data API response
// ============================================

export interface VehicleTypeI {
  id: string
  code: string
  name: string
  sortOrder?: number
}

export interface RequestingUnitI {
  id: string
  code: string
  name: string
  sortOrder?: number
  contactPhone?: string | null
  taxCode?: string | null
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
  sortOrder?: number,
  fullName?: string,
  employeeCode?: string,
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
    getRequestingUnits: builder.query<RequestingUnitI[], void>({
      query: () => ({ url: API_ENDPOINTS.vehicleDispatch.requestingUnits, method: 'GET' }),
      transformResponse: (response: { data?: RequestingUnitI[] } | RequestingUnitI[]) =>
        Array.isArray(response) ? response : (response?.data ?? [])
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
  useGetRequestingUnitsQuery,
  useGetLocationsQuery,
  useGetDriversQuery,
  useGetContainerSizesQuery
} = vehicleDispatchMasterApi
