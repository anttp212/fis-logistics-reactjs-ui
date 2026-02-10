import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import { FISButton } from 'fis-component'
import { BackIcon } from '@images'

// Extended Customer type with more details
interface CustomerDetailI {
  key: string
  name: string
  customerCode: string
  taxCode: string
  phone?: string
  email?: string
  address?: string
  representativeName?: string
  representativePhone?: string
  representativeEmail?: string
  logo?: string
  status?: string
  createdAt?: string
  capacityProfile?: {
    id: string
    title: string
    description: string
    documentUrl?: string
    issueDate: string
  }[]
  offices?: {
    id: string
    name: string
    address: string
    phone?: string
    email?: string
    isMain: boolean
  }[]
}

// Fake API function to get customer detail
const fetchCustomerDetail = async (customerId: string): Promise<CustomerDetailI | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const fakeCustomers: Record<string, CustomerDetailI> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '1': {
      key: '1',
      name: 'Công ty TNHH ABC',
      customerCode: 'KH001',
      taxCode: '0123456789',
      phone: '0901234567',
      email: 'contact@abc.com',
      address: '123 Đường ABC, Quận XYZ, Hà Nội',
      representativeName: 'Nguyễn Văn A',
      representativePhone: '0901111111',
      representativeEmail: 'nguyenvana@abc.com',
      logo: 'https://ui-avatars.com/api/?name=ABC+Company&size=200',
      status: 'active',
      createdAt: '2023-01-15',
      capacityProfile: [
        {
          id: '1',
          title: 'Giấy phép kinh doanh',
          description: 'Giấy phép kinh doanh số 123456789 do Sở Kế hoạch và Đầu tư Hà Nội cấp',
          documentUrl: 'https://example.com/doc1.pdf',
          issueDate: '2023-01-15'
        },
        {
          id: '2',
          title: 'Chứng nhận ISO 9001:2015',
          description: 'Chứng nhận hệ thống quản lý chất lượng',
          documentUrl: 'https://example.com/doc2.pdf',
          issueDate: '2023-02-20'
        }
      ],
      offices: [
        {
          id: '1',
          name: 'Trụ sở chính',
          address: '123 Đường ABC, Quận XYZ, Hà Nội',
          phone: '0901234567',
          email: 'contact@abc.com',
          isMain: true
        },
        {
          id: '2',
          name: 'Văn phòng TP.HCM',
          address: '456 Đường DEF, Quận 1, TP.HCM',
          phone: '0902345678',
          email: 'hcm@abc.com',
          isMain: false
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '2': {
      key: '2',
      name: 'Công ty Cổ phần XYZ',
      customerCode: 'KH002',
      taxCode: '0987654321',
      phone: '0902345678',
      email: 'info@xyz.com',
      address: '456 Đường DEF, Quận 1, TP.HCM',
      representativeName: 'Trần Thị B',
      representativePhone: '0902222222',
      representativeEmail: 'tranthib@xyz.com',
      logo: 'https://ui-avatars.com/api/?name=XYZ+Company&size=200',
      status: 'active',
      createdAt: '2023-02-20',
      capacityProfile: [
        {
          id: '1',
          title: 'Giấy phép kinh doanh',
          description: 'Giấy phép kinh doanh số 987654321 do Sở Kế hoạch và Đầu tư TP.HCM cấp',
          documentUrl: 'https://example.com/doc3.pdf',
          issueDate: '2023-02-20'
        }
      ],
      offices: [
        {
          id: '1',
          name: 'Trụ sở chính',
          address: '456 Đường DEF, Quận 1, TP.HCM',
          phone: '0902345678',
          email: 'info@xyz.com',
          isMain: true
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '3': {
      key: '3',
      name: 'Công ty TNHH DEF',
      customerCode: 'KH003',
      taxCode: '0111222333',
      phone: '0903456789',
      email: 'hello@def.com',
      address: '789 Đường GHI, Quận Hải Châu, Đà Nẵng',
      representativeName: 'Lê Văn C',
      status: 'inactive',
      createdAt: '2022-11-05',
      capacityProfile: [],
      offices: [
        {
          id: '1',
          name: 'Trụ sở chính',
          address: '789 Đường GHI, Quận Hải Châu, Đà Nẵng',
          phone: '0903456789',
          email: 'hello@def.com',
          isMain: true
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '4': {
      key: '4',
      name: 'Công ty Cổ phần GHI',
      customerCode: 'KH004',
      taxCode: '0444555666',
      phone: '0904567890',
      email: 'contact@ghi.com',
      address: '321 Đường JKL, Quận Ninh Kiều, Cần Thơ',
      representativeName: 'Phạm Thị D',
      status: 'archived',
      createdAt: '2021-05-10',
      capacityProfile: [],
      offices: []
    }
  }

  return fakeCustomers[customerId] || null
}

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState<CustomerDetailI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCustomerDetail = async () => {
      if (!id) {
        setError('ID khách hàng không hợp lệ')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const customerData = await fetchCustomerDetail(id)
        if (customerData) {
          setCustomer(customerData)
        } else {
          setError('Không tìm thấy thông tin khách hàng')
        }
      } catch (_err) {
        setError('Có lỗi xảy ra khi tải thông tin khách hàng')
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomerDetail()
  }, [id])

  const getStatusBadge = (status?: string) => {
    if (status === 'active') {
      return (
        <span className='inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800'>
          Đang hợp tác
        </span>
      )
    }
    if (status === 'inactive') {
      return (
        <span className='inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800'>
          Ngừng hợp tác
        </span>
      )
    }
    return (
      <span className='inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-800'>
        Đã lưu trữ
      </span>
    )
  }

  const breadcrumbItems = [
    { label: 'Trang chủ' },
    { label: 'Quản lý danh mục' },
    { label: 'Hồ sơ khách hàng', onClick: () => navigate(ROUTES.categoryManagementCustomerProfile) },
    { label: 'Chi tiết khách hàng' }
  ]

  return (
    <PageWrapper
      className='p-5'
      title='Chi tiết hồ sơ khách hàng'
      breadcrumbItems={breadcrumbItems}
      hasBackButton
      actionButtons={
        <FISButton
          variant='tertiary'
          startIcon={<BackIcon />}
          onClick={() => navigate(ROUTES.categoryManagementCustomerProfile)}
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

        {customer && !isLoading && (
          <>
            {/* Basic Information */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Logo */}
                <div className='flex flex-col items-center'>
                  {customer.logo ? (
                    <img
                      src={customer.logo}
                      alt={customer.name}
                      className='w-48 h-48 rounded-lg object-cover border-4 border-gray-200'
                    />
                  ) : (
                    <div className='w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center border-4 border-gray-200'>
                      <span className='text-white text-6xl font-medium'>{customer.name?.charAt(0) || 'C'}</span>
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className='md:col-span-2 space-y-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin định danh</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Tên khách hàng</label>
                        <p className='text-sm text-gray-900'>{customer.name}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Mã khách hàng</label>
                        <p className='text-sm text-gray-900'>{customer.customerCode}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Mã số thuế</label>
                        <p className='text-sm text-gray-900'>{customer.taxCode}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Trạng thái</label>
                        <div className='mt-1'>{getStatusBadge(customer.status)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin liên hệ</h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {customer.phone && (
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>Số điện thoại</label>
                    <p className='text-sm text-gray-900'>{customer.phone}</p>
                  </div>
                )}
                {customer.email && (
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>Email</label>
                    <p className='text-sm text-gray-900'>{customer.email}</p>
                  </div>
                )}
                {customer.address && (
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>Địa chỉ</label>
                    <p className='text-sm text-gray-900'>{customer.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Representative Information */}
            {customer.representativeName && (
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin người đại diện</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>Tên người đại diện</label>
                    <p className='text-sm text-gray-900'>{customer.representativeName}</p>
                  </div>
                  {customer.representativePhone && (
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Số điện thoại</label>
                      <p className='text-sm text-gray-900'>{customer.representativePhone}</p>
                    </div>
                  )}
                  {customer.representativeEmail && (
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Email</label>
                      <p className='text-sm text-gray-900'>{customer.representativeEmail}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Capacity Profile */}
            {customer.capacityProfile && customer.capacityProfile.length > 0 && (
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Hồ sơ năng lực</h3>
                <div className='space-y-4'>
                  {customer.capacityProfile.map((profile) => (
                    <div key={profile.id} className='border-l-4 border-blue-500 pl-4 py-2'>
                      <div className='flex justify-between items-start'>
                        <div className='flex-1'>
                          <p className='font-medium text-gray-900'>{profile.title}</p>
                          <p className='text-sm text-gray-600 mt-1'>{profile.description}</p>
                          <p className='text-xs text-gray-500 mt-2'>Ngày cấp: {profile.issueDate}</p>
                          {profile.documentUrl && (
                            <a
                              href={profile.documentUrl}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block'
                            >
                              Xem tài liệu
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Offices */}
            {customer.offices && customer.offices.length > 0 && (
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Địa điểm / Văn phòng</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {customer.offices.map((office) => (
                    <div key={office.id} className='border border-gray-200 rounded-lg p-4'>
                      <div className='flex items-start justify-between mb-2'>
                        <p className='font-medium text-gray-900'>{office.name}</p>
                        {office.isMain && (
                          <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800'>
                            Trụ sở chính
                          </span>
                        )}
                      </div>
                      <p className='text-sm text-gray-600 mb-2'>{office.address}</p>
                      {office.phone && (
                        <p className='text-sm text-gray-600'>
                          <strong>Điện thoại:</strong> {office.phone}
                        </p>
                      )}
                      {office.email && (
                        <p className='text-sm text-gray-600'>
                          <strong>Email:</strong> {office.email}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  )
}

export default CustomerDetail
