import { Modal } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { FISButton, FISInputText } from 'fis-component'
import { FC, useEffect } from 'react'

interface BranchFormDataI {
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  description?: string
}

interface BranchI {
  key: string
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  description?: string
  status?: string
}

interface BranchModalPropsI {
  open: boolean
  onClose: () => void
  onSubmit: (data: BranchFormDataI) => void
  initialData?: BranchI | null
  isLoading?: boolean
}

const BranchModal: FC<BranchModalPropsI> = ({ open, onClose, onSubmit, initialData, isLoading = false }) => {
  const isEditMode = !!initialData
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<BranchFormDataI>({
    defaultValues: {
      name: '',
      code: '',
      address: '',
      phone: '',
      email: '',
      description: ''
    }
  })

  // Reset form khi modal mở/đóng hoặc initialData thay đổi
  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          code: initialData.code || '',
          address: initialData.address || '',
          phone: initialData.phone || '',
          email: initialData.email || '',
          description: initialData.description || ''
        })
      } else {
        reset({
          name: '',
          code: '',
          address: '',
          phone: '',
          email: '',
          description: ''
        })
      }
    }
  }, [open, initialData, reset])

  const handleFormSubmit = (data: BranchFormDataI) => {
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
      title={isEditMode ? 'Chỉnh sửa chi nhánh' : 'Tạo mới chi nhánh'}
      width={600}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className='mt-4'>
        <div className='space-y-4'>
          {/* Tên chi nhánh */}
          <div>
            <Controller
              name='name'
              control={control}
              rules={{
                required: 'Tên chi nhánh là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Tên chi nhánh phải có ít nhất 2 ký tự'
                }
              }}
              render={({ field }) => (
                <div>
                  <FISInputText {...field} textLabel='Tên chi nhánh' placeholder='Nhập tên chi nhánh' />
                  {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>}
                </div>
              )}
            />
          </div>

          {/* Mã chi nhánh */}
          <div>
            <Controller
              name='code'
              control={control}
              rules={{
                required: 'Mã chi nhánh là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Mã chi nhánh phải có ít nhất 2 ký tự'
                }
              }}
              render={({ field }) => (
                <div>
                  <FISInputText {...field} textLabel='Mã chi nhánh' placeholder='Nhập mã chi nhánh' />
                  {errors.code && <p className='mt-1 text-sm text-red-600'>{errors.code.message}</p>}
                </div>
              )}
            />
          </div>

          {/* Địa chỉ */}
          <div>
            <Controller
              name='address'
              control={control}
              render={({ field }) => (
                <div>
                  <FISInputText {...field} textLabel='Địa chỉ' placeholder='Nhập địa chỉ' />
                </div>
              )}
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <Controller
              name='phone'
              control={control}
              render={({ field }) => (
                <div>
                  <FISInputText {...field} textLabel='Số điện thoại' placeholder='Nhập số điện thoại' />
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

          {/* Mô tả */}
          <div>
            <Controller
              name='description'
              control={control}
              render={({ field }) => (
                <div>
                  <FISInputText {...field} textLabel='Mô tả' placeholder='Nhập mô tả' />
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

export default BranchModal
