import { useNavigate, useParams } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES, buildVehicleDispatchDetailPath } from '@constants'
import VehicleDispatchEditForm from '../components/VehicleDispatchEditForm'

const VehicleDispatchEditPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Điều xe', onClick: () => navigate(ROUTES.transportationVehicleDispatch) },
    { label: 'Chỉnh sửa' }
  ]

  if (!id) {
    return (
      <PageWrapper className='p-5' title='Chỉnh sửa điều xe' breadcrumbItems={breadcrumbItems}>
        <div className='text-gray-500'>Không tìm thấy yêu cầu điều xe.</div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      className='overflow-y-auto mt-6 '
      title='Chỉnh sửa yêu cầu điều xe'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationVehicleDispatch)}
      hasBackButton
    >
      <VehicleDispatchEditForm
        orderId={id}
        onSuccess={() => navigate(buildVehicleDispatchDetailPath(id))}
        onCancel={() => navigate(buildVehicleDispatchDetailPath(id))}
      />
    </PageWrapper>
  )
}

export default VehicleDispatchEditPage
