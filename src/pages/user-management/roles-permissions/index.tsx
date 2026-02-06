import { useState, useMemo } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper, TableToolbar } from '@components'
import {
  FISButton,
  FISTable,
  FISTableCell,
  FISTableHeaderCell,
  FISIconButton,
  FISButtonGroup
} from 'fis-component'
import { AddIcon } from '@images'
import RolePermissionModal from './components/RolePermissionModal'
import RolesPermissionsFilter from './components/RolesPermissionsFilter'
import { useRolesPermissions } from './useRolesPermissions'

// Role Permission type
interface RolePermissionI {
  key: string
  name: string
  description: string
  permissions: string[]
  status?: string
}

// Fake data cho danh sách vai trò và phân quyền
const FAKE_ROLES_PERMISSIONS_DATA: RolePermissionI[] = [
  {
    key: '1',
    name: 'Quản trị viên',
    description: 'Toàn quyền truy cập hệ thống',
    permissions: ['read', 'write', 'delete', 'admin'],
    status: 'active'
  },
  {
    key: '2',
    name: 'Điều hành',
    description: 'Quyền quản lý và điều phối hoạt động',
    permissions: ['read', 'write', 'manage'],
    status: 'active'
  },
  {
    key: '3',
    name: 'Kế toán',
    description: 'Quyền xem và quản lý tài chính',
    permissions: ['read', 'write', 'finance'],
    status: 'active'
  },
  {
    key: '4',
    name: 'Người xem',
    description: 'Chỉ có quyền xem dữ liệu',
    permissions: ['read'],
    status: 'active'
  },
  {
    key: '5',
    name: 'Nhân viên kho',
    description: 'Quyền quản lý kho hàng',
    permissions: ['read', 'write', 'warehouse'],
    status: 'inactive'
  }
]

// TableRowSelection type
interface TableRowSelection {
  selectedRowKeys?: React.Key[]
  onChange?: (selectedRowKeys: React.Key[]) => void
  renderCell?: (checked: boolean, record: any) => React.ReactNode
  columnTitle?: React.ReactNode
}

// Simple Checkbox component
interface CheckboxProps {
  checked?: boolean
  indeterminate?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = ({ checked = false, indeterminate = false, onChange }: CheckboxProps) => {
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

const UserManagementRolesPermissions = () => {
  // Use rolesPermissions hook for filter and search
  const rolesPermissions = useRolesPermissions()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRolePermission, setEditingRolePermission] = useState<RolePermissionI | null>(null)

  // Get filter values from form
  const filterValues = rolesPermissions.watch()

  // Apply filters to data
  const dataSource = useMemo(() => {
    let filtered = [...FAKE_ROLES_PERMISSIONS_DATA]

    // Filter by name
    if (filterValues.name) {
      const searchTerm = filterValues.name.toLowerCase()
      filtered = filtered.filter((role) => role.name.toLowerCase().includes(searchTerm))
    }

    // Filter by description
    if (filterValues.description) {
      const searchTerm = filterValues.description.toLowerCase()
      filtered = filtered.filter((role) => role.description.toLowerCase().includes(searchTerm))
    }

    // Filter by search (general search)
    if (rolesPermissions.search) {
      const searchTerm = rolesPermissions.search.toLowerCase()
      filtered = filtered.filter(
        (role) =>
          role.name.toLowerCase().includes(searchTerm) ||
          role.description.toLowerCase().includes(searchTerm) ||
          role.permissions.some((p) => p.toLowerCase().includes(searchTerm))
      )
    }

    return filtered
  }, [filterValues, rolesPermissions.search])

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

  const rowSelection: TableRowSelection = {
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
    setEditingRolePermission(null)
    setIsModalOpen(true)
  }

  const handleEdit = (record: RolePermissionI) => {
    setEditingRolePermission(record)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingRolePermission(null)
  }

  const handleModalSubmit = async (formData: {
    name: string
    description: string
    permissions: string[]
  }) => {
    try {
      if (editingRolePermission) {
        // TODO: Call API to update role permission
        console.log('Update role permission:', editingRolePermission.key, formData)
      } else {
        // TODO: Call API to create role permission
        console.log('Create role permission:', formData)
      }
      handleModalClose()
      // TODO: Refresh role permission list
    } catch (error) {
      console.error('Error saving role permission:', error)
      // TODO: Show error notification
    }
  }

  const handleDelete = (record: RolePermissionI) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa vai trò và phân quyền này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{record.name}</p>
          <p className='mt-1 text-sm text-gray-500'>{record.description}</p>
          <p className='mt-1 text-sm text-gray-500'>Hành động này không thể hoàn tác.</p>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // TODO: Call API to delete role permission
          console.log('Delete role permission:', record.key)
          // TODO: Refresh role permission list
        } catch (error) {
          console.error('Error deleting role permission:', error)
          // TODO: Show error notification
          // Re-throw để modal không đóng khi có lỗi
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
      width: 200,
      title: () => {
        return <FISTableHeaderCell label='Tên vai trò' hasRightDivider />
      },
      render: (_: any, row: RolePermissionI) => (
        <FISTableCell content={row.name} textAlign='left' />
      )
    },
    {
      dataIndex: 'description',
      key: 'description',
      width: 300,
      title: () => <FISTableHeaderCell label='Mô tả' hasRightDivider />,
      render: (_: any, row: RolePermissionI) => <FISTableCell content={row.description} textAlign='left' />
    },
    {
      dataIndex: 'permissions',
      key: 'permissions',
      width: 250,
      title: () => <FISTableHeaderCell label='Phân quyền' hasRightDivider />,
      render: (_: any, row: RolePermissionI) => (
        <FISTableCell
          content={row.permissions.join(', ')}
          textAlign='left'
        />
      )
    },
    {
      dataIndex: 'status',
      key: 'status',
      width: 150,
      title: () => <FISTableHeaderCell label='Trạng thái' hasRightDivider />,
      render: (_: any, row: RolePermissionI) => getStatusBadge(row.status)
    },
    {
      title: () => <FISTableHeaderCell label='' />,
      dataIndex: 'actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: RolePermissionI) => (
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
    <PageWrapper className='p-5' title='Vai trò và phân quyền' breadcrumbItems={rolesPermissions.breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        {/* Table Toolbar with Filter */}
        <TableToolbar
          filterContent={<RolesPermissionsFilter control={rolesPermissions.control} />}
          actionButtons={
            <FISButton variant='primary' startIcon={<AddIcon />} onClick={handleAddNew}>
              Tạo mới
            </FISButton>
          }
          {...rolesPermissions}
          searchPlaceholder='Tìm kiếm vai trò và phân quyền...'
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
              expandedRowRender: (record: RolePermissionI) => (
                <div className='p-4'>
                  <p className='text-sm text-gray-600'>
                    <strong>Mô tả:</strong> {record.description}
                  </p>
                  <p className='text-sm text-gray-600 mt-2'>
                    <strong>Phân quyền:</strong> {record.permissions.join(', ')}
                  </p>
                  <p className='text-sm text-gray-600 mt-2'>
                    <strong>Trạng thái:</strong> {record.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
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

      {/* Role Permission Modal */}
      <RolePermissionModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={editingRolePermission}
      />
    </PageWrapper>
  )
}

export default UserManagementRolesPermissions
