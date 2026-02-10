import { Modal, Select, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useForm, Controller } from 'react-hook-form'
import { FISButton, FISInputText } from 'fis-component'
import { FC, useEffect, useState } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'

interface EmployeeFormDataI {
  name: string
  employeeCode: string
  department: string
  skillGroup?: string
  phone?: string
  email?: string
  address?: string
  position?: string
  portraitPhoto?: string
  certificates?: string[]
}

interface EmployeeI {
  key: string
  name: string
  employeeCode: string
  department: string
  skillGroup?: string
  phone?: string
  email?: string
  address?: string
  position?: string
  portraitPhoto?: string
  certificates?: string[]
  status?: string
}

interface EmployeeModalPropsI {
  open: boolean
  onClose: () => void
  onSubmit: (data: EmployeeFormDataI) => void
  departmentsList: { value: string; label: string }[]
  skillGroupsList: { value: string; label: string }[]
  initialData?: EmployeeI | null
  isLoading?: boolean
}

const EmployeeModal: FC<EmployeeModalPropsI> = ({
  open,
  onClose,
  onSubmit,
  departmentsList,
  skillGroupsList,
  initialData,
  isLoading = false
}) => {
  const isEditMode = !!initialData
  const [portraitFileList, setPortraitFileList] = useState<UploadFile[]>([])
  const [certificateFileList, setCertificateFileList] = useState<UploadFile[]>([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<EmployeeFormDataI>({
    defaultValues: {
      name: '',
      employeeCode: '',
      department: '',
      skillGroup: '',
      phone: '',
      email: '',
      address: '',
      position: '',
      portraitPhoto: '',
      certificates: []
    }
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          employeeCode: initialData.employeeCode || '',
          department: initialData.department || '',
          skillGroup: initialData.skillGroup || '',
          phone: initialData.phone || '',
          email: initialData.email || '',
          address: initialData.address || '',
          position: initialData.position || '',
          portraitPhoto: initialData.portraitPhoto || '',
          certificates: initialData.certificates || []
        })

        // Set portrait photo file list if exists
        if (initialData.portraitPhoto) {
          setPortraitFileList([
            {
              uid: '-1',
              name: 'portrait.jpg',
              status: 'done',
              url: initialData.portraitPhoto
            }
          ])
        } else {
          setPortraitFileList([])
        }

        // Set certificate file list if exists
        if (initialData.certificates && initialData.certificates.length > 0) {
          setCertificateFileList(
            initialData.certificates.map((cert, index) => ({
              uid: `-${index}`,
              name: `certificate-${index}.pdf`,
              status: 'done',
              url: cert
            }))
          )
        } else {
          setCertificateFileList([])
        }
      } else {
        reset({
          name: '',
          employeeCode: '',
          department: '',
          skillGroup: '',
          phone: '',
          email: '',
          address: '',
          position: '',
          portraitPhoto: '',
          certificates: []
        })
        setPortraitFileList([])
        setCertificateFileList([])
      }
    }
  }, [open, initialData, reset])

  const handleFormSubmit = async (data: EmployeeFormDataI) => {
    // Handle portrait photo upload
    if (portraitFileList.length > 0 && portraitFileList[0].originFileObj) {
      const file = portraitFileList[0].originFileObj
      const reader = new FileReader()
      reader.onloadend = () => {
        data.portraitPhoto = reader.result as string
        onSubmit(data)
      }
      reader.readAsDataURL(file)
    } else if (portraitFileList.length > 0 && portraitFileList[0].url) {
      data.portraitPhoto = portraitFileList[0].url
      onSubmit(data)
    } else {
      onSubmit(data)
    }
  }

  const handleCancel = () => {
    reset()
    setPortraitFileList([])
    setCertificateFileList([])
    onClose()
  }

  // Portrait photo upload props
  const portraitUploadProps = {
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
    fileList: portraitFileList,
    onChange: ({ fileList }: { fileList: UploadFile[] }) => {
      setPortraitFileList(fileList)
    },
    maxCount: 1,
    listType: 'picture-card' as const,
    onRemove: () => {
      setPortraitFileList([])
      return true
    }
  }

  // Certificate upload props
  const certificateUploadProps = {
    beforeUpload: (file: File) => {
      const isPdf = file.type === 'application/pdf'
      const isImage = file.type.startsWith('image/')
      if (!isPdf && !isImage) {
        message.error('Chỉ chấp nhận file PDF hoặc ảnh!')
        return Upload.LIST_IGNORE
      }
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('File phải nhỏ hơn 10MB!')
        return Upload.LIST_IGNORE
      }
      return false
    },
    fileList: certificateFileList,
    onChange: ({ fileList }: { fileList: UploadFile[] }) => {
      setCertificateFileList(fileList)
    },
    multiple: true,
    listType: 'text' as const
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title={isEditMode ? 'Chỉnh sửa hồ sơ nhân viên' : 'Tạo mới hồ sơ nhân viên'}
      width={800}
      destroyOnClose
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className='mt-4'>
        <div className='space-y-4 max-h-[70vh] overflow-y-auto pr-2'>
          {/* Basic Information */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Thông tin cơ bản</h3>

            <div>
              <Controller
                name='name'
                control={control}
                rules={{
                  required: 'Tên nhân viên là bắt buộc',
                  minLength: {
                    value: 2,
                    message: 'Tên nhân viên phải có ít nhất 2 ký tự'
                  }
                }}
                render={({ field }) => (
                  <div>
                    <FISInputText {...field} textLabel='Tên nhân viên' placeholder='Nhập tên nhân viên' />
                    {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>}
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name='employeeCode'
                control={control}
                rules={{
                  required: 'Mã nhân viên là bắt buộc',
                  minLength: {
                    value: 2,
                    message: 'Mã nhân viên phải có ít nhất 2 ký tự'
                  }
                }}
                render={({ field }) => (
                  <div>
                    <FISInputText {...field} textLabel='Mã nhân viên' placeholder='Nhập mã nhân viên' />
                    {errors.employeeCode && <p className='mt-1 text-sm text-red-600'>{errors.employeeCode.message}</p>}
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name='department'
                control={control}
                rules={{
                  required: 'Phòng ban là bắt buộc'
                }}
                render={({ field }) => (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Phòng ban</label>
                    <Select
                      value={field.value || undefined}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder='Chọn phòng ban'
                      options={departmentsList}
                      className='w-full'
                      size='large'
                    />
                    {errors.department && <p className='mt-1 text-sm text-red-600'>{errors.department.message}</p>}
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name='skillGroup'
                control={control}
                render={({ field }) => (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Nhóm kỹ năng</label>
                    <Select
                      value={field.value || undefined}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder='Chọn nhóm kỹ năng'
                      options={skillGroupsList}
                      className='w-full'
                      size='large'
                      allowClear
                    />
                  </div>
                )}
              />
            </div>

            <div>
              <Controller
                name='position'
                control={control}
                render={({ field }) => (
                  <div>
                    <FISInputText {...field} textLabel='Chức vụ' placeholder='Nhập chức vụ' />
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

          {/* Portrait Photo */}
          <div className='space-y-4 mt-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Ảnh chân dung</h3>
            <Upload {...portraitUploadProps}>
              {portraitFileList.length < 1 && (
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </div>

          {/* Certificates */}
          <div className='space-y-4 mt-6'>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>Chứng chỉ chuyên môn</h3>
            <Upload {...certificateUploadProps}>
              <FISButton variant='secondary' startIcon={<UploadOutlined />}>
                Tải lên chứng chỉ
              </FISButton>
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

export default EmployeeModal
