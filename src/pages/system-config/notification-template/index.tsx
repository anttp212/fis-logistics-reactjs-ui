import { PageWrapper } from '@components'

const SystemConfigNotificationTemplate = () => {
  return (
    <PageWrapper className='py-5' title='Mẫu thông báo' breadcrumbItems={[]}>
      <div className='flex gap-5 flex-col h-full'>
        <div className='flex-1 bg-white rounded-lg p-4'>
          <p className='text-gray-600'>Nội dung quản lý mẫu thông báo sẽ được hiển thị tại đây</p>
        </div>
      </div>
    </PageWrapper>
  )
}

export default SystemConfigNotificationTemplate
