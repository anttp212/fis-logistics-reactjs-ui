import { Col, Row } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface UserFilterPropsI {
  control: Control<any>
}

const UserFilter = ({ control }: UserFilterPropsI) => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <FISInputText {...field} textLabel='Tên người dùng' placeholder='Nhập tên người dùng' />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='email'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Email' placeholder='Nhập email' />}
        />
      </Col>
    </Row>
  )
}

export default UserFilter
