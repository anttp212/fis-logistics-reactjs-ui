import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'

interface DepotSubPagePropsI {
  title: string
}

export const DepotSubPage = ({ title }: DepotSubPagePropsI) => {
  const navigate = useNavigate()
  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý depot', onClick: () => navigate(ROUTES.depotServiceRegistration) },
    { label: title }
  ]
  return (
    <PageWrapper className='py-5' title={title} breadcrumbItems={breadcrumbItems}>
      <div className='flex-1' />
    </PageWrapper>
  )
}
