import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'

interface WarehouseSubPagePropsI {
  title: string
}

export const WarehouseSubPage = ({ title }: WarehouseSubPagePropsI) => {
  const navigate = useNavigate()
  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý kho', onClick: () => navigate(ROUTES.warehouseServiceRegistrationPortal) },
    { label: title }
  ]
  return (
    <PageWrapper className='py-5' title={title} breadcrumbItems={breadcrumbItems}>
      <div className='flex-1' />
    </PageWrapper>
  )
}
