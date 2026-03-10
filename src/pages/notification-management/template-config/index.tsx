import { PageWrapper } from '@components'

const NotificationManagementTemplateConfig = () => {
  return (
    <PageWrapper className='py-5' title='Cấu hình mẫu thông báo' breadcrumbItems={[]}>
      <div className='flex gap-5 flex-col h-full'>
        <div className='flex-1 bg-white rounded-lg p-4'>
          <p className='text-gray-600'>Nội dung cấu hình mẫu thông báo sẽ được hiển thị tại đây</p>
        </div>
      </div>
    </PageWrapper>
  )
}

export default NotificationManagementTemplateConfig
