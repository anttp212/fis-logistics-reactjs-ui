import { Col, Row } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface RolesPermissionsFilterPropsI {
  control: Control<any>
}

const RolesPermissionsFilter = ({ control }: RolesPermissionsFilterPropsI) => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Tên vai trò' placeholder='Nhập tên vai trò' />}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='description'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Mô tả' placeholder='Nhập mô tả' />}
        />
      </Col>
    </Row>
  )
}

export default RolesPermissionsFilter
