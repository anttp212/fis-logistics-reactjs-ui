import { Modal, Upload, message, Button } from 'antd'
import { UploadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { FISButton, FISInputText } from 'fis-component'
import { FC, useEffect, useState } from 'react'
import type { UploadFile } from 'antd/es/upload/interface'

interface VehicleI {
  id?: string
  licensePlate: string
  vehicleType: string
  capacity?: string
  driverName?: string
  driverPhone?: string
}

interface PartnerFormDataI {
  name: string
  partnerCode: string
  taxCode: string
  partnerType: 'transport' | 'subcontractor'
  phone?: string
  email?: string
  address?: string
  representativeName?: string
  representativePhone?: string
  representativeEmail?: string
  logo?: string
  vehicles?: VehicleI[]
}

interface PartnerI {
  key: string
  name: string
  partnerCode: string
  taxCode: string
  partnerType: 'transport' | 'subcontractor'
  phone?: string
  email?: string
  address?: string
  representativeName?: string
  representativePhone?: string
  representativeEmail?: string
  logo?: string
  vehicles?: VehicleI[]
  status?: string
}

interface PartnerModalPropsI {
  open: boolean
  onClose: () => void
  onSubmit: (data: PartnerFormDataI) => void
  initialData?: PartnerI | null
  isLoading?: boolean
}

const PartnerModal: FC<PartnerModalPropsI> = ({ open, onClose, onSubmit, initialData, isLoading = false }) => {
  const isEditMode = !!initialData
  const [logoFileList, setLogoFileList] = useState<UploadFile[]>([])

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<PartnerFormDataI>({
    defaultValues: {
      name: '',
      partnerCode: '',
      taxCode: '',
      partnerType: 'transport',
      phone: '',
      email: '',
      address: '',
      representativeName: '',
      representativePhone: '',
      representativeEmail: '',
      logo: '',
      vehicles: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'vehicles'
  })

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          partnerCode: initialData.partnerCode || '',
          taxCode: initialData.taxCode || '',
          partnerType: initialData.partnerType || 'transport',
          phone: initialData.phone || '',
          email: initialData.email || '',
          address: initialData.address || '',
          representativeName: initialData.representativeName || '',
          representativePhone: initialData.representativePhone || '',
          representativeEmail: initialData.representativeEmail || '',
          logo: initialData.logo || '',
          vehicles: initialData.vehicles || []
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
          partnerCode: '',
          taxCode: '',
          partnerType: 'transport',
          phone: '',
          email: '',
          address: '',
          representativeName: '',
          representativePhone: '',
          representativeEmail: '',
          logo: '',
          vehicles: []
        })
        setLogoFileList([])
      }
    }
  }, [open, initialData, reset])

  const handleFormSubmit = async (data: PartnerFormDataI) => {
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
      title={isEditMode ? 'Chỉnh sửa hồ sơ đối tác' : 'Khai báo hồ sơ đối tác mới'}
      width={900}
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
                  required: 'Tên đối tác là bắt buộc',
                  minLength: {
                    value: 2,
                    message: 'Tên đối tác phải có ít nhất 2 ký tự'
                  }
                }}
                render={({ field }) => (
                  <div>
                    <FISInputText {...field} textLabel='Tên đối tác' placeholder='Nhập tên đối tác' />
                    {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>}
                  </div>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Controller
                  name='partnerCode'
                  control={control}
                  rules={{
                    required: 'Mã đối tác là bắt buộc',
                    minLength: {
                      value: 2,
                      message: 'Mã đối tác phải có ít nhất 2 ký tự'
                    }
                  }}
                  render={({ field }) => (
                    <div>
                      <FISInputText {...field} textLabel='Mã đối tác' placeholder='Nhập mã đối tác' />
                      {errors.partnerCode && <p className='mt-1 text-sm text-red-600'>{errors.partnerCode.message}</p>}
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

            <div>
              <Controller
                name='partnerType'
                control={control}
                rules={{
                  required: 'Loại đối tác là bắt buộc'
                }}
                render={({ field }) => (
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Loại đối tác</label>
                    <select
                      {...field}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='transport'>Đối tác vận tải</option>
                      <option value='subcontractor'>Thầu phụ</option>
                    </select>
                    {errors.partnerType && <p className='mt-1 text-sm text-red-600'>{errors.partnerType.message}</p>}
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

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Controller
                  name='representativePhone'
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
                      <FISInputText {...field} type='email' textLabel='Email' placeholder='Nhập email' />
                      {errors.representativeEmail && (
                        <p className='mt-1 text-sm text-red-600'>{errors.representativeEmail.message}</p>
                      )}
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Vehicles */}
          <div className='space-y-4 mt-6'>
            <div className='flex justify-between items-center'>
              <h3 className='text-lg font-semibold text-gray-900'>Danh sách phương tiện được ủy quyền</h3>
              <Button
                type='dashed'
                onClick={() =>
                  append({ licensePlate: '', vehicleType: '', capacity: '', driverName: '', driverPhone: '' })
                }
                icon={<PlusOutlined />}
              >
                Thêm phương tiện
              </Button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className='border border-gray-200 rounded-lg p-4 space-y-4'>
                <div className='flex justify-between items-center mb-2'>
                  <h4 className='font-medium text-gray-900'>Phương tiện {index + 1}</h4>
                  <Button type='text' danger icon={<DeleteOutlined />} onClick={() => remove(index)} size='small'>
                    Xóa
                  </Button>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Controller
                      name={`vehicles.${index}.licensePlate`}
                      control={control}
                      rules={{ required: 'Biển số xe là bắt buộc' }}
                      render={({ field }) => (
                        <div>
                          <FISInputText {...field} textLabel='Biển số xe' placeholder='Nhập biển số xe' />
                          {errors.vehicles?.[index]?.licensePlate && (
                            <p className='mt-1 text-sm text-red-600'>{errors.vehicles[index]?.licensePlate?.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      name={`vehicles.${index}.vehicleType`}
                      control={control}
                      rules={{ required: 'Loại xe là bắt buộc' }}
                      render={({ field }) => (
                        <div>
                          <FISInputText {...field} textLabel='Loại xe' placeholder='Nhập loại xe' />
                          {errors.vehicles?.[index]?.vehicleType && (
                            <p className='mt-1 text-sm text-red-600'>{errors.vehicles[index]?.vehicleType?.message}</p>
                          )}
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      name={`vehicles.${index}.capacity`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <FISInputText {...field} textLabel='Tải trọng' placeholder='Nhập tải trọng' />
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      name={`vehicles.${index}.driverName`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <FISInputText {...field} textLabel='Tên lái xe' placeholder='Nhập tên lái xe' />
                        </div>
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      name={`vehicles.${index}.driverPhone`}
                      control={control}
                      render={({ field }) => (
                        <div>
                          <FISInputText {...field} textLabel='Số điện thoại lái xe' placeholder='Nhập số điện thoại' />
                        </div>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))}

            {fields.length === 0 && (
              <div className='text-center py-8 border border-dashed border-gray-300 rounded-lg'>
                <p className='text-gray-500'>Chưa có phương tiện nào. Nhấn "Thêm phương tiện" để thêm mới.</p>
              </div>
            )}
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

export default PartnerModal
