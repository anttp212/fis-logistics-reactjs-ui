import { Col, Row } from 'antd'
import { Select } from 'antd'
import { Controller, Control } from 'react-hook-form'
import { FISInputText } from 'fis-component'

interface PartnersFilterPropsI {
  control: Control<any>
}

const PartnersFilter = ({ control }: PartnersFilterPropsI) => {
  // Partner type options
  const partnerTypeOptions = [
    { value: 'transport', label: 'Đối tác vận tải' },
    { value: 'subcontractor', label: 'Thầu phụ' }
  ]

  // Status options
  const statusOptions = [
    { value: 'active', label: 'Đang hợp tác' },
    { value: 'inactive', label: 'Ngừng hợp tác' },
    { value: 'locked', label: 'Đã khóa' }
  ]

  // Quality rating options
  const qualityRatingOptions = [
    { value: 'excellent', label: 'Xuất sắc' },
    { value: 'good', label: 'Tốt' },
    { value: 'average', label: 'Trung bình' },
    { value: 'poor', label: 'Kém' }
  ]

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Tên đối tác' placeholder='Nhập tên đối tác' />}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='partnerCode'
          control={control}
          render={({ field }) => <FISInputText {...field} textLabel='Mã đối tác' placeholder='Nhập mã đối tác' />}
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
          name='partnerType'
          control={control}
          render={({ field }) => (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Loại đối tác</label>
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder='Chọn loại đối tác'
                options={partnerTypeOptions}
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
      <Col span={24}>
        <Controller
          name='qualityRating'
          control={control}
          render={({ field }) => (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>Xếp hạng chất lượng</label>
              <Select
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                placeholder='Chọn xếp hạng'
                options={qualityRatingOptions}
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

export default PartnersFilter
