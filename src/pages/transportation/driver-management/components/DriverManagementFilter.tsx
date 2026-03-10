import { Col, Row } from 'antd'
import { Controller, type Control } from 'react-hook-form'
import { FISSelect } from 'fis-component'
import { STATUS_SELECT_OPTIONS } from '../data'

const FILTER_LOGISTICS_OPTIONS = [
  {
    items: [{ label: 'Tất cả', value: '' }]
  }
]

interface DriverManagementFilterPropsI {
  control: Control<any>
}

const DriverManagementFilter = ({ control }: DriverManagementFilterPropsI) => {
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
              options={FILTER_LOGISTICS_OPTIONS}
            />
          )}
        />
      </Col>
    </Row>
  )
}

export default DriverManagementFilter
