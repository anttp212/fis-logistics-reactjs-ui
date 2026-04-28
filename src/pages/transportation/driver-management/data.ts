export type DriverStatusT = 'ACTIVE' | 'INACTIVE'
export type DriverGenderT = 'MALE' | 'FEMALE'
export type DriverVehicleTypeT = 'TRACTOR' | 'TRAILER' | 'TRUCK'

export interface DriverAttachmentI {
  name?: string | null
  contentType?: string
  size?: number
  path: string
}

export interface DriverItemI {
  id: string
  logisticsCustomerId: string
  logisticsId?: string
  companyName: string
  customerFullName: string
  primaryVehicleId: string
  primaryVehicleLicensePlate: string
  primaryVehicleType: DriverVehicleTypeT
  trailerVehicleId: string
  trailerVehicleLicensePlate: string
  trailerVehicleType: DriverVehicleTypeT
  userId: string
  userFullName: string
  userEmail: string
  userPhone: string
  userStatus: boolean
  username: string
  idCardNumber: string
  fullName?: string
  phone?: string
  email?: string
  gender?: DriverGenderT
  status?: DriverStatusT
  note: string
  createdAt: string
  updatedAt?: string
  drivingLicenseAttachments?: Array<string | DriverAttachmentI>
}

export interface DriverFormValuesI {
  logisticsCustomerId: string
  userId: string
  primaryVehicleId: string
  trailerVehicleId: string
  idCardNumber: string
  fullName: string
  phone: string
  email: string
  gender: DriverGenderT | ''
  note: string
}

export const LOGISTICS_OPTIONS = []

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

export const VEHICLE_ASSIGN_OPTIONS = []

export const MOCK_DRIVER_DATA: DriverItemI[] = []

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
  logisticsCustomerId: item?.logisticsCustomerId ?? item?.logisticsId ?? '',
  userId: item?.userId ?? '',
  primaryVehicleId: item?.primaryVehicleId ?? '',
  trailerVehicleId: item?.trailerVehicleId ?? '',
  idCardNumber: item?.idCardNumber ?? '',
  fullName: item?.userFullName ?? item?.fullName ?? '',
  phone: item?.userPhone ?? item?.phone ?? '',
  email: item?.userEmail ?? item?.email ?? '',
  gender: item?.gender ?? '',
  note: item?.note ?? ''
})
