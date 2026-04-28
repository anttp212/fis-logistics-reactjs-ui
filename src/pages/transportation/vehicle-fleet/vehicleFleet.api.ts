import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS, API_TAGS } from '@constants/Api'
import type { FleetItemI, FleetVehicleTypeT } from './data'

export interface CreateVehicleFleetRequestI {
  logisticsCustomerId: string
  vehicleType: FleetVehicleTypeT
  licensePlate: string
  secondaryLicensePlate?: string
  payloadCapacity?: string
  weight?: string
  status: string
  note?: string
  inspectionExpiryDate?: string
  attachments: string[]
}

export type UpdateVehicleFleetRequestT = CreateVehicleFleetRequestI

export interface GetVehicleFleetListParamsI {
  page?: number
  size?: number
  search?: string
  status?: string
  logisticsId?: string
  inspectionDateFrom?: string
  inspectionDateTo?: string
  createdDateFrom?: string
  createdDateTo?: string
  vehicleType?: string
}

export interface GetAvailableVehiclesParamsI {
  logisticsCustomerId?: string
  vehicleType?: string
  excludeDriverId?: string
}

export interface VehicleFleetPaginationI {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  hasNext: boolean
  hasPrevious: boolean
}

export interface VehicleFleetListResponseI {
  code: string
  message: string
  data?: FleetItemI[]
  pagination?: VehicleFleetPaginationI
}

export const vehicleFleetApi = createApi({
  reducerPath: 'vehicleFleetApi',
  baseQuery,
  tagTypes: [API_TAGS.vehicleFleet],
  endpoints: (builder) => ({
    getVehicleFleetList: builder.query<
      { data: FleetItemI[]; pagination: VehicleFleetPaginationI },
      GetVehicleFleetListParamsI | void
    >({
      query: (params) => {
        const p = params || {}
        const searchParams = new URLSearchParams()
        if (p.page != null) searchParams.set('page', String(p.page))
        if (p.size != null) searchParams.set('size', String(p.size))
        if (p.search?.trim()) searchParams.set('keyword', p.search.trim())
        if (p.status?.trim()) searchParams.set('status', p.status.trim())
        if (p.logisticsId?.trim()) searchParams.set('logisticsId', p.logisticsId.trim())
        if (p.inspectionDateFrom?.trim()) searchParams.set('inspectionDateFrom', p.inspectionDateFrom.trim())
        if (p.inspectionDateTo?.trim()) searchParams.set('inspectionDateTo', p.inspectionDateTo.trim())
        if (p.createdDateFrom?.trim()) searchParams.set('createdDateFrom', p.createdDateFrom.trim())
        if (p.createdDateTo?.trim()) searchParams.set('createdDateTo', p.createdDateTo.trim())
        if (p.vehicleType?.trim()) searchParams.set('vehicleType', p.vehicleType.trim())
        const qs = searchParams.toString()
        return { url: `${API_ENDPOINTS.vehicleFleet.list}${qs ? `?${qs}` : ''}`, method: 'GET' }
      },
      transformResponse: (response: VehicleFleetListResponseI) => ({
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
      providesTags: [API_TAGS.vehicleFleet]
    }),
    getAvailableVehicles: builder.query<FleetItemI[], GetAvailableVehiclesParamsI | void>({
      query: (params) => {
        const p = params || {}
        const searchParams = new URLSearchParams()
        if (p.logisticsCustomerId?.trim()) searchParams.set('logisticsCustomerId', p.logisticsCustomerId.trim())
        if (p.vehicleType?.trim()) searchParams.set('vehicleType', p.vehicleType.trim())
        if (p.excludeDriverId?.trim()) searchParams.set('excludeDriverId', p.excludeDriverId.trim())
        const qs = searchParams.toString()
        return {
          url: `${API_ENDPOINTS.vehicleFleet.available}${qs ? `?${qs}` : ''}`,
          method: 'GET'
        }
      },
      transformResponse: (response: { data?: FleetItemI[] } | FleetItemI[]): FleetItemI[] => {
        if (response && typeof response === 'object' && 'data' in response) return response.data ?? []
        return Array.isArray(response) ? response : []
      },
      providesTags: [API_TAGS.vehicleFleet]
    }),
    getVehicleFleetDetail: builder.query<FleetItemI, string>({
      query: (id) => ({ url: API_ENDPOINTS.vehicleFleet.detail.replace(':id', id), method: 'GET' }),
      transformResponse: (response: { data?: FleetItemI } | FleetItemI) =>
        (response && typeof response === 'object' && 'data' in response ? response.data : response) as FleetItemI,
      providesTags: (_result, _err, id) => [{ type: API_TAGS.vehicleFleet, id }]
    }),
    createVehicleFleet: builder.mutation<FleetItemI, CreateVehicleFleetRequestI>({
      query: (body) => ({ url: API_ENDPOINTS.vehicleFleet.create, method: 'POST', body }),
      transformResponse: (response: { data?: FleetItemI } | FleetItemI) =>
        (response && typeof response === 'object' && 'data' in response ? response.data : response) as FleetItemI,
      invalidatesTags: [API_TAGS.vehicleFleet]
    }),
    updateVehicleFleet: builder.mutation<FleetItemI, { id: string; body: UpdateVehicleFleetRequestT }>({
      query: ({ id, body }) => ({
        url: API_ENDPOINTS.vehicleFleet.update.replace(':id', id),
        method: 'PUT',
        body
      }),
      transformResponse: (response: { data?: FleetItemI } | FleetItemI) =>
        (response && typeof response === 'object' && 'data' in response ? response.data : response) as FleetItemI,
      invalidatesTags: (_result, _err, { id }) => [API_TAGS.vehicleFleet, { type: API_TAGS.vehicleFleet, id }]
    })
  })
})

export const {
  useGetVehicleFleetListQuery,
  useGetAvailableVehiclesQuery,
  useGetVehicleFleetDetailQuery,
  useCreateVehicleFleetMutation,
  useUpdateVehicleFleetMutation
} = vehicleFleetApi
