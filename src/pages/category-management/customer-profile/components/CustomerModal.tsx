import { Modal, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { FISButton, FISInputText } from 'fis-component'
import { FC, useEffect, useState } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'

interface CustomerFormDataI {
  name: string
  customerCode: string
  taxCode: string
  phone?: string
  email?: string
  address?: string
  representativeName?: string
  representativePhone?: string
  representativeEmail?: string
  logo?: string
}

interface CustomerI {
  key: string
  name: string
  customerCode: string
  taxCode: string
  phone?: string
  email?: string
  address?: string
  representativeName?: string
  representativePhone?: string
  representativeEmail?: string
  logo?: string
  status?: string
}

interface CustomerModalPropsI {
  open: boolean
  onClose: () => void
  onSubmit: (data: CustomerFormDataI) => void
  initialData?: CustomerI | null
  isLoading?: boolean
}

const CustomerModal: FC<CustomerModalPropsI> = ({ open, onClose, onSubmit, initialData, isLoading = false }) => {
  const isEditMode = !!initialData
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CustomerFormDataI>({
    defaultValues: {
      name: '',
      customerCode: '',
      taxCode: '',
      phone: '',
      email: '',
      address: '',
      representativeName: '',
      representativePhone: '',
      representativeEmail: '',
      logo: ''
    }
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          customerCode: initialData.customerCode || '',
          taxCode: initialData.taxCode || '',
          phone: initialData.phone || '',
          email: initialData.email || '',
          address: initialData.address || '',
          representativeName: initialData.representativeName || '',
          representativePhone: initialData.representativePhone || '',
          representativeEmail: initialData.representativeEmail || '',
          logo: initialData.logo || ''
        })

        // Set logo file list if exists
        if (initialData.logo) {
          setLogoFileList([
            {
              uid: '-1',
              name: 'logo.jpg',
              status: 'done',
              url: initialData.logo
            }
          ])
        } else {
          setLogoFileList([])
        }
      } else {
        reset({
          name: '',
          customerCode: '',
          taxCode: '',
          phone: '',
          email: '',
          address: '',
          representativeName: '',
          representativePhone: '',
          representativeEmail: '',
          logo: ''
        })
        setLogoFileList([])
      }
    }
  }, [open, initialData, reset])

  const handleFormSubmit = async (data: CustomerFormDataI) => {
    // Handle logo upload
    if (logoFileList.length > 0 && logoFileList[0].originFileObj) {
      const file = logoFileList[0].originFileObj
      const reader = new FileReader()
      reader.onloadend = () => {
        data.logo = reader.result as string
        onSubmit(data)
      }
      reader.readAsDataURL(file)
    } else if (logoFileList.length > 0 && logoFileList[0].url) {
      data.logo = logoFileList[0].url
      onSubmit(data)
    } else {
      onSubmit(data)
    }
  }

  const handleCancel = () => {
    reset()
    setLogoFileList([])
    onClose()
  }

  // Logo upload props
  const logoUploadProps = {
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith('image/')
      if (!isImage) {
        message.error('Chỉ chấp nhận file ảnh!')
        return Upload.LIST_IGNORE
      }
      const isLt5M = file.size / 1024 / 1024 < 5
      if (!isLt5M) {
        message.error('Ảnh phải nhỏ hơn 5MB!')
        return Upload.LIST_IGNORE
      }
      return false
    },
    fileList: logoFileList,
    onChange: ({ fileList }: { fileList: UploadFile[] }) => {
      setLogoFileList(fileList)
    },
    maxCount: 1,
    listType: 'picture-card' as const,
    onRemove: () => {
      setLogoFileList([])
      return true
    }
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title={isEditMode ? 'Chỉnh sửa hồ sơ khách hàng' : 'Khai báo hồ sơ khách hàng mới'}
      width={800}
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className='mt-4'>
        <div className='space-y-4 max-h-[70vh] overflow-y-auto pr-2'>
          {/* Basic Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Thông tin định danh</h3>

            <div>
              <Controller
                name='name'
                control={control}
                rules={{
                  required: 'Tên khách hàng là bắt buộc',
                  minLength: {
                    value: 2,
                    message: 'Tên khách hàng phải có ít nhất 2 ký tự'
                  }
                }}
                render={({ field }) => (
                  <div>
                    <FISInputText {...field} textLabel='Tên khách hàng' placeholder='Nhập tên khách hàng' />
                    {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>}
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name='customerCode'
                control={control}
                rules={{
                  required: 'Mã khách hàng là bắt buộc',
                  minLength: {
                    value: 2,
                    message: 'Mã khách hàng phải có ít nhất 2 ký tự'
                  }
                }}
                render={({ field }) => (
                  <div>
                    <FISInputText {...field} textLabel='Mã khách hàng' placeholder='Nhập mã khách hàng' />
                    {errors.customerCode && <p className='mt-1 text-sm text-red-600'>{errors.customerCode.message}</p>}
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name='taxCode'
                control={control}
                rules={{
                  required: 'Mã số thuế là bắt buộc',
                  minLength: {
                    value: 10,
                    message: 'Mã số thuế phải có ít nhất 10 ký tự'
                  }
                }}
                render={({ field }) => (
                  <div>
                    <FISInputText {...field} textLabel='Mã số thuế' placeholder='Nhập mã số thuế' />
                    {errors.taxCode && <p className='mt-1 text-sm text-red-600'>{errors.taxCode.message}</p>}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className='space-y-4 mt-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Thông tin liên hệ</h3>

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
          </div>

          {/* Representative Information */}
          <div className='space-y-4 mt-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Thông tin người đại diện</h3>

            <div>
              <Controller
                name='representativeName'
                control={control}
                render={({ field }) => (
                  <div>
                    <FISInputText {...field} textLabel='Tên người đại diện' placeholder='Nhập tên người đại diện' />
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name='representativePhone'
                control={control}
                render={({ field }) => (
                  <div>
                    <FISInputText
                      {...field}
                      textLabel='Số điện thoại người đại diện'
                      placeholder='Nhập số điện thoại'
                    />
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name='representativeEmail'
                control={control}
                rules={{
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ'
                  }
                }}
                render={({ field }) => (
                  <div>
                    <FISInputText {...field} type='email' textLabel='Email người đại diện' placeholder='Nhập email' />
                    {errors.representativeEmail && (
                      <p className='mt-1 text-sm text-red-600'>{errors.representativeEmail.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          {/* Logo */}
          <div className='space-y-4 mt-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Ảnh đại diện</h3>
            <Upload {...logoUploadProps}>
              {logoFileList.length < 1 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
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

export default CustomerModal
