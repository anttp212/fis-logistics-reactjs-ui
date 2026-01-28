import { Col, Row } from 'antd'
import { Controller } from 'react-hook-form'
import { FISInputArea, FISInputText, FISSelect } from 'fis-component'
import { useCostGroupContext } from '..'

const STATUS_OPTIONS = {
  items: [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ]
}

const FILTER_FIELDS = {
  code: {
    label: 'Cost Group Code',
    placeholder: 'Enter Cost Group Code'
  },
  name: {
    label: 'Cost Group Name',
    placeholder: 'Enter Cost Group Name'
  },
  status: {
    label: 'Status',
    placeholder: 'Select Status'
  },
  remark: {
    label: 'Remark',
    placeholder: 'Enter Remark'
  }
} as const

const CostGroupFilter = () => {
  const { control } = useCostGroupContext()

  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='code'
          control={control}
          render={({ field }) => (
            <FISInputText
              {...field}
              textLabel={FILTER_FIELDS.code.label}
              placeholder={FILTER_FIELDS.code.placeholder}
            />
          )}
        />
      </Col>

      <Col span={24}>
        <Controller
          name='name'
          control={control}
          render={({ field }) => (
            <FISInputText
              {...field}
              textLabel={FILTER_FIELDS.name.label}
              placeholder={FILTER_FIELDS.name.placeholder}
            />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='status'
          control={control}
          render={({ field }) => (
            <FISSelect
              {...field}
              multi={false}
              value={field.value ?? ''}
              textLabel={FILTER_FIELDS.status.label}
              placeholder={FILTER_FIELDS.status.placeholder}
              options={[STATUS_OPTIONS]}
            />
          )}
        />
      </Col>

      <Col span={24}>
        <Controller
          name='remark'
          control={control}
          render={({ field }) => (
            <FISInputArea
              {...field}
              textLabel={FILTER_FIELDS.remark.label}
              placeholder={FILTER_FIELDS.remark.placeholder}
              rows={3}
            />
          )}
        />
      </Col>
    </Row>
  )
}

export default CostGroupFilter
