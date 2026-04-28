import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS, API_TAGS } from '@constants/Api'
import type { ApiResponseI } from '@app-types/api-response'

// ============================================
// TYPES - API Response
// ============================================

/** Container item - hỗ trợ cả format cũ và mới từ API */
export interface DispatchOrderContainerI {
  id?: string
  containerNumber?: string
  containerNo?: string
  size?: string
  containerSizeId?: string
  containerSizeName?: string
  weight?: string
  containerWeight?: number
  driver?: string
  driverId?: string
  driverName?: string
  driverPhone?: string
  driverPlateNo?: string
  departureLocationName?: string
  destinationLocationName?: string
}

/** Cargo item - dùng cho yêu cầu điều xe loại Xe vận tải */
export interface DispatchOrderCargoI {
  id?: string
  cargoType?: string
  dimension?: string
  weight?: number
  driverId?: string
  driverName?: string
  driverPhone?: string
  driverPlateNo?: string
}

/** Item từ API GET /api/v1/dispatch-orders - hỗ trợ cả format cũ và mới */
export interface DispatchOrderApiI {
  id: string
  dispatchCode?: string
  status?: string
  statusText?: string
  vehicleType?: string
  vehicleTypeId?: string
  vehicleTypeName?: string
  requestUnit?: string
  logisticsCustomerId?: string
  logisticsCustomerName?: string
  origin?: string
  departureLocationId?: string
  destination?: string
  destinationLocationId?: string
  expectedPickupTime?: string
  estimatedPickupTime?: string
  expectedDeliveryTime?: string
  estimatedDeliveryTime?: string
  containerCount?: number
  containers?: DispatchOrderContainerI[]
  sizeSummary?: string
  weightSummary?: string
  note?: string
  notes?: string
  createdAt?: string
  /** @deprecated */
  depotName?: string
  depotCode?: string
  depotAddress?: string
  dispatchDate?: string
  dispatcherNotes?: string
  content?: string
  departureLocationName?: string
  destinationLocationName?: string
  driverName?: string
  vehiclePlateNo?: string
}

export interface DispatchOrderPaginationI {
  page: number
  size: number
  totalElements: number
  totalPages: number
  first: boolean
  last: boolean
  hasNext: boolean
  hasPrevious: boolean
}

export interface DispatchOrderListResponseI {
  code: string
  message: string
  data: DispatchOrderApiI[]
  pagination: DispatchOrderPaginationI
}

// ============================================
// TYPES - Chi tiết lô hàng (dùng cho modal)
// ============================================

export interface ShipmentDetailI {
  key: string
  status: string
  containerNo: string
  size: string
  weight: string
  assignedDriver?: string
  assignedDriverPhones?: string[]
  yardCoordinates?: string
  dispatchNote?: string
}

/** Dùng cho trang chi tiết - hỗ trợ cả format cũ và mới từ API */
export interface VehicleDispatchDetailI {
  id: string
  dispatchCode?: string
  status?: string
  isDanalogDeparture?: boolean
  vehicleType?: string
  vehicleTypeId?: string
  vehicleTypeName?: string
  vehicleTypeText?: string
  requestUnit?: string
  logisticsCustomerId?: string
  logisticsCustomerName?: string
  origin?: string
  departureLocationId?: string
  destination?: string
  destinationLocationId?: string
  departureProvinceId?: string
  departureProvinceName?: string
  departureWardId?: string
  departureWardName?: string
  departureAddress?: string
  destinationProvinceId?: string
  destinationProvinceName?: string
  destinationWardId?: string
  destinationWardName?: string
  destinationAddress?: string
  expectedPickupTime?: string
  estimatedPickupTime?: string
  expectedDeliveryTime?: string
  estimatedDeliveryTime?: string
  content?: string
  containers: DispatchOrderContainerI[]
  cargos?: DispatchOrderCargoI[]
  note?: string
  notes?: string
  createdAt?: string
  recipientName?: string
  recipientPhone?: string
  departureLocationName?: string
  destinationLocationName?: string
}

/** @deprecated Dùng VehicleDispatchDetailI */
export interface VehicleDispatchOrderI {
  key: string
  lotId: string
  billBooking: string
  owner: string
  quantity: number
  time: string
  opr: string
  createdBy: string
  shipmentDetails?: ShipmentDetailI[]
}

export interface DriverI {
  id: string
  name: string
  phone: string
}

const DUMMY_DRIVERS: DriverI[] = []

// ============================================
// API
// ============================================

export interface GetDispatchOrderListParamsI {
  page?: number
  size?: number
  keyword?: string
  status?: string[]
  vehicleTypeId?: string
  dateFrom?: string
  dateTo?: string
  dispatchDateFrom?: string
  dispatchDateTo?: string
  depotCode?: string
  driverId?: string
}

/** Request body cho API tạo mới điều xe */
export interface CreateVehicleDispatchContainerI {
  containerNo: string
  containerSizeId?: string
  containerWeight?: number
  driverId?: string
}

export interface CreateVehicleDispatchCargoI {
  cargoType: string
  dimension: string
  weight: number
  driverId: string
}

export interface CreateVehicleDispatchRequestI {
  vehicleTypeId: string
  logisticsCustomerId: string
  isDanalogDeparture?: boolean
  departureLocationId?: string
  destinationLocationId?: string
  departureLocationName?: string
  destinationLocationName?: string
  departureProvinceId?: string
  departureWardId?: string
  departureAddress?: string
  destinationProvinceId?: string
  destinationWardId?: string
  destinationAddress?: string
  estimatedPickupTime: string
  estimatedDeliveryTime: string
  recipientName?: string
  recipientPhone?: string
  content?: string
  notes?: string
  containers?: CreateVehicleDispatchContainerI[]
  cargos?: CreateVehicleDispatchCargoI[]
}

export const vehicleDispatchApi = createApi({
  reducerPath: 'vehicleDispatchApi',
  baseQuery: baseQuery,
  tagTypes: [API_TAGS.vehicleDispatch],
  endpoints: (builder) => ({
    getVehicleDispatchList: builder.query<
      { data: DispatchOrderApiI[]; pagination: DispatchOrderPaginationI },
      GetDispatchOrderListParamsI | void
    >({
      query: (params) => {
        const p = params || {}
        const searchParams = new URLSearchParams()
        if (p.page != null) searchParams.set('page', String(p.page))
        if (p.size != null) searchParams.set('size', String(p.size))
        if (p.keyword) searchParams.set('keyword', p.keyword)
        ;(p.status ?? []).forEach((s: string) => searchParams.append('status', s))
        if (p.vehicleTypeId) searchParams.set('vehicleTypeId', p.vehicleTypeId)
        if (p.dateFrom) searchParams.set('dateFrom', p.dateFrom)
        if (p.dateTo) searchParams.set('dateTo', p.dateTo)
        if (p.dispatchDateFrom) searchParams.set('dispatchDateFrom', p.dispatchDateFrom)
        if (p.dispatchDateTo) searchParams.set('dispatchDateTo', p.dispatchDateTo)
        if (p.depotCode) searchParams.set('depotCode', p.depotCode)
        if (p.driverId) searchParams.set('driverId', p.driverId)
        const query = searchParams.toString()
        return {
          url: `${API_ENDPOINTS.vehicleDispatch.list}${query ? `?${query}` : ''}`,
          method: 'GET'
        }
      },
      transformResponse: (response: DispatchOrderListResponseI) => ({
        data: response.data ?? [],
        pagination: response.pagination ?? {
          page: 1,
          size: 20,
          totalElements: 0,
          totalPages: 0,
          first: true,
          last: true,
          hasNext: false,
          hasPrevious: false
        }
      }),
      providesTags: [API_TAGS.vehicleDispatch]
    }),

    getTransportReport: builder.query<
      { data: DispatchOrderApiI[]; pagination: DispatchOrderPaginationI },
      Record<string, unknown> | void
    >({
      query: (params) => {
        const p = params || {}
        const searchParams = new URLSearchParams()
        searchParams.set('type', 'TRANSPORT_REPORT')
        if (p.dateFrom) searchParams.set('dateFrom', String(p.dateFrom))
        if (p.dateTo) searchParams.set('dateTo', String(p.dateTo))
        if (p.status) searchParams.set('status', String(p.status))
        if (p.keyword) searchParams.set('keyword', String(p.keyword))
        if (p.page != null) searchParams.set('page', String(p.page))
        if (p.size != null) searchParams.set('size', String(p.size))
        const query = searchParams.toString()
        return {
          url: `${API_ENDPOINTS.vehicleDispatch.list}?${query}`,
          method: 'GET'
        }
      },
      transformResponse: (response: DispatchOrderListResponseI) => ({
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
      providesTags: [API_TAGS.vehicleDispatch]
    }),

    exportTransportReport: builder.mutation<Blob, Record<string, unknown> | void>({
      query: (params) => {
        const p = params || {}
        const searchParams = new URLSearchParams()
        searchParams.set('type', 'TRANSPORT_REPORT')
        if (p.dateFrom) searchParams.set('dateFrom', String(p.dateFrom))
        if (p.dateTo) searchParams.set('dateTo', String(p.dateTo))
        if (p.status) searchParams.set('status', String(p.status))
        if (p.keyword) searchParams.set('keyword', String(p.keyword))
        const query = searchParams.toString()
        return {
          url: `${API_ENDPOINTS.vehicleDispatch.exportExcel}?${query}`,
          method: 'GET',
          responseHandler: (response) => response.blob()
        }
      }
    }),

    getVehicleDispatchDetail: builder.query<VehicleDispatchDetailI, string>({
      query: (id) => ({
        url: API_ENDPOINTS.vehicleDispatch.detail.replace(':id', id),
        method: 'GET'
      }),
      transformResponse: (response: { data?: VehicleDispatchDetailI }) =>
        response?.data ?? ({} as VehicleDispatchDetailI),
      providesTags: (_result, _error, id) => [{ type: API_TAGS.vehicleDispatch, id }]
    }),

    getDrivers: builder.query<DriverI[], void>({
      queryFn: async () => ({ data: DUMMY_DRIVERS })
    }),

    assignDriver: builder.mutation<
      ApiResponseI<void>,
      { shipmentDetailKey: string; orderKey: string; driverId: string }
    >({
      queryFn: async ({ driverId }) => {
        const driver = DUMMY_DRIVERS.find((d: DriverI) => d.id === driverId)
        if (driver) {
          return {
            data: { status: 'success', message: '', data: null } as ApiResponseI<void>
          }
        }
        return { error: { status: 400, data: { message: 'Driver not found' } } }
      },
      invalidatesTags: [API_TAGS.vehicleDispatch]
    }),

    updateShipmentDetail: builder.mutation<
      ApiResponseI<void>,
      { orderKey: string; shipmentKey: string; data: Partial<ShipmentDetailI> }
    >({
      queryFn: async () => ({
        data: { status: 'success', message: '', data: null } as ApiResponseI<void>
      }),
      invalidatesTags: [API_TAGS.vehicleDispatch]
    }),

    deleteVehicleDispatch: builder.mutation<ApiResponseI<void>, string>({
      query: (id) => ({
        url: API_ENDPOINTS.vehicleDispatch.delete.replace(':id', id),
        method: 'DELETE'
      }),
      invalidatesTags: [API_TAGS.vehicleDispatch]
    }),

    cancelVehicleDispatch: builder.mutation<ApiResponseI<void>, { id: string; cancellationReason: string }>({
      query: ({ id, cancellationReason }) => ({
        url: API_ENDPOINTS.vehicleDispatch.cancel.replace(':id', id),
        method: 'PATCH',
        body: { cancellationReason }
      }),
      invalidatesTags: [API_TAGS.vehicleDispatch]
    }),

    createVehicleDispatch: builder.mutation<ApiResponseI<DispatchOrderApiI>, CreateVehicleDispatchRequestI>({
      query: (body) => ({
        url: API_ENDPOINTS.vehicleDispatch.create,
        method: 'POST',
        body
      }),
      invalidatesTags: [API_TAGS.vehicleDispatch]
    }),

    updateVehicleDispatch: builder.mutation<
      ApiResponseI<DispatchOrderApiI>,
      { id: string; body: CreateVehicleDispatchRequestI }
    >({
      query: ({ id, body }) => ({
        url: API_ENDPOINTS.vehicleDispatch.update.replace(':id', id),
        method: 'PUT',
        body
      }),
      invalidatesTags: [API_TAGS.vehicleDispatch]
    })
  })
})

export const {
  useGetVehicleDispatchListQuery,
  useGetTransportReportQuery,
  useExportTransportReportMutation,
  useGetVehicleDispatchDetailQuery,
  useGetDriversQuery,
  useAssignDriverMutation,
  useUpdateShipmentDetailMutation,
  useDeleteVehicleDispatchMutation,
  useCancelVehicleDispatchMutation,
  useCreateVehicleDispatchMutation,
  useUpdateVehicleDispatchMutation
} = vehicleDispatchApi
