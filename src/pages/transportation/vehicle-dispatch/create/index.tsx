import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import VehicleDispatchForm from '../components/VehicleDispatchForm'

const VehicleDispatchCreatePage = () => {
  const navigate = useNavigate()

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Điều xe', onClick: () => navigate(ROUTES.transportationVehicleDispatch) },
    { label: 'Thêm mới yêu cầu điều xe' }
  ]

  return (
    <PageWrapper
      className='overflow-y-auto mt-6 '
      title='Thêm mới yêu cầu điều xe'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationVehicleDispatch)}
      hasBackButton
    >
      <VehicleDispatchForm
        mode='create'
        onSuccess={() => navigate(ROUTES.transportationVehicleDispatch)}
        onCancel={() => navigate(ROUTES.transportationVehicleDispatch)}
      />
    </PageWrapper>
  )
}

export default VehicleDispatchCreatePage
