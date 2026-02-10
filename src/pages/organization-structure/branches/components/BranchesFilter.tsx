import { Col, Row } from 'antd'
import { Select } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface BranchesFilterPropsI {
  control: Control<any>
}

const BranchesFilter = ({ control }: BranchesFilterPropsI) => {
  // Status options
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
          render={({ field }) => <FISInputText {...field} textLabel='Tên chi nhánh' placeholder='Nhập tên chi nhánh' />}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='code'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Mã chi nhánh' placeholder='Nhập mã chi nhánh' />}
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

export default BranchesFilter
