import { useEffect, useMemo, useState } from 'react'
import { PlusOutlined } from '@ant-design/icons'
import { useForm, Controller, useFieldArray, useWatch } from 'react-hook-form'
import { message, Modal, Table, Checkbox } from 'antd'
import { FISButton, FISInputDate, FISInputText, FISIconButton, FISSelect, FISText, FISInputArea } from 'fis-component'
import { DeleteIcon } from '@images'
import dayjs from '@utils/dayjs'
import { parseDateValue, toSelectOptions } from '@utils'
import {
  useCreateVehicleDispatchMutation,
  useGetVehicleDispatchDetailQuery,
  useUpdateVehicleDispatchMutation,
  type CreateVehicleDispatchRequestI
} from '../vehicleDispatch.api'
import {
  useGetVehicleTypesQuery,
  useGetDriversQuery,
  useGetContainerSizesQuery,
  useGetLogisticListQuery,
  useGetProvincesQuery,
  useGetWardsQuery,
  type LogisticInformationI
} from '../vehicleDispatchMaster.api'

const DANALOG_ADDRESS = '97 Yết Kiêu, Phường Sơn Trà, Thành phố Đà Nẵng'

interface ContainerItemI {
  containerNumber: string
  size: string
  weight: string
  driver: string
}

interface CargoItemI {
  cargoType: string
  dimension: string
  weight: string
  driver: string
}

interface FormValuesI {
  vehicleType: string
  requestUnit: string
  isDanalogDeparture: boolean
  departureProvinceId: string
  departureWardId: string
  departureAddress: string
  destinationProvinceId: string
  destinationWardId: string
  destinationAddress: string
  recipientName: string
  recipientPhone: string
  expectedPickupTime: string
  expectedDeliveryTime: string
  content: string
  containers: ContainerItemI[]
  cargos: CargoItemI[]
  note: string
}

const defaultContainer: ContainerItemI = {
  containerNumber: '',
  size: '',
  weight: '',
  driver: ''
}

const defaultCargo: CargoItemI = {
  cargoType: '',
  dimension: '',
  weight: '',
  driver: ''
}

const defaultValues: FormValuesI = {
  vehicleType: '',
  requestUnit: '',
  isDanalogDeparture: false,
  departureProvinceId: '',
  departureWardId: '',
  departureAddress: '',
  destinationProvinceId: '',
  destinationWardId: '',
  destinationAddress: '',
  recipientName: '',
  recipientPhone: '',
  expectedPickupTime: '',
  expectedDeliveryTime: '',
  content: '',
  containers: [defaultContainer],
  cargos: [defaultCargo],
  note: ''
}

const isContainerVehicleType = (code?: string, name?: string) => {
  const c = (code || '').toUpperCase()
  const n = (name || '').toLowerCase()
  return c.includes('CONTAINER') || n.includes('container')
}

interface VehicleDispatchFormPropsI {
  mode: 'create' | 'edit'
  orderId?: string
  onSuccess?: () => void
  onCancel?: () => void
}

const VehicleDispatchForm = ({ mode, orderId, onSuccess, onCancel }: VehicleDispatchFormPropsI) => {
  const isEdit = mode === 'edit'

  const [createVehicleDispatch, { isLoading: isCreating }] = useCreateVehicleDispatchMutation()
  const [updateVehicleDispatch, { isLoading: isUpdating }] = useUpdateVehicleDispatchMutation()
  const isLoading = isCreating || isUpdating

  const { data: order, isLoading: isLoadingDetail } = useGetVehicleDispatchDetailQuery(orderId ?? '', {
    skip: !isEdit || !orderId
  })

  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorItems, setErrorItems] = useState<string[]>([])

  const { data: vehicleTypes = [] } = useGetVehicleTypesQuery()
  const { data: responseLogistics, isLoading: isLoadingLogistics } = useGetLogisticListQuery({
    page: 1,
    size: 1000
  })
  const { data: drivers = [] } = useGetDriversQuery()
  const { data: containerSizes = [] } = useGetContainerSizesQuery()
  const { data: provinces = [], isLoading: isLoadingProvinces } = useGetProvincesQuery()

  const filteredVehicleTypes = useMemo(
    () =>
      vehicleTypes.filter((vt) => {
        const code = (vt.code || '').toUpperCase()
        const name = (vt.name || '').toLowerCase()
        return (
          code.includes('CONTAINER') ||
          code.includes('TRANSPORT') ||
          name.includes('container') ||
          name.includes('vận tải')
        )
      }),
    [vehicleTypes]
  )

  const vehicleTypeOptions = useMemo(() => toSelectOptions(filteredVehicleTypes), [filteredVehicleTypes])

  const logisticsOptions = useMemo(
    () =>
      toSelectOptions(
        responseLogistics?.data?.map((item: LogisticInformationI) => ({
          id: item.id,
          name: item.companyName || item.fullName || ''
        })) ?? []
      ),
    [responseLogistics]
  )

  const driverOptions = useMemo(
    () =>
      toSelectOptions(
        drivers.map((s) => ({
          id: s.id,
          name: s.fullName || '',
          phone: s.phone || '',
          vehiclePlateNo: s.vehiclePlateNo || ''
        }))
      ),
    [drivers]
  )

  const provinceOptions = useMemo(() => toSelectOptions(provinces), [provinces])

  const containerSizeOptions = useMemo(
    () => toSelectOptions(containerSizes.map((s) => ({ id: s.id, name: s.name || s.code }))),
    [containerSizes]
  )

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormValuesI>({ defaultValues })

  const {
    fields: containerFields,
    append: appendContainer,
    remove: removeContainer
  } = useFieldArray({ control, name: 'containers' })

  const { fields: cargoFields, append: appendCargo, remove: removeCargo } = useFieldArray({ control, name: 'cargos' })

  const vehicleTypeId = useWatch({ control, name: 'vehicleType' })
  const isDanalog = useWatch({ control, name: 'isDanalogDeparture' })
  const departureProvinceId = useWatch({ control, name: 'departureProvinceId' })
  const destinationProvinceId = useWatch({ control, name: 'destinationProvinceId' })

  const selectedVehicleType = useMemo(
    () => vehicleTypes.find((v) => v.id === vehicleTypeId),
    [vehicleTypes, vehicleTypeId]
  )
  const isContainerSelected = useMemo(
    () => isContainerVehicleType(selectedVehicleType?.code, selectedVehicleType?.name),
    [selectedVehicleType]
  )

  const { data: departureWards = [] } = useGetWardsQuery(
    { provinceId: departureProvinceId },
    { skip: !departureProvinceId }
  )
  const { data: destinationWards = [] } = useGetWardsQuery(
    { provinceId: destinationProvinceId },
    { skip: !destinationProvinceId }
  )

  const departureWardOptions = useMemo(() => toSelectOptions(departureWards), [departureWards])
  const destinationWardOptions = useMemo(() => toSelectOptions(destinationWards), [destinationWards])

  // Hydrate form when editing
  useEffect(() => {
    if (!isEdit || !order) return
    reset({
      vehicleType: order.vehicleType ?? order.vehicleTypeId ?? '',
      requestUnit: order.requestUnit ?? order.logisticsCustomerId ?? '',
      isDanalogDeparture: !!order.isDanalogDeparture,
      departureProvinceId: order.departureProvinceId ?? '',
      departureWardId: order.departureWardId ?? '',
      departureAddress: order.departureAddress ?? '',
      destinationProvinceId: order.destinationProvinceId ?? '',
      destinationWardId: order.destinationWardId ?? '',
      destinationAddress: order.destinationAddress ?? '',
      recipientName: order.recipientName ?? '',
      recipientPhone: order.recipientPhone ?? '',
      expectedPickupTime: order.expectedPickupTime ?? order.estimatedPickupTime ?? '',
      expectedDeliveryTime: order.expectedDeliveryTime ?? order.estimatedDeliveryTime ?? '',
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
      cargos:
        (order.cargos?.length ?? 0) > 0
          ? order.cargos!.map((c) => ({
              cargoType: c.cargoType ?? '',
              dimension: c.dimension ?? '',
              weight: c.weight != null ? String(c.weight) : '',
              driver: c.driverId ?? ''
            }))
          : [defaultCargo],
      note: order.note ?? order.notes ?? ''
    })
  }, [order, isEdit, reset])

  const selectedPickupTime = watch('expectedPickupTime')
  const selectedPickupTimeMin = selectedPickupTime ? dayjs(parseDateValue(selectedPickupTime) ?? undefined) : undefined

  const toIsoDateTime = (dateStr: string) =>
    dateStr ? (dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00.000Z`) : ''

  const buildPayload = (data: FormValuesI): CreateVehicleDispatchRequestI => {
    const trimmedDepartureAddress = data.departureAddress.trim()
    const trimmedDestinationAddress = data.destinationAddress.trim()

    const departureProvinceName = provinces.find((p) => p.id === data.departureProvinceId)?.name ?? ''
    const departureWardName = departureWards.find((w) => w.id === data.departureWardId)?.name ?? ''
    const destinationProvinceName = provinces.find((p) => p.id === data.destinationProvinceId)?.name ?? ''
    const destinationWardName = destinationWards.find((w) => w.id === data.destinationWardId)?.name ?? ''

    const departureLocationName = data.isDanalogDeparture
      ? DANALOG_ADDRESS
      : [trimmedDepartureAddress, departureWardName, departureProvinceName].filter(Boolean).join(', ')
    const destinationLocationName = [trimmedDestinationAddress, destinationWardName, destinationProvinceName]
      .filter(Boolean)
      .join(', ')

    const payload: CreateVehicleDispatchRequestI = {
      vehicleTypeId: data.vehicleType,
      logisticsCustomerId: data.requestUnit,
      isDanalogDeparture: data.isDanalogDeparture,
      departureLocationName,
      destinationLocationName,
      destinationProvinceId: data.destinationProvinceId,
      destinationWardId: data.destinationWardId,
      destinationAddress: trimmedDestinationAddress,
      estimatedPickupTime: toIsoDateTime(data.expectedPickupTime),
      estimatedDeliveryTime: toIsoDateTime(data.expectedDeliveryTime),
      recipientName: data.recipientName.trim() || undefined,
      recipientPhone: data.recipientPhone.trim() || undefined,
      content: data.content || undefined,
      notes: data.note || undefined
    }

    if (!data.isDanalogDeparture) {
      payload.departureProvinceId = data.departureProvinceId
      payload.departureWardId = data.departureWardId
      payload.departureAddress = trimmedDepartureAddress
    }

    if (isContainerSelected) {
      payload.containers = data.containers
        .filter((c) => c.containerNumber.trim())
        .map((c) => ({
          containerNo: c.containerNumber.trim(),
          containerSizeId: c.size || undefined,
          containerWeight: c.weight ? Number(c.weight) : undefined,
          driverId: c.driver || undefined
        }))
    } else {
      payload.cargos = data.cargos.map((c) => ({
        cargoType: c.cargoType.trim(),
        dimension: c.dimension.trim(),
        weight: Number(c.weight),
        driverId: c.driver
      }))
    }

    return payload
  }

  const onSubmit = async (data: FormValuesI) => {
    try {
      const body = buildPayload(data)
      if (isEdit && orderId) {
        await updateVehicleDispatch({ id: orderId, body }).unwrap()
        message.success('Cập nhật yêu cầu điều xe thành công')
      } else {
        await createVehicleDispatch(body).unwrap()
        message.success('Tạo yêu cầu điều xe thành công')
      }
      onSuccess?.()
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'data' in err ? (err as { data?: { message?: string } })?.data?.message : null
      const fallback = isEdit
        ? 'Cập nhật thất bại. Vui lòng thử lại.'
        : 'Tạo yêu cầu điều xe thất bại. Vui lòng thử lại.'
      const msg = errorMessage || fallback
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

  if (isEdit && (isLoadingDetail || !order)) {
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
          Thông tin chung
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
                disabled={isEdit}
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
                options={logisticsOptions}
                negative={!!errors.requestUnit}
                message={errors.requestUnit?.message}
                loading={isLoadingLogistics}
              />
            )}
          />
        </div>

        {/* Điểm đi */}
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-3' className='mt-6 mb-3 block'>
          Điểm đi
        </FISText>
        <Controller
          name='isDanalogDeparture'
          control={control}
          render={({ field }) => (
            <Checkbox checked={!!field.value} onChange={(e) => field.onChange(e.target.checked)} className='mb-3'>
              Điểm đi là Danalog
            </Checkbox>
          )}
        />
        {isDanalog ? (
          <div className='rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700'>
            {DANALOG_ADDRESS}
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <Controller
                name='departureProvinceId'
                control={control}
                rules={{ validate: (v) => isDanalog || !!v || 'Vui lòng chọn tỉnh/thành phố' }}
                render={({ field }) => (
                  <FISSelect
                    {...field}
                    onChange={(val) => {
                      const next = String(val ?? '')
                      field.onChange(next)
                      if (next !== field.value) setValue('departureWardId', '')
                    }}
                    required
                    textLabel='Tỉnh/Thành phố'
                    placeholder='Chọn tỉnh/thành phố'
                    options={provinceOptions}
                    loading={isLoadingProvinces}
                    negative={!!errors.departureProvinceId}
                    message={errors.departureProvinceId?.message}
                  />
                )}
              />
              <Controller
                name='departureWardId'
                control={control}
                rules={{ validate: (v) => isDanalog || !!v || 'Vui lòng chọn phường/xã' }}
                render={({ field }) => (
                  <FISSelect
                    {...field}
                    required
                    textLabel='Phường/Xã'
                    placeholder='Chọn phường/xã'
                    options={departureWardOptions}
                    disabled={!departureProvinceId}
                    negative={!!errors.departureWardId}
                    message={errors.departureWardId?.message}
                  />
                )}
              />
            </div>
            <div className='mt-4'>
              <Controller
                name='departureAddress'
                control={control}
                rules={{
                  validate: (v) =>
                    isDanalog ||
                    (!!v.trim() && v.trim().length <= 1000) ||
                    'Vui lòng nhập địa chỉ điểm đi (tối đa 1000 ký tự)'
                }}
                render={({ field }) => (
                  <FISInputText
                    {...field}
                    required
                    textLabel='Địa chỉ'
                    placeholder='Nhập địa chỉ điểm đi'
                    maxLength={1000}
                    negative={!!errors.departureAddress}
                    message={errors.departureAddress?.message}
                  />
                )}
              />
            </div>
          </>
        )}

        {/* Điểm đến */}
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-3' className='mt-6 mb-3 block'>
          Điểm đến
        </FISText>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <Controller
            name='destinationProvinceId'
            control={control}
            rules={{ required: 'Vui lòng chọn tỉnh/thành phố' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                onChange={(val) => {
                  const next = String(val ?? '')
                  field.onChange(next)
                  if (next !== field.value) setValue('destinationWardId', '')
                }}
                required
                textLabel='Tỉnh/Thành phố'
                placeholder='Chọn tỉnh/thành phố'
                options={provinceOptions}
                loading={isLoadingProvinces}
                negative={!!errors.destinationProvinceId}
                message={errors.destinationProvinceId?.message}
              />
            )}
          />
          <Controller
            name='destinationWardId'
            control={control}
            rules={{ required: 'Vui lòng chọn phường/xã' }}
            render={({ field }) => (
              <FISSelect
                {...field}
                required
                textLabel='Phường/Xã'
                placeholder='Chọn phường/xã'
                options={destinationWardOptions}
                disabled={!destinationProvinceId}
                negative={!!errors.destinationWardId}
                message={errors.destinationWardId?.message}
              />
            )}
          />
        </div>
        <div className='mt-4'>
          <Controller
            name='destinationAddress'
            control={control}
            rules={{
              validate: (v) =>
                (!!v.trim() && v.trim().length <= 1000) || 'Vui lòng nhập địa chỉ điểm đến (tối đa 1000 ký tự)'
            }}
            render={({ field }) => (
              <FISInputText
                {...field}
                required
                textLabel='Địa chỉ'
                placeholder='Nhập địa chỉ điểm đến'
                maxLength={1000}
                negative={!!errors.destinationAddress}
                message={errors.destinationAddress?.message}
              />
            )}
          />
        </div>

        {/* Thời gian */}
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 mt-6'>
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
                showTime
                format='DD/MM/YYYY HH:mm'
                negative={!!errors.expectedPickupTime}
                message={errors.expectedPickupTime?.message}
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
                placeholder='Chọn ngày'
                value={parseDateValue(field.value)}
                onChange={(date) => field.onChange(date ? date.toISOString() : '')}
                minDate={selectedPickupTimeMin}
                picker='date'
                showTime
                format='DD/MM/YYYY HH:mm'
                negative={!!errors.expectedDeliveryTime}
                message={errors.expectedDeliveryTime?.message}
                required
              />
            )}
          />
        </div>
      </div>

      {/* 2. Thông tin hàng hóa */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          Thông tin hàng hóa
        </FISText>

        {!vehicleTypeId ? (
          <div className='text-sm text-gray-500'>Vui lòng chọn loại xe trước</div>
        ) : isContainerSelected ? (
          <div className='space-y-4'>
            {containerFields.map((field, index) => (
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
                      {...f}
                      required
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
                  render={({ field: f }) => (
                    <FISSelect
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
                  render={({ field: f }) => (
                    <FISInputText
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
                          required
                          textLabel='Tài xế'
                          placeholder='Chọn tài xế'
                          options={driverOptions}
                          negative={!!errors.containers?.[index]?.driver}
                          message={errors.containers?.[index]?.driver?.message}
                          renderOption={(option: { [key: string]: any }) => (
                            <div className='gap-2 text-sm cursor-pointer p-2 hover:bg-gray-100 rounded-[6px] text-[#505a5f]'>
                              <span>Tên: {option.label}</span>
                              <div className='flex justify-between gap-[4px]'>
                                <span>SĐT: {option.phone}</span>
                                <span>Biển số xe: {option.vehiclePlateNo}</span>
                              </div>
                            </div>
                          )}
                        />
                      )}
                    />
                  </div>
                  {containerFields.length > 1 && (
                    <FISIconButton
                      icon={<DeleteIcon />}
                      onClick={() => removeContainer(index)}
                      size='md'
                      variant='secondary-negative'
                    />
                  )}
                </div>
              </div>
            ))}
            <FISButton type='button' variant='secondary' onClick={() => appendContainer({ ...defaultContainer })}>
              <PlusOutlined />
              <span>Thêm container</span>
            </FISButton>
          </div>
        ) : (
          <div className='space-y-4'>
            {cargoFields.map((field, index) => (
              <div
                key={field.id}
                className='grid grid-cols-1 gap-4 p-4 rounded-lg border border-gray-100 bg-gray-50/50 md:grid-cols-2 lg:grid-cols-4'
              >
                <Controller
                  name={`cargos.${index}.cargoType`}
                  control={control}
                  rules={{
                    required: 'Loại hàng hóa là bắt buộc',
                    maxLength: { value: 1000, message: 'Tối đa 1000 ký tự' }
                  }}
                  render={({ field: f }) => (
                    <FISInputText
                      {...f}
                      required
                      textLabel='Loại hàng hóa'
                      placeholder='Nhập loại hàng hóa'
                      maxLength={1000}
                      negative={!!errors.cargos?.[index]?.cargoType}
                      message={errors.cargos?.[index]?.cargoType?.message}
                    />
                  )}
                />
                <Controller
                  name={`cargos.${index}.dimension`}
                  control={control}
                  rules={{
                    required: 'Kích thước là bắt buộc',
                    maxLength: { value: 1000, message: 'Tối đa 1000 ký tự' }
                  }}
                  render={({ field: f }) => (
                    <FISInputText
                      {...f}
                      required
                      textLabel='Kích thước'
                      placeholder='Nhập kích thước'
                      maxLength={1000}
                      negative={!!errors.cargos?.[index]?.dimension}
                      message={errors.cargos?.[index]?.dimension?.message}
                    />
                  )}
                />
                <Controller
                  name={`cargos.${index}.weight`}
                  control={control}
                  rules={{
                    required: 'Trọng lượng là bắt buộc',
                    validate: (v) => (Number(v) > 0 ? true : 'Trọng lượng phải lớn hơn 0')
                  }}
                  render={({ field: f }) => (
                    <FISInputText
                      {...f}
                      required
                      type='number'
                      textLabel='Trọng lượng (kg)'
                      placeholder='VD: 500'
                      negative={!!errors.cargos?.[index]?.weight}
                      message={errors.cargos?.[index]?.weight?.message}
                    />
                  )}
                />
                <div className='flex gap-2 items-end'>
                  <div className='flex-1 min-w-0'>
                    <Controller
                      name={`cargos.${index}.driver`}
                      control={control}
                      rules={{ required: 'Vui lòng chọn tài xế' }}
                      render={({ field: f }) => (
                        <FISSelect
                          {...f}
                          required
                          textLabel='Tài xế'
                          placeholder='Chọn tài xế'
                          options={driverOptions}
                          negative={!!errors.cargos?.[index]?.driver}
                          message={errors.cargos?.[index]?.driver?.message}
                          renderOption={(option: { [key: string]: any }) => (
                            <div className='gap-2 text-sm cursor-pointer p-2 hover:bg-gray-100 rounded-[6px] text-[#505a5f]'>
                              <span>Tên: {option.label}</span>
                              <div className='flex justify-between gap-[4px]'>
                                <span>SĐT: {option.phone}</span>
                                <span>Biển số xe: {option.vehiclePlateNo}</span>
                              </div>
                            </div>
                          )}
                        />
                      )}
                    />
                  </div>
                  {cargoFields.length > 1 && (
                    <FISIconButton
                      icon={<DeleteIcon />}
                      onClick={() => removeCargo(index)}
                      size='md'
                      variant='secondary-negative'
                    />
                  )}
                </div>
              </div>
            ))}
            <FISButton type='button' variant='secondary' onClick={() => appendCargo({ ...defaultCargo })}>
              <PlusOutlined />
              <span>Thêm hàng hóa</span>
            </FISButton>
          </div>
        )}
      </div>

      {/* 3. Thông tin người nhận */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          Thông tin người nhận
        </FISText>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
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
                value: /^(\+84|0)[0-9]{9,10}$/,
                message: 'Số điện thoại không đúng định dạng (VD: 0912345678 hoặc +84912345678)'
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
        </div>
      </div>

      {/* 4. Ghi chú */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <FISText color='sem/color/text/neutral/strong' variant='Emphasis/Emp-2' className='mb-4 block'>
          Ghi chú
        </FISText>
        <Controller
          name='note'
          control={control}
          render={({ field }) => (
            <FISInputArea {...field} textLabel='Ghi chú' placeholder='Nhập ghi chú' rows={4} maxLength={2000} />
          )}
        />
      </div>

      <div className='sticky bottom-0 mt-12 pr-3 py-4 bg-[#EFF3FD] border-t border-gray-200 flex justify-end gap-2'>
        <FISButton type='button' variant='secondary' onClick={onCancel}>
          Hủy
        </FISButton>
        <FISButton type='submit' variant='primary' disabled={isLoading}>
          {isLoading ? 'Đang xử lý...' : isEdit ? 'Cập nhật' : 'Tạo yêu cầu'}
        </FISButton>
      </div>

      <Modal
        title={isEdit ? 'Lỗi cập nhật yêu cầu điều xe' : 'Lỗi tạo yêu cầu điều xe'}
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

export default VehicleDispatchForm
