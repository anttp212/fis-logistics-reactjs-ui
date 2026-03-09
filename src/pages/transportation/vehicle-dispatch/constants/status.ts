export const STATUS_OPTIONS = [
  {
    items: [
      { label: 'Chờ xác nhận', value: 'PENDING_CONFIRMATION' },
      { label: 'Nhận lệnh', value: 'IN_TRANSIT' },
      { label: 'Đang vận chuyển', value: 'IN_PROGRESS' },
      { label: 'Hoàn thành', value: 'COMPLETED' },
      { label: 'Sự cố', value: 'INCIDENT' },
      { label: 'Đã huỷ', value: 'CANCELLED' },
      { label: 'Từ chối', value: 'REJECTED' }
    ]
  }
]

export const STATUS_LABELS: Record<string, string> = {
  PENDING_CONFIRMATION: 'Chờ xác nhận',
  IN_TRANSIT: 'Nhận lệnh',
  COMPLETED: 'Hoàn thành',
  INCIDENT: 'Sự cố',
  CANCELLED: 'Đã huỷ',
  REJECTED: 'Từ chối',
  IN_PROGRESS: 'Đang vận chuyển'
}

export type BadgeStatusT = 'caution' | 'info' | 'positive' | 'negative'
export const STATUS_BADGE: Record<string, { label: string; status: BadgeStatusT }> = {
  PENDING_CONFIRMATION: { label: 'Chờ xác nhận', status: 'caution' },
  IN_TRANSIT: { label: 'Nhận lệnh', status: 'info' },
  COMPLETED: { label: 'Hoàn thành', status: 'positive' },
  INCIDENT: { label: 'Sự cố', status: 'negative' },
  CANCELLED: { label: 'Đã huỷ', status: 'negative' },
  REJECTED: { label: 'Từ chối', status: 'negative' },
  IN_PROGRESS: { label: 'Đang vận chuyển', status: 'info' }
}
