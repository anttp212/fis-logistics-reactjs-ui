import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper } from '@components'
import { ROUTES } from '@constants'
import { FISButton } from 'fis-component'
import { BackIcon } from '@images'

// Extended Employee type with more details
interface EmployeeDetailI {
  key: string
  name: string
  employeeCode: string
  department: string
  skillGroup?: string
  phone?: string
  email?: string
  address?: string
  position?: string
  portraitPhoto?: string
  certificates?: string[]
  status?: string
  createdAt?: string
  workHistory?: {
    id: string
    department: string
    position: string
    startDate: string
    endDate?: string
    description?: string
  }[]
  qualifications?: {
    id: string
    name: string
    issuingOrganization: string
    issueDate: string
    expiryDate?: string
    certificateFile?: string
  }[]
}

// Fake API function to get employee detail
const fetchEmployeeDetail = async (employeeId: string): Promise<EmployeeDetailI | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const fakeEmployees: Record<string, EmployeeDetailI> = {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '1': {
      key: '1',
      name: 'Nguyễn Văn A',
      employeeCode: 'NV001',
      department: 'Phòng Kinh doanh',
      skillGroup: 'Kinh doanh',
      phone: '0901234567',
      email: 'nva@example.com',
      address: '123 Đường ABC, Quận XYZ, Hà Nội',
      position: 'Nhân viên kinh doanh',
      portraitPhoto: 'https://ui-avatars.com/api/?name=Nguyen+Van+A&size=200',
      status: 'active',
      createdAt: '2023-01-15',
      workHistory: [
        {
          id: '1',
          department: 'Phòng Kinh doanh',
          position: 'Nhân viên kinh doanh',
          startDate: '2023-01-15',
          description: 'Bắt đầu làm việc tại phòng kinh doanh'
        }
      ],
      qualifications: [
        {
          id: '1',
          name: 'Chứng chỉ Kinh doanh Quốc tế',
          issuingOrganization: 'Hiệp hội Kinh doanh Việt Nam',
          issueDate: '2022-12-01',
          expiryDate: '2025-12-01'
        },
        {
          id: '2',
          name: 'Chứng chỉ Tiếng Anh TOEIC',
          issuingOrganization: 'ETS',
          issueDate: '2022-06-15',
          expiryDate: '2024-06-15'
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '2': {
      key: '2',
      name: 'Trần Thị B',
      employeeCode: 'NV002',
      department: 'Phòng Kế toán',
      skillGroup: 'Kế toán',
      phone: '0902345678',
      email: 'ttb@example.com',
      address: '456 Đường DEF, Quận 1, TP.HCM',
      position: 'Kế toán viên',
      portraitPhoto: 'https://ui-avatars.com/api/?name=Tran+Thi+B&size=200',
      status: 'active',
      createdAt: '2023-02-20',
      workHistory: [
        {
          id: '1',
          department: 'Phòng Kế toán',
          position: 'Kế toán viên',
          startDate: '2023-02-20',
          description: 'Bắt đầu làm việc tại phòng kế toán'
        }
      ],
      qualifications: [
        {
          id: '1',
          name: 'Chứng chỉ Kế toán viên',
          issuingOrganization: 'Hội Kế toán Việt Nam',
          issueDate: '2022-11-10'
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '3': {
      key: '3',
      name: 'Lê Văn C',
      employeeCode: 'NV003',
      department: 'Phòng IT',
      skillGroup: 'Công nghệ thông tin',
      phone: '0903456789',
      email: 'lvc@example.com',
      address: '789 Đường GHI, Quận Hải Châu, Đà Nẵng',
      position: 'Lập trình viên',
      portraitPhoto: 'https://ui-avatars.com/api/?name=Le+Van+C&size=200',
      status: 'active',
      createdAt: '2023-03-10',
      workHistory: [
        {
          id: '1',
          department: 'Phòng IT',
          position: 'Lập trình viên',
          startDate: '2023-03-10',
          description: 'Bắt đầu làm việc tại phòng IT'
        }
      ],
      qualifications: [
        {
          id: '1',
          name: 'Chứng chỉ Lập trình viên Java',
          issuingOrganization: 'Oracle',
          issueDate: '2022-08-20'
        },
        {
          id: '2',
          name: 'Chứng chỉ AWS Solutions Architect',
          issuingOrganization: 'Amazon Web Services',
          issueDate: '2023-01-05',
          expiryDate: '2026-01-05'
        }
      ]
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    '4': {
      key: '4',
      name: 'Phạm Thị D',
      employeeCode: 'NV004',
      department: 'Phòng Nhân sự',
      skillGroup: 'Nhân sự',
      phone: '0904567890',
      email: 'ptd@example.com',
      address: '321 Đường JKL, Quận Ninh Kiều, Cần Thơ',
      position: 'Chuyên viên nhân sự',
      portraitPhoto: 'https://ui-avatars.com/api/?name=Pham+Thi+D&size=200',
      status: 'inactive',
      createdAt: '2022-11-05',
      workHistory: [
        {
          id: '1',
          department: 'Phòng Nhân sự',
          position: 'Chuyên viên nhân sự',
          startDate: '2022-11-05',
          endDate: '2024-10-31',
          description: 'Đã nghỉ việc'
        }
      ],
      qualifications: [
        {
          id: '1',
          name: 'Chứng chỉ Quản trị Nhân sự',
          issuingOrganization: 'Viện Nhân sự Việt Nam',
          issueDate: '2022-09-15'
        }
      ]
    }
  }

  return fakeEmployees[employeeId] || null
}

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [employee, setEmployee] = useState<EmployeeDetailI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadEmployeeDetail = async () => {
      if (!id) {
        setError('ID nhân viên không hợp lệ')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const employeeData = await fetchEmployeeDetail(id)
        if (employeeData) {
          setEmployee(employeeData)
        } else {
          setError('Không tìm thấy thông tin nhân viên')
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải thông tin nhân viên')
        console.error('Error loading employee detail:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadEmployeeDetail()
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
        Đã nghỉ việc
      </span>
    )
  }

  const handleActivateDeactivate = () => {
    if (!employee) return

    const isDeactivating = employee.status === 'active'
    const actionText = isDeactivating ? 'ngừng kích hoạt' : 'kích hoạt'

    Modal.confirm({
      title: `Xác nhận ${actionText}`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn {actionText} hồ sơ nhân viên này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{employee.name}</p>
          <p className='mt-1 text-sm text-gray-500'>{employee.employeeCode}</p>
        </div>
      ),
      okText: isDeactivating ? 'Ngừng kích hoạt' : 'Kích hoạt',
      okType: isDeactivating ? 'danger' : 'default',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // eslint-disable-next-line no-console
          console.log(`${isDeactivating ? 'Deactivate' : 'Activate'} employee:`, employee.key)
          setEmployee({
            ...employee,
            status: isDeactivating ? 'inactive' : 'active'
          })
        } catch (error) {
          console.error(`Error ${actionText} employee:`, error)
          throw error
        }
      },
      onCancel: () => {}
    })
  }

  const breadcrumbItems = [
    { label: 'Trang chủ' },
    { label: 'Quản lý danh mục' },
    { label: 'Hồ sơ nhân viên', onClick: () => navigate(ROUTES.employeeProfileList) },
    { label: 'Chi tiết nhân viên' }
  ]

  return (
    <PageWrapper
      className='py-5'
      title='Chi tiết hồ sơ nhân viên'
      breadcrumbItems={breadcrumbItems}
      hasBackButton
      onBackClick={() => navigate(ROUTES.employeeProfileList)}
      actionButtons={
        <div className='flex gap-2'>
          {employee && (
            <FISButton
              variant={employee.status === 'active' ? 'secondary-negative' : 'primary'}
              onClick={handleActivateDeactivate}
            >
              {employee.status === 'active' ? 'Ngừng kích hoạt' : 'Kích hoạt'}
            </FISButton>
          )}
          <FISButton variant='tertiary' startIcon={<BackIcon />} onClick={() => navigate(ROUTES.employeeProfileList)}>
            Quay lại
          </FISButton>
        </div>
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

        {employee && !isLoading && (
          <>
            {/* Basic Information */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                {/* Portrait Photo */}
                <div className='flex flex-col items-center'>
                  {employee.portraitPhoto ? (
                    <img
                      src={employee.portraitPhoto}
                      alt={employee.name}
                      className='w-48 h-48 rounded-lg object-cover border-4 border-gray-200'
                    />
                  ) : (
                    <div className='w-48 h-48 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center border-4 border-gray-200'>
                      <span className='text-white text-6xl font-medium'>{employee.name?.charAt(0) || 'E'}</span>
                    </div>
                  )}
                </div>

                {/* Basic Info */}
                <div className='md:col-span-2 space-y-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin cơ bản</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Tên nhân viên</label>
                        <p className='text-sm text-gray-900'>{employee.name}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Mã nhân viên</label>
                        <p className='text-sm text-gray-900'>{employee.employeeCode}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Phòng ban</label>
                        <p className='text-sm text-gray-900'>{employee.department}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Nhóm kỹ năng</label>
                        <p className='text-sm text-gray-900'>{employee.skillGroup || '-'}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Chức vụ</label>
                        <p className='text-sm text-gray-900'>{employee.position || '-'}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Trạng thái</label>
                        <div className='mt-1'>{getStatusBadge(employee.status)}</div>
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
                {employee.phone && (
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>Số điện thoại</label>
                    <p className='text-sm text-gray-900'>{employee.phone}</p>
                  </div>
                )}
                {employee.email && (
                  <div>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>Email</label>
                    <p className='text-sm text-gray-900'>{employee.email}</p>
                  </div>
                )}
                {employee.address && (
                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-500 mb-1'>Địa chỉ</label>
                    <p className='text-sm text-gray-900'>{employee.address}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Work History */}
            {employee.workHistory && employee.workHistory.length > 0 && (
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Quá trình công tác</h3>
                <div className='space-y-4'>
                  {employee.workHistory.map((history) => (
                    <div key={history.id} className='border-l-4 border-blue-500 pl-4 py-2'>
                      <div className='flex justify-between items-start'>
                        <div>
                          <p className='font-medium text-gray-900'>{history.position}</p>
                          <p className='text-sm text-gray-600'>{history.department}</p>
                          <p className='text-xs text-gray-500 mt-1'>
                            {history.startDate} {history.endDate ? `- ${history.endDate}` : '- Hiện tại'}
                          </p>
                          {history.description && <p className='text-sm text-gray-600 mt-2'>{history.description}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Qualifications */}
            {employee.qualifications && employee.qualifications.length > 0 && (
              <div className='bg-white rounded-lg border border-gray-200 p-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>Bằng cấp chuyên môn</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {employee.qualifications.map((qual) => (
                    <div key={qual.id} className='border border-gray-200 rounded-lg p-4'>
                      <p className='font-medium text-gray-900'>{qual.name}</p>
                      <p className='text-sm text-gray-600 mt-1'>{qual.issuingOrganization}</p>
                      <p className='text-xs text-gray-500 mt-2'>
                        Ngày cấp: {qual.issueDate}
                        {qual.expiryDate && ` | Hết hạn: ${qual.expiryDate}`}
                      </p>
                      {qual.certificateFile && (
                        <a
                          href={qual.certificateFile}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block'
                        >
                          Xem chứng chỉ
                        </a>
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

export default EmployeeDetail
