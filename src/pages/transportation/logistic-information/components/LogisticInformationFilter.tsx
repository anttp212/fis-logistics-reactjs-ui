import { Col, Row } from 'antd'
import { Controller, useWatch, type Control } from 'react-hook-form'
import { FISInputDate, FISSelect } from 'fis-component'
import { CUSTOMER_TYPE_OPTIONS, PAYMENT_OPTIONS } from '../data'
import dayjs from '@utils/dayjs'
import { parseDateValue, toBoundaryIsoString } from '@utils'

const FILTER_TYPE_OPTIONS = [
  {
    items: [{ label: 'Tất cả', value: '' }, ...CUSTOMER_TYPE_OPTIONS[0].items]
  }
]

const PAYMENT_TYPE_OPTIONS = [
  {
    items: [{ label: 'Tất cả', value: '' }, ...PAYMENT_OPTIONS]
  }
]

interface LogisticInformationFilterPropsI {
  control: Control<any>
}

const LogisticInformationFilter = ({ control }: LogisticInformationFilterPropsI) => {
  const dateFrom = useWatch({ control, name: 'dateFrom' }) as string
  const dateFromMin = dateFrom ? dayjs(parseDateValue(dateFrom) ?? undefined) : undefined
  return (
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <Controller
          name='customerType'
          control={control}
          render={({ field }) => (
            <FISSelect {...field} textLabel='Loại' placeholder='Chọn loại' options={FILTER_TYPE_OPTIONS} />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='paymentType'
          control={control}
          render={({ field }) => (
            <FISSelect {...field} textLabel='Thanh toán' placeholder='Chọn thanh toán' options={PAYMENT_TYPE_OPTIONS} />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='dateFrom'
          control={control}
          render={({ field }) => (
            <FISInputDate
              textLabel='Từ ngày tạo'
              placeholder='Chọn ngày'
              value={parseDateValue(field.value)}
              onChange={(date) => {
                field.onChange(date ? toBoundaryIsoString(date, 'start') : '')
              }}
              picker='date'
              format='DD/MM/YYYY'
            />
          )}
        />
      </Col>
      <Col span={24}>
        <Controller
          name='dateTo'
          control={control}
          render={({ field }) => (
            <FISInputDate
              textLabel='Đến ngày tạo'
              placeholder='Chọn ngày'
              value={parseDateValue(field.value)}
              onChange={(date) => field.onChange(date ? toBoundaryIsoString(date, 'end') : '')}
              minDate={dateFromMin}
              picker='date'
              format='DD/MM/YYYY'
            />
          )}
        />
      </Col>
    </Row>
  )
}

export default LogisticInformationFilter
