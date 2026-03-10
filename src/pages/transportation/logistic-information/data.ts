export type LogisticCustomerTypeT = 'BUSINESS' | 'INDIVIDUAL'
export type LogisticPaymentTypeT = 'PREPAID' | 'POSTPAID'
export enum CustomerTypeE {
  BUSINESS = 'BUSINESS', // Khách hàng doanh nghiệp
  INDIVIDUAL = 'INDIVIDUAL' // Khách hàng cá nhân
}

export enum PaymentTypeE {
  PREPAID = 'PREPAID', // Trả trước
  POSTPAID = 'POSTPAID' // Trả sau
}
export interface LogisticInformationI {
  id: string
  customerType: LogisticCustomerTypeT
  taxCode?: string
  companyName?: string
  shortName?: string
  fullName?: string
  idCardNumber?: string
  address?: string
  paymentType: LogisticPaymentTypeT
  email?: string
  phone?: string
  note?: string
  createdAt: string
}

export interface LogisticFormValuesI {
  customerType: LogisticCustomerTypeT
  taxCode: string
  companyName: string
  shortName: string
  fullName: string
  idCardNumber: string
  address: string
  paymentType: LogisticPaymentTypeT | ''
  email: string
  phone: string
  note: string
}

export const CUSTOMER_TYPE_OPTIONS = [
  {
    items: [
      { label: 'Doanh nghiệp', value: CustomerTypeE.BUSINESS },
      { label: 'Cá nhân', value: CustomerTypeE.INDIVIDUAL }
    ]
  }
]

export const PAYMENT_OPTIONS = [
  { label: 'Trả trước', value: PaymentTypeE.PREPAID },
  { label: 'Trả sau', value: PaymentTypeE.POSTPAID }
] as const

export const CUSTOMER_TYPE_LABELS: Record<LogisticCustomerTypeT, string> = {
  BUSINESS: 'Doanh nghiệp',
  INDIVIDUAL: 'Cá nhân'
}

export const PAYMENT_LABELS: Record<LogisticPaymentTypeT, string> = {
  PREPAID: 'Trả trước',
  POSTPAID: 'Trả sau'
}

export const MOCK_LOGISTIC_DATA: LogisticInformationI[] = []

export const getLogisticDisplayName = (item: LogisticInformationI) =>
  item.customerType === CustomerTypeE.BUSINESS ? item.companyName || item.shortName || '-' : item.fullName || '-'

export const formatDisplayDate = (iso?: string) => {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  return `${day}/${month}/${year}`
}

export const toFormValues = (item?: LogisticInformationI): LogisticFormValuesI => ({
  customerType: item?.customerType ?? CustomerTypeE.BUSINESS,
  taxCode: item?.taxCode ?? '',
  companyName: item?.companyName ?? '',
  shortName: item?.shortName ?? '',
  fullName: item?.fullName ?? '',
  idCardNumber: item?.idCardNumber ?? '',
  address: item?.address ?? '',
  paymentType: item?.paymentType ?? PaymentTypeE.PREPAID,
  email: item?.email ?? '',
  phone: item?.phone ?? '',
  note: item?.note ?? ''
})
