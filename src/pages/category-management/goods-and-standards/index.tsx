import { PageWrapper } from '@components'

const CategoryManagementGoodsAndStandards = () => {
  return (
    <PageWrapper className='p-5' title='Hàng hoá và Quy chuẩn chung' breadcrumbItems={[]}>
      <div className='flex gap-5 flex-col h-full'>
        <div className='flex-1 bg-white rounded-lg p-4'>
          <p className='text-gray-600'>Nội dung quản lý hàng hoá và quy chuẩn chung sẽ được hiển thị tại đây</p>
        </div>
      </div>
    </PageWrapper>
  )
}

export default CategoryManagementGoodsAndStandards
