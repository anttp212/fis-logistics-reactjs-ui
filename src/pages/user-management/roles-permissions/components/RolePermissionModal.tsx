import { Modal, Checkbox } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { FISButton, FISInputText } from 'fis-component'
import { FC, useEffect } from 'react'

interface RolePermissionFormDataI {
  name: string
  description: string
  permissions: string[]
}

interface RolePermissionI {
  key: string
  name: string
  description: string
  permissions: string[]
  status?: string
}

interface RolePermissionModalPropsI {
  open: boolean
  onClose: () => void
  onSubmit: (data: RolePermissionFormDataI) => void
  initialData?: RolePermissionI | null
  isLoading?: boolean
}

const RolePermissionModal: FC<RolePermissionModalPropsI> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false
}) => {
  const isEditMode = !!initialData

  // Available permissions
  const availablePermissions = [
    { value: 'read', label: 'Đọc' },
    { value: 'write', label: 'Ghi' },
    { value: 'delete', label: 'Xóa' },
    { value: 'admin', label: 'Quản trị' },
    { value: 'manage', label: 'Quản lý' },
    { value: 'finance', label: 'Tài chính' },
    { value: 'warehouse', label: 'Kho hàng' }
  ]

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<RolePermissionFormDataI>({
    defaultValues: {
      name: '',
      description: '',
      permissions: []
    }
  })

  const selectedPermissions = watch('permissions')

  // Reset form khi modal mở/đóng hoặc initialData thay đổi
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          description: initialData.description || '',
          permissions: initialData.permissions || []
        })
      } else {
        reset({
          name: '',
          description: '',
          permissions: []
        })
      }
    }
  }, [open, initialData, reset])

  const handleFormSubmit = (data: RolePermissionFormDataI) => {
    onSubmit(data)
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  const handlePermissionChange = (permission: string, checked: boolean, onChange: (value: string[]) => void) => {
    if (checked) {
      onChange([...selectedPermissions, permission])
    } else {
      onChange(selectedPermissions.filter((p) => p !== permission))
    }
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title={isEditMode ? 'Chỉnh sửa vai trò và phân quyền' : 'Tạo mới vai trò và phân quyền'}
      width={700}
      destroyOnClose
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className='mt-4'>
        <div className='space-y-4'>
          {/* Tên vai trò */}
          <div>
            <Controller
              name='name'
              control={control}
              rules={{
                required: 'Tên vai trò là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Tên vai trò phải có ít nhất 2 ký tự'
                }
              }}
              render={({ field }) => (
                <div>
                  <FISInputText {...field} textLabel='Tên vai trò' placeholder='Nhập tên vai trò' />
                  {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>}
                </div>
              )}
            />
          </div>

          {/* Mô tả */}
          <div>
            <Controller
              name='description'
              control={control}
              rules={{
                required: 'Mô tả là bắt buộc',
                minLength: {
                  value: 3,
                  message: 'Mô tả phải có ít nhất 3 ký tự'
                }
              }}
              render={({ field }) => (
                <div>
                  <FISInputText {...field} textLabel='Mô tả' placeholder='Nhập mô tả vai trò' />
                  {errors.description && <p className='mt-1 text-sm text-red-600'>{errors.description.message}</p>}
                </div>
              )}
            />
          </div>

          {/* Phân quyền */}
          <div>
            <Controller
              name='permissions'
              control={control}
              rules={{
                required: 'Phân quyền là bắt buộc',
                validate: (value) => value.length > 0 || 'Vui lòng chọn ít nhất một quyền'
              }}
              render={({ field }) => (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Phân quyền</label>
                  <div className='border border-gray-300 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto'>
                    {availablePermissions.map((permission) => (
                      <div key={permission.value} className='flex items-center'>
                        <Checkbox
                          checked={field.value?.includes(permission.value)}
                          onChange={(e) => handlePermissionChange(permission.value, e.target.checked, field.onChange)}
                        >
                          <span className='ml-2'>{permission.label}</span>
                        </Checkbox>
                      </div>
                    ))}
                  </div>
                  {errors.permissions && <p className='mt-1 text-sm text-red-600'>{errors.permissions.message}</p>}
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

export default RolePermissionModal
