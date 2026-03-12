import { useMemo } from 'react'
import { Col, Row } from 'antd'
import { Controller, Control, useWatch, type UseFormSetValue } from 'react-hook-form'
import { FISInputDate, FISSelect } from 'fis-component'
import { useGetVehicleTypesQuery, useGetDriversQuery } from '../vehicleDispatchMaster.api'
import { STATUS_OPTIONS } from '../constants/status'
import dayjs from '@utils/dayjs'
import { parseDateValue, toBoundaryIsoString, toSelectOptions } from '@utils'

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
            <FISSelect
              {...field}
              textLabel='Tài xế'
              placeholder='Chọn tài xế'
              options={driverOptions}
              renderOption={(option: { [key: string]: any }) => (
                <div className='gap-2 text-sm cursor-pointer p-2 hover:bg-gray-100 rounded-[6px] text-[12px]'>
                  <span>Tên: {option.label}</span>
                  <div className='flex justify-between gap-[4px] text-[12px]'>
                    <span>SĐT: {option.phone}</span>
                    <span>Biển số xe: {option.vehiclePlateNo}</span>
                  </div>
                </div>
              )}
            />
          )}
        />
      </Col>
    </Row>
  )
}

export default VehicleDispatchFilter
