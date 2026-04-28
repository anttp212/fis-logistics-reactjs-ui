import { useState } from 'react'
import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import VehicleFleetForm from '../VehicleFleetForm'
import { toFleetFormValues, type FleetFormValuesI } from '../data'
import { useCreateVehicleFleetMutation } from '../vehicleFleet.api'
import type { CreateVehicleFleetRequestI } from '../vehicleFleet.api'

const toCreateBody = (values: FleetFormValuesI, files: string[]): CreateVehicleFleetRequestI => ({
  logisticsCustomerId: values.logisticsCustomerId || '',
  vehicleType: values.vehicleType || 'TRACTOR',
  licensePlate: values.licensePlate || '',
  secondaryLicensePlate: values.secondaryLicensePlate || undefined,
  inspectionExpiryDate: values.inspectionExpiryDate || undefined,
  payloadCapacity: values.payloadCapacity || undefined,
  weight: values.weight || undefined,
  status: values.status || 'ACTIVE',
  note: values.note || undefined,
  attachments: files
})

const VehicleFleetCreatePage = () => {
  const navigate = useNavigate()
  const [createVehicle, { isLoading }] = useCreateVehicleFleetMutation()
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý đội xe', onClick: () => navigate(ROUTES.transportationVehicleFleet) },
    { label: 'Tạo xe' }
  ]

  const handleSubmit = async (values: FleetFormValuesI, _files: string[]) => {
    setServerErrors({})
    try {
      await createVehicle(toCreateBody(values, _files)).unwrap()
      message.success('Tạo xe thành công')
      navigate(ROUTES.transportationVehicleFleet)
    } catch (err: unknown) {
      const data =
        err && typeof err === 'object' && 'data' in err
          ? ((err as { data?: { message?: string; errors?: Record<string, string> } }).data ?? {})
          : {}
      if (data.errors && Object.keys(data.errors).length > 0) {
        setServerErrors(data.errors)
      }
      message.error(data.message || 'Tạo xe thất bại')
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
        serverErrors={serverErrors}
      />
    </PageWrapper>
  )
}

export default VehicleFleetCreatePage
