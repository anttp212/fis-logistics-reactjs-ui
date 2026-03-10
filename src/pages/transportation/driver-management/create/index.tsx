import { message } from 'antd'
import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import DriverForm from '../DriverForm'
import { toDriverFormValues, type DriverFormValuesI } from '../data'
import { useCreateDriverMutation } from '../driverManagement.api'
import type { CreateDriverRequestI } from '../driverManagement.api'

const toCreateBody = (values: DriverFormValuesI): CreateDriverRequestI => ({
  logisticsId: values.logisticsId,
  identityNumber: values.identityNumber,
  fullName: values.fullName,
  phone: values.phone,
  email: values.email || undefined,
  password: values.password,
  gender: values.gender || undefined,
  status: values.status || 'ACTIVE',
  note: values.note || undefined
})

const DriverManagementCreatePage = () => {
  const navigate = useNavigate()
  const [createDriver, { isLoading }] = useCreateDriverMutation()

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý tài xế', onClick: () => navigate(ROUTES.transportationDriverManagement) },
    { label: 'Tạo tài xế' }
  ]

  const handleSubmit = async (values: DriverFormValuesI) => {
    try {
      await createDriver(toCreateBody(values)).unwrap()
      message.success('Tạo tài xế thành công')
      navigate(ROUTES.transportationDriverManagement)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err ? (err as { data?: { message?: string } }).data?.message : null
      message.error(msg || 'Tạo tài xế thất bại')
    }
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
        isSubmitting={isLoading}
      />
    </PageWrapper>
  )
}

export default DriverManagementCreatePage
