import { Controller, useForm } from 'react-hook-form'
import { FISButton, FISCheckboxGroup, FISInputArea, FISInputText, FISSelect, FISText } from 'fis-component'
import { GENDER_OPTIONS, LOGISTICS_OPTIONS, STATUS_CHECKBOX_OPTIONS, type DriverFormValuesI } from './data'

interface DriverFormPropsI {
  defaultValues: DriverFormValuesI
  submitLabel: string
  onSubmit: (values: DriverFormValuesI) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

const DriverForm = ({ defaultValues, submitLabel, onSubmit, onCancel, isSubmitting = false }: DriverFormPropsI) => {
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<DriverFormValuesI>({
    defaultValues
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          1. Thông tin tài xế
        </FISText>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Controller
            name='logisticsId'
            control={control}
            rules={{ required: 'Vui lòng chọn logistics' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                required
                textLabel='Logistics'
                placeholder='Chọn logistics'
                options={LOGISTICS_OPTIONS}
                negative={!!errors.logisticsId}
                message={errors.logisticsId?.message}
              />
            )}
          />
          <Controller
            name='identityNumber'
            control={control}
            rules={{ required: 'Vui lòng nhập CCCD/CMND' }}
            render={({ field }) => (
              <FISInputText
                {...field}
                required
                textLabel='CCCD/CMND'
                placeholder='Nhập CCCD/CMND'
                negative={!!errors.identityNumber}
                message={errors.identityNumber?.message}
              />
            )}
          />
          <Controller
            name='fullName'
            control={control}
            rules={{ required: 'Vui lòng nhập tên cá nhân' }}
            render={({ field }) => (
              <FISInputText
                {...field}
                required
                textLabel='Tên cá nhân'
                placeholder='Nhập tên cá nhân'
                negative={!!errors.fullName}
                message={errors.fullName?.message}
              />
            )}
          />
          <Controller
            name='phone'
            control={control}
            rules={{ required: 'Vui lòng nhập số điện thoại' }}
            render={({ field }) => (
              <FISInputText
                {...field}
                required
                textLabel='Số điện thoại'
                placeholder='Nhập số điện thoại'
                negative={!!errors.phone}
                message={errors.phone?.message}
              />
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field }) => <FISInputText {...field} textLabel='Email' placeholder='Nhập email' />}
          />
          <Controller
            name='password'
            control={control}
            rules={{ required: 'Vui lòng nhập mật khẩu' }}
            render={({ field }) => (
              <FISInputText
                {...field}
                required
                type='password'
                textLabel='Mật khẩu'
                placeholder='Nhập mật khẩu'
                negative={!!errors.password}
                message={errors.password?.message}
              />
            )}
          />
          <Controller
            name='gender'
            control={control}
            render={({ field }) => (
              <FISSelect {...field} textLabel='Giới tính' placeholder='Chọn giới tính' options={GENDER_OPTIONS} />
            )}
          />
          <Controller
            name='status'
            control={control}
            rules={{ required: 'Vui lòng chọn trạng thái' }}
            render={({ field }) => (
              <div className='md:col-span-2'>
                <FISCheckboxGroup
                  direction='row'
                  groupLabel='Trạng thái'
                  options={[...STATUS_CHECKBOX_OPTIONS]}
                  value={field.value ? [field.value] : []}
                  onChange={(nextValue) => field.onChange(nextValue[0] ?? '')}
                />
                {errors.status && <p className='mt-1 text-sm text-red-500'>{errors.status.message}</p>}
              </div>
            )}
          />
        </div>
      </div>

      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          2. Ghi chú
        </FISText>
        <Controller
          name='note'
          control={control}
          render={({ field }) => (
            <FISInputArea {...field} textLabel='Ghi chú' placeholder='Nhập ghi chú' maxLength={1000} />
          )}
        />
      </div>

      <div className='sticky bottom-0 mt-12 pr-3 py-4 bg-[#EFF3FD] border-t border-gray-200 flex justify-end gap-2'>
        <FISButton type='button' variant='secondary' onClick={onCancel}>
          Hủy
        </FISButton>
        <FISButton type='submit' variant='primary' disabled={isSubmitting}>
          {isSubmitting ? 'Đang xử lý...' : submitLabel}
        </FISButton>
      </div>
    </form>
  )
}

export default DriverForm
