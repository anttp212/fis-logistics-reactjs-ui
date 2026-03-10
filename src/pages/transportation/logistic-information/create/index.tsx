import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import LogisticForm from '../LogisticForm'
import { toFormValues, type LogisticFormValuesI } from '../data'
import { useCreateLogisticMutation } from '../logisticInformation.api'
import type { CreateLogisticRequestI } from '../logisticInformation.api'

const toCreateBody = (values: LogisticFormValuesI): CreateLogisticRequestI => ({
  customerType: values.customerType,
  paymentType: values.paymentType || 'PREPAID',
  customerCode: values.customerCode || undefined,
  taxCode: values.taxCode || undefined,
  organizationName: values.organizationName || undefined,
  shortName: values.shortName || undefined,
  fullName: values.fullName || undefined,
  identityNumber: values.identityNumber || undefined,
  address: values.address || undefined,
  email: values.email || undefined,
  phone: values.phone || undefined,
  note: values.note || undefined
})

const LogisticInformationCreatePage = () => {
  const navigate = useNavigate()
  const [createLogistic, { isLoading }] = useCreateLogisticMutation()

  const breadcrumbItems = [
    { label: 'Trang chu', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý thông tin logistic', onClick: () => navigate(ROUTES.transportationLogisticInformation) },
    { label: 'Tạo thông tin logistic' }
  ]

  const handleSubmit = async (values: LogisticFormValuesI) => {
    try {
      await createLogistic(toCreateBody(values)).unwrap()
      message.success('Tạo thông tin logistic thành công')
      navigate(ROUTES.transportationLogisticInformation)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err ? (err as { data?: { message?: string } }).data?.message : null
      message.error(msg || 'Tạo thông tin logistic thất bại')
    }
  }

  return (
    <PageWrapper
      className='overflow-y-auto mt-6'
      title='Tạo thông tin logistic'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationLogisticInformation)}
      hasBackButton
    >
      <LogisticForm
        defaultValues={toFormValues()}
        submitLabel='Tạo'
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.transportationLogisticInformation)}
        isSubmitting={isLoading}
      />
    </PageWrapper>
  )
}

export default LogisticInformationCreatePage
