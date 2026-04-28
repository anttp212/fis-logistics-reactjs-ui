import { useState } from 'react'
import { message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import VehicleFleetForm from '../VehicleFleetForm'
import { toFleetFormValues, type FleetFormValuesI } from '../data'
import { useGetVehicleFleetDetailQuery, useUpdateVehicleFleetMutation } from '../vehicleFleet.api'
import type { UpdateVehicleFleetRequestT } from '../vehicleFleet.api'

const toUpdateBody = (values: FleetFormValuesI, files: string[]): UpdateVehicleFleetRequestT => ({
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

const VehicleFleetEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: item, isLoading: isLoadingDetail } = useGetVehicleFleetDetailQuery(id!, { skip: !id })
  const [updateVehicle, { isLoading }] = useUpdateVehicleFleetMutation()
  const [serverErrors, setServerErrors] = useState<Record<string, string>>({})

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý đội xe', onClick: () => navigate(ROUTES.transportationVehicleFleet) },
    { label: 'Chỉnh sửa xe' }
  ]

  const handleSubmit = async (values: FleetFormValuesI, _files: string[]) => {
    if (!id) return
    setServerErrors({})
    try {
      await updateVehicle({ id, body: toUpdateBody(values, _files) }).unwrap()
      message.success('Cập nhật xe thành công')
      navigate(ROUTES.transportationVehicleFleet)
    } catch (err: unknown) {
      const data =
        err && typeof err === 'object' && 'data' in err
          ? ((err as { data?: { message?: string; errors?: Record<string, string> } }).data ?? {})
          : {}
      if (data.errors && Object.keys(data.errors).length > 0) {
        setServerErrors(data.errors)
      }
      message.error(data.message || 'Cập nhật xe thất bại')
    }
  }

  if (!id) {
    return (
      <PageWrapper className='overflow-y-auto mt-6' title='Chỉnh sửa xe' breadcrumbItems={breadcrumbItems}>
        <div className='text-gray-500'>Không tìm thấy xe.</div>
      </PageWrapper>
    )
  }

  if (isLoadingDetail || !item) {
    return (
      <PageWrapper className='overflow-y-auto mt-6' title='Chỉnh sửa xe' breadcrumbItems={breadcrumbItems}>
        <div className='text-gray-500'>Đang tải...</div>
      </PageWrapper>
    )
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
        isSubmitting={isLoading}
        serverErrors={serverErrors}
      />
    </PageWrapper>
  )
}

export default VehicleFleetEditPage
