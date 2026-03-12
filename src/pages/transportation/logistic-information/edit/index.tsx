import { message } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import LogisticForm from '../LogisticForm'
import { toFormValues, type LogisticFormValuesI } from '../data'
import { useGetLogisticDetailQuery, useUpdateLogisticMutation } from '../logisticInformation.api'
import type { UpdateLogisticRequestT } from '../logisticInformation.api'

const toUpdateBody = (values: LogisticFormValuesI): UpdateLogisticRequestT => ({
  customerType: values.customerType,
  paymentType: values.paymentType || 'PREPAID',
  taxCode: values.taxCode || undefined,
  companyName: values.companyName || undefined,
  shortName: values.shortName || undefined,
  fullName: values.fullName || undefined,
  idCardNumber: values.idCardNumber || undefined,
  address: values.address || undefined,
  email: values.email || undefined,
  phone: values.phone || undefined,
  note: values.note || undefined
})

const LogisticInformationEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { data: item, isLoading: isLoadingDetail } = useGetLogisticDetailQuery(id!, { skip: !id })
  const [updateLogistic, { isLoading }] = useUpdateLogisticMutation()

  const breadcrumbItems = [
    { label: 'Trang chu', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý thông tin Logistic', onClick: () => navigate(ROUTES.transportationLogisticInformation) },
    { label: 'Chỉnh sửa thông tin Logistic' }
  ]

  const handleSubmit = async (values: LogisticFormValuesI) => {
    if (!id) return
    try {
      await updateLogistic({ id, body: toUpdateBody(values) }).unwrap()
      message.success('Cập nhật thông tin logistic thành công')
      navigate(ROUTES.transportationLogisticInformation)
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'data' in err ? (err as { data?: { message?: string } }).data?.message : null
      message.error(msg || 'Cập nhật thất bại')
    }
  }

  if (!id) {
    return (
      <PageWrapper
        className='overflow-y-auto mt-6'
        title='Chỉnh sửa thông tin Logistic'
        breadcrumbItems={breadcrumbItems}
      >
        <div className='text-gray-500'>Không tìm thấy mã logistic.</div>
      </PageWrapper>
    )
  }

  if (isLoadingDetail || !item) {
    return (
      <PageWrapper
        className='overflow-y-auto mt-6'
        title='Chỉnh sửa thông tin Logistic'
        breadcrumbItems={breadcrumbItems}
      >
        <div className='text-gray-500'>Đang tải...</div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper
      className='overflow-y-auto mt-6'
      title='Chỉnh sửa thông tin Logistic'
      breadcrumbItems={breadcrumbItems}
      onBackClick={() => navigate(ROUTES.transportationLogisticInformation)}
      hasBackButton
    >
      <LogisticForm
        defaultValues={toFormValues(item)}
        submitLabel='Lưu thay đổi'
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.transportationLogisticInformation)}
        isSubmitting={isLoading}
      />
    </PageWrapper>
  )
}

export default LogisticInformationEditPage
