import { useState, useMemo } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper, TableToolbar } from '@components'
import { FISButton, FISTable, FISTableCell, FISTableHeaderCell, FISIconButton, FISButtonGroup } from 'fis-component'
import { AddIcon } from '@images'
import UserModal from './components/UserModal'
import UsersFilter from './components/UsersFilter'
import { useGetUserGroupsQuery } from '../user-group/userGroup.api'
import { useUsers } from './useUsers'

// User type
interface UserI {
  key: string
  username: string
  email: string
  userGroup: string
  role: 'admin' | 'operator' | 'accountant' | 'viewer'
  status?: string
}

// Fake data cho danh sách người dùng
const FAKE_USERS_DATA: UserI[] = [
  {
    key: '1',
    username: 'admin001',
    email: 'admin001@example.com',
    userGroup: 'Văn phòng',
    role: 'admin',
    status: 'active'
  },
  {
    key: '2',
    username: 'operator001',
    email: 'operator001@example.com',
    userGroup: 'Nhân viên hiện trường',
    role: 'operator',
    status: 'active'
  },
  {
    key: '3',
    username: 'accountant001',
    email: 'accountant001@example.com',
    userGroup: 'Văn phòng',
    role: 'accountant',
    status: 'active'
  },
  {
    key: '4',
    username: 'viewer001',
    email: 'viewer001@example.com',
    userGroup: 'Khách hàng',
    role: 'viewer',
    status: 'inactive'
  },
  {
    key: '5',
    username: 'operator002',
    email: 'operator002@example.com',
    userGroup: 'Nhân viên hiện trường',
    role: 'operator',
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

const UserManagementUsers = () => {
  // Use users hook for filter and search
  const users = useUsers()

  // Get user groups for select dropdown
  const { data: userGroupsResponse } = useGetUserGroupsQuery()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserI | null>(null)

  // Get filter values from form
  const filterValues = users.watch()

  // Apply filters to data
  const dataSource = useMemo(() => {
    let filtered = [...FAKE_USERS_DATA]

    // Filter by name (username or email)
    if (filterValues.name) {
      const searchTerm = filterValues.name.toLowerCase()
      filtered = filtered.filter(
        (user) => user.username.toLowerCase().includes(searchTerm) || user.email.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by userGroup
    if (filterValues.userGroup) {
      filtered = filtered.filter((user) => user.userGroup === filterValues.userGroup)
    }

    // Filter by role
    if (filterValues.role) {
      filtered = filtered.filter((user) => user.role === filterValues.role)
    }

    // Filter by status
    if (filterValues.status) {
      filtered = filtered.filter((user) => user.status === filterValues.status)
    }

    // Filter by search (general search)
    if (users.search) {
      const searchTerm = users.search.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.userGroup.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  }, [filterValues, users.search])

  // Get user groups list for select
  const userGroupsList = useMemo(() => {
    if (userGroupsResponse?.data?.data && Array.isArray(userGroupsResponse.data.data)) {
      return userGroupsResponse.data.data.map((group) => ({
        value: group.name,
        label: group.name
      }))
    }
    // Fallback data
    return [
      { value: 'Khách hàng', label: 'Khách hàng' },
      { value: 'Văn phòng', label: 'Văn phòng' },
      { value: 'Nhân viên hiện trường', label: 'Nhân viên hiện trường' }
    ]
  }, [userGroupsResponse])

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
    setEditingUser(null)
    setIsModalOpen(true)
  }

  const handleEdit = (record: UserI) => {
    setEditingUser(record)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingUser(null)
  }

  const handleModalSubmit = async (formData: {
    username: string
    email: string
    password: string
    userGroup: string
    role: 'admin' | 'operator' | 'accountant' | 'viewer'
  }) => {
    try {
      if (editingUser) {
        // TODO: Call API to update user
        // eslint-disable-next-line no-console
        console.log('Update user:', editingUser.key, formData)
      } else {
        // TODO: Call API to create user
        // eslint-disable-next-line no-console
        console.log('Create user:', formData)
      }
      handleModalClose()
      // TODO: Refresh user list
    } catch (error) {
      console.error('Error saving user:', error)
      // TODO: Show error notification
    }
  }

  const handleDelete = (record: UserI) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa tài khoản người dùng này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{record.username}</p>
          <p className='mt-1 text-sm text-gray-500'>{record.email}</p>
          <p className='mt-1 text-sm text-gray-500'>Hành động này không thể hoàn tác.</p>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // TODO: Call API to delete user
          // eslint-disable-next-line no-console
          console.log('Delete user:', record.key)
          // TODO: Refresh user list
        } catch (error) {
          console.error('Error deleting user:', error)
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

  const getRoleLabel = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: 'Quản trị viên',
      operator: 'Điều hành',
      accountant: 'Kế toán',
      viewer: 'Người xem'
    }
    return roleMap[role] || role
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
      dataIndex: 'username',
      key: 'username',
      width: 200,
      title: () => {
        return <FISTableHeaderCell label='Tên người dùng' hasRightDivider />
      },
      render: (_: any, row: UserI) => <FISTableCell content={row.username} textAlign='left' />
    },
    {
      dataIndex: 'email',
      key: 'email',
      width: 250,
      title: () => <FISTableHeaderCell label='Email' hasRightDivider />,
      render: (_: any, row: UserI) => <FISTableCell content={row.email} textAlign='left' />
    },
    {
      dataIndex: 'userGroup',
      key: 'userGroup',
      width: 200,
      title: () => <FISTableHeaderCell label='Nhóm người dùng' hasRightDivider />,
      render: (_: any, row: UserI) => <FISTableCell content={row.userGroup} textAlign='left' />
    },
    {
      dataIndex: 'role',
      key: 'role',
      width: 150,
      title: () => <FISTableHeaderCell label='Vai trò' hasRightDivider />,
      render: (_: any, row: UserI) => <FISTableCell content={getRoleLabel(row.role)} textAlign='left' />
    },
    {
      dataIndex: 'status',
      key: 'status',
      width: 150,
      title: () => <FISTableHeaderCell label='Trạng thái' hasRightDivider />,
      render: (_: any, row: UserI) => getStatusBadge(row.status)
    },
    {
      title: () => <FISTableHeaderCell label='' />,
      dataIndex: 'actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: UserI) => (
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
    <PageWrapper className='p-5' title='Tài khoản người dùng' breadcrumbItems={users.breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        {/* Table Toolbar with Filter */}
        <TableToolbar
          filterContent={<UsersFilter control={users.control} userGroupsList={userGroupsList} />}
          actionButtons={
            <FISButton variant='primary' startIcon={<AddIcon />} onClick={handleAddNew}>
              Tạo mới
            </FISButton>
          }
          {...users}
          searchPlaceholder='Tìm kiếm người dùng...'
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
              expandedRowRender: (record: UserI) => (
                <div className='p-4'>
                  <p className='text-sm text-gray-600'>
                    <strong>Email:</strong> {record.email}
                  </p>
                  <p className='text-sm text-gray-600 mt-2'>
                    <strong>Nhóm:</strong> {record.userGroup}
                  </p>
                  <p className='text-sm text-gray-600 mt-2'>
                    <strong>Vai trò:</strong> {getRoleLabel(record.role)}
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

      {/* User Modal */}
      <UserModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        userGroupsList={userGroupsList}
        initialData={editingUser}
      />
    </PageWrapper>
  )
}

export default UserManagementUsers
