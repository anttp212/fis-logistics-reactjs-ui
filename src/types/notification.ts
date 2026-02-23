// Loại thông báo: cảnh báo, thông tin, hoàn thành
export type NotificationType = 'warning' | 'info' | 'success'

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: string
}
