export type FleetVehicleTypeT = 'TRACTOR' | 'TRAILER' | 'TRUCK'
export type FleetStatusT = 'ACTIVE' | 'SUSPENDED' | 'EXPIRED'

export interface FleetItemI {
  id: string
  logisticsCustomerId: string
  vehicleType: FleetVehicleTypeT
  licensePlate: string
  secondaryLicensePlate?: string
  payloadCapacity?: string
  weight?: string
  status: FleetStatusT
  inspectionExpiryDate?: string
  note?: string
  attachments?: {
    contentType: string
    name: string
    path: string
    size: number
  }[]
  companyName?: string
  fullName?: string
}

export interface FleetFormValuesI {
  logisticsCustomerId: string
  vehicleType: FleetVehicleTypeT
  licensePlate: string
  secondaryLicensePlate?: string
  payloadCapacity: string
  weight: string
  status: FleetStatusT
  note: string
  inspectionExpiryDate?: string
  attachments?: string[]
}

export const VEHICLE_TYPE_OPTIONS = [
  {
    items: [
      { label: 'Xe đầu kéo', value: 'TRACTOR' },
      { label: 'Xe rơ mooc', value: 'TRAILER' },
      { label: 'Xe tải', value: 'TRUCK' }
    ]
  }
]

export const STATUS_OPTIONS = [
  {
    items: [
      { label: 'Hoạt động', value: 'ACTIVE' },
      { label: 'Tạm dừng', value: 'SUSPENDED' },
      { label: 'Hết hạn', value: 'EXPIRED' }
    ]
  }
]

export const VEHICLE_TYPE_LABELS: Record<FleetVehicleTypeT, string> = {
  TRACTOR: 'Xe đầu kéo',
  TRAILER: 'Xe rơ mooc',
  TRUCK: 'Xe tải'
}

export const STATUS_LABELS: Record<FleetStatusT, string> = {
  ACTIVE: 'Hoạt động',
  SUSPENDED: 'Tạm dừng',
  EXPIRED: 'Hết hạn'
}

export const STATUS_BADGE: Record<FleetStatusT, { label: string; status: 'positive' | 'caution' | 'negative' }> = {
  ACTIVE: { label: 'Hoạt động', status: 'positive' },
  SUSPENDED: { label: 'Tạm dừng', status: 'caution' },
  EXPIRED: { label: 'Hết hạn', status: 'negative' }
}

// const defaultUploadList: UploadFile[] = [
//   {
//     uid: '-1',
//     name: 'dang-kiem-xe.png',
//     status: 'done',
//     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
//     thumbUrl: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
//   }
// ]

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
  logisticsCustomerId: item?.logisticsCustomerId ?? '',
  vehicleType: item?.vehicleType ?? 'TRACTOR',
  licensePlate: item?.licensePlate ?? '',
  secondaryLicensePlate: item?.secondaryLicensePlate ?? '',
  payloadCapacity: item?.payloadCapacity ?? '',
  weight: item?.weight ?? '',
  status: item?.status ?? 'ACTIVE',
  note: item?.note ?? '',
  inspectionExpiryDate: item?.inspectionExpiryDate ?? '',
  attachments: []
})
