import { useMemo } from 'react'
import { Col, Row } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputDate, FISSelect } from 'fis-component'
import { useGetVehicleTypesQuery, useGetDriversQuery } from '../vehicleDispatchMaster.api'


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

const STATUS_OPTIONS = [
  {
    items: [
      { label: 'Chờ xác nhận', value: 'PENDING_CONFIRMATION' },
      { label: 'Đang vận chuyển', value: 'IN_TRANSIT' },
      { label: 'Hoàn thành', value: 'COMPLETED' },
      { label: 'Sự cố', value: 'INCIDENT' },
      { label: 'Huỷ', value: 'CANCELLED' }
    ]
  }
]

interface VehicleDispatchFilterPropsI {
  control: Control<any>
}

const VehicleDispatchFilter = ({ control }: VehicleDispatchFilterPropsI) => {
  const { data: vehicleTypes = [] } = useGetVehicleTypesQuery()
  const { data: drivers = [] } = useGetDriversQuery()
  const vehicleTypeOptions = useMemo(() => toSelectOptions(vehicleTypes), [vehicleTypes])
  const driverOptions = useMemo(
    () => toSelectOptions(drivers.map((s) => ({ id: s.id, name: s.fullName + '-' + s.phone + '-' + s.vehiclePlateNo }))),
    [drivers]
  );
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
              multiDisplayText={ (count) => `${count} lựa chọn`}
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
              placeholder='dd/mm/yyyy'
              value={parseDateValue(field.value)}
              onChange={(date) => field.onChange(date ? date.toISOString() : '')}
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
              placeholder='dd/mm/yyyy'
              value={parseDateValue(field.value)}
              onChange={(date) => field.onChange(date ? date.toISOString() : '')}
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
