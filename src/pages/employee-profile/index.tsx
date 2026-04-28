import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Upload, message } from 'antd'
import { ExclamationCircleOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons'
import { PageWrapper, TableToolbar } from '@components'
import { FISButton, FISTable, FISTableCell, FISTableHeaderCell, FISIconButton, FISButtonGroup } from 'fis-component'
import { AddIcon } from '@images'
import EmployeeModal from './components/EmployeeModal'
import EmployeesFilter from './components/EmployeesFilter'
import { useEmployees } from './useEmployees'
import { buildEmployeeDetailPath } from '@constants'

// Employee type
interface EmployeeI {
  key: string
  name: string
  employeeCode: string
  department: string
  skillGroup?: string
  phone?: string
  email?: string
  position?: string
  portraitPhoto?: string
  status?: string
}

// Fake data cho danh sách nhân viên
const FAKE_EMPLOYEES_DATA: EmployeeI[] = [
  {
    key: '1',
    name: 'Nguyễn Văn A',
    employeeCode: 'NV001',
    department: 'Phòng Kinh doanh',
    skillGroup: 'Kinh doanh',
    phone: '0901234567',
    email: 'nva@example.com',
    position: 'Nhân viên kinh doanh',
    status: 'active'
  },
  {
    key: '2',
    name: 'Trần Thị B',
    employeeCode: 'NV002',
    department: 'Phòng Kế toán',
    skillGroup: 'Kế toán',
    phone: '0902345678',
    email: 'ttb@example.com',
    position: 'Kế toán viên',
    status: 'active'
  },
  {
    key: '3',
    name: 'Lê Văn C',
    employeeCode: 'NV003',
    department: 'Phòng IT',
    skillGroup: 'Công nghệ thông tin',
    phone: '0903456789',
    email: 'lvc@example.com',
    position: 'Lập trình viên',
    status: 'active'
  },
  {
    key: '4',
    name: 'Phạm Thị D',
    employeeCode: 'NV004',
    department: 'Phòng Nhân sự',
    skillGroup: 'Nhân sự',
    phone: '0904567890',
    email: 'ptd@example.com',
    position: 'Chuyên viên nhân sự',
    status: 'inactive'
  }
]

// TableRowSelection type
interface TableRowSelectionI {
  selectedRowKeys?: React.Key[]
  onChange?: (selectedRowKeys: React.Key[]) => void
  renderCell?: (checked: boolean, record: any) => React.ReactNode
  columnTitle?: React.ReactNode
}

// Simple Checkbox component
interface CheckboxPropsI {
  checked?: boolean
  indeterminate?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = ({ checked = false, indeterminate = false, onChange }: CheckboxPropsI) => {
  return (
    <input
      type='checkbox'
      checked={checked}
      ref={(input) => {
        if (input) input.indeterminate = indeterminate
      }}
      onChange={onChange}
      className='w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer'
    />
  )
}

const Employees = () => {
  const navigate = useNavigate()
  const employees = useEmployees()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<EmployeeI | null>(null)

  // Get filter values from form
  const filterValues = employees.watch()

  // Apply filters to data
  const dataSource = useMemo(() => {
    let filtered = [...FAKE_EMPLOYEES_DATA]

    // Filter by name
    if (filterValues.name) {
      const searchTerm = filterValues.name.toLowerCase()
      filtered = filtered.filter((emp) => emp.name.toLowerCase().includes(searchTerm))
    }

    // Filter by employeeCode
    if (filterValues.employeeCode) {
      const searchTerm = filterValues.employeeCode.toLowerCase()
      filtered = filtered.filter((emp) => emp.employeeCode.toLowerCase().includes(searchTerm))
    }

    // Filter by department
    if (filterValues.department) {
      filtered = filtered.filter((emp) => emp.department === filterValues.department)
    }

    // Filter by skillGroup
    if (filterValues.skillGroup) {
      filtered = filtered.filter((emp) => emp.skillGroup === filterValues.skillGroup)
    }

    // Filter by status
    if (filterValues.status) {
      filtered = filtered.filter((emp) => emp.status === filterValues.status)
    }

    // Filter by search (general search)
    if (employees.search) {
      const searchTerm = employees.search.toLowerCase()
      filtered = filtered.filter(
        (emp) =>
          emp.name.toLowerCase().includes(searchTerm) ||
          emp.employeeCode.toLowerCase().includes(searchTerm) ||
          emp.department.toLowerCase().includes(searchTerm) ||
          emp.position?.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  }, [filterValues, employees.search])

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])

  const toggleExpand = (key: string) => {
    setExpandedRowKeys((prevKeys: string[]) =>
      prevKeys.includes(key) ? prevKeys.filter((k) => k !== key) : [...prevKeys, key]
    )
  }

  const isAllSelected = selectedRowKeys.length === dataSource.length
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < dataSource.length

  const handleSelect = (key: React.Key) => {
    setSelectedRowKeys((prevKeys: React.Key[]) =>
      prevKeys.includes(key) ? prevKeys.filter((k) => k !== key) : [...prevKeys, key]
    )
  }

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRowKeys([])
    } else {
      setSelectedRowKeys(dataSource.map((item) => item.key))
    }
  }

  const rowSelection: TableRowSelectionI = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
    renderCell: (checked: boolean, record: any) => (
      <FISTableCell icon={<Checkbox checked={checked} onChange={() => handleSelect(record.key)} />} hasBorder={false} />
    ),
    columnTitle: (
      <FISTableHeaderCell
        label=''
        rightComponent={
          <Checkbox checked={isAllSelected} indeterminate={isIndeterminate} onChange={() => toggleSelectAll()} />
        }
        hasRightDivider={false}
      />
    )
  }

  const handleAddNew = () => {
    setEditingEmployee(null)
    setIsModalOpen(true)
  }

  const handleEdit = (record: EmployeeI) => {
    setEditingEmployee(record)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingEmployee(null)
  }

  const handleModalSubmit = async (formData: any) => {
    try {
      if (editingEmployee) {
        // TODO: Call API to update employee
        // eslint-disable-next-line no-console
        console.log('Update employee:', editingEmployee.key, formData)
      } else {
        // TODO: Call API to create employee
        // eslint-disable-next-line no-console
        console.log('Create employee:', formData)
      }
      handleModalClose()
      // TODO: Refresh employee list
    } catch (_error) {
      // Error handling - TODO: Show error notification
    }
  }

  const handleDelete = (record: EmployeeI) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa hồ sơ nhân viên này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{record.name}</p>
          <p className='mt-1 text-sm text-gray-500'>{record.employeeCode}</p>
          <p className='mt-1 text-sm text-gray-500'>Hành động này không thể hoàn tác.</p>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        // TODO: Call API to delete employee
        // eslint-disable-next-line no-console
        console.log('Delete employee:', record.key)
        // TODO: Refresh employee list
      },
      onCancel: () => {}
    })
  }

  const handleExport = (format: 'pdf' | 'xlsx') => {
    // TODO: Implement export functionality
    // eslint-disable-next-line no-console
    console.log(`Export employees to ${format}`)
    message.info(`Chức năng xuất file ${format.toUpperCase()} đang được phát triển`)
  }

  const handleBulkImport = (file: File) => {
    // TODO: Implement bulk import functionality
    // eslint-disable-next-line no-console
    console.log('Bulk import employees from file:', file.name)
    message.info('Chức năng nhập liệu hàng loạt đang được phát triển')
  }

  const getStatusBadge = (status?: string) => {
    if (status === 'active') {
      return (
        <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800'>
          Hoạt động
        </span>
      )
    }
    return (
      <span className='inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800'>
        Đã nghỉ việc
      </span>
    )
  }

  const departmentsList = [
    { value: 'Phòng Kinh doanh', label: 'Phòng Kinh doanh' },
    { value: 'Phòng Kế toán', label: 'Phòng Kế toán' },
    { value: 'Phòng IT', label: 'Phòng IT' },
    { value: 'Phòng Nhân sự', label: 'Phòng Nhân sự' }
  ]

  const skillGroupsList = [
    { value: 'Kinh doanh', label: 'Kinh doanh' },
    { value: 'Kế toán', label: 'Kế toán' },
    { value: 'Công nghệ thông tin', label: 'Công nghệ thông tin' },
    { value: 'Nhân sự', label: 'Nhân sự' },
    { value: 'Vận hành', label: 'Vận hành' }
  ]

  const columns: any = [
    {
      dataIndex: 'name',
      key: 'name',
      width: 200,
      title: () => {
        return <FISTableHeaderCell label='Tên nhân viên' hasRightDivider />
      },
      render: (_: any, row: EmployeeI) => (
        <FISTableCell
          content={
            <button
              onClick={() => navigate(buildEmployeeDetailPath(row.key))}
              className='text-blue-600 hover:text-blue-800 hover:underline cursor-pointer text-left'
            >
              {row.name}
            </button>
          }
          textAlign='left'
        />
      )
    },
    {
      dataIndex: 'employeeCode',
      key: 'employeeCode',
      width: 150,
      title: () => <FISTableHeaderCell label='Mã nhân viên' hasRightDivider />,
      render: (_: any, row: EmployeeI) => <FISTableCell content={row.employeeCode} textAlign='left' />
    },
    {
      dataIndex: 'department',
      key: 'department',
      width: 200,
      title: () => <FISTableHeaderCell label='Phòng ban' hasRightDivider />,
      render: (_: any, row: EmployeeI) => <FISTableCell content={row.department} textAlign='left' />
    },
    {
      dataIndex: 'skillGroup',
      key: 'skillGroup',
      width: 180,
      title: () => <FISTableHeaderCell label='Nhóm kỹ năng' hasRightDivider />,
      render: (_: any, row: EmployeeI) => <FISTableCell content={row.skillGroup || '-'} textAlign='left' />
    },
    {
      dataIndex: 'position',
      key: 'position',
      width: 180,
      title: () => <FISTableHeaderCell label='Chức vụ' hasRightDivider />,
      render: (_: any, row: EmployeeI) => <FISTableCell content={row.position || '-'} textAlign='left' />
    },
    {
      dataIndex: 'status',
      key: 'status',
      width: 150,
      title: () => <FISTableHeaderCell label='Trạng thái' hasRightDivider />,
      render: (_: any, row: EmployeeI) => getStatusBadge(row.status)
    },
    {
      title: () => <FISTableHeaderCell label='' />,
      dataIndex: 'actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: EmployeeI) => (
        <FISTableCell
          style={{ textAlign: 'center' }}
          icon={
            <FISButtonGroup
              size='md'
              options={[
                {
                  label: '',
                  startIcon: (
                    <FISIconButton
                      size='xs'
                      icon={
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                          />
                        </svg>
                      }
                      variant='tertiary-invisible'
                      color='blue'
                      onClick={() => handleEdit(record)}
                    />
                  )
                },
                {
                  label: '',
                  startIcon: (
                    <FISIconButton
                      size='xs'
                      icon={
                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
                      }
                      variant='secondary-invisible-negative'
                      onClick={() => handleDelete(record)}
                    />
                  )
                }
              ]}
            />
          }
        />
      )
    }
  ]

  return (
    <PageWrapper className='py-5' title='Hồ sơ nhân viên' breadcrumbItems={employees.breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        {/* Table Toolbar with Filter */}
        <TableToolbar
          filterContent={
            <EmployeesFilter
              control={employees.control}
              departmentsList={departmentsList}
              skillGroupsList={skillGroupsList}
            />
          }
          actionButtons={
            <div className='flex gap-2'>
              <Upload
                accept='.xlsx,.xls'
                beforeUpload={(file) => {
                  handleBulkImport(file)
                  return false
                }}
                showUploadList={false}
              >
                <FISButton variant='secondary' startIcon={<UploadOutlined />}>
                  Nhập Excel
                </FISButton>
              </Upload>
              <FISButton variant='secondary' startIcon={<DownloadOutlined />} onClick={() => handleExport('xlsx')}>
                Xuất Excel
              </FISButton>
              <FISButton variant='secondary' startIcon={<DownloadOutlined />} onClick={() => handleExport('pdf')}>
                Xuất PDF
              </FISButton>
              <FISButton variant='primary' startIcon={<AddIcon />} onClick={handleAddNew}>
                Tạo mới
              </FISButton>
            </div>
          }
          {...employees}
          searchPlaceholder='Tìm kiếm nhân viên...'
        />

        {/* FISTable */}
        <div className='flex-1 bg-white rounded-lg overflow-hidden p-4'>
          <FISTable
            dataSource={dataSource}
            columns={columns}
            rowSelection={rowSelection}
            scroll={{ x: 'max-content' }}
            expandable={{
              expandedRowKeys,
              expandedRowRender: (record: EmployeeI) => (
                <div className='p-4'>
                  <p className='text-sm text-gray-600'>
                    <strong>Email:</strong> {record.email || '-'}
                  </p>
                  <p className='text-sm text-gray-600 mt-2'>
                    <strong>Số điện thoại:</strong> {record.phone || '-'}
                  </p>
                  <p className='text-sm text-gray-600 mt-2'>
                    <strong>Chức vụ:</strong> {record.position || '-'}
                  </p>
                </div>
              ),
              onExpand: (_expanded, record) => toggleExpand(record.key),
              expandIcon: () => null,
              expandIconColumnIndex: -1
            }}
          />
        </div>
      </div>

      {/* Employee Modal */}
      <EmployeeModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        departmentsList={departmentsList}
        skillGroupsList={skillGroupsList}
        initialData={editingEmployee}
      />
    </PageWrapper>
  )
}

export default Employees
