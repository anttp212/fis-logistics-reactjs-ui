import { Col, Row } from 'antd'
import { Select } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface UsersFilterPropsI {
  control: Control<any>
  userGroupsList: { value: string; label: string }[]
  departmentsList: { value: string; label: string }[]
}

const UsersFilter = ({ control, userGroupsList, departmentsList }: UsersFilterPropsI) => {
  // Role options: Admin, Tài xế, Bảo vệ
  const roleOptions = [
    { value: 'Admin', label: 'Admin' },
    { value: 'Tài xế', label: 'Tài xế' },
    { value: 'Bảo vệ', label: 'Bảo vệ' }
  ]

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
          render={({ field }) => (
            <FISInputText {...field} textLabel='Tên người dùng' placeholder='Nhập tên người dùng' />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='userGroup'
          control={control}
          render={({ field }) => (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Nhóm người dùng</label>
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder='Chọn nhóm người dùng'
                options={userGroupsList}
                className='w-full'
                allowClear
              />
            </div>
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
          name='role'
          control={control}
          render={({ field }) => (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Vai trò</label>
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder='Chọn vai trò'
                options={roleOptions}
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

export default UsersFilter
