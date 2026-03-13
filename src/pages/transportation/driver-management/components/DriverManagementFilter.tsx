import { Col, Row } from 'antd'
import { Controller, useWatch, type Control } from 'react-hook-form'
import { FISInputDate, FISSelect } from 'fis-component'
import { STATUS_SELECT_OPTIONS } from '../data'
import { parseDateValue, toBoundaryIsoString } from '@utils'
import dayjs from '@utils/dayjs'
import { useMemo } from 'react'
import { useGetLogisticListQuery } from '../../logistic-information/logisticInformation.api'
import { toSelectOptions } from '@utils'

const FILTER_LOGISTICS_OPTIONS = [
  {
    items: [{ label: 'Tất cả', value: '' }]
  }
]

interface DriverManagementFilterPropsI {
  control: Control<any>
}

const DriverManagementFilter = ({ control }: DriverManagementFilterPropsI) => {
  const createdDateFrom = useWatch({ control, name: 'createdDateFrom' }) as string
  const createdDateFromMin = createdDateFrom ? dayjs(parseDateValue(createdDateFrom) ?? undefined) : undefined
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
              options={STATUS_SELECT_OPTIONS}
            />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='logisticsId'
          control={control}
          render={({ field }) => (
            <FISSelect
              {...field}
              textLabel='Logistics'
              placeholder='Chọn logistics'
              loading={isLoadingLogistics}
              options={logisticsOptions.length ? logisticsOptions : FILTER_LOGISTICS_OPTIONS}
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
          name='createdDateTo'
          control={control}
          render={({ field }) => (
            <FISInputDate
              textLabel='Đến ngày tạo'
              placeholder='Chọn ngày'
              value={parseDateValue(field.value)}
              onChange={(date) => field.onChange(date ? toBoundaryIsoString(date, 'end') : '')}
              minDate={createdDateFromMin}
              picker='date'
              format='DD/MM/YYYY'
            />
          )}
        />
      </Col>
    </Row>
  )
}

export default DriverManagementFilter
