import { MOCK_LOGISTIC_DATA } from '../logistic-information/data'
import { MOCK_FLEET_DATA } from '../vehicle-fleet/data'

export type DriverStatusT = 'ACTIVE' | 'INACTIVE'
export type DriverGenderT = 'MALE' | 'FEMALE'

export interface DriverItemI {
  id: string
  logisticsId: string
  idCardNumber: string
  fullName: string
  phone: string
  email?: string
  password: string
  gender?: DriverGenderT
  status: DriverStatusT
  note?: string
  createdAt: string
  assignedVehicleId?: string
}

export interface DriverFormValuesI {
  logisticsId: string
  idCardNumber: string
  fullName: string
  phone: string
  email: string
  password: string
  gender: DriverGenderT | ''
  status: DriverStatusT | ''
  note: string
}

export const LOGISTICS_OPTIONS = [
  {
    items: MOCK_LOGISTIC_DATA.map((item) => ({
      label: 'getLogisticDisplayName(item)',
      value: item.id
    }))
  }
]

export const GENDER_OPTIONS = [
  {
    items: [
      { label: 'Nam', value: 'MALE' },
      { label: 'Nữ', value: 'FEMALE' }
    ]
  }
]

export const STATUS_CHECKBOX_OPTIONS = [
  { label: 'Hoạt động', value: 'ACTIVE' },
  { label: 'Ngưng hoạt động', value: 'INACTIVE' }
] as const

export const STATUS_SELECT_OPTIONS = [
  {
    items: [
      { label: 'Tất cả', value: '' },
      { label: 'Hoạt động', value: 'ACTIVE' },
      { label: 'Ngưng hoạt động', value: 'INACTIVE' }
    ]
  }
]

export const STATUS_LABELS: Record<DriverStatusT, string> = {
  ACTIVE: 'Hoạt động',
  INACTIVE: 'Ngưng hoạt động'
}

export const STATUS_BADGE: Record<DriverStatusT, { label: string; status: 'positive' | 'negative' }> = {
  ACTIVE: { label: 'Hoạt động', status: 'positive' },
  INACTIVE: { label: 'Ngưng hoạt động', status: 'negative' }
}

export const GENDER_LABELS: Record<DriverGenderT, string> = {
  MALE: 'Nam',
  FEMALE: 'Nữ'
}

export const VEHICLE_ASSIGN_OPTIONS = [
  {
    items: MOCK_FLEET_DATA.map((item) => ({
      label: item.secondaryPlateNumber ? `${item.plateNumber} / ${item.secondaryPlateNumber}` : item.plateNumber,
      value: item.id
    }))
  }
]

export const MOCK_DRIVER_DATA: DriverItemI[] = []

export const getVehicleLabel = (vehicleId?: string) => {
  const item = MOCK_FLEET_DATA.find((fleet) => fleet.id === vehicleId)
  if (!item) return '-'
  return item.secondaryPlateNumber ? `${item.plateNumber} / ${item.secondaryPlateNumber}` : item.plateNumber
}

export const formatDate = (value?: string) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

export const toDriverFormValues = (item?: DriverItemI): DriverFormValuesI => ({
  logisticsId: item?.logisticsId ?? '',
  idCardNumber: item?.idCardNumber ?? '',
  fullName: item?.fullName ?? '',
  phone: item?.phone ?? '',
  email: item?.email ?? '',
  password: item?.password ?? '',
  gender: item?.gender ?? '',
  status: item?.status ?? '',
  note: item?.note ?? ''
})
