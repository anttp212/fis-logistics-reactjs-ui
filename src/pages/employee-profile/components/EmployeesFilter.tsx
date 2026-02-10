import { Col, Row } from 'antd'
import { Select } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface EmployeesFilterPropsI {
  control: Control<any>
  departmentsList: { value: string; label: string }[]
  skillGroupsList: { value: string; label: string }[]
}

const EmployeesFilter = ({ control, departmentsList, skillGroupsList }: EmployeesFilterPropsI) => {
  // Status options
  const statusOptions = [
    { value: 'active', label: 'Hoạt động' },
    { value: 'inactive', label: 'Đã nghỉ việc' }
  ]

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <FISInputText {...field} textLabel='Tên nhân viên' placeholder='Nhập tên nhân viên' />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='employeeCode'
          control={control}
          render={({ field }) => (
            <FISInputText {...field} textLabel='Mã nhân viên' placeholder='Nhập mã nhân viên' />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='department'
          control={control}
          render={({ field }) => (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Phòng ban</label>
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder='Chọn phòng ban'
                options={departmentsList}
                className='w-full'
                allowClear
              />
            </div>
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='skillGroup'
          control={control}
          render={({ field }) => (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Nhóm kỹ năng</label>
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder='Chọn nhóm kỹ năng'
                options={skillGroupsList}
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

export default EmployeesFilter
