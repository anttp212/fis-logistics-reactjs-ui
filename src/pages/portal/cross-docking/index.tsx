import React from 'react'
import { PageWrapper } from '@components'
import PortalLayout from '../PortalLayout'

const PortalCrossDockingPage: React.FC = () => {
  const breadcrumbItems = [{ label: 'Portal' }, { label: 'Cross-docking', active: true }]

  return (
    <PortalLayout activeKey='cross-docking'>
      <PageWrapper title='Cross-docking' breadcrumbItems={breadcrumbItems} className='p-5'>
        <div className='h-40 rounded-lg border border-dashed border-gray-200 bg-gray-50' />
      </PageWrapper>
    </PortalLayout>
  )
}

export default PortalCrossDockingPage
