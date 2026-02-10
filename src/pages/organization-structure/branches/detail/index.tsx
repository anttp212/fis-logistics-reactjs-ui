import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import { FISButton } from 'fis-component'
import { BackIcon } from '@images'

interface BranchDetailI {
  key: string
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  description?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

const fetchBranchDetail = async (branchId: string): Promise<BranchDetailI | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const fakeBranches: Record<string, BranchDetailI> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '1': {
      key: '1',
      name: 'Chi nhánh Hà Nội',
      code: 'HN001',
      address: '123 Đường ABC, Quận XYZ, Hà Nội',
      phone: '0241234567',
      email: 'hanoi@example.com',
      description: 'Chi nhánh chính tại Hà Nội',
      status: 'active',
      createdAt: '2024-01-10',
      updatedAt: '2024-12-15'
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '2': {
      key: '2',
      name: 'Chi nhánh Hồ Chí Minh',
      code: 'HCM001',
      address: '456 Đường DEF, Quận 1, TP.HCM',
      phone: '0287654321',
      email: 'hcm@example.com',
      description: 'Chi nhánh tại TP.HCM',
      status: 'active',
      createdAt: '2024-02-15',
      updatedAt: '2024-12-10'
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '3': {
      key: '3',
      name: 'Chi nhánh Đà Nẵng',
      code: 'DN001',
      address: '789 Đường GHI, Quận Hải Châu, Đà Nẵng',
      phone: '0236123456',
      email: 'danang@example.com',
      description: 'Chi nhánh tại Đà Nẵng',
      status: 'active',
      createdAt: '2024-03-20',
      updatedAt: '2024-12-05'
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '4': {
      key: '4',
      name: 'Chi nhánh Cần Thơ',
      code: 'CT001',
      address: '321 Đường JKL, Quận Ninh Kiều, Cần Thơ',
      phone: '0292123456',
      email: 'cantho@example.com',
      description: 'Chi nhánh tại Cần Thơ',
      status: 'inactive',
      createdAt: '2024-04-05',
      updatedAt: '2024-11-20'
    }
  }
  return fakeBranches[branchId] || null
}

const BranchDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [branch, setBranch] = useState<BranchDetailI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBranchDetail = async () => {
      if (!id) {
        setError('ID chi nhánh không hợp lệ')
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        setError(null)
        const branchData = await fetchBranchDetail(id)
        if (branchData) {
          setBranch(branchData)
        } else {
          setError('Không tìm thấy thông tin chi nhánh')
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải thông tin chi nhánh')
        console.error('Error loading branch detail:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadBranchDetail()
  }, [id])

  const getStatusBadge = (status?: string) => {
    if (status === 'active') {
      return (
        <span className='inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800'>
          Hoạt động
        </span>
      )
    }
    return (
      <span className='inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800'>
        Không hoạt động
      </span>
    )
  }

  const breadcrumbItems = [
    { label: 'Trang chủ' },
    { label: 'Cơ cấu Tổ chức', onClick: () => navigate(ROUTES.organizationStructureBranches) },
    { label: 'Chi nhánh', onClick: () => navigate(ROUTES.organizationStructureBranches) },
    { label: 'Chi tiết chi nhánh' }
  ]

  return (
    <PageWrapper
      className='p-5'
      title='Chi tiết chi nhánh'
      breadcrumbItems={breadcrumbItems}
      hasBackButton
      actionButtons={
        <FISButton
          variant='tertiary'
          startIcon={<BackIcon />}
          onClick={() => navigate(ROUTES.organizationStructureBranches)}
        >
          Quay lại
        </FISButton>
      }
    >
      <div className='flex flex-col gap-6'>
        {isLoading && (
          <div className='flex items-center justify-center py-12'>
            <div className='text-gray-500'>Đang tải thông tin...</div>
          </div>
        )}

        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <div className='flex'>
              <div className='flex-shrink-0'>
                <svg className='h-5 w-5 text-red-400' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
              <div className='ml-3'>
                <p className='text-sm text-red-800'>{error}</p>
              </div>
            </div>
          </div>
        )}

        {branch && !isLoading && (
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin cơ bản</h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Tên chi nhánh</label>
                      <p className='text-sm text-gray-900'>{branch.name}</p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Mã chi nhánh</label>
                      <p className='text-sm text-gray-900'>{branch.code}</p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Trạng thái</label>
                      <div className='mt-1'>{getStatusBadge(branch.status)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin liên hệ</h3>
                  <div className='space-y-4'>
                    {branch.address && (
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Địa chỉ</label>
                        <p className='text-sm text-gray-900'>{branch.address}</p>
                      </div>
                    )}
                    {branch.phone && (
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Số điện thoại</label>
                        <p className='text-sm text-gray-900'>{branch.phone}</p>
                      </div>
                    )}
                    {branch.email && (
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Email</label>
                        <p className='text-sm text-gray-900'>{branch.email}</p>
                      </div>
                    )}
                    {branch.createdAt && (
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Ngày tạo</label>
                        <p className='text-sm text-gray-900'>{branch.createdAt}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {branch.description && (
              <div className='mt-6 pt-6 border-t border-gray-200'>
                <label className='block text-sm font-medium text-gray-500 mb-2'>Mô tả</label>
                <p className='text-sm text-gray-900'>{branch.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

export default BranchDetail
