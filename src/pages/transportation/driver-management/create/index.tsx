import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import DriverForm from '../DriverForm'
import { toDriverFormValues, type DriverFormValuesI } from '../data'

const DriverManagementCreatePage = () => {
  const navigate = useNavigate()

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý tài xế', onClick: () => navigate(ROUTES.transportationDriverManagement) },
    { label: 'Tạo tài xế' }
  ]

  const handleSubmit = async (_values: DriverFormValuesI) => {
    message.success('Tạo tài xế thành công')
    navigate(ROUTES.transportationDriverManagement)
  }

  return (
    <PageWrapper
      className='overflow-y-auto mt-6'
      title='Tạo tài xế'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationDriverManagement)}
      hasBackButton
    >
      <DriverForm
        defaultValues={toDriverFormValues()}
        submitLabel='Tạo tài xế'
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.transportationDriverManagement)}
      />
    </PageWrapper>
  )
}

export default DriverManagementCreatePage
