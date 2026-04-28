import { message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import DriverForm from '../DriverForm'
import { toDriverFormValues, type DriverFormValuesI } from '../data'
import { useGetDriverDetailQuery, useUpdateDriverMutation } from '../driverManagement.api'
import type { UpdateDriverRequestT } from '../driverManagement.api'
import type { AttachmentItemI } from '@components'

const toUpdateBody = (values: DriverFormValuesI, files: string[]): UpdateDriverRequestT => ({
  logisticsCustomerId: values.logisticsCustomerId,
  primaryVehicleId: values.primaryVehicleId || undefined,
  trailerVehicleId: values.trailerVehicleId || undefined,
  userId: values.userId,
  idCardNumber: values.idCardNumber,
  gender: values.gender || undefined,
  note: values.note || undefined,
  drivingLicenseAttachments: files
})

const toAttachmentList = (attachments?: Array<string | AttachmentItemI>): AttachmentItemI[] =>
  (attachments ?? []).map((item) => (typeof item === 'string' ? { path: item } : item))

const DriverManagementEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: item, isLoading: isLoadingDetail } = useGetDriverDetailQuery(id!, { skip: !id })
  const [updateDriver, { isLoading }] = useUpdateDriverMutation()

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý tài xế', onClick: () => navigate(ROUTES.transportationDriverManagement) },
    { label: 'Chỉnh sửa tài xế' }
  ]

  const handleSubmit = async (values: DriverFormValuesI, files: string[]) => {
    if (!id) return
    try {
      await updateDriver({ id, body: toUpdateBody(values, files) }).unwrap()
      message.success('Cập nhật tài xế thành công')
      navigate(ROUTES.transportationDriverManagement)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err ? (err as { data?: { message?: string } }).data?.message : null
      message.error(msg || 'Cập nhật tài xế thất bại')
    }
  }

  if (!id) {
    return (
      <PageWrapper className='overflow-y-auto mt-6' title='Chỉnh sửa tài xế' breadcrumbItems={breadcrumbItems}>
        <div className='text-gray-500'>Không tìm thấy tài xế.</div>
      </PageWrapper>
    )
  }

  if (isLoadingDetail || !item) {
    return (
      <PageWrapper className='overflow-y-auto mt-6' title='Chỉnh sửa tài xế' breadcrumbItems={breadcrumbItems}>
        <div className='text-gray-500'>Đang tải...</div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      className='overflow-y-auto mt-6'
      title='Chỉnh sửa tài xế'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationDriverManagement)}
      hasBackButton
    >
      <DriverForm
        defaultValues={toDriverFormValues(item)}
        defaultFileList={toAttachmentList(item.drivingLicenseAttachments)}
        excludeDriverId={id}
        submitLabel='Lưu thay đổi'
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.transportationDriverManagement)}
        isSubmitting={isLoading}
      />
    </PageWrapper>
  )
}

export default DriverManagementEditPage
