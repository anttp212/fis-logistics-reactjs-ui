import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import LogisticForm from '../LogisticForm'
import { toFormValues, type LogisticFormValuesI } from '../data'

const LogisticInformationCreatePage = () => {
  const navigate = useNavigate()

  const breadcrumbItems = [
    { label: 'Trang chu', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý thông tin logistic', onClick: () => navigate(ROUTES.transportationLogisticInformation) },
    { label: 'Tạo thông tin logistic' }
  ]

  const handleSubmit = async (_values: LogisticFormValuesI) => {
    message.success('Tao Thông tin logistic thanh cong')
    navigate(ROUTES.transportationLogisticInformation)
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
      />
    </PageWrapper>
  )
}

export default LogisticInformationCreatePage
