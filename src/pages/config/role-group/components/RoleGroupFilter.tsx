import { Col, Row } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface RoleGroupFilterPropsI {
  control: Control<any>
}

const RoleGroupFilter = ({ control }: RoleGroupFilterPropsI) => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <FISInputText
              {...field}
              textLabel='Tên nhóm quyền'
              placeholder='Nhập tên nhóm quyền'
            />
          )}
        />
      </Col>
    </Row>
  )
}

export default RoleGroupFilter
