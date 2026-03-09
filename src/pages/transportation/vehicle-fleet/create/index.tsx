import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import VehicleFleetForm from '../VehicleFleetForm'
import { toFleetFormValues, type FleetFormValuesI } from '../data'
import type { UploadFile } from 'antd'

const VehicleFleetCreatePage = () => {
  const navigate = useNavigate()

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý đội xe', onClick: () => navigate(ROUTES.transportationVehicleFleet) },
    { label: 'Tạo xe' }
  ]

  const handleSubmit = async (_values: FleetFormValuesI, _files: UploadFile[]) => {
    message.success('Tạo xe thành công')
    navigate(ROUTES.transportationVehicleFleet)
  }

  return (
    <PageWrapper
      className='overflow-y-auto mt-6'
      title='Tạo xe'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationVehicleFleet)}
      hasBackButton
    >
      <VehicleFleetForm
        defaultValues={toFleetFormValues()}
        submitLabel='Tạo xe'
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.transportationVehicleFleet)}
      />
    </PageWrapper>
  )
}

export default VehicleFleetCreatePage
