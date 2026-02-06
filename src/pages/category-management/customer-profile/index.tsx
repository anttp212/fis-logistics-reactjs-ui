import { PageWrapper } from '@components'

const CategoryManagementCustomerProfile = () => {
  return (
    <PageWrapper className='p-5' title='Hồ sơ Khách hàng' breadcrumbItems={[]}>
      <div className='flex gap-5 flex-col h-full'>
        <div className='flex-1 bg-white rounded-lg p-4'>
          <p className='text-gray-600'>Nội dung quản lý hồ sơ khách hàng sẽ được hiển thị tại đây</p>
        </div>
      </div>
    </PageWrapper>
  )
}

export default CategoryManagementCustomerProfile
