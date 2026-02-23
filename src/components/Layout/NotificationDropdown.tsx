import React, { useCallback, useRef, useState } from 'react'
import { WarningOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import type { NotificationItemI, NotificationTypeT } from '@app-types/notification'

const PAGE_SIZE = 10

// Mock: tạo dữ liệu mẫu
function createMockNotifications(page: number): NotificationItemI[] {
  const types: NotificationTypeT[] = ['warning', 'info', 'success']
  const titles: Record<NotificationTypeT, string> = {
    warning: 'Cảnh báo',
    info: 'Thông tin',
    success: 'Hoàn thành'
  }
  const list: NotificationItemI[] = []
  const start = (page - 1) * PAGE_SIZE
  for (let i = 0; i < PAGE_SIZE; i++) {
    const idx = start + i
    const type = types[idx % 3]
    list.push({
      id: `notif-${page}-${i}`,
      type,
      title: `${titles[type]} #${idx + 1}`,
      message:
        type === 'warning'
          ? `Cảnh báo đơn hàng hoặc tồn kho cần xử lý.`
          : type === 'info'
            ? `Thông tin cập nhật mới từ hệ thống.`
            : `Đơn hàng hoặc quy trình đã hoàn thành.`,
      read: idx % 3 === 0,
      createdAt: new Date(Date.now() - idx * 3600000).toISOString()
    })
  }
  return list
}

const typeConfig: Record<NotificationTypeT, { icon: React.ReactNode; bg: string; text: string; label: string }> = {
  warning: {
    icon: <WarningOutlined />,
    bg: 'bg-amber-100',
    text: 'text-amber-700',
    label: 'Cảnh báo'
  },
  info: {
    icon: <InfoCircleOutlined />,
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    label: 'Thông tin'
  },
  success: {
    icon: <CheckCircleOutlined />,
    bg: 'bg-emerald-100',
    text: 'text-emerald-700',
    label: 'Hoàn thành'
  }
}

function formatTime(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return 'Vừa xong'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} giờ trước`
  return d.toLocaleDateString('vi-VN')
}

interface NotificationDropdownPropsI {
  onClose?: () => void
  onUnreadChange?: (count: number) => void
}

const NotificationDropdown: React.FC<NotificationDropdownPropsI> = ({ onUnreadChange }) => {
  const [notifications, setNotifications] = useState<NotificationItemI[]>(() => createMockNotifications(1))
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.read).length

  React.useEffect(() => {
    onUnreadChange?.(unreadCount)
  }, [unreadCount, onUnreadChange])

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    setLoadingMore(true)
    setTimeout(() => {
      const nextPage = page + 1
      const more = createMockNotifications(nextPage)
      setNotifications((prev) => [...prev, ...more])
      setPage(nextPage)
      setLoadingMore(false)
      if (nextPage >= 3) setHasMore(false)
    }, 400)
  }, [page, loadingMore, hasMore])

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el || loadingMore || !hasMore) return
    const { scrollTop, scrollHeight, clientHeight } = el
    if (scrollTop + clientHeight >= scrollHeight - 80) {
      loadMore()
    }
  }, [loadMore, loadingMore, hasMore])

  return (
    <div className='absolute right-0 mt-2 w-[380px] bg-white rounded-lg shadow-lg border border-gray-200 z-50 flex flex-col max-h-[420px]'>
      <div className='px-4 py-3 border-b border-gray-200 flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-gray-800'>Thông báo</h3>
        {unreadCount > 0 && <span className='text-xs text-gray-500'>{unreadCount} chưa đọc</span>}
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className='overflow-y-auto overscroll-contain flex-1'
        style={{ maxHeight: 360 }}
      >
        {notifications.length === 0 ? (
          <div className='px-4 py-8 text-center text-gray-500 text-sm'>Không có thông báo</div>
        ) : (
          <ul className='divide-y divide-gray-100'>
            {notifications.map((item) => {
              const config = typeConfig[item.type]
              return (
                <li key={item.id}>
                  <button
                    type='button'
                    onClick={() => markAsRead(item.id)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex gap-3 ${!item.read ? 'bg-blue-50/50' : ''}`}
                  >
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${config.bg} ${config.text}`}
                    >
                      {config.icon}
                    </span>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center gap-2'>
                        <span className={`text-xs font-medium ${config.text}`}>{config.label}</span>
                        {!item.read && <span className='w-2 h-2 rounded-full bg-blue-500 flex-shrink-0' />}
                      </div>
                      <p className='text-sm font-medium text-gray-800 mt-0.5 truncate'>{item.title}</p>
                      <p className='text-xs text-gray-500 mt-0.5 line-clamp-2'>{item.message}</p>
                      <p className='text-xs text-gray-400 mt-1'>{formatTime(item.createdAt)}</p>
                    </div>
                  </button>
                </li>
              )
            })}
          </ul>
        )}

        {loadingMore && <div className='px-4 py-3 text-center text-gray-500 text-sm'>Đang tải thêm...</div>}
        {!hasMore && notifications.length > 0 && (
          <div className='px-4 py-2 text-center text-gray-400 text-xs'>Đã xem hết thông báo</div>
        )}
      </div>
    </div>
  )
}

export default NotificationDropdown
