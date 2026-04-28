import { Modal } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { FISButton, FISInputText } from 'fis-component'
import { FC, useEffect } from 'react'
import type { UserGroupI } from '../userGroup.api'

interface UserGroupFormDataI {
  name: string
  description: string
}

interface UserGroupModalPropsI {
  open: boolean
  onClose: () => void
  onSubmit: (data: UserGroupFormDataI) => void
  initialData?: UserGroupI | null
  isLoading?: boolean
}

const UserGroupModal: FC<UserGroupModalPropsI> = ({ open, onClose, onSubmit, initialData, isLoading = false }) => {
  const isEditMode = !!initialData

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<UserGroupFormDataI>({
    defaultValues: {
      name: '',
      description: ''
    }
  })

  // Reset form khi modal mở/đóng hoặc initialData thay đổi
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          description: initialData.description || ''
        })
      } else {
        reset({
          name: '',
          description: ''
        })
      }
    }
  }, [open, initialData, reset])

  const handleFormSubmit = (data: UserGroupFormDataI) => {
    onSubmit(data)
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title={isEditMode ? 'Chỉnh sửa nhóm người dùng' : 'Thêm mới nhóm người dùng'}
      width={600}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className='mt-4'>
        <div className='space-y-4'>
          {/* Tên nhóm */}
          <div>
            <Controller
              name='name'
              control={control}
              rules={{
                required: 'Tên nhóm là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Tên nhóm phải có ít nhất 2 ký tự'
                }
              }}
              render={({ field }) => (
                <div>
                  <FISInputText {...field} textLabel='Tên nhóm' placeholder='Nhập tên nhóm người dùng' />
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
                  <FISInputText {...field} textLabel='Mô tả' placeholder='Nhập mô tả (ví dụ: Chủ hàng lẻ, Đại lý)' />
                  {errors.description && <p className='mt-1 text-sm text-red-600'>{errors.description.message}</p>}
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

export default UserGroupModal
