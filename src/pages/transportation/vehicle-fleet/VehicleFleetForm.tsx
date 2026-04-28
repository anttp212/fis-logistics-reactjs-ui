import { useEffect, useMemo, useState } from 'react'
import { Controller, useForm, type Path } from 'react-hook-form'
import { FISButton, FISInputArea, FISInputDate, FISInputText, FISSelect, FISText } from 'fis-component'
import { STATUS_OPTIONS, VEHICLE_TYPE_OPTIONS, type FleetFormValuesI } from './data'
import { parseDateValue, toSelectOptions } from '@utils'
import { useGetLogisticListQuery } from '../logistic-information/logisticInformation.api'
import { UploadMinio } from '@components'
import type { AttachmentItemI } from '@components/Upload'

/**
 * Biển số xe Việt Nam — đồng bộ với mobile (`logistics-mobile/src/utils/validation.ts`):
 *   Ô tô/xe tải mới : 51F-123.45
 *   Ô tô/xe tải cũ  : 51F-12345
 *   Xe máy mới       : 29A1-111.22
 *   Xe máy cũ        : 29A1-12345
 */
const VIETNAM_PLATE_REGEX = /^[0-9]{2}[A-Z]\d?-(\d{3}\.\d{2}|\d{5})$/i
const PLATE_ERROR_MSG = 'Biển số xe không đúng định dạng (VD: 51F-123.45)'

interface VehicleFleetFormPropsI {
  defaultValues: FleetFormValuesI
  submitLabel: string
  onSubmit: (values: FleetFormValuesI, files: string[]) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  /** Danh sách đính kèm từ API (hiển thị trong upload); khi submit vẫn nhận string[] paths */
  defaultFileList?: AttachmentItemI[]
  /** Lỗi field-level từ server (response.data.errors): { fieldName: message } */
  serverErrors?: Record<string, string>
}

const VehicleFleetForm = ({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultFileList = [],
  serverErrors
}: VehicleFleetFormPropsI) => {
  const [attachments, setAttachments] = useState<string[]>(() => defaultFileList.map((f) => f.path))

  const {
    control,
    watch,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FleetFormValuesI>({
    defaultValues
  })

  useEffect(() => {
    if (!serverErrors) return
    Object.entries(serverErrors).forEach(([field, msg]) => {
      setError(field as Path<FleetFormValuesI>, { type: 'server', message: msg })
    })
  }, [serverErrors, setError])

  const vehicleType = watch('vehicleType')

  const { data: listResponse, isLoading: isLoadingLogistics } = useGetLogisticListQuery({
    page: 1,
    size: 1000
  })

  const logisticsOptions = useMemo(
    () =>
      toSelectOptions(
        listResponse?.data?.map((item) => ({ id: item.id, name: item.companyName || item.fullName || '' })) ?? []
      ),
    [listResponse]
  )
  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, attachments))} className='space-y-6'>
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          Thông tin xe
        </FISText>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Controller
            name='logisticsCustomerId'
            control={control}
            rules={{ required: 'Vui lòng chọn logistics' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                required
                textLabel='Logistics'
                placeholder='Chọn logistics'
                loading={isLoadingLogistics}
                options={logisticsOptions}
                negative={!!errors.logisticsCustomerId}
                message={errors.logisticsCustomerId?.message}
              />
            )}
          />

          <Controller
            name='vehicleType'
            control={control}
            rules={{ required: 'Vui lòng chọn loại xe' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                required
                textLabel='Loại xe'
                placeholder='Chọn loại xe'
                options={VEHICLE_TYPE_OPTIONS}
                negative={!!errors.vehicleType}
                message={errors.vehicleType?.message}
              />
            )}
          />

          <Controller
            name='licensePlate'
            control={control}
            rules={{
              required: 'Vui lòng nhập biển số',
              pattern: { value: VIETNAM_PLATE_REGEX, message: PLATE_ERROR_MSG }
            }}
            render={({ field }) => (
              <FISInputText
                {...field}
                required
                textLabel='Biển số'
                placeholder='VD: 51F-123.45'
                negative={!!errors.licensePlate}
                message={errors.licensePlate?.message}
              />
            )}
          />

          {vehicleType === 'TRAILER' && (
            <Controller
              name='secondaryLicensePlate'
              control={control}
              rules={{
                required: 'Vui lòng nhập biển số phụ',
                pattern: { value: VIETNAM_PLATE_REGEX, message: PLATE_ERROR_MSG }
              }}
              render={({ field }) => (
                <FISInputText
                  {...field}
                  required
                  textLabel='Biển số phụ'
                  placeholder='VD: 51F-123.45'
                  negative={!!errors.secondaryLicensePlate}
                  message={errors.secondaryLicensePlate?.message}
                />
              )}
            />
          )}

          <Controller
            name='payloadCapacity'
            control={control}
            rules={{ required: 'Vui lòng nhập tải trọng' }}
            render={({ field }) => (
              <FISInputText
                {...field}
                type='number'
                textLabel='Tải trọng (kg)'
                required={true}
                placeholder='Nhập tải trọng'
                negative={!!errors.payloadCapacity}
                message={errors.payloadCapacity?.message}
              />
            )}
          />

          <Controller
            name='weight'
            control={control}
            rules={{ required: 'Vui lòng nhập trọng lượng' }}
            render={({ field }) => (
              <FISInputText
                {...field}
                type='number'
                textLabel='Trọng lượng (kg)'
                required={true}
                placeholder='Nhập trọng lượng'
                negative={!!errors.weight}
                message={errors.weight?.message}
              />
            )}
          />

          <Controller
            name='inspectionExpiryDate'
            control={control}
            rules={{ required: 'Vui lòng chọn hạn đăng kiểm' }}
            render={({ field }) => (
              <FISInputDate
                required={true}
                textLabel='Hạn đăng kiểm'
                placeholder='Chọn ngày đăng kiểm'
                value={parseDateValue(field.value ?? '')}
                onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                picker='date'
                format='DD/MM/YYYY'
                negative={!!errors.inspectionExpiryDate}
                message={errors.inspectionExpiryDate?.message}
              />
            )}
          />

          <Controller
            name='status'
            control={control}
            render={({ field }) => (
              <FISSelect {...field} textLabel='Trạng thái' placeholder='Chọn trạng thái' options={STATUS_OPTIONS} />
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

      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          Đính kèm file
        </FISText>
        <UploadMinio
          value={attachments}
          acceptOnlyDocuments={true}
          onChange={(paths) => setAttachments(paths)}
          initialFileList={defaultFileList}
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

export default VehicleFleetForm
