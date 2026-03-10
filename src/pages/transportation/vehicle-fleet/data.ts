import type { UploadFile } from 'antd'
import { MOCK_LOGISTIC_DATA, getLogisticDisplayName } from '../logistic-information/data'

export type FleetVehicleTypeT = 'TRACTOR' | 'TRAILER'
export type FleetStatusT = 'ACTIVE' | 'PAUSED' | 'EXPIRED'

export interface FleetItemI {
  id: string
  logisticsId: string
  vehicleType: FleetVehicleTypeT
  plateNumber: string
  secondaryPlateNumber?: string
  payload?: string
  weight?: string
  status: FleetStatusT
  inspectionExpiry?: string
  note?: string
  attachments?: UploadFile[]
}

export interface FleetFormValuesI {
  logisticsId: string
  vehicleType: FleetVehicleTypeT | ''
  plateNumber: string
  secondaryPlateNumber: string
  payload: string
  weight: string
  status: FleetStatusT | ''
  note: string
}

export const VEHICLE_TYPE_OPTIONS = [
  {
    items: [
      { label: 'Xe đầu kéo', value: 'TRACTOR' },
      { label: 'Xe rơ mooc', value: 'TRAILER' }
    ]
  }
]

export const STATUS_OPTIONS = [
  {
    items: [
      { label: 'Hoạt động', value: 'ACTIVE' },
      { label: 'Tạm dừng', value: 'PAUSED' },
      { label: 'Hết hạn', value: 'EXPIRED' }
    ]
  }
]

export const VEHICLE_TYPE_LABELS: Record<FleetVehicleTypeT, string> = {
  TRACTOR: 'Xe đầu kéo',
  TRAILER: 'Xe rơ mooc'
}

export const STATUS_LABELS: Record<FleetStatusT, string> = {
  ACTIVE: 'Hoạt động',
  PAUSED: 'Tạm dừng',
  EXPIRED: 'Hết hạn'
}

export const STATUS_BADGE: Record<FleetStatusT, { label: string; status: 'positive' | 'caution' | 'negative' }> = {
  ACTIVE: { label: 'Hoạt động', status: 'positive' },
  PAUSED: { label: 'Tạm dừng', status: 'caution' },
  EXPIRED: { label: 'Hết hạn', status: 'negative' }
}

export const LOGISTICS_OPTIONS = [
  {
    items: MOCK_LOGISTIC_DATA.map((item) => ({
      label: getLogisticDisplayName(item),
      value: item.id
    }))
  }
]

const defaultUploadList: UploadFile[] = [
  {
    uid: '-1',
    name: 'dang-kiem-xe.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
  }
]

export const MOCK_FLEET_DATA: FleetItemI[] = [
  {
    id: 'fleet-001',
    logisticsId: 'log-001',
    vehicleType: 'TRACTOR',
    plateNumber: '51H-12345',
    payload: '24',
    weight: '8000',
    status: 'ACTIVE',
    inspectionExpiry: '2026-12-31',
    note: 'Xe hoạt động tuyến Nam.',
    attachments: defaultUploadList
  },
  {
    id: 'fleet-002',
    logisticsId: 'log-002',
    vehicleType: 'TRAILER',
    plateNumber: '43R-67890',
    secondaryPlateNumber: '43RM-67890',
    payload: '30',
    weight: '12000',
    status: 'PAUSED',
    inspectionExpiry: '2026-09-15',
    note: 'Tạm ngưng để bảo dưỡng.',
    attachments: []
  },
  {
    id: 'fleet-003',
    logisticsId: 'log-003',
    vehicleType: 'TRACTOR',
    plateNumber: '29H-24680',
    payload: '20',
    weight: '7600',
    status: 'EXPIRED',
    inspectionExpiry: '2025-12-01',
    note: 'Cần gia hạn đăng kiểm.',
    attachments: []
  }
]

export const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const toFleetFormValues = (item?: FleetItemI): FleetFormValuesI => ({
  logisticsId: item?.logisticsId ?? '',
  vehicleType: item?.vehicleType ?? '',
  plateNumber: item?.plateNumber ?? '',
  secondaryPlateNumber: item?.secondaryPlateNumber ?? '',
  payload: item?.payload ?? '',
  weight: item?.weight ?? '',
  status: item?.status ?? '',
  note: item?.note ?? ''
})
