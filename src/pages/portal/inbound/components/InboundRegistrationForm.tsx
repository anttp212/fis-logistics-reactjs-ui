import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Input, Modal, Select } from 'antd'
import { FISButton, FISInputDate, FISInputText, FISText } from 'fis-component'
import { submitInboundRegistration } from '../inbound.service'
import type { InboundRegistrationRequestI } from '../inbound.api'

const { TextArea } = Input

const PRODUCT_TYPE_OPTIONS = [
  { value: 'fmcg', label: 'FMCG' },
  { value: 'electronics', label: 'Điện tử' },
  { value: 'chemical', label: 'Hóa chất' },
  { value: 'textile', label: 'Dệt may' },
  { value: 'food', label: 'Thực phẩm' },
  { value: 'other', label: 'Khác' }
]

const CONTAINER_TYPE_OPTIONS = [
  { value: '20ft', label: '20ft' },
  { value: '40ft', label: '40ft' }
]

const InboundRegistrationForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<InboundRegistrationRequestI>({
    defaultValues: {
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      companyName: '',
      taxCode: '',
      address: '',
      contactPerson: '',
      productName: '',
      skuCode: '',
      productType: '',
      specialRequirements: '',
      expectedVolumePerMonth: '',
      palletsOrContainers: '',
      containerType: '',
      plannedStartDate: '',
      note: ''
    }
  })

  const onSubmit = async (data: InboundRegistrationRequestI) => {
    try {
      setIsLoading(true)
      const payload = {
        ...data,
        customerName: data.companyName
      }
      await submitInboundRegistration(payload)
      reset()
      Modal.success({
        title: 'Đăng ký thành công',
        content: 'Yêu cầu đăng ký dịch vụ Inbound đã được gửi. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.',
        okText: 'Đóng'
      })
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } })?.response?.data?.message
          : null
      Modal.error({
        title: 'Đăng ký thất bại',
        content: errorMessage || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
        okText: 'Đóng'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='relative pb-20'>
      <div className='space-y-8'>
        {/* Section 1: Thông tin khách hàng */}
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
            1. Thông tin khách hàng
          </FISText>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Controller
              name='companyName'
              control={control}
              rules={{ required: 'Tên công ty là bắt buộc' }}
              render={({ field }) => (
                <div>
                  <FISInputText
                    {...field}
                    textLabel='Tên công ty'
                    placeholder='Nhập tên công ty'
                    negative={!!errors.companyName}
                    message={errors.companyName?.message}
                  />
                </div>
              )}
            />
            <Controller
              name='taxCode'
              control={control}
              render={({ field }) => <FISInputText {...field} textLabel='Mã số thuế' placeholder='Nhập mã số thuế' />}
            />
            <Controller
              name='contactPerson'
              control={control}
              rules={{ required: 'Người liên hệ là bắt buộc' }}
              render={({ field }) => (
                <div>
                  <FISInputText
                    {...field}
                    textLabel='Người liên hệ'
                    placeholder='Nhập tên người liên hệ'
                    negative={!!errors.contactPerson}
                    message={errors.contactPerson?.message}
                  />
                </div>
              )}
            />
            <Controller
              name='customerEmail'
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
                  <FISInputText
                    {...field}
                    type='email'
                    textLabel='Email'
                    placeholder='Nhập email'
                    negative={!!errors.customerEmail}
                    message={errors.customerEmail?.message}
                  />
                </div>
              )}
            />
            <Controller
              name='customerPhone'
              control={control}
              rules={{ required: 'Số điện thoại là bắt buộc' }}
              render={({ field }) => (
                <div>
                  <FISInputText
                    {...field}
                    textLabel='Số điện thoại'
                    placeholder='Nhập số điện thoại'
                    negative={!!errors.customerPhone}
                    message={errors.customerPhone?.message}
                  />
                </div>
              )}
            />
            <Controller
              name='address'
              control={control}
              render={({ field }) => <FISInputText {...field} textLabel='Địa chỉ' placeholder='Nhập địa chỉ' />}
            />
          </div>
        </div>

        {/* Section 2: Thông tin hàng hóa */}
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
            2. Thông tin hàng hóa
          </FISText>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Controller
              name='productName'
              control={control}
              rules={{ required: 'Tên hàng là bắt buộc' }}
              render={({ field }) => (
                <div>
                  <FISInputText
                    {...field}
                    textLabel='Tên hàng'
                    placeholder='Nhập tên hàng hóa'
                    negative={!!errors.productName}
                    message={errors.productName?.message}
                  />
                </div>
              )}
            />
            <Controller
              name='skuCode'
              control={control}
              rules={{ required: 'Mã SKU là bắt buộc' }}
              render={({ field }) => (
                <div>
                  <FISInputText
                    {...field}
                    textLabel='Mã SKU'
                    placeholder='Nhập mã SKU'
                    negative={!!errors.skuCode}
                    message={errors.skuCode?.message}
                  />
                </div>
              )}
            />
            <Controller
              name='productType'
              control={control}
              rules={{ required: 'Loại hàng là bắt buộc' }}
              render={({ field }) => (
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>Loại hàng</label>
                  <Select
                    {...field}
                    value={field.value || undefined}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder='Chọn loại hàng (FMCG, điện tử, hóa chất…)'
                    options={PRODUCT_TYPE_OPTIONS}
                    className='w-full'
                    size='large'
                    status={errors.productType ? 'error' : undefined}
                  />
                  {errors.productType && <p className='mt-1 text-sm text-red-600'>{errors.productType.message}</p>}
                </div>
              )}
            />
            <Controller
              name='expectedVolumePerMonth'
              control={control}
              render={({ field }) => (
                <FISInputText {...field} textLabel='Sản lượng dự kiến / tháng' placeholder='Nhập sản lượng dự kiến' />
              )}
            />
            <Controller
              name='palletsOrContainers'
              control={control}
              render={({ field }) => (
                <FISInputText
                  {...field}
                  textLabel='Số pallet / container'
                  placeholder='Nhập số pallet hoặc container'
                />
              )}
            />
            <Controller
              name='containerType'
              control={control}
              render={({ field }) => (
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>Loại container</label>
                  <Select
                    {...field}
                    value={field.value || undefined}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder='Chọn loại container'
                    options={CONTAINER_TYPE_OPTIONS}
                    className='w-full'
                    size='large'
                    allowClear
                  />
                </div>
              )}
            />
          </div>
          <div className='mt-4'>
            <Controller
              name='specialRequirements'
              control={control}
              render={({ field }) => (
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>
                    Có yêu cầu đặc biệt không? (nhiệt độ, chống ẩm…)
                  </label>
                  <TextArea
                    {...field}
                    placeholder='Nhập yêu cầu đặc biệt (nhiệt độ, chống ẩm, v.v.)'
                    rows={3}
                    className='w-full'
                  />
                </div>
              )}
            />
          </div>
        </div>

        {/* Section 3: Thời gian kế hoạch */}
        <div className='rounded-lg border border-gray-200 bg-white p-6'>
          <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
            3. Thời gian kế hoạch
          </FISText>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <Controller
              name='plannedStartDate'
              control={control}
              render={({ field }) => (
                <FISInputDate
                  textLabel='Thời gian dự kiến bắt đầu'
                  placeholder='dd/mm/yyyy'
                  value={field.value ? new Date(field.value) : null}
                  onChange={(date) => field.onChange(date ? date.toISOString().split('T')[0] : '')}
                  picker='date'
                  format='DD/MM/YYYY'
                />
              )}
            />
          </div>
          <div className='mt-4'>
            <Controller
              name='note'
              control={control}
              render={({ field }) => (
                <div>
                  <label className='mb-2 block text-sm font-medium text-gray-700'>Ghi chú</label>
                  <TextArea {...field} placeholder='Nhập ghi chú' rows={4} className='w-full' />
                </div>
              )}
            />
          </div>
        </div>
      </div>

      <div className='fixed bottom-6 right-6'>
        <FISButton type='submit' variant='primary' disabled={isLoading}>
          {isLoading ? 'Đang gửi...' : 'Đăng ký'}
        </FISButton>
      </div>
    </form>
  )
}

export default InboundRegistrationForm
