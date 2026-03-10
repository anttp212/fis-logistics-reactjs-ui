import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS, API_TAGS } from '@constants/Api'
import type { FleetItemI } from './data'

export interface CreateVehicleFleetRequestI {
  logisticsId: string
  vehicleType: string
  plateNumber: string
  secondaryPlateNumber?: string
  payload?: string
  weight?: string
  status: string
  note?: string
}

export type UpdateVehicleFleetRequestT = CreateVehicleFleetRequestI

export interface GetVehicleFleetListParamsI {
  page?: number
  size?: number
  search?: string
  status?: string
  logisticsId?: string
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
        if (p.search?.trim()) searchParams.set('search', p.search.trim())
        if (p.status?.trim()) searchParams.set('status', p.status.trim())
        if (p.logisticsId?.trim()) searchParams.set('logisticsId', p.logisticsId.trim())
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
  useGetVehicleFleetDetailQuery,
  useCreateVehicleFleetMutation,
  useUpdateVehicleFleetMutation
} = vehicleFleetApi
