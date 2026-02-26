export interface InboundRegistrationRequestI {
  // Section 1: Thông tin khách hàng
  customerName: string
  customerEmail: string
  customerPhone: string
  companyName: string
  taxCode?: string
  address?: string
  contactPerson?: string

  // Section 2: Thông tin hàng hóa
  productName: string
  skuCode: string
  productType: string
  specialRequirements?: string
  expectedVolumePerMonth?: string
  palletsOrContainers?: string
  containerType?: string

  // Section 3: Thời gian kế hoạch
  plannedStartDate?: string
  note?: string
}

export interface InboundRegistrationResponseI {
  id?: string
  message: string
}
