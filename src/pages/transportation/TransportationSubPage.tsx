import { useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'

interface TransportationSubPagePropsI {
  title: string
}

export const TransportationSubPage = ({ title }: TransportationSubPagePropsI) => {
  const navigate = useNavigate()
  const breadcrumbItems = [
    { label: 'Trang chủ', onClick: () => navigate(ROUTES.home) },
    { label: 'Quản lý vận chuyển', onClick: () => navigate(ROUTES.transportationVehicleDispatch) },
    { label: title }
  ]
  return (
    <PageWrapper className='py-5' title={title} breadcrumbItems={breadcrumbItems}>
      <div className='flex-1' />
    </PageWrapper>
  )
}
