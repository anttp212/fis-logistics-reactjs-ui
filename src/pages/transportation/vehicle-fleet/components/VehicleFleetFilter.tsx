import { Col, Row } from 'antd'
import { Controller, useWatch, type Control } from 'react-hook-form'
import { FISInputDate, FISSelect } from 'fis-component'
import { STATUS_OPTIONS, VEHICLE_TYPE_OPTIONS } from '../data'
import { parseDateValue, toBoundaryIsoString } from '@utils'
import dayjs from '@utils/dayjs'
// import { useMemo } from 'react'
// import { useGetLogisticListQuery } from '@pages/transportation/logistic-information/logisticInformation.api'

const FILTER_STATUS_OPTIONS = [
  {
    items: [{ label: 'Tất cả', value: '' }, ...STATUS_OPTIONS[0].items]
  }
]

interface VehicleFleetFilterPropsI {
  control: Control<any>
}

const VehicleFleetFilter = ({ control }: VehicleFleetFilterPropsI) => {
  const dateFrom = useWatch({ control, name: 'createdDateFrom' }) as string
  const dateFromMin = dateFrom ? dayjs(parseDateValue(dateFrom) ?? undefined) : undefined

  const inspectionDateFrom = useWatch({ control, name: 'inspectionDateFrom' }) as string
  const inspectionDateFromMin = dateFrom ? dayjs(parseDateValue(inspectionDateFrom) ?? undefined) : undefined

  // const { data: listResponse, isLoading: isLoadingLogistics } = useGetLogisticListQuery({
  //   page: 1,
  //   size: 1000
  // })
  // const logisticsOptions = useMemo(
  //   () =>
  //     toSelectOptions(
  //       listResponse?.data?.map((item) => ({ id: item.id, name: item.companyName || item.fullName || '' })) ?? []
  //     ),
  //   [listResponse]
  // );

  return (
    <Row gutter={[12, 12]}>
      {/* <Col span={24}>
        <Controller
          name='logisticsId'
          control={control}
          render={({ field }) => (
            <FISSelect
              {...field}
              loading={isLoadingLogistics}
              textLabel='Logistics'
              placeholder='Chọn logistics'
              options={logisticsOptions}
            />
          )}
        />
      </Col> */}
      <Col span={24}>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <FISSelect
              {...field}
              textLabel='Trạng thái'
              placeholder='Chọn trạng thái'
              options={FILTER_STATUS_OPTIONS}
            />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='vehicleType'
          control={control}
          render={({ field }) => (
            <FISSelect {...field} textLabel='Loại xe' placeholder='Chọn loại xe' options={VEHICLE_TYPE_OPTIONS} />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='inspectionDateFrom'
          control={control}
          render={({ field }) => (
            <FISInputDate
              textLabel='Hạn đăng kiểm'
              placeholder='Chọn ngày'
              value={parseDateValue(field.value)}
              onChange={(date) => {
                field.onChange(date ? toBoundaryIsoString(date, 'start') : '')
              }}
              picker='date'
              format='DD/MM/YYYY'
            />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='inspectionDateTo'
          control={control}
          render={({ field }) => (
            <FISInputDate
              textLabel='Đến hạn đăng kiểm'
              placeholder='Chọn ngày'
              value={parseDateValue(field.value)}
              onChange={(date) => {
                field.onChange(date ? toBoundaryIsoString(date, 'start') : '')
              }}
              picker='date'
              minDate={inspectionDateFromMin}
              format='DD/MM/YYYY'
            />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='createdDateFrom'
          control={control}
          render={({ field }) => (
            <FISInputDate
              textLabel='Từ ngày tạo'
              placeholder='Chọn ngày'
              value={parseDateValue(field.value)}
              onChange={(date) => field.onChange(date ? toBoundaryIsoString(date, 'end') : '')}
              picker='date'
              format='DD/MM/YYYY'
            />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='createdDateTo'
          control={control}
          render={({ field }) => (
            <FISInputDate
              textLabel='Đến ngày tạo'
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
    </Row>
  )
}

export default VehicleFleetFilter
