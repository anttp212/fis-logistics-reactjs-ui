import { Col, Row } from 'antd'
import { Select } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface DepartmentsFilterPropsI {
  control: Control<any>
  branchesList: { value: string; label: string }[]
}

const DepartmentsFilter = ({ control, branchesList }: DepartmentsFilterPropsI) => {
  const statusOptions = [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Không hoạt động' }
  ]

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <FISInputText {...field} textLabel='Tên phòng ban' placeholder='Nhập tên phòng ban' />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='code'
          control={control}
          render={({ field }) => (
            <FISInputText {...field} textLabel='Mã phòng ban' placeholder='Nhập mã phòng ban' />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='branch'
          control={control}
          render={({ field }) => (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Chi nhánh</label>
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder='Chọn chi nhánh'
                options={branchesList}
                className='w-full'
                allowClear
              />
            </div>
          )}
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

export default DepartmentsFilter
