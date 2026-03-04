import { Modal, Select } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { FISButton, FISInputText } from 'fis-component'
import { FC, useEffect } from 'react'

interface DepartmentFormDataI {
  name: string
  code: string
  branch: string
  users?: string[]
  description?: string
}

interface DepartmentI {
  key: string
  name: string
  code: string
  branch: string
  users?: string[]
  description?: string
  status?: string
}

interface DepartmentModalPropsI {
  open: boolean
  onClose: () => void
  onSubmit: (data: DepartmentFormDataI) => void
  branchesList: { value: string; label: string }[]
  usersList: { value: string; label: string }[]
  initialData?: DepartmentI | null
  isLoading?: boolean
}

const DepartmentModal: FC<DepartmentModalPropsI> = ({
  open,
  onClose,
  onSubmit,
  branchesList,
  usersList,
  initialData,
  isLoading = false
}) => {
  const isEditMode = !!initialData
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<DepartmentFormDataI>({
    defaultValues: {
      name: '',
      code: '',
      branch: '',
      users: [],
      description: ''
    }
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          code: initialData.code || '',
          branch: initialData.branch || '',
          users: initialData.users || [],
          description: initialData.description || ''
        })
      } else {
        reset({
          name: '',
          code: '',
          branch: '',
          users: [],
          description: ''
        })
      }
    }
  }, [open, initialData, reset])

  const handleFormSubmit = (data: DepartmentFormDataI) => {
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
      title={isEditMode ? 'Chỉnh sửa phòng ban' : 'Tạo mới phòng ban'}
      width={600}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className='mt-4'>
        <div className='space-y-4'>
          <div>
            <Controller
              name='name'
              control={control}
              rules={{
                required: 'Tên phòng ban là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Tên phòng ban phải có ít nhất 2 ký tự'
                }
              }}
              render={({ field }) => (
                <div>
                  <FISInputText {...field} textLabel='Tên phòng ban' placeholder='Nhập tên phòng ban' />
                  {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>}
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name='code'
              control={control}
              rules={{
                required: 'Mã phòng ban là bắt buộc',
                minLength: {
                  value: 2,
                  message: 'Mã phòng ban phải có ít nhất 2 ký tự'
                }
              }}
              render={({ field }) => (
                <div>
                  <FISInputText {...field} textLabel='Mã phòng ban' placeholder='Nhập mã phòng ban' />
                  {errors.code && <p className='mt-1 text-sm text-red-600'>{errors.code.message}</p>}
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name='branch'
              control={control}
              rules={{
                required: 'Chi nhánh là bắt buộc'
              }}
              render={({ field }) => (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Chi nhánh</label>
                  <Select
                    value={field.value || undefined}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder='Chọn chi nhánh'
                    options={branchesList}
                    className='w-full'
                    size='large'
                  />
                  {errors.branch && <p className='mt-1 text-sm text-red-600'>{errors.branch.message}</p>}
                </div>
              )}
            />
          </div>

          <div>
            <Controller
              name='users'
              control={control}
              render={({ field }) => (
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Danh sách người dùng</label>
                  <Select
                    value={Array.isArray(field.value) ? field.value : []}
                    onChange={(value) => field.onChange(Array.isArray(value) ? value : [])}
                    onBlur={field.onBlur}
                    placeholder='Chọn người dùng'
                    options={usersList}
                    mode='multiple'
                    className='w-full'
                    size='large'
                  />
                </div>
              )}
            />
          </div>

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

export default DepartmentModal
