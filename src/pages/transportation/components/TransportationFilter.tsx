import { Col, Row } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface TransportationFilterPropsI {
  control: Control<any>
}

const TransportationFilter = ({ control }: TransportationFilterPropsI) => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <FISInputText
              {...field}
              textLabel='Tên vận chuyển'
              placeholder='Nhập tên vận chuyển'
            />
          )}
        />
      </Col>
    </Row>
  )
}

export default TransportationFilter
