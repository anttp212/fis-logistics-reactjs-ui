import { useState, useRef } from 'react'
import { useAppSelector, useAppDispatch } from '@hooks'
import { PageWrapper } from '@components'
import { FISButton } from 'fis-component'
import { setUser } from '@slices/auth.slice'

// Fake API function to update avatar
const updateAvatar = async (avatarUrl: string): Promise<string> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return avatarUrl
}

const Profile = () => {
  const user = useAppSelector((state) => state.auth?.user)
  const dispatch = useAppDispatch()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước file không được vượt quá 5MB')
      return
    }

    try {
      setIsUploading(true)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = async () => {
        const avatarUrl = reader.result as string

        try {
          // Call API to update avatar
          const updatedAvatarUrl = await updateAvatar(avatarUrl)

          // Update Redux store
          if (user) {
            dispatch(
              setUser({
                ...user,
                avatar: updatedAvatarUrl
              })
            )
          }

          // TODO: Show success notification
        } catch (error) {
          console.error('Error updating avatar:', error)
          alert('Có lỗi xảy ra khi cập nhật avatar. Vui lòng thử lại.')
        } finally {
          setIsUploading(false)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error reading file:', error)
      setIsUploading(false)
      alert('Có lỗi xảy ra khi đọc file. Vui lòng thử lại.')
    }
  }

  const getRoleLabel = (role?: string) => {
    if (!role) return 'Chưa xác định'
    const roleMap: Record<string, string> = {
      admin: 'Quản trị viên',
      operator: 'Điều hành',
      accountant: 'Kế toán',
      viewer: 'Người xem'
    }
    return roleMap[role] || role
  }

  const breadcrumbItems = [{ label: 'Trang chủ' }, { label: 'Hồ sơ cá nhân' }]

  if (!user) {
    return (
      <PageWrapper className='py-5' title='Hồ sơ cá nhân' breadcrumbItems={breadcrumbItems}>
        <div className='flex items-center justify-center py-12'>
          <div className='text-gray-500'>Không tìm thấy thông tin người dùng</div>
        </div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className='py-5' title='Hồ sơ cá nhân' breadcrumbItems={breadcrumbItems}>
      <div className='flex flex-col gap-6'>
        {/* Profile Header */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <div className='flex flex-col md:flex-row items-center md:items-start gap-6'>
            {/* Avatar Section */}
            <div className='flex flex-col items-center gap-4'>
              <div className='relative'>
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className='w-32 h-32 rounded-full object-cover border-4 border-gray-200'
                  />
                ) : (
                  <div className='w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-gray-200'>
                    <span className='text-white text-4xl font-medium'>{user.name?.charAt(0) || 'U'}</span>
                  </div>
                )}
                {isUploading && (
                  <div className='absolute inset-0 bg-black/50 rounded-full flex items-center justify-center'>
                    <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-white'></div>
                  </div>
                )}
              </div>
              <FISButton variant='secondary' onClick={handleAvatarClick} disabled={isUploading}>
                {isUploading ? 'Đang tải...' : 'Thay đổi avatar'}
              </FISButton>
              <input ref={fileInputRef} type='file' accept='image/*' onChange={handleFileChange} className='hidden' />
            </div>

            {/* User Information */}
            <div className='flex-1 w-full md:w-auto'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin cơ bản</h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Họ và tên</label>
                      <p className='text-sm text-gray-900'>{user.name}</p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Email</label>
                      <p className='text-sm text-gray-900'>{user.email}</p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Vai trò</label>
                      <p className='text-sm text-gray-900'>{getRoleLabel(user.role)}</p>
                    </div>
                    {user.id && (
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>ID người dùng</label>
                        <p className='text-sm text-gray-900 font-mono'>{user.id}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information Section */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin bổ sung</h3>
          <div className='text-sm text-gray-500'>
            <p>Thông tin bổ sung sẽ được hiển thị tại đây khi có dữ liệu.</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default Profile
