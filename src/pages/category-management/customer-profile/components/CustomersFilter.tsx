import { Col, Row } from 'antd'
import { Select } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface CustomersFilterPropsI {
  control: Control<any>
}

const CustomersFilter = ({ control }: CustomersFilterPropsI) => {
  // Status options
  const statusOptions = [
    { value: 'active', label: 'Đang hợp tác' },
    { value: 'inactive', label: 'Ngừng hợp tác' },
    { value: 'archived', label: 'Đã lưu trữ' }
  ]

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <FISInputText {...field} textLabel='Tên khách hàng' placeholder='Nhập tên khách hàng' />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='customerCode'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Mã khách hàng' placeholder='Nhập mã khách hàng' />}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='taxCode'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Mã số thuế' placeholder='Nhập mã số thuế' />}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Trạng thái</label>
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder='Chọn trạng thái'
                options={statusOptions}
                className='w-full'
                allowClear
              />
            </div>
          )}
        />
      </Col>
    </Row>
  )
}

export default CustomersFilter
