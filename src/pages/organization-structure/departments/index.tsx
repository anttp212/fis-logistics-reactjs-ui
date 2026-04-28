import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper, TableToolbar } from '@components'
import { FISButton, FISTable, FISTableCell, FISTableHeaderCell, FISIconButton, FISButtonGroup } from 'fis-component'
import { AddIcon } from '@images'
import DepartmentModal from './components/DepartmentModal'
import DepartmentsFilter from './components/DepartmentsFilter'
import { useDepartments } from './useDepartments'
import { buildDepartmentDetailPath } from '@constants'

interface DepartmentI {
  key: string
  name: string
  code: string
  branch: string
  description?: string
  status?: string
}

const FAKE_DEPARTMENTS_DATA: DepartmentI[] = [
  {
    key: '1',
    name: 'Phòng Kinh doanh',
    code: 'KD001',
    branch: 'Chi nhánh Hà Nội',
    description: 'Phòng kinh doanh tại Hà Nội',
    status: 'active'
  },
  {
    key: '2',
    name: 'Phòng Kế toán',
    code: 'KT001',
    branch: 'Chi nhánh Hà Nội',
    description: 'Phòng kế toán tại Hà Nội',
    status: 'active'
  },
  {
    key: '3',
    name: 'Phòng Nhân sự',
    code: 'NS001',
    branch: 'Chi nhánh Hồ Chí Minh',
    description: 'Phòng nhân sự tại TP.HCM',
    status: 'active'
  },
  {
    key: '4',
    name: 'Phòng IT',
    code: 'IT001',
    branch: 'Chi nhánh Đà Nẵng',
    description: 'Phòng IT tại Đà Nẵng',
    status: 'inactive'
  }
]

interface TableRowSelectionI {
  selectedRowKeys?: React.Key[]
  onChange?: (selectedRowKeys: React.Key[]) => void
  renderCell?: (checked: boolean, record: any) => React.ReactNode
  columnTitle?: React.ReactNode
}

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

const Departments = () => {
  const navigate = useNavigate()
  const departments = useDepartments()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<DepartmentI | null>(null)

  const filterValues = departments.watch()

  const dataSource = useMemo(() => {
    let filtered = [...FAKE_DEPARTMENTS_DATA]

    if (filterValues.name) {
      const searchTerm = filterValues.name.toLowerCase()
      filtered = filtered.filter((dept) => dept.name.toLowerCase().includes(searchTerm))
    }

    if (filterValues.code) {
      const searchTerm = filterValues.code.toLowerCase()
      filtered = filtered.filter((dept) => dept.code.toLowerCase().includes(searchTerm))
    }

    if (filterValues.branch) {
      filtered = filtered.filter((dept) => dept.branch === filterValues.branch)
    }

    if (filterValues.status) {
      filtered = filtered.filter((dept) => dept.status === filterValues.status)
    }

    if (departments.search) {
      const searchTerm = departments.search.toLowerCase()
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(searchTerm) ||
          dept.code.toLowerCase().includes(searchTerm) ||
          dept.branch.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  }, [filterValues, departments.search])

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
    setEditingDepartment(null)
    setIsModalOpen(true)
  }

  const handleEdit = (record: DepartmentI) => {
    setEditingDepartment(record)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingDepartment(null)
  }

  const handleModalSubmit = async (formData: { name: string; code: string; branch: string; description?: string }) => {
    try {
      if (editingDepartment) {
        // eslint-disable-next-line no-console
        console.log('Update department:', editingDepartment.key, formData)
      } else {
        // eslint-disable-next-line no-console
        console.log('Create department:', formData)
      }
      handleModalClose()
    } catch (_error) {
      // Error handling
    }
  }

  const handleDelete = (record: DepartmentI) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa phòng ban này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{record.name}</p>
          <p className='mt-1 text-sm text-gray-500'>{record.code}</p>
          <p className='mt-1 text-sm text-gray-500'>Hành động này không thể hoàn tác.</p>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        // eslint-disable-next-line no-console
        console.log('Delete department:', record.key)
      },
      onCancel: () => {}
    })
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
        Không hoạt động
      </span>
    )
  }

  const branchesList = [
    { value: 'Chi nhánh Hà Nội', label: 'Chi nhánh Hà Nội' },
    { value: 'Chi nhánh Hồ Chí Minh', label: 'Chi nhánh Hồ Chí Minh' },
    { value: 'Chi nhánh Đà Nẵng', label: 'Chi nhánh Đà Nẵng' },
    { value: 'Chi nhánh Cần Thơ', label: 'Chi nhánh Cần Thơ' }
  ]

  // Fake users list
  const usersList = [
    { value: '1', label: 'admin001 - Admin User' },
    { value: '2', label: 'operator001 - Operator User' },
    { value: '3', label: 'accountant001 - Accountant User' },
    { value: '4', label: 'viewer001 - Viewer User' },
    { value: '5', label: 'operator002 - Operator User 2' },
    { value: '6', label: 'manager001 - Manager User' },
    { value: '7', label: 'staff001 - Staff User' }
  ]

  const columns: any = [
    {
      dataIndex: 'name',
      key: 'name',
      width: 250,
      title: () => {
        return <FISTableHeaderCell label='Tên phòng ban' hasRightDivider />
      },
      render: (_: any, row: DepartmentI) => (
        <FISTableCell
          content={
            <button
              onClick={() => navigate(buildDepartmentDetailPath(row.key))}
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
      dataIndex: 'code',
      key: 'code',
      width: 150,
      title: () => <FISTableHeaderCell label='Mã phòng ban' hasRightDivider />,
      render: (_: any, row: DepartmentI) => <FISTableCell content={row.code} textAlign='left' />
    },
    {
      dataIndex: 'branch',
      key: 'branch',
      width: 200,
      title: () => <FISTableHeaderCell label='Chi nhánh' hasRightDivider />,
      render: (_: any, row: DepartmentI) => <FISTableCell content={row.branch} textAlign='left' />
    },
    {
      dataIndex: 'status',
      key: 'status',
      width: 150,
      title: () => <FISTableHeaderCell label='Trạng thái' hasRightDivider />,
      render: (_: any, row: DepartmentI) => getStatusBadge(row.status)
    },
    {
      title: () => <FISTableHeaderCell label='' />,
      dataIndex: 'actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: DepartmentI) => (
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
    <PageWrapper className='py-5' title='Phòng ban' breadcrumbItems={departments.breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        <TableToolbar
          filterContent={<DepartmentsFilter control={departments.control} branchesList={branchesList} />}
          actionButtons={
            <FISButton variant='primary' startIcon={<AddIcon />} onClick={handleAddNew}>
              Tạo mới
            </FISButton>
          }
          {...departments}
          searchPlaceholder='Tìm kiếm phòng ban...'
        />

        <div className='flex-1 bg-white rounded-lg overflow-hidden p-4'>
          <FISTable
            dataSource={dataSource}
            columns={columns}
            rowSelection={rowSelection}
            scroll={{ x: 'max-content' }}
            expandable={{
              expandedRowKeys,
              expandedRowRender: (record: DepartmentI) => (
                <div className='p-4'>
                  <p className='text-sm text-gray-600'>
                    <strong>Chi nhánh:</strong> {record.branch}
                  </p>
                  {record.description && (
                    <p className='text-sm text-gray-600 mt-2'>
                      <strong>Mô tả:</strong> {record.description}
                    </p>
                  )}
                </div>
              ),
              onExpand: (_expanded, record) => toggleExpand(record.key),
              expandIcon: () => null,
              expandIconColumnIndex: -1
            }}
          />
        </div>
      </div>

      <DepartmentModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        branchesList={branchesList}
        usersList={usersList}
        initialData={editingDepartment}
      />
    </PageWrapper>
  )
}

export default Departments
