import { Col, Row } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface WarehouseFilterPropsI {
  control: Control<any>
}

const WarehouseFilter = ({ control }: WarehouseFilterPropsI) => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Tên kho' placeholder='Nhập tên kho' />}
        />
      </Col>
    </Row>
  )
}

export default WarehouseFilter
