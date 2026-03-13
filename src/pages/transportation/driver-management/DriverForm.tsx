import { useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FISButton, FISInputArea, FISInputText, FISSelect, FISText } from 'fis-component'
import { UploadMinio, type AttachmentItemI } from '@components'
import { useGetLogisticListQuery } from '../logistic-information/logisticInformation.api'
import { useGetAvailableVehiclesQuery, useGetVehicleFleetDetailQuery } from '../vehicle-fleet/vehicleFleet.api'
import { useGetUserDetailQuery, useGetUserListQuery, type UserListItemI } from './driverManagement.api'
import { GENDER_OPTIONS, type DriverFormValuesI } from './data'

interface DriverFormPropsI {
  defaultValues: DriverFormValuesI
  submitLabel: string
  onSubmit: (values: DriverFormValuesI, files: string[]) => void | Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
  defaultFileList?: AttachmentItemI[]
  excludeDriverId?: string
}

const DriverForm = ({
  defaultValues,
  submitLabel,
  onSubmit,
  onCancel,
  isSubmitting = false,
  defaultFileList = [],
  excludeDriverId
}: DriverFormPropsI) => {
  const [attachments, setAttachments] = useState<string[]>(() => defaultFileList.map((file) => file.path))
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors }
  } = useForm<DriverFormValuesI>({
    defaultValues
  })

  const selectedLogisticsCustomerId = watch('logisticsCustomerId')
  const selectedUserId = watch('userId')
  const selectedVehicleId = watch('primaryVehicleId')
  const selectedTrailerVehicleId = watch('trailerVehicleId')
  const previousLogisticsCustomerIdRef = useRef(selectedLogisticsCustomerId)
  const { data: logisticsResponse, isLoading: isLoadingLogistics } = useGetLogisticListQuery({ page: 1, size: 1000 })
  const { data: users = [], isLoading: isLoadingUsers } = useGetUserListQuery({
    payload: { page: 0, size: 1000, search: '' }
  })
  const { data: selectedUserDetail } = useGetUserDetailQuery(selectedUserId, { skip: !selectedUserId })
  const { data: currentPrimaryVehicleDetail } = useGetVehicleFleetDetailQuery(selectedVehicleId, {
    skip: !selectedVehicleId
  })
  const { data: currentTrailerVehicleDetail } = useGetVehicleFleetDetailQuery(selectedTrailerVehicleId, {
    skip: !selectedTrailerVehicleId
  })

  const logisticsOptions = useMemo(
    () => [
      {
        items:
          logisticsResponse?.data?.map((item) => ({
            label: item.companyName || item.fullName || '-',
            value: item.id
          })) ?? []
      }
    ],
    [logisticsResponse]
  )

  const userOptions = useMemo(
    () => [
      {
        items: users.map((item) => ({
          label: item.fullName ? `${item.fullName} (${item.username})` : item.username,
          value: item.id
        }))
      }
    ],
    [users]
  )
  const { data: primaryVehicleResponse = [], isLoading: isLoadingPrimaryVehicles } = useGetAvailableVehiclesQuery(
    {
      logisticsCustomerId: selectedLogisticsCustomerId || undefined,
      excludeDriverId: excludeDriverId || undefined
    },
    { skip: !selectedLogisticsCustomerId }
  )

  const mergedPrimaryVehicles = useMemo(() => {
    if (!currentPrimaryVehicleDetail) return primaryVehicleResponse
    if (primaryVehicleResponse.some((item) => item.id === currentPrimaryVehicleDetail.id)) return primaryVehicleResponse
    return [currentPrimaryVehicleDetail, ...primaryVehicleResponse]
  }, [currentPrimaryVehicleDetail, primaryVehicleResponse])

  const selectedVehicle = useMemo(
    () => mergedPrimaryVehicles.find((item) => item.id === selectedVehicleId),
    [mergedPrimaryVehicles, selectedVehicleId]
  )
  const shouldShowTrailerVehicle = selectedVehicle?.vehicleType === 'TRACTOR'

  const { data: trailerVehicleResponse = [], isLoading: isLoadingTrailerVehicles } = useGetAvailableVehiclesQuery(
    {
      logisticsCustomerId: selectedLogisticsCustomerId || undefined,
      vehicleType: 'TRAILER',
      excludeDriverId: excludeDriverId || undefined
    },
    { skip: !selectedLogisticsCustomerId || !shouldShowTrailerVehicle }
  )

  const mergedTrailerVehicles = useMemo(() => {
    if (!currentTrailerVehicleDetail) return trailerVehicleResponse
    if (trailerVehicleResponse.some((item) => item.id === currentTrailerVehicleDetail.id)) return trailerVehicleResponse
    return [currentTrailerVehicleDetail, ...trailerVehicleResponse]
  }, [currentTrailerVehicleDetail, trailerVehicleResponse])

  const primaryVehicleOptions = useMemo(
    () => [
      {
        items: mergedPrimaryVehicles.map((item) => ({
          label: item.secondaryLicensePlate
            ? `${item.licensePlate} / ${item.secondaryLicensePlate}`
            : item.licensePlate,
          value: item.id,
          ...item
        }))
      }
    ],
    [mergedPrimaryVehicles]
  )
  const trailerVehicleOptions = useMemo(
    () => [
      {
        items: mergedTrailerVehicles.map((item) => ({
          label: item.secondaryLicensePlate
            ? `${item.licensePlate} / ${item.secondaryLicensePlate}`
            : item.licensePlate,
          value: item.id,
          ...item
        }))
      }
    ],
    [mergedTrailerVehicles]
  )

  useEffect(() => {
    if (!shouldShowTrailerVehicle) {
      setValue('trailerVehicleId', '')
    }
  }, [setValue, shouldShowTrailerVehicle])

  useEffect(() => {
    if (
      previousLogisticsCustomerIdRef.current &&
      previousLogisticsCustomerIdRef.current !== selectedLogisticsCustomerId
    ) {
      setValue('primaryVehicleId', '')
      setValue('trailerVehicleId', '')
    }
    previousLogisticsCustomerIdRef.current = selectedLogisticsCustomerId
  }, [selectedLogisticsCustomerId, setValue])

  useEffect(() => {
    const selectedFromList = users.find((item) => item.id === selectedUserId)
    const source: UserListItemI | undefined = selectedUserDetail ?? selectedFromList

    if (!source) return

    setValue('fullName', source.fullName ?? '')
    setValue('email', source.email ?? '')
    setValue('phone', source.phone ?? '')
  }, [selectedUserDetail, selectedUserId, setValue, users])

  return (
    <form onSubmit={handleSubmit((values) => onSubmit(values, attachments))} className='space-y-6'>
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          1. Thông tin tài xế
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
            name='userId'
            control={control}
            rules={{ required: 'Vui lòng chọn tài xế' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                required
                textLabel='Danh sách người dùng'
                placeholder='Chọn người dùng'
                loading={isLoadingUsers}
                options={userOptions}
                negative={!!errors.userId}
                message={errors.userId?.message}
              />
            )}
          />
          <Controller
            name='idCardNumber'
            control={control}
            rules={{ required: 'Vui lòng nhập CCCD/CMND' }}
            render={({ field }) => (
              <FISInputText
                {...field}
                required
                textLabel='CCCD/CMND'
                placeholder='Nhập CCCD/CMND'
                negative={!!errors.idCardNumber}
                message={errors.idCardNumber?.message}
              />
            )}
          />
          <Controller
            name='fullName'
            control={control}
            render={({ field }) => (
              <FISInputText {...field} textLabel='Tên cá nhân' placeholder='Tự động theo user' disabled />
            )}
          />
          <Controller
            name='phone'
            control={control}
            render={({ field }) => (
              <FISInputText {...field} textLabel='Số điện thoại' placeholder='Tự động theo user' disabled />
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <FISInputText {...field} textLabel='Email' placeholder='Tự động theo user' disabled />
            )}
          />
          <Controller
            name='primaryVehicleId'
            control={control}
            rules={{ required: 'Vui lòng chọn xe' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                required
                textLabel='Danh sách xe'
                placeholder='Chọn xe'
                loading={isLoadingPrimaryVehicles}
                options={primaryVehicleOptions}
                negative={!!errors.primaryVehicleId}
                message={errors.primaryVehicleId?.message}
                renderOption={(option: { [key: string]: any }) => (
                  <div className='gap-2 text-sm cursor-pointer p-2 hover:bg-gray-100 rounded-[6px] text-[12px]'>
                    <span>Biển số xe: {option.label}</span>
                    <div className='flex justify-between gap-[4px] text-[12px]'>
                      <span>Tải trọng tối đa: {option.payloadCapacity}</span>
                      <span>Loại xe: {option.vehicleType}</span>
                    </div>
                  </div>
                )}
              />
            )}
          />
          {shouldShowTrailerVehicle && (
            <Controller
              name='trailerVehicleId'
              control={control}
              render={({ field }) => (
                <FISSelect
                  {...field}
                  textLabel='Xe rơ moóc'
                  placeholder='Chọn xe rơ moóc'
                  loading={isLoadingTrailerVehicles}
                  options={trailerVehicleOptions}
                  renderOption={(option: { [key: string]: any }) => (
                    <div className='gap-2 text-sm cursor-pointer p-2 hover:bg-gray-100 rounded-[6px] text-[12px]'>
                      <span>Biển số xe: {option.label}</span>
                      <div className='flex justify-between gap-[4px] text-[12px]'>
                        <span>Tải trọng tối đa: {option.payloadCapacity}</span>
                        <span>Loại xe: {option.vehicleType}</span>
                      </div>
                    </div>
                  )}
                />
              )}
            />
          )}
          <Controller
            name='gender'
            control={control}
            render={({ field }) => (
              <FISSelect {...field} textLabel='Giới tính' placeholder='Chọn giới tính' options={GENDER_OPTIONS} />
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
          render={({ field }) => (
            <FISInputArea {...field} textLabel='Ghi chú' placeholder='Nhập ghi chú' maxLength={1000} />
          )}
        />
      </div>

      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          Tài liệu đính kèm
        </FISText>
        <UploadMinio
          value={attachments}
          onChange={setAttachments}
          initialFileList={defaultFileList}
          acceptOnlyDocuments
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
