import { Col, Row } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface VehicleDispatchFilterPropsI {
  control: Control<any>
}

const VehicleDispatchFilter = ({ control }: VehicleDispatchFilterPropsI) => {
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='billBooking'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Bill/Booking' placeholder='Nhập Bill/Booking' />}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='owner'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Chủ hàng' placeholder='Nhập chủ hàng' />}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='opr'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='OPR' placeholder='Nhập OPR' />}
        />
      </Col>
    </Row>
  )
}

export default VehicleDispatchFilter
