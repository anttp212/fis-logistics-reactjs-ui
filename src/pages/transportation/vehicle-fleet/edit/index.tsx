import type { UploadFile } from 'antd'
import { message } from 'antd'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import VehicleFleetForm from '../VehicleFleetForm'
import { MOCK_FLEET_DATA, toFleetFormValues, type FleetFormValuesI } from '../data'

const VehicleFleetEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const item = useMemo(() => MOCK_FLEET_DATA.find((entry) => entry.id === id), [id])

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý đội xe', onClick: () => navigate(ROUTES.transportationVehicleFleet) },
    { label: 'Chỉnh sửa xe' }
  ]

  const handleSubmit = async (_values: FleetFormValuesI, _files: UploadFile[]) => {
    message.success('Cập nhật xe thành công')
    navigate(ROUTES.transportationVehicleFleet)
  }

  return (
    <PageWrapper
      className='overflow-y-auto mt-6'
      title='Chỉnh sửa xe'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationVehicleFleet)}
      hasBackButton
    >
      <VehicleFleetForm
        defaultValues={toFleetFormValues(item)}
        defaultFileList={item?.attachments}
        submitLabel='Lưu thay đổi'
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.transportationVehicleFleet)}
      />
    </PageWrapper>
  )
}

export default VehicleFleetEditPage
