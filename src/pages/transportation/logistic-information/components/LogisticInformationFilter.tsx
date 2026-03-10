import { Col, Row } from 'antd'
import { Controller, type Control } from 'react-hook-form'
import { FISInputText, FISSelect } from 'fis-component'
import { CUSTOMER_TYPE_OPTIONS } from '../data'

const FILTER_TYPE_OPTIONS = [
  {
    items: [{ label: 'Tất cả', value: '' }, ...CUSTOMER_TYPE_OPTIONS[0].items]
  }
]

interface LogisticInformationFilterPropsI {
  control: Control<any>
}

const LogisticInformationFilter = ({ control }: LogisticInformationFilterPropsI) => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='customerType'
          control={control}
          render={({ field }) => (
            <FISSelect {...field} textLabel='Loại' placeholder='Chọn loại' options={FILTER_TYPE_OPTIONS} />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='taxCode'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Mã số thuế' placeholder='Nhập mã số thuế' />}
        />
      </Col>
    </Row>
  )
}

export default LogisticInformationFilter
