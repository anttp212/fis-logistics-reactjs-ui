import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import { FISButton } from 'fis-component'
import { BackIcon } from '@images'

// Extended Partner type with more details
interface VehicleI {
  id: string
  licensePlate: string
  vehicleType: string
  capacity?: string
  driverName?: string
  driverPhone?: string
}

interface PartnerDetailI {
  key: string
  name: string
  partnerCode: string
  taxCode: string
  partnerType: 'transport' | 'subcontractor'
  phone?: string
  email?: string
  address?: string
  representativeName?: string
  representativePhone?: string
  representativeEmail?: string
  logo?: string
  status?: string
  createdAt?: string
  transportCapacity?: {
    id: string
    title: string
    description: string
    documentUrl?: string
    issueDate: string
  }[]
  vehicles?: VehicleI[]
  cooperationHistory?: {
    id: string
    projectName: string
    startDate: string
    endDate?: string
    status: 'completed' | 'ongoing' | 'cancelled'
    rating?: number
    notes?: string
  }[]
  qualityAssessments?: {
    id: string
    assessmentDate: string
    rating: 'excellent' | 'good' | 'average' | 'poor'
    score: number
    evaluator: string
    comments?: string
  }[]
}

// Fake API function to get partner detail
const fetchPartnerDetail = async (partnerId: string): Promise<PartnerDetailI | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const fakePartners: Record<string, PartnerDetailI> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '1': {
      key: '1',
      name: 'Công ty Vận tải ABC',
      partnerCode: 'DT001',
      taxCode: '0123456789',
      partnerType: 'transport',
      phone: '0901234567',
      email: 'contact@abc-transport.com',
      address: '123 Đường ABC, Quận XYZ, Hà Nội',
      representativeName: 'Nguyễn Văn A',
      representativePhone: '0901111111',
      representativeEmail: 'nguyenvana@abc-transport.com',
      logo: 'https://ui-avatars.com/api/?name=ABC+Transport&size=200',
      status: 'active',
      createdAt: '2023-01-15',
      transportCapacity: [
        {
          id: '1',
          title: 'Giấy phép vận tải đường bộ',
          description: 'Giấy phép vận tải đường bộ số 123456789 do Sở Giao thông Vận tải Hà Nội cấp',
          documentUrl: 'https://example.com/doc1.pdf',
          issueDate: '2023-01-15'
        },
        {
          id: '2',
          title: 'Chứng nhận an toàn giao thông',
          description: 'Chứng nhận đạt tiêu chuẩn an toàn giao thông',
          documentUrl: 'https://example.com/doc2.pdf',
          issueDate: '2023-02-20'
        }
      ],
      vehicles: [
        {
          id: '1',
          licensePlate: '29A-12345',
          vehicleType: 'Xe tải',
          capacity: '10 tấn',
          driverName: 'Nguyễn Văn B',
          driverPhone: '0902222222'
        },
        {
          id: '2',
          licensePlate: '29A-67890',
          vehicleType: 'Xe container',
          capacity: '20 tấn',
          driverName: 'Trần Văn C',
          driverPhone: '0903333333'
        }
      ],
      cooperationHistory: [
        {
          id: '1',
          projectName: 'Dự án vận chuyển hàng hóa Hà Nội - TP.HCM',
          startDate: '2023-03-01',
          endDate: '2023-06-30',
          status: 'completed',
          rating: 5,
          notes: 'Hoàn thành tốt, đúng tiến độ'
        },
        {
          id: '2',
          projectName: 'Dự án vận chuyển hàng hóa Hà Nội - Đà Nẵng',
          startDate: '2023-07-01',
          status: 'ongoing',
          rating: 4
        }
      ],
      qualityAssessments: [
        {
          id: '1',
          assessmentDate: '2023-06-30',
          rating: 'excellent',
          score: 95,
          evaluator: 'Nguyễn Thị D',
          comments: 'Đối tác có năng lực tốt, thực hiện đúng cam kết'
        },
        {
          id: '2',
          assessmentDate: '2023-03-31',
          rating: 'good',
          score: 85,
          evaluator: 'Trần Văn E',
          comments: 'Chất lượng dịch vụ tốt, cần cải thiện thời gian phản hồi'
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '2': {
      key: '2',
      name: 'Công ty Thầu phụ XYZ',
      partnerCode: 'DT002',
      taxCode: '0987654321',
      partnerType: 'subcontractor',
      phone: '0902345678',
      email: 'info@xyz-subcontractor.com',
      address: '456 Đường DEF, Quận 1, TP.HCM',
      representativeName: 'Trần Thị B',
      logo: 'https://ui-avatars.com/api/?name=XYZ+Subcontractor&size=200',
      status: 'active',
      createdAt: '2023-02-20',
      transportCapacity: [],
      vehicles: [],
      cooperationHistory: [
        {
          id: '1',
          projectName: 'Dự án xây dựng kho bãi',
          startDate: '2023-04-01',
          endDate: '2023-08-31',
          status: 'completed',
          rating: 4
        }
      ],
      qualityAssessments: [
        {
          id: '1',
          assessmentDate: '2023-08-31',
          rating: 'good',
          score: 80,
          evaluator: 'Lê Văn F'
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '3': {
      key: '3',
      name: 'Công ty Vận tải DEF',
      partnerCode: 'DT003',
      taxCode: '0111222333',
      partnerType: 'transport',
      phone: '0903456789',
      email: 'hello@def-transport.com',
      address: '789 Đường GHI, Quận Hải Châu, Đà Nẵng',
      representativeName: 'Lê Văn C',
      status: 'inactive',
      createdAt: '2022-11-05',
      transportCapacity: [],
      vehicles: [],
      cooperationHistory: [],
      qualityAssessments: []
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '4': {
      key: '4',
      name: 'Công ty Thầu phụ GHI',
      partnerCode: 'DT004',
      taxCode: '0444555666',
      partnerType: 'subcontractor',
      phone: '0904567890',
      email: 'contact@ghi-subcontractor.com',
      address: '321 Đường JKL, Quận Ninh Kiều, Cần Thơ',
      representativeName: 'Phạm Thị D',
      status: 'locked',
      createdAt: '2021-05-10',
      transportCapacity: [],
      vehicles: [],
      cooperationHistory: [],
      qualityAssessments: []
    }
  }

  return fakePartners[partnerId] || null
}

const PartnerDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [partner, setPartner] = useState<PartnerDetailI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPartnerDetail = async () => {
      if (!id) {
        setError('ID đối tác không hợp lệ')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const partnerData = await fetchPartnerDetail(id)
        if (partnerData) {
          setPartner(partnerData)
        } else {
          setError('Không tìm thấy thông tin đối tác')
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải thông tin đối tác')
        console.error('Error loading partner detail:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadPartnerDetail()
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
      <span className='inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800'>
        Đã khóa
      </span>
    )
  }

  const getQualityRatingBadge = (rating?: string) => {
    if (rating === 'excellent') {
      return (
        <span className='inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-green-100 text-green-800'>
          Xuất sắc
        </span>
      )
    }
    if (rating === 'good') {
      return (
        <span className='inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-800'>
          Tốt
        </span>
      )
    }
    if (rating === 'average') {
      return (
        <span className='inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-yellow-100 text-yellow-800'>
          Trung bình
        </span>
      )
    }
    if (rating === 'poor') {
      return (
        <span className='inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-800'>
          Kém
        </span>
      )
    }
    return <span className='text-gray-500'>-</span>
  }

  const getPartnerTypeLabel = (type?: string) => {
    if (type === 'transport') return 'Đối tác vận tải'
    if (type === 'subcontractor') return 'Thầu phụ'
    return '-'
  }

  const getStatusLabel = (status?: string) => {
    if (status === 'completed') return 'Hoàn thành'
    if (status === 'ongoing') return 'Đang thực hiện'
    if (status === 'cancelled') return 'Đã hủy'
    return '-'
  }

  const breadcrumbItems = [
    { label: 'Trang chủ' },
    { label: 'Quản lý danh mục' },
    { label: 'Hồ sơ đối tác', onClick: () => navigate(ROUTES.categoryManagementPartnerProfile) },
    { label: 'Chi tiết đối tác' }
  ]

  return (
    <PageWrapper
      className='py-5'
      title='Chi tiết hồ sơ đối tác'
      breadcrumbItems={breadcrumbItems}
      hasBackButton
      onBackClick={() => navigate(ROUTES.categoryManagementPartnerProfile)}
      actionButtons={
        <FISButton
          variant='tertiary'
          startIcon={<BackIcon />}
          onClick={() => navigate(ROUTES.categoryManagementPartnerProfile)}
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

        {partner && !isLoading && (
          <>
            {/* Basic Information */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Logo */}
                <div className='flex flex-col items-center'>
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className='w-48 h-48 rounded-lg object-cover border-4 border-gray-200'
                    />
                  ) : (
                    <div className='w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center border-4 border-gray-200'>
                      <span className='text-white text-6xl font-medium'>{partner.name?.charAt(0) || 'P'}</span>
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className='md:col-span-2 space-y-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin định danh</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Tên đối tác</label>
                        <p className='text-sm text-gray-900'>{partner.name}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Mã đối tác</label>
                        <p className='text-sm text-gray-900'>{partner.partnerCode}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Mã số thuế</label>
                        <p className='text-sm text-gray-900'>{partner.taxCode}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Loại đối tác</label>
                        <p className='text-sm text-gray-900'>{getPartnerTypeLabel(partner.partnerType)}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Trạng thái</label>
                        <div className='mt-1'>{getStatusBadge(partner.status)}</div>
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
                {partner.phone && (
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>Số điện thoại</label>
                    <p className='text-sm text-gray-900'>{partner.phone}</p>
                  </div>
                )}
                {partner.email && (
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>Email</label>
                    <p className='text-sm text-gray-900'>{partner.email}</p>
                  </div>
                )}
                {partner.address && (
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>Địa chỉ</label>
                    <p className='text-sm text-gray-900'>{partner.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Representative Information */}
            {partner.representativeName && (
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin người đại diện</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>Tên người đại diện</label>
                    <p className='text-sm text-gray-900'>{partner.representativeName}</p>
                  </div>
                  {partner.representativePhone && (
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Số điện thoại</label>
                      <p className='text-sm text-gray-900'>{partner.representativePhone}</p>
                    </div>
                  )}
                  {partner.representativeEmail && (
                    <div>
                      <label className='block text-sm font-medium text-gray-500 mb-1'>Email</label>
                      <p className='text-sm text-gray-900'>{partner.representativeEmail}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Transport Capacity */}
            {partner.transportCapacity && partner.transportCapacity.length > 0 && (
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Năng lực vận tải</h3>
                <div className='space-y-4'>
                  {partner.transportCapacity.map((capacity) => (
                    <div key={capacity.id} className='border-l-4 border-blue-500 pl-4 py-2'>
                      <div className='flex justify-between items-start'>
                        <div className='flex-1'>
                          <p className='font-medium text-gray-900'>{capacity.title}</p>
                          <p className='text-sm text-gray-600 mt-1'>{capacity.description}</p>
                          <p className='text-xs text-gray-500 mt-2'>Ngày cấp: {capacity.issueDate}</p>
                          {capacity.documentUrl && (
                            <a
                              href={capacity.documentUrl}
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

            {/* Vehicles */}
            {partner.vehicles && partner.vehicles.length > 0 && (
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Danh sách xe ủy quyền</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {partner.vehicles.map((vehicle) => (
                    <div key={vehicle.id} className='border border-gray-200 rounded-lg p-4'>
                      <p className='font-medium text-gray-900 mb-2'>{vehicle.licensePlate}</p>
                      <p className='text-sm text-gray-600'>
                        <strong>Loại xe:</strong> {vehicle.vehicleType}
                      </p>
                      {vehicle.capacity && (
                        <p className='text-sm text-gray-600'>
                          <strong>Tải trọng:</strong> {vehicle.capacity}
                        </p>
                      )}
                      {vehicle.driverName && (
                        <p className='text-sm text-gray-600'>
                          <strong>Lái xe:</strong> {vehicle.driverName}
                        </p>
                      )}
                      {vehicle.driverPhone && (
                        <p className='text-sm text-gray-600'>
                          <strong>Điện thoại lái xe:</strong> {vehicle.driverPhone}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cooperation History */}
            {partner.cooperationHistory && partner.cooperationHistory.length > 0 && (
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Lịch sử hợp tác</h3>
                <div className='space-y-4'>
                  {partner.cooperationHistory.map((history) => (
                    <div key={history.id} className='border-l-4 border-green-500 pl-4 py-2'>
                      <div className='flex justify-between items-start'>
                        <div className='flex-1'>
                          <p className='font-medium text-gray-900'>{history.projectName}</p>
                          <p className='text-sm text-gray-600 mt-1'>
                            {history.startDate} {history.endDate ? `- ${history.endDate}` : '- Hiện tại'}
                          </p>
                          <div className='flex items-center gap-2 mt-2'>
                            <span className='text-sm text-gray-600'>Trạng thái:</span>
                            <span className='text-sm font-medium text-gray-900'>{getStatusLabel(history.status)}</span>
                            {history.rating && (
                              <>
                                <span className='text-sm text-gray-600 ml-2'>Đánh giá:</span>
                                <div className='flex items-center'>
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${i < history.rating! ? 'text-yellow-400' : 'text-gray-300'}`}
                                      fill='currentColor'
                                      viewBox='0 0 20 20'
                                    >
                                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                    </svg>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                          {history.notes && <p className='text-sm text-gray-600 mt-2'>{history.notes}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quality Assessments */}
            {partner.qualityAssessments && partner.qualityAssessments.length > 0 && (
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Đánh giá xếp hạng chất lượng</h3>
                <div className='space-y-4'>
                  {partner.qualityAssessments.map((assessment) => (
                    <div key={assessment.id} className='border border-gray-200 rounded-lg p-4'>
                      <div className='flex justify-between items-start mb-2'>
                        <div>
                          <p className='font-medium text-gray-900'>{assessment.assessmentDate}</p>
                          <p className='text-sm text-gray-600'>Người đánh giá: {assessment.evaluator}</p>
                        </div>
                        <div className='text-right'>
                          <div className='mb-1'>{getQualityRatingBadge(assessment.rating)}</div>
                          <p className='text-sm font-medium text-gray-900'>Điểm: {assessment.score}/100</p>
                        </div>
                      </div>
                      {assessment.comments && <p className='text-sm text-gray-600 mt-2'>{assessment.comments}</p>}
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

export default PartnerDetail
