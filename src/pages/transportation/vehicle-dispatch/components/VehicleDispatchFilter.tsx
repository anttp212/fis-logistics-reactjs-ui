import { useMemo } from 'react'
import { Col, Row } from 'antd'
import { Controller, Control, useWatch, type UseFormSetValue } from 'react-hook-form'
import { FISInputDate, FISSelect } from 'fis-component'
import { useGetVehicleTypesQuery, useGetDriversQuery } from '../vehicleDispatchMaster.api'
import { STATUS_OPTIONS } from '../constants/status'
import dayjs from '@utils/dayjs'

const toSelectOptions = (items: { id: string; name: string }[] | undefined, allLabel = 'Tất cả') => [
  { items: [{ label: allLabel, value: '' }, ...(items ?? []).map((item) => ({ label: item.name, value: item.id }))] }
]

/** Parse string sang Date: full ISO dùng new Date(), YYYY-MM-DD dùng local để tránh lệch timezone */
const parseDateValue = (val: string): Date | null => {
  if (!val) return null
  if (val.includes('T')) return new Date(val)
  const parts = val.split('-').map(Number)
  if (parts.length !== 3) return new Date(val)
  return new Date(parts[0], parts[1] - 1, parts[2])
}

const toBoundaryIsoString = (date: Date, boundary: 'start' | 'end') => {
  const nextDate = new Date(date)
  if (boundary === 'start') {
    nextDate.setHours(0, 0, 0, 0)
  } else {
    nextDate.setHours(23, 59, 59, 999)
  }
  return nextDate.toISOString()
}

interface VehicleDispatchFilterPropsI {
  control: Control<any>
  setValue: UseFormSetValue<any>
}

const VehicleDispatchFilter = ({ control, setValue }: VehicleDispatchFilterPropsI) => {
  const { data: vehicleTypes = [] } = useGetVehicleTypesQuery()
  const { data: drivers = [] } = useGetDriversQuery()
  const vehicleTypeOptions = useMemo(() => toSelectOptions(vehicleTypes), [vehicleTypes])
  const driverOptions = useMemo(
    () =>
      toSelectOptions(drivers.map((s) => ({ id: s.id, name: s.fullName + '-' + s.phone + '-' + s.vehiclePlateNo }))),
    [drivers]
  )
  const dateFrom = useWatch({ control, name: 'dateFrom' }) as string
  const dateFromMin = dateFrom ? dayjs(parseDateValue(dateFrom) ?? undefined) : undefined
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <FISSelect
              {...field}
              textLabel='Trạng thái'
              placeholder='Chọn trạng thái'
              options={STATUS_OPTIONS}
              removeSelectedText='Xóa lựa chọn'
              multiDisplayText={(count) => `${count} lựa chọn`}
              selectedGroupLabel='Đã chọn'
              multi
            />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='vehicleTypeId'
          control={control}
          render={({ field }) => (
            <FISSelect {...field} textLabel='Loại xe' placeholder='Chọn loại xe' options={vehicleTypeOptions} />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='dateFrom'
          control={control}
          render={({ field }) => (
            <FISInputDate
              textLabel='Từ ngày điều xe'
              placeholder='Chọn ngày'
              value={parseDateValue(field.value)}
              onChange={(date) => {
                field.onChange(date ? toBoundaryIsoString(date, 'start') : '')
                setValue('dateTo', '')
              }}
              picker='date'
              format='DD/MM/YYYY'
            />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='dateTo'
          control={control}
          render={({ field }) => (
            <FISInputDate
              textLabel='Đến ngày điều xe'
              placeholder='Chọn ngày'
              value={parseDateValue(field.value)}
              onChange={(date) => field.onChange(date ? toBoundaryIsoString(date, 'end') : '')}
              minDate={dateFromMin}
              picker='date'
              format='DD/MM/YYYY'
            />
          )}
        />
      </Col>
      {/* <Col span={24}>
        <Controller
          name='depotCode'
          control={control}
          render={({ field }) => (
            <FISInputText {...field} textLabel='Mã kho' placeholder='Nhập mã kho' />
          )}
        />
      </Col> */}
      <Col span={24}>
        <Controller
          name='driverId'
          control={control}
          render={({ field }) => (
            <FISSelect {...field} textLabel='Tài xế' placeholder='Chọn tài xế' options={driverOptions} />
          )}
        />
      </Col>
    </Row>
  )
}

export default VehicleDispatchFilter
