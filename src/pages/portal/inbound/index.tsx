import React from 'react'
import { PageWrapper } from '@components'
import PortalLayout from '../PortalLayout'
import InboundRegistrationForm from './components/InboundRegistrationForm'

const PortalInboundPage: React.FC = () => {
  const breadcrumbItems = [{ label: 'Portal' }, { label: 'Inbound (Nhập kho)', active: true }]

  return (
    <PortalLayout activeKey='inbound'>
      <PageWrapper title='Đăng ký dịch vụ Inbound (Nhập kho)' breadcrumbItems={breadcrumbItems} className='py-5'>
        <InboundRegistrationForm />
      </PageWrapper>
    </PortalLayout>
  )
}

export default PortalInboundPage
