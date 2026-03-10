import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import VehicleFleetForm from '../VehicleFleetForm'
import { toFleetFormValues, type FleetFormValuesI } from '../data'
import type { UploadFile } from 'antd'
import { useCreateVehicleFleetMutation } from '../vehicleFleet.api'
import type { CreateVehicleFleetRequestI } from '../vehicleFleet.api'

const toCreateBody = (values: FleetFormValuesI): CreateVehicleFleetRequestI => ({
  logisticsId: values.logisticsId,
  vehicleType: values.vehicleType || 'TRACTOR',
  plateNumber: values.plateNumber,
  secondaryPlateNumber: values.secondaryPlateNumber || undefined,
  payload: values.payload || undefined,
  weight: values.weight || undefined,
  status: values.status || 'ACTIVE',
  note: values.note || undefined
})

const VehicleFleetCreatePage = () => {
  const navigate = useNavigate()
  const [createVehicle, { isLoading }] = useCreateVehicleFleetMutation()

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý đội xe', onClick: () => navigate(ROUTES.transportationVehicleFleet) },
    { label: 'Tạo xe' }
  ]

  const handleSubmit = async (values: FleetFormValuesI, _files: UploadFile[]) => {
    try {
      await createVehicle(toCreateBody(values)).unwrap()
      message.success('Tạo xe thành công')
      navigate(ROUTES.transportationVehicleFleet)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err ? (err as { data?: { message?: string } }).data?.message : null
      message.error(msg || 'Tạo xe thất bại')
    }
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
        isSubmitting={isLoading}
      />
    </PageWrapper>
  )
}

export default VehicleFleetCreatePage
