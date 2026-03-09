import { message } from 'antd'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import DriverForm from '../DriverForm'
import { MOCK_DRIVER_DATA, toDriverFormValues, type DriverFormValuesI } from '../data'

const DriverManagementEditPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const item = useMemo(() => MOCK_DRIVER_DATA.find((entry) => entry.id === id), [id])

  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportation) },
    { label: 'Quản lý tài xế', onClick: () => navigate(ROUTES.transportationDriverManagement) },
    { label: 'Chỉnh sửa tài xế' }
  ]

  const handleSubmit = async (_values: DriverFormValuesI) => {
    message.success('Cập nhật tài xế thành công')
    navigate(ROUTES.transportationDriverManagement)
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
        submitLabel='Lưu thay đổi'
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.transportationDriverManagement)}
      />
    </PageWrapper>
  )
}

export default DriverManagementEditPage
