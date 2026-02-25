import React from 'react'
import { PageWrapper } from '@components'
import PortalLayout from '../PortalLayout'

const PortalExportRequestPage: React.FC = () => {
  const breadcrumbItems = [{ label: 'Portal' }, { label: 'Yêu cầu xuất hàng', active: true }]

  return (
    <PortalLayout activeKey='export'>
      <PageWrapper title='Yêu cầu xuất hàng' breadcrumbItems={breadcrumbItems} className='p-5'>
        <div className='h-40 rounded-lg border border-dashed border-gray-200 bg-gray-50' />
      </PageWrapper>
    </PortalLayout>
  )
}

export default PortalExportRequestPage
