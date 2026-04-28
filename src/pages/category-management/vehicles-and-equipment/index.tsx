import { PageWrapper } from '@components'

const CategoryManagementVehiclesAndEquipment = () => {
  return (
    <PageWrapper className='py-5' title='Phương Tiện và Thiết bị' breadcrumbItems={[]}>
      <div className='flex gap-5 flex-col h-full'>
        <div className='flex-1 bg-white rounded-lg p-4'>
          <p className='text-gray-600'>Nội dung quản lý phương tiện và thiết bị sẽ được hiển thị tại đây</p>
        </div>
      </div>
    </PageWrapper>
  )
}

export default CategoryManagementVehiclesAndEquipment
