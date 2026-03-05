import { useEffect, useMemo, useState } from 'react'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Input, message, Modal, Table } from 'antd'
import { FISButton, FISInputDate, FISInputText, FISIconButton, FISSelect, FISText, FISInputArea } from 'fis-component'
import { DeleteIcon } from '@images'
import { useGetVehicleDispatchDetailQuery, useUpdateVehicleDispatchMutation } from '../vehicleDispatch.api'
import {
  useGetVehicleTypesQuery,
  useGetRequestingUnitsQuery,
  useGetLocationsQuery,
  useGetDriversQuery,
  useGetContainerSizesQuery
} from '../vehicleDispatchMaster.api'

const { TextArea } = Input

/** Chuyển mảng API sang format FISSelect options */
const toSelectOptions = <T extends { id: string; name: string; fullName?: string }>(
  items: T[] | undefined
): { items: { label: string; value: string }[] }[] => [
  { items: (items ?? []).map((item) => ({ label: item.name || item?.fullName || '', value: item.id })) }
]

interface ContainerItemI {
  containerNumber: string
  size: string
  weight: string
  driver: string
}

interface FormValuesI {
  vehicleType: string
  requestUnit: string
  origin: string
  destination: string
  recipientName: string
  recipientPhone: string
  expectedDeliveryTime: string
  expectedPickupTime: string
  content: string
  containers: ContainerItemI[]
  note: string
}

const defaultContainer: ContainerItemI = {
  containerNumber: '',
  size: '',
  weight: '',
  driver: ''
}

interface VehicleDispatchEditFormPropsI {
  orderId: string
  onSuccess?: () => void
  onCancel?: () => void
}

const VehicleDispatchEditForm = ({ orderId, onSuccess, onCancel }: VehicleDispatchEditFormPropsI) => {
  const [updateVehicleDispatch, { isLoading }] = useUpdateVehicleDispatchMutation()
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorItems, setErrorItems] = useState<string[]>([])
  const { data: order, isLoading: isLoadingDetail } = useGetVehicleDispatchDetailQuery(orderId, {
    skip: !orderId
  })

  const { data: vehicleTypes = [] } = useGetVehicleTypesQuery()
  const { data: requestingUnits = [] } = useGetRequestingUnitsQuery()
  const { data: locations = [] } = useGetLocationsQuery()
  const { data: drivers = [] } = useGetDriversQuery()
  const { data: containerSizes = [] } = useGetContainerSizesQuery()

  const vehicleTypeOptions = useMemo(() => toSelectOptions(vehicleTypes), [vehicleTypes])
  const requestingUnitOptions = useMemo(() => toSelectOptions(requestingUnits), [requestingUnits])
  const locationOptions = useMemo(() => toSelectOptions(locations), [locations])
  const driverOptions = useMemo(
    () =>
      toSelectOptions(drivers.map((s) => ({ id: s.id, name: s.fullName + '-' + s.phone + '-' + s.vehiclePlateNo }))),
    [drivers]
  )
  const containerSizeOptions = useMemo(
    () => toSelectOptions(containerSizes.map((s) => ({ id: s.id, name: s.name || s.code }))),
    [containerSizes]
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormValuesI>({
    defaultValues: {
      vehicleType: '',
      requestUnit: '',
      origin: '',
      destination: '',
      recipientName: '',
      recipientPhone: '',
      expectedDeliveryTime: '',
      expectedPickupTime: '',
      content: '',
      containers: [defaultContainer],
      note: ''
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'containers'
  })

  /** Lấy full ISO string từ API (giữ nguyên time để tránh lỗi timezone) */
  const fromIsoDateTime = (iso?: string) => iso ?? ''

  /** Parse string sang Date: full ISO dùng new Date(), YYYY-MM-DD dùng local để tránh lệch timezone */
  const parseDateValue = (val: string): Date | null => {
    if (!val) return null
    if (val.includes('T')) return new Date(val)
    const parts = val.split('-').map(Number)
    if (parts.length !== 3) return new Date(val)
    return new Date(parts[0], parts[1] - 1, parts[2])
  }

  useEffect(() => {
    if (order) {
      reset({
        vehicleType: order.vehicleType ?? order.vehicleTypeId ?? '',
        requestUnit: order.requestUnit ?? order.requestingUnitId ?? '',
        origin: order.origin ?? order.departureLocationId ?? '',
        destination: order.destination ?? order.destinationLocationId ?? '',
        recipientName: order.recipientName ?? '',
        recipientPhone: order.recipientPhone ?? '',
        expectedPickupTime: fromIsoDateTime(order.expectedPickupTime ?? order.estimatedPickupTime),
        expectedDeliveryTime: fromIsoDateTime(order.expectedDeliveryTime ?? order.estimatedDeliveryTime),
        content: order.content ?? '',
        containers:
          (order.containers?.length ?? 0) > 0
            ? order.containers!.map((c) => ({
                containerNumber: c.containerNumber ?? c.containerNo ?? '',
                size: c.size ?? c.containerSizeId ?? '',
                weight: String(c.weight ?? c.containerWeight ?? ''),
                driver: c.driver ?? c.driverId ?? ''
              }))
            : [defaultContainer],
        note: order.note ?? order.notes ?? ''
      })
    }
  }, [order, reset])

  /** Chuyển sang ISO: nếu đã có 'T' (full ISO) thì giữ nguyên, else thêm T00:00:00.000Z */
  const toIsoDateTime = (dateStr: string) =>
    dateStr ? (dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00.000Z`) : ''

  const onSubmit = async (data: FormValuesI) => {
    try {
      await updateVehicleDispatch({
        id: orderId,
        body: {
          vehicleTypeId: data.vehicleType,
          requestingUnitId: data.requestUnit,
          departureLocationId: data.origin,
          destinationLocationId: data.destination,
          estimatedPickupTime: toIsoDateTime(data.expectedPickupTime),
          estimatedDeliveryTime: toIsoDateTime(data.expectedDeliveryTime),
          recipientName: data.recipientName || undefined,
          recipientPhone: data.recipientPhone || undefined,
          content: data.content || undefined,
          notes: data.note || undefined,
          containers: data.containers.map((c) => ({
            containerNo: c.containerNumber,
            containerSizeId: c.size,
            containerWeight: Number(c.weight) || 0,
            driverId: c.driver || undefined
          }))
        }
      }).unwrap()
      message.success('Cập nhật yêu cầu điều xe thành công')
      onSuccess?.()
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'data' in err ? (err as { data?: { message?: string } })?.data?.message : null
      const msg = errorMessage || 'Cập nhật thất bại. Vui lòng thử lại.'
      const items = msg
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean)
      if (items.length > 1) {
        setErrorItems(items)
        setErrorModalOpen(true)
      } else {
        message.error(msg)
      }
    }
  }

  const handleAddContainer = () => {
    append({ ...defaultContainer })
  }

  if (isLoadingDetail || !order) {
    return (
      <div className='flex justify-center py-12'>
        <div className='text-gray-500'>Đang tải...</div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* 1. Thông tin chung */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          1. Thông tin chung
        </FISText>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Controller
            name='vehicleType'
            control={control}
            rules={{ required: 'Vui lòng chọn loại xe' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                textLabel='Loại xe'
                placeholder='Chọn loại xe'
                options={vehicleTypeOptions}
                negative={!!errors.vehicleType}
                message={errors.vehicleType?.message}
                disabled={true}
              />
            )}
          />
          <Controller
            name='requestUnit'
            control={control}
            rules={{ required: 'Vui lòng chọn đơn vị yêu cầu' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                textLabel='Đơn vị yêu cầu'
                placeholder='Chọn đơn vị'
                options={requestingUnitOptions}
                negative={!!errors.requestUnit}
                message={errors.requestUnit?.message}
              />
            )}
          />
          <Controller
            name='origin'
            control={control}
            rules={{ required: 'Vui lòng chọn điểm đi' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                textLabel='Điểm đi'
                placeholder='Chọn điểm đi'
                options={locationOptions}
                negative={!!errors.origin}
                message={errors.origin?.message}
              />
            )}
          />
          <Controller
            name='destination'
            control={control}
            rules={{ required: 'Vui lòng chọn điểm đến' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                textLabel='Điểm đến'
                placeholder='Chọn điểm đến'
                options={locationOptions}
                negative={!!errors.destination}
                message={errors.destination?.message}
              />
            )}
          />
          <Controller
            name='recipientName'
            control={control}
            rules={{ required: 'Vui lòng nhập tên người nhận' }}
            render={({ field }) => (
              <FISInputText
                {...field}
                required
                textLabel='Tên người nhận'
                placeholder='Nhập tên người nhận'
                negative={!!errors.recipientName}
                message={errors.recipientName?.message}
              />
            )}
          />
          <Controller
            name='recipientPhone'
            control={control}
            rules={{
              required: 'Vui lòng nhập số điện thoại người nhận',
              pattern: {
                value: /^$|^(\+84|0)[0-9]{9,10}$/,
                message: 'Số điện thoại người nhận không đúng định dạng (VD: 0912345678 hoặc +84912345678)'
              }
            }}
            render={({ field }) => (
              <FISInputText
                {...field}
                required
                textLabel='Số điện thoại'
                placeholder='Nhập số điện thoại người nhận'
                negative={!!errors.recipientPhone}
                message={errors.recipientPhone?.message}
              />
            )}
          />
          <Controller
            name='expectedPickupTime'
            control={control}
            rules={{ required: 'Vui lòng chọn thời gian dự kiến nhận hàng' }}
            render={({ field }) => (
              <FISInputDate
                textLabel='Thời gian dự kiến nhận hàng (ở điểm đi)'
                placeholder='dd/mm/yyyy'
                value={parseDateValue(field.value)}
                onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                picker='date'
                format='DD/MM/YYYY HH:mm'
                negative={!!errors.expectedPickupTime}
                message={errors.expectedPickupTime?.message}
                showTime
                required
              />
            )}
          />
          <Controller
            name='expectedDeliveryTime'
            control={control}
            rules={{ required: 'Vui lòng chọn thời gian dự kiến giao hàng' }}
            render={({ field }) => (
              <FISInputDate
                textLabel='Thời gian dự kiến giao hàng (ở điểm đến)'
                placeholder='dd/mm/yyyy'
                value={parseDateValue(field.value)}
                onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                picker='date'
                format='DD/MM/YYYY HH:mm'
                negative={!!errors.expectedDeliveryTime}
                message={errors.expectedDeliveryTime?.message}
                showTime
                required
              />
            )}
          />
          <Controller
            name='content'
            control={control}
            render={({ field }) => (
              <FISInputArea
                {...field}
                rows={4}
                textLabel='Nội dung'
                placeholder='Nhập nội dung'
                className='md:col-span-2'
                maxLength={1000}
              />
            )}
          />
        </div>
      </div>

      {/* 2. Thông tin chi tiết container */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          2. Thông tin chi tiết container
        </FISText>
        <div className='space-y-4'>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className='grid grid-cols-1 gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50 md:grid-cols-2 lg:grid-cols-4'
            >
              <Controller
                name={`containers.${index}.containerNumber`}
                control={control}
                rules={{
                  required: 'Số container là bắt buộc',
                  pattern: {
                    value: /^[A-Z]{4}[0-9]{7}$/,
                    message: 'Số container không hợp lệ (4 chữ in hoa + 7 số, ví dụ: ABCD1234567)'
                  }
                }}
                render={({ field: f }) => (
                  <FISInputText
                    required
                    {...f}
                    textLabel='Số container'
                    placeholder='Nhập số container'
                    negative={!!errors.containers?.[index]?.containerNumber}
                    message={errors.containers?.[index]?.containerNumber?.message}
                  />
                )}
              />
              <Controller
                name={`containers.${index}.size`}
                control={control}
                rules={{ required: 'Vui lòng chọn kích thước' }}
                render={({ field: f }) => (
                  <FISSelect
                    required
                    {...f}
                    textLabel='Kích thước'
                    placeholder='Chọn kích thước'
                    options={containerSizeOptions}
                    negative={!!errors.containers?.[index]?.size}
                    message={errors.containers?.[index]?.size?.message}
                  />
                )}
              />
              <Controller
                name={`containers.${index}.weight`}
                control={control}
                rules={{ required: 'Trọng lượng là bắt buộc' }}
                render={({ field: f }) => (
                  <FISInputText
                    required
                    {...f}
                    type='number'
                    textLabel='Trọng lượng'
                    placeholder='Nhập trọng lượng'
                    negative={!!errors.containers?.[index]?.weight}
                    message={errors.containers?.[index]?.weight?.message}
                  />
                )}
              />
              <div className='flex gap-2 items-end'>
                <div className='flex-1 min-w-0'>
                  <Controller
                    name={`containers.${index}.driver`}
                    control={control}
                    rules={{ required: 'Vui lòng chọn tài xế' }}
                    render={({ field: f }) => (
                      <FISSelect
                        {...f}
                        textLabel='Tài xế'
                        required
                        placeholder='Chọn tài xế'
                        negative={!!errors.containers?.[index]?.driver}
                        message={errors.containers?.[index]?.driver?.message}
                        options={driverOptions}
                        disabled={true}
                      />
                    )}
                  />
                </div>
                {fields.length > 1 && (
                  <FISIconButton
                    icon={<DeleteIcon />}
                    onClick={() => remove(index)}
                    size='md'
                    variant='secondary-negative'
                  />
                )}
              </div>
            </div>
          ))}
          <FISButton type='button' variant='secondary' onClick={handleAddContainer}>
            Thêm container
          </FISButton>
        </div>
      </div>

      {/* 3. Ghi chú */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          3. Ghi chú
        </FISText>
        <Controller
          name='note'
          control={control}
          render={({ field }) => (
            <div>
              <TextArea {...field} placeholder='Nhập ghi chú' rows={4} className='w-full' />
            </div>
          )}
        />
      </div>

      <div className='sticky bottom-0 mt-12 pr-3 py-4 bg-[#EFF3FD] border-t border-gray-200 flex justify-end gap-2'>
        <FISButton type='button' variant='secondary' onClick={onCancel}>
          Hủy
        </FISButton>
        <FISButton type='submit' variant='primary' disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : 'Cập nhật'}
        </FISButton>
      </div>

      <Modal
        title='Lỗi cập nhật yêu cầu điều xe'
        open={errorModalOpen}
        onCancel={() => setErrorModalOpen(false)}
        footer={[
          <FISButton key='close' variant='secondary' onClick={() => setErrorModalOpen(false)}>
            Đóng
          </FISButton>
        ]}
        centered
        width={600}
      >
        <Table
          dataSource={errorItems.map((content, idx) => ({ key: idx, stt: idx + 1, content }))}
          columns={[
            { title: 'STT', dataIndex: 'stt', width: 60, align: 'center' as const },
            { title: 'Nội dung lỗi', dataIndex: 'content' }
          ]}
          pagination={false}
          size='small'
          className='mt-4'
        />
      </Modal>
    </form>
  )
}

export default VehicleDispatchEditForm
