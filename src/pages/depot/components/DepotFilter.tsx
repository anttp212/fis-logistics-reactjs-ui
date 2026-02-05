import { Col, Row } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface DepotFilterPropsI {
  control: Control<any>
}

const DepotFilter = ({ control }: DepotFilterPropsI) => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Tên bãi depot' placeholder='Nhập tên bãi depot' />}
        />
      </Col>
    </Row>
  )
}

export default DepotFilter
