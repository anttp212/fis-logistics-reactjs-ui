// Loại thông báo: cảnh báo, thông tin, hoàn thành
export type NotificationTypeT = 'warning' | 'info' | 'success'

export interface NotificationItemI {
  id: string
  type: NotificationTypeT
  title: string
  message: string
  read: boolean
  createdAt: string
}
