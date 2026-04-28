import React from 'react'
import { PageWrapper } from '@components'
import PortalLayout from '../PortalLayout'

const PortalVasPage: React.FC = () => {
  const breadcrumbItems = [{ label: 'Portal' }, { label: 'VAS (Gia công, đóng gói, dán tem)', active: true }]
  return (
    <PortalLayout activeKey='vas'>
      <PageWrapper title='VAS (Gia công, đóng gói, dán tem)' breadcrumbItems={breadcrumbItems} className='py-5'>
        <div className='h-40 rounded-lg border border-dashed border-gray-200 bg-gray-50' />
      </PageWrapper>
    </PortalLayout>
  )
}

export default PortalVasPage
