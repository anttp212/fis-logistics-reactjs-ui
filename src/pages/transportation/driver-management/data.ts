import { MOCK_LOGISTIC_DATA, getLogisticDisplayName } from '../logistic-information/data'
import { MOCK_FLEET_DATA } from '../vehicle-fleet/data'

export type DriverStatusT = 'ACTIVE' | 'INACTIVE'
export type DriverGenderT = 'MALE' | 'FEMALE'

export interface DriverItemI {
  id: string
  logisticsId: string
  identityNumber: string
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
  identityNumber: string
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
      label: getLogisticDisplayName(item),
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

export const MOCK_DRIVER_DATA: DriverItemI[] = [
  {
    id: 'driver-001',
    logisticsId: 'log-001',
    identityNumber: '079123456789',
    fullName: 'Nguyen Van B',
    phone: '0909000111',
    email: 'driver01@pls.vn',
    password: '123456',
    gender: 'MALE',
    status: 'ACTIVE',
    note: 'Tai xe chuyen container.',
    createdAt: '2026-03-02T08:00:00.000Z',
    assignedVehicleId: 'fleet-001'
  },
  {
    id: 'driver-002',
    logisticsId: 'log-002',
    identityNumber: '079123456788',
    fullName: 'Tran Thi C',
    phone: '0911000222',
    email: 'driver02@btn.vn',
    password: '123456',
    gender: 'FEMALE',
    status: 'INACTIVE',
    note: 'Tam nghi phep.',
    createdAt: '2026-03-04T10:00:00.000Z',
    assignedVehicleId: 'fleet-002'
  },
  {
    id: 'driver-003',
    logisticsId: 'log-003',
    identityNumber: '079123456787',
    fullName: 'Le Van D',
    phone: '0988777666',
    email: 'driver03@gmail.com',
    password: '123456',
    gender: 'MALE',
    status: 'ACTIVE',
    note: '',
    createdAt: '2026-03-05T09:00:00.000Z'
  }
]

export const getLogisticsLabel = (logisticsId: string) =>
  getLogisticDisplayName(MOCK_LOGISTIC_DATA.find((item) => item.id === logisticsId) ?? MOCK_LOGISTIC_DATA[0])

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
  identityNumber: item?.identityNumber ?? '',
  fullName: item?.fullName ?? '',
  phone: item?.phone ?? '',
  email: item?.email ?? '',
  password: item?.password ?? '',
  gender: item?.gender ?? '',
  status: item?.status ?? '',
  note: item?.note ?? ''
})
