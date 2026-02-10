import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import { FISButton } from 'fis-component'
import { BackIcon } from '@images'

// Extended User type with more details
interface UserDetailI {
  key: string
  username: string
  email: string
  userGroup: string
  role: 'admin' | 'operator' | 'accountant' | 'viewer'
  status?: string
  fullName?: string
  phone?: string
  createdAt?: string
  lastLogin?: string
  description?: string
}

// Fake API function to get user detail
const fetchUserDetail = async (userId: string): Promise<UserDetailI | null> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // Fake user data
  const fakeUsers: Record<string, UserDetailI> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '1': {
      key: '1',
      username: 'admin001',
      email: 'admin001@example.com',
      userGroup: 'Văn phòng',
      role: 'admin',
      status: 'active',
      fullName: 'Nguyễn Văn Admin',
      phone: '0901234567',
      createdAt: '2024-01-15',
      lastLogin: '2024-12-20 10:30:00',
      description: 'Quản trị viên hệ thống với quyền truy cập đầy đủ'
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '2': {
      key: '2',
      username: 'operator001',
      email: 'operator001@example.com',
      userGroup: 'Nhân viên hiện trường',
      role: 'operator',
      status: 'active',
      fullName: 'Trần Thị Điều hành',
      phone: '0902345678',
      createdAt: '2024-02-20',
      lastLogin: '2024-12-20 09:15:00',
      description: 'Nhân viên điều hành tại hiện trường'
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '3': {
      key: '3',
      username: 'accountant001',
      email: 'accountant001@example.com',
      userGroup: 'Văn phòng',
      role: 'accountant',
      status: 'active',
      fullName: 'Lê Văn Kế toán',
      phone: '0903456789',
      createdAt: '2024-03-10',
      lastLogin: '2024-12-19 16:45:00',
      description: 'Kế toán viên phụ trách tài chính'
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '4': {
      key: '4',
      username: 'viewer001',
      email: 'viewer001@example.com',
      userGroup: 'Khách hàng',
      role: 'viewer',
      status: 'inactive',
      fullName: 'Phạm Thị Xem',
      phone: '0904567890',
      createdAt: '2024-04-05',
      lastLogin: '2024-12-15 14:20:00',
      description: 'Người dùng chỉ xem, không có quyền chỉnh sửa'
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '5': {
      key: '5',
      username: 'operator002',
      email: 'operator002@example.com',
      userGroup: 'Nhân viên hiện trường',
      role: 'operator',
      status: 'active',
      fullName: 'Hoàng Văn Vận hành',
      phone: '0905678901',
      createdAt: '2024-05-12',
      lastLogin: '2024-12-20 11:00:00',
      description: 'Nhân viên vận hành tại hiện trường'
    }
  }

  return fakeUsers[userId] || null
}

const UserDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<UserDetailI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserDetail = async () => {
      if (!id) {
        setError('ID người dùng không hợp lệ')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const userData = await fetchUserDetail(id)
        if (userData) {
          setUser(userData)
        } else {
          setError('Không tìm thấy thông tin người dùng')
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải thông tin người dùng')
        console.error('Error loading user detail:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserDetail()
  }, [id])

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: 'Quản trị viên',
      operator: 'Điều hành',
      accountant: 'Kế toán',
      viewer: 'Người xem'
    }
    return roleMap[role] || role
  }

  const getStatusBadge = (status?: string) => {
    if (status === 'active') {
      return (
        <span className='inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800'>
          Hoạt động
        </span>
      )
    }
    return (
      <span className='inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800'>
        Không hoạt động
      </span>
    )
  }

  const handleLockAccount = () => {
    if (!user) return

    const isLocking = user.status === 'active'
    const actionText = isLocking ? 'khóa' : 'mở khóa'

    Modal.confirm({
      title: `Xác nhận ${actionText} tài khoản`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn {actionText} tài khoản người dùng này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{user.username}</p>
          <p className='mt-1 text-sm text-gray-500'>{user.email}</p>
          {isLocking && <p className='mt-1 text-sm text-gray-500'>Tài khoản sẽ không thể đăng nhập sau khi bị khóa.</p>}
        </div>
      ),
      okText: isLocking ? 'Khóa' : 'Mở khóa',
      okType: isLocking ? 'danger' : 'default',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // TODO: Call API to lock/unlock user account
          // eslint-disable-next-line no-console
          console.log(`${isLocking ? 'Lock' : 'Unlock'} user account:`, user.key)

          // Update local state
          setUser({
            ...user,
            status: isLocking ? 'inactive' : 'active'
          })

          // TODO: Show success notification
        } catch (error) {
          console.error(`Error ${actionText} user account:`, error)
          // TODO: Show error notification
          // Re-throw để modal không đóng khi có lỗi
          throw error
        }
      },
      onCancel: () => {
        // User cancelled
      }
    })
  }

  const breadcrumbItems = [
    { label: 'Trang chủ' },
    { label: 'Quản lý người dùng', onClick: () => navigate(ROUTES.userManagementUsers) },
    { label: 'Chi tiết tài khoản' }
  ]

  return (
    <PageWrapper
      className='p-5'
      title='Chi tiết tài khoản người dùng'
      breadcrumbItems={breadcrumbItems}
      hasBackButton
      actionButtons={
        <div className='flex gap-2'>
          {user && (
            <FISButton
              variant={user.status === 'active' ? 'secondary-negative' : 'primary'}
              onClick={handleLockAccount}
            >
              {user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
            </FISButton>
          )}
          <FISButton variant='tertiary' startIcon={<BackIcon />} onClick={() => navigate(ROUTES.userManagementUsers)}>
            Quay lại
          </FISButton>
        </div>
      }
    >
      <div className='flex flex-col gap-6'>
        {isLoading && (
          <div className='flex items-center justify-center py-12'>
            <div className='text-gray-500'>Đang tải thông tin...</div>
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg className='h-5 w-5 text-red-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm text-red-800'>{error}</p>
              </div>
            </div>
          </div>
        )}

        {user && !isLoading && (
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* Left Column */}
              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin cơ bản</h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Tên đăng nhập</label>
                      <p className='text-sm text-gray-900'>{user.username}</p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Email</label>
                      <p className='text-sm text-gray-900'>{user.email}</p>
                    </div>
                    {user.fullName && (
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Họ và tên</label>
                        <p className='text-sm text-gray-900'>{user.fullName}</p>
                      </div>
                    )}
                    {user.phone && (
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Số điện thoại</label>
                        <p className='text-sm text-gray-900'>{user.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin hệ thống</h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Nhóm người dùng</label>
                      <p className='text-sm text-gray-900'>{user.userGroup}</p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Vai trò</label>
                      <p className='text-sm text-gray-900'>{getRoleLabel(user.role)}</p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Trạng thái</label>
                      <div className='mt-1'>{getStatusBadge(user.status)}</div>
                    </div>
                    {user.createdAt && (
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Ngày tạo</label>
                        <p className='text-sm text-gray-900'>{user.createdAt}</p>
                      </div>
                    )}
                    {user.lastLogin && (
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Đăng nhập lần cuối</label>
                        <p className='text-sm text-gray-900'>{user.lastLogin}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {user.description && (
              <div className='mt-6 pt-6 border-t border-gray-200'>
                <label className='block text-sm font-medium text-gray-500 mb-2'>Mô tả</label>
                <p className='text-sm text-gray-900'>{user.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

export default UserDetail
