import React from 'react'
import { PageWrapper } from '@components'
import PortalLayout from '../PortalLayout'

const PortalImportRequestPage: React.FC = () => {
  const breadcrumbItems = [{ label: 'Portal' }, { label: 'Yêu cầu nhập hàng', active: true }]

  return (
    <PortalLayout activeKey='import'>
      <PageWrapper title='Yêu cầu nhập hàng' breadcrumbItems={breadcrumbItems} className='p-5'>
        <div className='h-40 rounded-lg border border-dashed border-gray-200 bg-gray-50' />
      </PageWrapper>
    </PortalLayout>
  )
}

export default PortalImportRequestPage
