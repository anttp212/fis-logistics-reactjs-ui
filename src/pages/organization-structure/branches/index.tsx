import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper, TableToolbar } from '@components'
import { FISButton, FISTable, FISTableCell, FISTableHeaderCell, FISIconButton, FISButtonGroup } from 'fis-component'
import { AddIcon } from '@images'
import BranchModal from './components/BranchModal'
import BranchesFilter from './components/BranchesFilter'
import { useBranches } from './useBranches'
import { buildBranchDetailPath } from '@constants'

// Branch type
interface BranchI {
  key: string
  name: string
  code: string
  address?: string
  phone?: string
  email?: string
  description?: string
  status?: string
}

// Fake data cho danh sách chi nhánh
const FAKE_BRANCHES_DATA: BranchI[] = [
  {
    key: '1',
    name: 'Chi nhánh Hà Nội',
    code: 'HN001',
    address: '123 Đường ABC, Quận XYZ, Hà Nội',
    phone: '0241234567',
    email: 'hanoi@example.com',
    description: 'Chi nhánh chính tại Hà Nội',
    status: 'active'
  },
  {
    key: '2',
    name: 'Chi nhánh Hồ Chí Minh',
    code: 'HCM001',
    address: '456 Đường DEF, Quận 1, TP.HCM',
    phone: '0287654321',
    email: 'hcm@example.com',
    description: 'Chi nhánh tại TP.HCM',
    status: 'active'
  },
  {
    key: '3',
    name: 'Chi nhánh Đà Nẵng',
    code: 'DN001',
    address: '789 Đường GHI, Quận Hải Châu, Đà Nẵng',
    phone: '0236123456',
    email: 'danang@example.com',
    description: 'Chi nhánh tại Đà Nẵng',
    status: 'active'
  },
  {
    key: '4',
    name: 'Chi nhánh Cần Thơ',
    code: 'CT001',
    address: '321 Đường JKL, Quận Ninh Kiều, Cần Thơ',
    phone: '0292123456',
    email: 'cantho@example.com',
    description: 'Chi nhánh tại Cần Thơ',
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

const Branches = () => {
  const navigate = useNavigate()
  const branches = useBranches()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<BranchI | null>(null)

  // Get filter values from form
  const filterValues = branches.watch()

  // Apply filters to data
  const dataSource = useMemo(() => {
    let filtered = [...FAKE_BRANCHES_DATA]

    // Filter by name
    if (filterValues.name) {
      const searchTerm = filterValues.name.toLowerCase()
      filtered = filtered.filter((branch) => branch.name.toLowerCase().includes(searchTerm))
    }

    // Filter by code
    if (filterValues.code) {
      const searchTerm = filterValues.code.toLowerCase()
      filtered = filtered.filter((branch) => branch.code.toLowerCase().includes(searchTerm))
    }

    // Filter by status
    if (filterValues.status) {
      filtered = filtered.filter((branch) => branch.status === filterValues.status)
    }

    // Filter by search (general search)
    if (branches.search) {
      const searchTerm = branches.search.toLowerCase()
      filtered = filtered.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchTerm) ||
          branch.code.toLowerCase().includes(searchTerm) ||
          branch.address?.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  }, [filterValues, branches.search])

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
    setEditingBranch(null)
    setIsModalOpen(true)
  }

  const handleEdit = (record: BranchI) => {
    setEditingBranch(record)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingBranch(null)
  }

  const handleModalSubmit = async (formData: {
    name: string
    code: string
    address?: string
    phone?: string
    email?: string
    description?: string
  }) => {
    try {
      if (editingBranch) {
        // TODO: Call API to update branch
        // eslint-disable-next-line no-console
        console.log('Update branch:', editingBranch.key, formData)
      } else {
        // TODO: Call API to create branch
        // eslint-disable-next-line no-console
        console.log('Create branch:', formData)
      }
      handleModalClose()
      // TODO: Refresh branch list
    } catch (error) {
      console.error('Error saving branch:', error)
      // TODO: Show error notification
    }
  }

  const handleDelete = (record: BranchI) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa chi nhánh này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{record.name}</p>
          <p className='mt-1 text-sm text-gray-500'>{record.code}</p>
          <p className='mt-1 text-sm text-gray-500'>Hành động này không thể hoàn tác.</p>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // TODO: Call API to delete branch
          // eslint-disable-next-line no-console
          console.log('Delete branch:', record.key)
          // TODO: Refresh branch list
        } catch (error) {
          console.error('Error deleting branch:', error)
          // TODO: Show error notification
          throw error
        }
      },
      onCancel: () => {
        // User cancelled
      }
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

  const columns: any = [
    {
      dataIndex: 'name',
      key: 'name',
      width: 250,
      title: () => {
        return <FISTableHeaderCell label='Tên chi nhánh' hasRightDivider />
      },
      render: (_: any, row: BranchI) => (
        <FISTableCell
          content={
            <button
              onClick={() => navigate(buildBranchDetailPath(row.key))}
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
      title: () => <FISTableHeaderCell label='Mã chi nhánh' hasRightDivider />,
      render: (_: any, row: BranchI) => <FISTableCell content={row.code} textAlign='left' />
    },
    {
      dataIndex: 'address',
      key: 'address',
      width: 300,
      title: () => <FISTableHeaderCell label='Địa chỉ' hasRightDivider />,
      render: (_: any, row: BranchI) => <FISTableCell content={row.address || '-'} textAlign='left' />
    },
    {
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      title: () => <FISTableHeaderCell label='Số điện thoại' hasRightDivider />,
      render: (_: any, row: BranchI) => <FISTableCell content={row.phone || '-'} textAlign='left' />
    },
    {
      dataIndex: 'status',
      key: 'status',
      width: 150,
      title: () => <FISTableHeaderCell label='Trạng thái' hasRightDivider />,
      render: (_: any, row: BranchI) => getStatusBadge(row.status)
    },
    {
      title: () => <FISTableHeaderCell label='' />,
      dataIndex: 'actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: BranchI) => (
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
    <PageWrapper className='p-5' title='Chi nhánh' breadcrumbItems={branches.breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        {/* Table Toolbar with Filter */}
        <TableToolbar
          filterContent={<BranchesFilter control={branches.control} />}
          actionButtons={
            <FISButton variant='primary' startIcon={<AddIcon />} onClick={handleAddNew}>
              Tạo mới
            </FISButton>
          }
          {...branches}
          searchPlaceholder='Tìm kiếm chi nhánh...'
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
              expandedRowRender: (record: BranchI) => (
                <div className='p-4'>
                  <p className='text-sm text-gray-600'>
                    <strong>Địa chỉ:</strong> {record.address || '-'}
                  </p>
                  <p className='text-sm text-gray-600 mt-2'>
                    <strong>Số điện thoại:</strong> {record.phone || '-'}
                  </p>
                  <p className='text-sm text-gray-600 mt-2'>
                    <strong>Email:</strong> {record.email || '-'}
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

      {/* Branch Modal */}
      <BranchModal open={isModalOpen} onClose={handleModalClose} onSubmit={handleModalSubmit} initialData={editingBranch} />
    </PageWrapper>
  )
}

export default Branches
