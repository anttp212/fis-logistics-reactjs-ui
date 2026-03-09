import { message } from 'antd'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import LogisticForm from '../LogisticForm'
import { MOCK_LOGISTIC_DATA, toFormValues, type LogisticFormValuesI } from '../data'

const LogisticInformationEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const item = useMemo(() => MOCK_LOGISTIC_DATA.find((entry) => entry.id === id), [id])

  const breadcrumbItems = [
    { label: 'Trang chu', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý thông tin logistic', onClick: () => navigate(ROUTES.transportationLogisticInformation) },
    { label: 'Chinh sua logistic' }
  ]

  const handleSubmit = async (_values: LogisticFormValuesI) => {
    message.success('Cap nhat Thông tin logistic thanh cong')
    navigate(ROUTES.transportationLogisticInformation)
  }

  return (
    <PageWrapper
      className='overflow-y-auto mt-6'
      title='Chinh sua logistic'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationLogisticInformation)}
      hasBackButton
    >
      <LogisticForm
        defaultValues={toFormValues(item)}
        submitLabel='Luu thay doi'
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.transportationLogisticInformation)}
      />
    </PageWrapper>
  )
}

export default LogisticInformationEditPage
