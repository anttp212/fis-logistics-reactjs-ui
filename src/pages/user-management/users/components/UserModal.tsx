import { Modal, Select } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { FISButton, FISInputText } from 'fis-component'
import { FC, useEffect } from 'react'

interface UserFormDataI {
  username: string
  email: string
  password: string
  userGroup: string
  department: string
  role: string
}

interface UserI {
  key: string
  username: string
  email: string
  userGroup: string
  department?: string
  role: string
  status?: string
}

interface UserModalPropsI {
  open: boolean
  onClose: () => void
  onSubmit: (data: UserFormDataI) => void
  userGroupsList: { value: string; label: string }[]
  departmentsList: { value: string; label: string }[]
  initialData?: UserI | null
  isLoading?: boolean
}

const UserModal: FC<UserModalPropsI> = ({
  open,
  onClose,
  onSubmit,
  userGroupsList,
  departmentsList,
  initialData,
  isLoading = false
}) => {
  const isEditMode = !!initialData
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserFormDataI>({
    defaultValues: {
      username: '',
      email: '',
      password: '',
      userGroup: '',
      department: '',
      role: 'Bảo vệ'
    }
  })

  // Reset form khi modal mở/đóng hoặc initialData thay đổi
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          username: initialData.username || '',
          email: initialData.email || '',
          password: '', // Không fill password khi edit
          userGroup: initialData.userGroup || '',
          department: initialData.department ?? '',
          role: initialData.role || 'Bảo vệ'
        })
      } else {
        reset({
          username: '',
          email: '',
          password: '',
          userGroup: '',
          department: '',
          role: 'Bảo vệ'
        })
      }
    }
  }, [open, initialData, reset])

  const handleFormSubmit = (data: UserFormDataI) => {
    onSubmit(data)
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  // Role options: Admin, Tài xế, Bảo vệ
  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Tài xế', label: 'Tài xế' },
    { value: 'Bảo vệ', label: 'Bảo vệ' }
  ]

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title={isEditMode ? 'Chỉnh sửa tài khoản người dùng' : 'Tạo mới tài khoản người dùng'}
      width={600}
      destroyOnClose
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className='mt-4'>
        <div className='space-y-4'>
          {/* Tên người dùng */}
          <div>
            <Controller
              name='username'
              control={control}
              rules={{
                required: 'Tên người dùng là bắt buộc',
                minLength: {
                  value: 3,
                  message: 'Tên người dùng phải có ít nhất 3 ký tự'
                }
              }}
              render={({ field }) => (
                <div>
                  <FISInputText {...field} textLabel='Tên người dùng' placeholder='Nhập tên người dùng' />
                  {errors.username && <p className='mt-1 text-sm text-red-600'>{errors.username.message}</p>}
                </div>
              )}
            />
          </div>

          {/* Email */}
          <div>
            <Controller
              name='email'
              control={control}
              rules={{
                required: 'Email là bắt buộc',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email không hợp lệ'
                }
              }}
              render={({ field }) => (
                <div>
                  <FISInputText {...field} type='email' textLabel='Email' placeholder='Nhập email' />
                  {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
                </div>
              )}
            />
          </div>

          {/* Password - chỉ required khi tạo mới */}
          <div>
            <Controller
              name='password'
              control={control}
              rules={{
                required: isEditMode ? false : 'Mật khẩu là bắt buộc',
                minLength: isEditMode
                  ? undefined
                  : {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự'
                    }
              }}
              render={({ field }) => (
                <div>
                  <FISInputText
                    {...field}
                    type='password'
                    textLabel={isEditMode ? 'Mật khẩu mới (để trống nếu không đổi)' : 'Mật khẩu'}
                    placeholder={isEditMode ? 'Nhập mật khẩu mới (tùy chọn)' : 'Nhập mật khẩu'}
                  />
                  {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>}
                </div>
              )}
            />
          </div>

          {/* Nhóm người dùng */}
          <div>
            <Controller
              name='userGroup'
              control={control}
              rules={{
                required: 'Nhóm người dùng là bắt buộc'
              }}
              render={({ field }) => (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Nhóm người dùng</label>
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder='Chọn nhóm người dùng'
                    options={userGroupsList}
                    className='w-full'
                    size='large'
                  />
                  {errors.userGroup && <p className='mt-1 text-sm text-red-600'>{errors.userGroup.message}</p>}
                </div>
              )}
            />
          </div>

          {/* Phòng ban */}
          <div>
            <Controller
              name='department'
              control={control}
              render={({ field }) => (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phòng ban</label>
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder='Chọn phòng ban'
                    options={departmentsList}
                    className='w-full'
                    size='large'
                    allowClear
                  />
                  {errors.department && <p className='mt-1 text-sm text-red-600'>{errors.department.message}</p>}
                </div>
              )}
            />
          </div>

          {/* Role */}
          <div>
            <Controller
              name='role'
              control={control}
              rules={{
                required: 'Vai trò là bắt buộc'
              }}
              render={({ field }) => (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Vai trò</label>
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder='Chọn vai trò'
                    options={roleOptions}
                    className='w-full'
                    size='large'
                  />
                  {errors.role && <p className='mt-1 text-sm text-red-600'>{errors.role.message}</p>}
                </div>
              )}
            />
          </div>
        </div>

        {/* Footer buttons */}
        <div className='flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200'>
          <FISButton variant='secondary' onClick={handleCancel} disabled={isLoading}>
            Hủy
          </FISButton>
          <FISButton type='submit' variant='primary' disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Tạo mới'}
          </FISButton>
        </div>
      </form>
    </Modal>
  )
}

export default UserModal
