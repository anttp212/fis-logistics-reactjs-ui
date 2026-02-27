import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQuery } from '@utils/baseQuery'
import { API_ENDPOINTS, API_TAGS } from '@constants/Api'
import type { ApiResponseI } from '@app-types/api-response'

// ============================================
// TYPES
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

// Dummy data - API chưa có, dùng mock
const DUMMY_ORDERS: VehicleDispatchOrderI[] = [
  {
    key: '1',
    lotId: 'LOT-001',
    billBooking: 'BL-2024-001',
    owner: 'Công ty TNHH ABC',
    quantity: 5,
    time: '2024-02-27 08:00',
    opr: 'OPR-001',
    createdBy: 'Nguyễn Văn A',
    shipmentDetails: [
      {
        key: 's1',
        status: 'Chờ xử lý',
        containerNo: 'CONT-001',
        size: '20ft',
        weight: '15,000 kg',
        yardCoordinates: 'A1-02',
        dispatchNote: 'Ghi chú 1'
      },
      {
        key: 's2',
        status: 'Đã chỉ định',
        containerNo: 'CONT-002',
        size: '40ft',
        weight: '22,000 kg',
        assignedDriver: 'Trần Văn B',
        assignedDriverPhones: ['0901234567'],
        yardCoordinates: 'B2-03',
        dispatchNote: 'Ghi chú 2'
      }
    ]
  },
  {
    key: '2',
    lotId: 'LOT-002',
    billBooking: 'BL-2024-002',
    owner: 'Công ty CP XYZ',
    quantity: 3,
    time: '2024-02-27 09:30',
    opr: 'OPR-002',
    createdBy: 'Lê Thị C',
    shipmentDetails: [
      {
        key: 's3',
        status: 'Chờ xử lý',
        containerNo: 'CONT-003',
        size: '20ft',
        weight: '18,000 kg',
        yardCoordinates: 'C3-01',
        dispatchNote: ''
      }
    ]
  },
  {
    key: '3',
    lotId: 'LOT-003',
    billBooking: 'BL-2024-003',
    owner: 'Công ty TNHH Vận tải Đông Nam',
    quantity: 8,
    time: '2024-02-27 10:15',
    opr: 'OPR-003',
    createdBy: 'Phạm Minh H',
    shipmentDetails: [
      {
        key: 's4',
        status: 'Đã chỉ định',
        containerNo: 'TEMU1234567',
        size: '40ft',
        weight: '22,500 kg',
        assignedDriver: 'Trần Văn B',
        assignedDriverPhones: ['0901234567'],
        yardCoordinates: 'D4-01',
        dispatchNote: 'Giao hàng ưu tiên'
      },
      {
        key: 's5',
        status: 'Chờ xử lý',
        containerNo: 'TEMU1234568',
        size: '20ft',
        weight: '16,200 kg',
        yardCoordinates: 'D4-02',
        dispatchNote: ''
      }
    ]
  },
  {
    key: '4',
    lotId: 'LOT-004',
    billBooking: 'BKG-2024-004',
    owner: 'Công ty TNHH Thép Việt',
    quantity: 4,
    time: '2024-02-27 11:00',
    opr: 'OPR-001',
    createdBy: 'Nguyễn Văn A',
    shipmentDetails: [
      {
        key: 's6',
        status: 'Đã chỉ định',
        containerNo: 'MSCU9876543',
        size: '40ft',
        weight: '24,000 kg',
        assignedDriver: 'Phạm Văn D',
        assignedDriverPhones: ['0912345678'],
        yardCoordinates: 'E5-03',
        dispatchNote: 'Hàng nặng'
      }
    ]
  },
  {
    key: '5',
    lotId: 'LOT-005',
    billBooking: 'BL-2024-005',
    owner: 'Công ty CP Dệt may Sài Gòn',
    quantity: 6,
    time: '2024-02-27 13:30',
    opr: 'OPR-002',
    createdBy: 'Lê Thị C',
    shipmentDetails: [
      {
        key: 's7',
        status: 'Chờ xử lý',
        containerNo: 'HLBU4567890',
        size: '20ft',
        weight: '14,800 kg',
        yardCoordinates: 'F6-01',
        dispatchNote: 'Giao trước 16h'
      },
      {
        key: 's8',
        status: 'Chờ xử lý',
        containerNo: 'HLBU4567891',
        size: '20ft',
        weight: '15,200 kg',
        yardCoordinates: 'F6-02',
        dispatchNote: ''
      }
    ]
  },
  {
    key: '6',
    lotId: 'LOT-006',
    billBooking: 'BKG-2024-006',
    owner: 'Công ty TNHH Gạo An Giang',
    quantity: 12,
    time: '2024-02-27 14:00',
    opr: 'OPR-003',
    createdBy: 'Phạm Minh H',
    shipmentDetails: [
      {
        key: 's9',
        status: 'Đã chỉ định',
        containerNo: 'OOLU1112223',
        size: '40ft',
        weight: '21,000 kg',
        assignedDriver: 'Hoàng Văn E',
        assignedDriverPhones: ['0923456789'],
        yardCoordinates: 'G7-01',
        dispatchNote: 'Gạo xuất khẩu'
      },
      {
        key: 's10',
        status: 'Đã chỉ định',
        containerNo: 'OOLU1112224',
        size: '40ft',
        weight: '20,500 kg',
        assignedDriver: 'Nguyễn Văn F',
        assignedDriverPhones: ['0934567890'],
        yardCoordinates: 'G7-02',
        dispatchNote: ''
      }
    ]
  },
  {
    key: '7',
    lotId: 'LOT-007',
    billBooking: 'BL-2024-007',
    owner: 'Công ty TNHH Điện tử FPT',
    quantity: 2,
    time: '2024-02-27 15:45',
    opr: 'OPR-001',
    createdBy: 'Nguyễn Văn A',
    shipmentDetails: [
      {
        key: 's11',
        status: 'Chờ xử lý',
        containerNo: 'CMAU7778889',
        size: '40ft',
        weight: '22,000 kg',
        yardCoordinates: 'H8-01',
        dispatchNote: 'Hàng điện tử - xử lý cẩn thận'
      }
    ]
  },
  {
    key: '8',
    lotId: 'LOT-008',
    billBooking: 'BKG-2024-008',
    owner: 'Công ty CP Xăng dầu PV Oil',
    quantity: 10,
    time: '2024-02-27 16:00',
    opr: 'OPR-002',
    createdBy: 'Lê Thị C',
    shipmentDetails: [
      {
        key: 's12',
        status: 'Chờ xử lý',
        containerNo: 'SUDU3334445',
        size: '20ft',
        weight: '15,000 kg',
        yardCoordinates: 'I9-01',
        dispatchNote: ''
      },
      {
        key: 's13',
        status: 'Chờ xử lý',
        containerNo: 'SUDU3334446',
        size: '20ft',
        weight: '15,500 kg',
        yardCoordinates: 'I9-02',
        dispatchNote: 'Hàng nguy hiểm'
      }
    ]
  }
]

const DUMMY_DRIVERS: DriverI[] = [
  { id: 'd1', name: 'Trần Văn B', phone: '0901234567' },
  { id: 'd2', name: 'Phạm Văn D', phone: '0912345678' },
  { id: 'd3', name: 'Hoàng Văn E', phone: '0923456789' },
  { id: 'd4', name: 'Nguyễn Văn F', phone: '0934567890' },
  { id: 'd5', name: 'Lê Văn G', phone: '0945678901' },
  { id: 'd6', name: 'Võ Thị H', phone: '0956789012' },
  { id: 'd7', name: 'Đặng Văn K', phone: '0967890123' },
  { id: 'd8', name: 'Bùi Văn L', phone: '0978901234' }
]

// ============================================
// API
// ============================================

export const vehicleDispatchApi = createApi({
  reducerPath: 'vehicleDispatchApi',
  baseQuery: baseQuery,
  tagTypes: [API_TAGS.vehicleDispatch],
  endpoints: (builder) => ({
    getVehicleDispatchList: builder.query<
      { data: VehicleDispatchOrderI[]; total: number },
      void
    >({
      queryFn: async () => ({
        data: { data: DUMMY_ORDERS, total: DUMMY_ORDERS.length }
      }),
      providesTags: [API_TAGS.vehicleDispatch]
    }),

    getVehicleDispatchDetail: builder.query<VehicleDispatchOrderI, string>({
      queryFn: async (id: string) => {
        const order = DUMMY_ORDERS.find((o) => o.key === id)
        return { data: order || DUMMY_ORDERS[0] }
      },
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
    })
  })
})

export const {
  useGetVehicleDispatchListQuery,
  useGetVehicleDispatchDetailQuery,
  useGetDriversQuery,
  useAssignDriverMutation,
  useUpdateShipmentDetailMutation,
  useDeleteVehicleDispatchMutation
} = vehicleDispatchApi
