import { Col, Row } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface UserGroupFilterPropsI {
  control: Control<any>
}

const UserGroupFilter = ({ control }: UserGroupFilterPropsI) => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <FISInputText {...field} textLabel='Tên nhóm' placeholder='Nhập tên nhóm người dùng' />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='description'
          control={control}
          render={({ field }) => (
            <FISInputText {...field} textLabel='Mô tả' placeholder='Nhập mô tả' />
          )}
        />
      </Col>
    </Row>
  )
}

export default UserGroupFilter
