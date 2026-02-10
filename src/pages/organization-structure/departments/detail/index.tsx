import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import { FISButton } from 'fis-component'
import { BackIcon } from '@images'

interface DepartmentDetailI {
  key: string
  name: string
  code: string
  branch: string
  description?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

const fetchDepartmentDetail = async (departmentId: string): Promise<DepartmentDetailI | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500))
  const fakeDepartments: Record<string, DepartmentDetailI> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '1': {
      key: '1',
      name: 'Phòng Kinh doanh',
      code: 'KD001',
      branch: 'Chi nhánh Hà Nội',
      description: 'Phòng kinh doanh tại Hà Nội',
      status: 'active',
      createdAt: '2024-01-10',
      updatedAt: '2024-12-15'
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '2': {
      key: '2',
      name: 'Phòng Kế toán',
      code: 'KT001',
      branch: 'Chi nhánh Hà Nội',
      description: 'Phòng kế toán tại Hà Nội',
      status: 'active',
      createdAt: '2024-02-15',
      updatedAt: '2024-12-10'
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '3': {
      key: '3',
      name: 'Phòng Nhân sự',
      code: 'NS001',
      branch: 'Chi nhánh Hồ Chí Minh',
      description: 'Phòng nhân sự tại TP.HCM',
      status: 'active',
      createdAt: '2024-03-20',
      updatedAt: '2024-12-05'
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '4': {
      key: '4',
      name: 'Phòng IT',
      code: 'IT001',
      branch: 'Chi nhánh Đà Nẵng',
      description: 'Phòng IT tại Đà Nẵng',
      status: 'inactive',
      createdAt: '2024-04-05',
      updatedAt: '2024-11-20'
    }
  }
  return fakeDepartments[departmentId] || null
}

const DepartmentDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [department, setDepartment] = useState<DepartmentDetailI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDepartmentDetail = async () => {
      if (!id) {
        setError('ID phòng ban không hợp lệ')
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        setError(null)
        const departmentData = await fetchDepartmentDetail(id)
        if (departmentData) {
          setDepartment(departmentData)
        } else {
          setError('Không tìm thấy thông tin phòng ban')
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải thông tin phòng ban')
        console.error('Error loading department detail:', err)
      } finally {
        setIsLoading(false)
      }
    }
    loadDepartmentDetail()
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
    { label: 'Cơ cấu Tổ chức', onClick: () => navigate(ROUTES.organizationStructureDepartments) },
    { label: 'Phòng ban', onClick: () => navigate(ROUTES.organizationStructureDepartments) },
    { label: 'Chi tiết phòng ban' }
  ]

  return (
    <PageWrapper
      className='p-5'
      title='Chi tiết phòng ban'
      breadcrumbItems={breadcrumbItems}
      hasBackButton
      actionButtons={
        <FISButton
          variant='tertiary'
          startIcon={<BackIcon />}
          onClick={() => navigate(ROUTES.organizationStructureDepartments)}
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

        {department && !isLoading && (
          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin cơ bản</h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Tên phòng ban</label>
                      <p className='text-sm text-gray-900'>{department.name}</p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Mã phòng ban</label>
                      <p className='text-sm text-gray-900'>{department.code}</p>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Trạng thái</label>
                      <div className='mt-1'>{getStatusBadge(department.status)}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-6'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin hệ thống</h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Chi nhánh</label>
                      <p className='text-sm text-gray-900'>{department.branch}</p>
                    </div>
                    {department.createdAt && (
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Ngày tạo</label>
                        <p className='text-sm text-gray-900'>{department.createdAt}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {department.description && (
              <div className='mt-6 pt-6 border-t border-gray-200'>
                <label className='block text-sm font-medium text-gray-500 mb-2'>Mô tả</label>
                <p className='text-sm text-gray-900'>{department.description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  )
}

export default DepartmentDetail
