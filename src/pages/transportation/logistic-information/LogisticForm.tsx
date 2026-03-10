import { Controller, useForm } from 'react-hook-form'
import { FISButton, FISRadioGroup, FISInputArea, FISInputText, FISSelect, FISText } from 'fis-component'
import type { LogisticFormValuesI } from './data'
import { CUSTOMER_TYPE_OPTIONS, CustomerTypeE, PAYMENT_OPTIONS } from './data'

interface LogisticFormPropsI {
  defaultValues: LogisticFormValuesI
  submitLabel: string
  onSubmit: (values: LogisticFormValuesI) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

const LogisticForm = ({ defaultValues, submitLabel, onSubmit, onCancel, isSubmitting = false }: LogisticFormPropsI) => {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<LogisticFormValuesI>({
    defaultValues
  })

  const customerType = watch('customerType')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          Thông tin chung
        </FISText>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Controller
            name='customerType'
            control={control}
            rules={{ required: 'Vui lòng chọn loại khách hàng' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                required
                textLabel='Loại khách hàng'
                placeholder='Chọn loại khách hàng'
                options={CUSTOMER_TYPE_OPTIONS}
                negative={!!errors.customerType}
                message={errors.customerType?.message}
              />
            )}
          />

          {customerType === CustomerTypeE.BUSINESS ? (
            <>
              <Controller
                name='companyName'
                control={control}
                rules={{ required: 'Vui lòng nhập tên đơn vị' }}
                render={({ field }) => (
                  <FISInputText
                    {...field}
                    required
                    textLabel='Tên đơn vị'
                    placeholder='Nhập tên đơn vị'
                    negative={!!errors.companyName}
                    message={errors.companyName?.message}
                  />
                )}
              />
              <Controller
                name='shortName'
                control={control}
                rules={{ required: 'Vui lòng nhập tên rút gọn' }}
                render={({ field }) => (
                  <FISInputText
                    {...field}
                    required
                    textLabel='Tên rút gọn'
                    placeholder='Nhập tên rút gọn'
                    negative={!!errors.shortName}
                    message={errors.shortName?.message}
                  />
                )}
              />
              <Controller
                name='taxCode'
                control={control}
                render={({ field }) => <FISInputText {...field} textLabel='Mã số thuế' placeholder='Nhập mã số thuế' />}
              />
            </>
          ) : (
            <>
              <Controller
                name='fullName'
                control={control}
                rules={{ required: 'Vui lòng nhập họ và tên' }}
                render={({ field }) => (
                  <FISInputText
                    {...field}
                    required
                    textLabel='Họ và tên'
                    placeholder='Nhập họ và tên'
                    negative={!!errors.fullName}
                    message={errors.fullName?.message}
                  />
                )}
              />
              <Controller
                name='idCardNumber'
                control={control}
                render={({ field }) => <FISInputText {...field} textLabel='CCCD/CMND' placeholder='Nhập CCCD/CMND' />}
              />
            </>
          )}

          <Controller
            name='address'
            control={control}
            render={({ field }) => <FISInputText {...field} textLabel='Địa chỉ' placeholder='Nhập địa chỉ' />}
          />
          <Controller
            name='paymentType'
            control={control}
            rules={{ required: 'Vui lòng chọn hình thức thanh toán' }}
            render={({ field }) => (
              <div className='md:col-span-2'>
                <FISRadioGroup {...field} direction='row' groupLabel='Thanh toán' options={[...PAYMENT_OPTIONS]} />
                {errors.paymentType && <p className='mt-1 text-sm text-red-500'>{errors.paymentType.message}</p>}
              </div>
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field }) => <FISInputText {...field} textLabel='Email' placeholder='Nhập email' />}
          />
          <Controller
            name='phone'
            control={control}
            rules={{
              pattern: {
                value: /^$|^(\+84|0)[0-9]{9,10}$/,
                message: 'Số điện thoại không đúng định dạng (VD: 0912345678 hoặc +84912345678)'
              }
            }}
            render={({ field }) => (
              <FISInputText
                {...field}
                textLabel='Số điện thoại'
                placeholder='Nhập số điện thoại'
                negative={!!errors.phone}
                message={errors.phone?.message}
              />
            )}
          />
        </div>
      </div>

      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          Ghi chú
        </FISText>
        <Controller
          name='note'
          control={control}
          render={({ field }) => <FISInputArea {...field} placeholder='Nhập ghi chú' maxLength={1000} />}
        />
      </div>

      <div className='sticky bottom-0 mt-12 pr-3 py-4 bg-[#EFF3FD] border-t border-gray-200 flex justify-end gap-2'>
        <FISButton type='button' variant='secondary' onClick={onCancel}>
          Huy
        </FISButton>
        <FISButton type='submit' variant='primary' disabled={isSubmitting}>
          {isSubmitting ? 'Dang xu ly...' : submitLabel}
        </FISButton>
      </div>
    </form>
  )
}

export default LogisticForm
