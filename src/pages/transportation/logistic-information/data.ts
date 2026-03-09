export type LogisticCustomerTypeT = 'ENTERPRISE' | 'INDIVIDUAL'
export type LogisticPaymentTypeT = 'PREPAID' | 'POSTPAID'

export interface LogisticInformationI {
  id: string
  customerType: LogisticCustomerTypeT
  customerCode: string
  taxCode?: string
  organizationName?: string
  shortName?: string
  fullName?: string
  identityNumber?: string
  address?: string
  paymentType: LogisticPaymentTypeT
  email?: string
  phone?: string
  note?: string
  createdAt: string
}

export interface LogisticFormValuesI {
  customerType: LogisticCustomerTypeT
  customerCode: string
  taxCode: string
  organizationName: string
  shortName: string
  fullName: string
  identityNumber: string
  address: string
  paymentType: LogisticPaymentTypeT | ''
  email: string
  phone: string
  note: string
}

export const CUSTOMER_TYPE_OPTIONS = [
  {
    items: [
      { label: 'Doanh nghiệp', value: 'ENTERPRISE' },
      { label: 'Cá nhân', value: 'INDIVIDUAL' }
    ]
  }
]

export const PAYMENT_OPTIONS = [
  { label: 'Trả trước', value: 'PREPAID' },
  { label: 'Trả sau', value: 'POSTPAID' }
] as const

export const CUSTOMER_TYPE_LABELS: Record<LogisticCustomerTypeT, string> = {
  ENTERPRISE: 'Doanh nghiệp',
  INDIVIDUAL: 'Cá nhân'
}

export const PAYMENT_LABELS: Record<LogisticPaymentTypeT, string> = {
  PREPAID: 'Trả trước',
  POSTPAID: 'Trả sau'
}

export const MOCK_LOGISTIC_DATA: LogisticInformationI[] = [
  {
    id: 'log-001',
    customerType: 'ENTERPRISE',
    customerCode: 'LOGI001',
    taxCode: '0312345678',
    organizationName: 'Cong ty Logistics Phuong Nam',
    shortName: 'PLS',
    address: '123 Nguyen Van Linh, Quan 7, TP.HCM',
    paymentType: 'POSTPAID',
    email: 'contact@pls.vn',
    phone: '0909123456',
    note: 'Khach hang chien luoc.',
    createdAt: '2026-03-01T08:30:00.000Z'
  },
  {
    id: 'log-002',
    customerType: 'ENTERPRISE',
    customerCode: 'LOGI002',
    taxCode: '0309988776',
    organizationName: 'Cong ty Van tai Bac Nam',
    shortName: 'BTN',
    address: '25 Le Duan, Hai Chau, Da Nang',
    paymentType: 'PREPAID',
    email: 'sales@btn.vn',
    phone: '0911222333',
    note: '',
    createdAt: '2026-03-02T09:15:00.000Z'
  },
  {
    id: 'log-003',
    customerType: 'INDIVIDUAL',
    customerCode: 'LOGI003',
    fullName: 'Nguyen Van A',
    identityNumber: '079123456789',
    address: '88 Tran Hung Dao, Hoan Kiem, Ha Noi',
    paymentType: 'POSTPAID',
    email: 'nguyenvana@gmail.com',
    phone: '0988111222',
    note: 'Khach hang ca nhan.',
    createdAt: '2026-03-03T11:00:00.000Z'
  }
]

export const getLogisticDisplayName = (item: LogisticInformationI) =>
  item.customerType === 'ENTERPRISE' ? item.organizationName || item.shortName || '-' : item.fullName || '-'

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
  customerType: item?.customerType ?? 'ENTERPRISE',
  customerCode: item?.customerCode ?? '',
  taxCode: item?.taxCode ?? '',
  organizationName: item?.organizationName ?? '',
  shortName: item?.shortName ?? '',
  fullName: item?.fullName ?? '',
  identityNumber: item?.identityNumber ?? '',
  address: item?.address ?? '',
  paymentType: item?.paymentType ?? '',
  email: item?.email ?? '',
  phone: item?.phone ?? '',
  note: item?.note ?? ''
})
