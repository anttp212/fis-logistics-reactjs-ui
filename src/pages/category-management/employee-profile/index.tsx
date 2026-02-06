import { PageWrapper } from '@components'

const CategoryManagementEmployeeProfile = () => {
  return (
    <PageWrapper className='p-5' title='Hồ sơ Nhân viên' breadcrumbItems={[]}>
      <div className='flex gap-5 flex-col h-full'>
        <div className='flex-1 bg-white rounded-lg p-4'>
          <p className='text-gray-600'>Nội dung quản lý hồ sơ nhân viên sẽ được hiển thị tại đây</p>
        </div>
      </div>
    </PageWrapper>
  )
}

export default CategoryManagementEmployeeProfile
