import React from 'react'
import { PageWrapper } from '@components'
import PortalLayout from '../PortalLayout'

const PortalStoragePage: React.FC = () => {
  const breadcrumbItems = [{ label: 'Portal' }, { label: 'Storage (Lưu kho)', active: true }]

  return (
    <PortalLayout activeKey='storage'>
      <PageWrapper title='Storage (Lưu kho)' breadcrumbItems={breadcrumbItems} className='py-5'>
        <div className='h-40 rounded-lg border border-dashed border-gray-200 bg-gray-50' />
      </PageWrapper>
    </PortalLayout>
  )
}

export default PortalStoragePage
