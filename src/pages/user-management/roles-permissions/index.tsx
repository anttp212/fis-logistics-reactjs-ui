import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper, TableToolbar } from '@components'
import { FISButton, FISTable, FISTableCell, FISTableHeaderCell, FISIconButton, FISButtonGroup } from 'fis-component'
import { AddIcon } from '@images'
import RolePermissionModal from './components/RolePermissionModal'
import RolesPermissionsFilter from './components/RolesPermissionsFilter'
import { useRolesPermissions } from './useRolesPermissions'
import { buildRoleDetailPath } from '@constants'
import { buildMenuPermissions, getAllPermissionKeys } from '@constants'
import type { MenuPermissionI } from '@app-types/permission'

// Role Permission type
interface RolePermissionI {
  key: string
  name: string
  description: string
  menuPermissions: MenuPermissionI[]
  status?: string
}

// 3 vai trò: Admin (tất cả quyền), Tài xế (full quyền depot), Bảo vệ (full quyền kho)
const FAKE_ROLES_PERMISSIONS_DATA: RolePermissionI[] = [
  {
    key: 'admin',
    name: 'Admin',
    description: 'Toàn quyền hệ thống',
    menuPermissions: buildMenuPermissions(getAllPermissionKeys()),
    status: 'active'
  },
  {
    key: 'driver',
    name: 'Tài xế',
    description: 'Tất cả quyền quản lý depot',
    menuPermissions: buildMenuPermissions(['depot']),
    status: 'active'
  },
  {
    key: 'security',
    name: 'Bảo vệ',
    description: 'Tất cả quyền quản lý kho',
    menuPermissions: buildMenuPermissions(['warehouse']),
    status: 'active'
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

const UserManagementRolesPermissions = () => {
  const navigate = useNavigate()
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
          role.menuPermissions.some((p) => p.menuKey.toLowerCase().includes(searchTerm))
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
    menuPermissions: MenuPermissionI[]
  }) => {
    try {
      if (editingRolePermission) {
        // TODO: Call API to update role permission
        // eslint-disable-next-line no-console
        console.log('Update role permission:', editingRolePermission.key, formData)
      } else {
        // TODO: Call API to create role permission
        // eslint-disable-next-line no-console
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
          <p>Bạn có chắc chắn muốn xóa Vai trò & phân quyền này không?</p>
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
          // eslint-disable-next-line no-console
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
        <FISTableCell
          content={
            <button
              onClick={() => navigate(buildRoleDetailPath(row.key))}
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
      dataIndex: 'description',
      key: 'description',
      width: 300,
      title: () => <FISTableHeaderCell label='Mô tả' hasRightDivider />,
      render: (_: any, row: RolePermissionI) => <FISTableCell content={row.description} textAlign='left' />
    },
    {
      dataIndex: 'permissions',
      key: 'permissions',
      width: 280,
      title: () => <FISTableHeaderCell label='Phân quyền' hasRightDivider />,
      render: (_: any, row: RolePermissionI) => {
        const perms = row.menuPermissions || []
        const viewCount = perms.filter((p) => p.view).length
        const createCount = perms.filter((p) => p.create).length
        const editCount = perms.filter((p) => p.edit).length
        const deleteCount = perms.filter((p) => p.delete).length
        const searchCount = perms.filter((p) => p.search).length
        const summary = [
          viewCount ? `Xem: ${viewCount}` : null,
          createCount ? `Tạo: ${createCount}` : null,
          editCount ? `Sửa: ${editCount}` : null,
          deleteCount ? `Xóa: ${deleteCount}` : null,
          searchCount ? `Tìm: ${searchCount}` : null
        ]
          .filter(Boolean)
          .join(', ')
        return <FISTableCell content={summary || '—'} textAlign='left' />
      }
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
    <PageWrapper className='p-5' title='Vai trò & phân quyền' breadcrumbItems={rolesPermissions.breadcrumbItems}>
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
          searchPlaceholder='Tìm kiếm Vai trò & phân quyền...'
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
                    <strong>Phân quyền:</strong> {(record.menuPermissions || []).length} menu đã cấu hình quyền
                    (Xem/Tạo/Sửa/Xóa/Tìm kiếm)
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
