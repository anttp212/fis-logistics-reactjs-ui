import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller, useFieldArray } from 'react-hook-form'
import { Input, message, Modal, Table } from 'antd'
import { PageWrapper } from '@components'
import { FISButton, FISInputDate, FISInputText, FISIconButton, FISSelect, FISText, FISInputArea } from 'fis-component'
import { ROUTES } from '@constants'
import { DeleteIcon } from '@images'
import { useCreateVehicleDispatchMutation } from '../vehicleDispatch.api'
import {
  useGetVehicleTypesQuery,
  useGetRequestingUnitsQuery,
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

const VehicleDispatchCreatePage = () => {
  const navigate = useNavigate()
  const [createVehicleDispatch, { isLoading }] = useCreateVehicleDispatchMutation()
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorItems, setErrorItems] = useState<string[]>([])

  const { data: vehicleTypes = [] } = useGetVehicleTypesQuery()
  const { data: requestingUnits = [] } = useGetRequestingUnitsQuery()
  const { data: drivers = [] } = useGetDriversQuery()
  const { data: containerSizes = [] } = useGetContainerSizesQuery()

  const vehicleTypeOptions = useMemo(() => toSelectOptions(vehicleTypes), [vehicleTypes])
  const requestingUnitOptions = useMemo(() => toSelectOptions(requestingUnits), [requestingUnits])
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
    setValue,
    watch,
    formState: { errors }
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

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Điều xe', onClick: () => navigate(ROUTES.transportationVehicleDispatch) },
    { label: 'Thêm mới yêu cầu điều xe' }
  ]

  /** Parse string sang Date: full ISO dùng new Date(), YYYY-MM-DD dùng local để tránh lệch timezone */
  const parseDateValue = (val: string): Date | null => {
    if (!val) return null
    if (val.includes('T')) return new Date(val)
    const parts = val.split('-').map(Number)
    if (parts.length !== 3) return new Date(val)
    return new Date(parts[0], parts[1] - 1, parts[2])
  }

  /** Chuyển sang ISO: nếu đã có 'T' (full ISO) thì giữ nguyên, else thêm T00:00:00.000Z */
  const toIsoDateTime = (dateStr: string) =>
    dateStr ? (dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00.000Z`) : ''
  const selectedPickupTime = watch('expectedPickupTime')
  const selectedPickupTimeMin = selectedPickupTime ? dayjs(parseDateValue(selectedPickupTime) ?? undefined) : undefined

  const onSubmit = async (data: FormValuesI) => {
    try {
      await createVehicleDispatch({
        vehicleTypeId: data.vehicleType,
        requestingUnitId: data.requestUnit,
        departureLocationName: data.origin,
        destinationLocationName: data.destination,
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
      }).unwrap()
      message.success('Tạo yêu cầu điều xe thành công')
      navigate(ROUTES.transportationVehicleDispatch)
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'data' in err ? (err as { data?: { message?: string } })?.data?.message : null
      const msg = errorMessage || 'Tạo yêu cầu điều xe thất bại. Vui lòng thử lại.'
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

  return (
    <PageWrapper
      className='overflow-y-auto mt-6 '
      title='Thêm mới yêu cầu điều xe'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationVehicleDispatch)}
      hasBackButton
    >
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
                  required
                  textLabel='Loại xe'
                  placeholder='Chọn loại xe'
                  options={vehicleTypeOptions}
                  negative={!!errors.vehicleType}
                  message={errors.vehicleType?.message}
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
                  required
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
              rules={{ required: 'Vui lòng nhập điểm đi' }}
              render={({ field }) => (
                <FISInputText
                  {...field}
                  required
                  textLabel='Điểm đi'
                  placeholder='Nhập điểm đi'
                  negative={!!errors.origin}
                  message={errors.origin?.message}
                />
              )}
            />
            <Controller
              name='destination'
              control={control}
              rules={{ required: 'Vui lòng nhập điểm đến' }}
              render={({ field }) => (
                <FISInputText
                  {...field}
                  required
                  textLabel='Điểm đến'
                  placeholder='Nhập điểm đến'
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
                  required
                  {...field}
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
                  placeholder='Chọn ngày'
                  value={parseDateValue(field.value)}
                  onChange={(date) => {
                    field.onChange(date ? date.toISOString() : '')
                    setValue('expectedDeliveryTime', '')
                  }}
                  picker='date'
                  format='DD/MM/YYYY HH:mm'
                  negative={!!errors.expectedPickupTime}
                  message={errors.expectedPickupTime?.message}
                  required
                  showTime
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
                  placeholder='Chọn ngày'
                  value={parseDateValue(field.value)}
                  onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                  minDate={selectedPickupTimeMin}
                  picker='date'
                  format='DD/MM/YYYY HH:mm'
                  negative={!!errors.expectedDeliveryTime}
                  message={errors.expectedDeliveryTime?.message}
                  required
                  showTime
                />
              )}
            />
            <Controller
              name='content'
              control={control}
              render={({ field }) => (
                <FISInputArea
                  {...field}
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
                    // required: 'Số container là bắt buộc',
                    pattern: {
                      value: /^[A-Z]{4}[0-9]{7}$/,
                      message: 'Số container không hợp lệ (4 chữ in hoa + 7 số, ví dụ: ABCD1234567)'
                    }
                  }}
                  render={({ field: f }) => (
                    <FISInputText
                      {...f}
                      textLabel='Số container'
                      placeholder='Nhập số container'
                      negative={!!errors.containers?.[index]?.containerNumber}
                      message={errors.containers?.[index]?.containerNumber?.message}
                      // required
                    />
                  )}
                />
                <Controller
                  name={`containers.${index}.size`}
                  control={control}
                  // rules={{ required: 'Vui lòng chọn kích thước' }}
                  render={({ field: f }) => (
                    <FISSelect
                      {...f}
                      // required
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
                  // rules={{ required: 'Trọng lượng là bắt buộc' }}
                  render={({ field: f }) => (
                    <FISInputText
                      {...f}
                      // required
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
                          placeholder='Chọn tài xế'
                          options={driverOptions}
                          negative={!!errors.containers?.[index]?.driver}
                          message={errors.containers?.[index]?.driver?.message}
                          required
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
          <FISButton type='button' variant='secondary' onClick={() => navigate(ROUTES.transportationVehicleDispatch)}>
            Hủy
          </FISButton>
          <FISButton type='submit' variant='primary' disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Tạo yêu cầu'}
          </FISButton>
        </div>
      </form>

      <Modal
        title='Lỗi tạo yêu cầu điều xe'
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
    </PageWrapper>
  )
}

export default VehicleDispatchCreatePage
