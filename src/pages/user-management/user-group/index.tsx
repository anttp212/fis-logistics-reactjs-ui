import { useState, useMemo } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper, TableToolbar } from '@components'
import { FISButton, FISTable, FISTableCell, FISTableHeaderCell, FISIconButton, FISButtonGroup } from 'fis-component'
import { AddIcon } from '@images'
import {
  useGetUserGroupsQuery,
  useCreateUserGroupMutation,
  useUpdateUserGroupMutation,
  useDeleteUserGroupMutation
} from './userGroup.api'
import type { UserGroupI } from './userGroup.api'
import UserGroupModal from './components/UserGroupModal'
import UserGroupFilter from './components/UserGroupFilter'
import { useUserGroup } from './useUserGroup'

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

// Fallback data cứng khi API trả về lỗi hoặc chưa có data
const FALLBACK_DATA: UserGroupI[] = [
  {
    key: '1',
    name: 'Khách hàng',
    description: 'Chủ hàng lẻ, Đại lý'
  },
  {
    key: '2',
    name: 'Văn phòng',
    description: 'CS, Điều phối, Kế toán'
  },
  {
    key: '3',
    name: 'Nhân viên hiện trường',
    description: 'Kiểm viên kho, Kiểm viên bãi, Bảo vệ, Tài xế'
  }
]

const UserManagementUserGroup = () => {
  // Use userGroup hook for filter and search
  const userGroup = useUserGroup()

  // Call API để lấy danh sách nhóm người dùng
  const { data: apiResponse, isLoading, error } = useGetUserGroupsQuery()
  const [createUserGroup, { isLoading: isCreating }] = useCreateUserGroupMutation()
  const [updateUserGroup, { isLoading: isUpdating }] = useUpdateUserGroupMutation()
  const [deleteUserGroup] = useDeleteUserGroupMutation()

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUserGroup, setEditingUserGroup] = useState<UserGroupI | null>(null)

  // Get filter values from form
  const filterValues = userGroup.watch()

  // Get raw data from API or fallback
  const rawDataSource = useMemo(() => {
    if (apiResponse?.data?.data && Array.isArray(apiResponse.data.data) && apiResponse.data.data.length > 0) {
      return apiResponse.data.data
    }
    // Fix cứng list này khi API trả về lỗi hoặc chưa có data
    return FALLBACK_DATA
  }, [apiResponse])

  // Apply filters to data
  const dataSource = useMemo(() => {
    let filtered = [...rawDataSource]

    // Filter by name
    if (filterValues.name) {
      const searchTerm = filterValues.name.toLowerCase()
      filtered = filtered.filter((group) => group.name.toLowerCase().includes(searchTerm))
    }

    // Filter by description
    if (filterValues.description) {
      const searchTerm = filterValues.description.toLowerCase()
      filtered = filtered.filter((group) => group.description.toLowerCase().includes(searchTerm))
    }

    // Filter by search (general search)
    if (userGroup.search) {
      const searchTerm = userGroup.search.toLowerCase()
      filtered = filtered.filter(
        (group) => group.name.toLowerCase().includes(searchTerm) || group.description.toLowerCase().includes(searchTerm)
      )
    }

    return filtered
  }, [rawDataSource, filterValues, userGroup.search])
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])
  const [sortedInfo] = useState<{
    columnKey: string | null
    order: string | null
  }>({
    columnKey: null,
    order: null
  })

  // Sorting handler - can be used when implementing sort functionality
  // const handleSort = (columnKey: string | null, order: string | null) => {
  //   setSortedInfo({
  //     columnKey,
  //     order
  //   })
  // }

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
    setEditingUserGroup(null)
    setIsModalOpen(true)
  }

  const handleEdit = (record: UserGroupI) => {
    setEditingUserGroup(record)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setEditingUserGroup(null)
  }

  const handleModalSubmit = async (formData: { name: string; description: string }) => {
    try {
      if (editingUserGroup) {
        // Update existing user group
        await updateUserGroup({
          id: editingUserGroup.key,
          data: formData
        }).unwrap()
      } else {
        // Create new user group
        await createUserGroup(formData).unwrap()
      }
      handleModalClose()
    } catch (error) {
      console.error('Error saving user group:', error)
      // TODO: Show error notification
    }
  }

  const handleDelete = (record: UserGroupI) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa nhóm người dùng này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{record.name}</p>
          <p className='mt-1 text-sm text-gray-500'>Hành động này không thể hoàn tác.</p>
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteUserGroup(record.key).unwrap()
          // TODO: Show success notification
        } catch (error) {
          console.error('Error deleting user group:', error)
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

  const columns: any = [
    {
      dataIndex: 'name',
      key: 'name',
      width: 250,
      sorter: (a: { name: string }, b: { name: string }) => (a.name || '').localeCompare(b.name || ''),
      sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null,
      showSorterTooltip: false,
      title: () => {
        return <FISTableHeaderCell label='Tên nhóm' hasRightDivider />
      },
      render: (_: any, row: { name: string | undefined; description: string | undefined; key: string }) => (
        <FISTableCell content={row.name} description={row.description} variant='primary-positive' textAlign='left' />
      )
    },
    {
      title: () => <FISTableHeaderCell label='Mô tả' description='Các loại trong nhóm' hasRightDivider />,
      dataIndex: 'description',
      key: 'description',
      width: 400,
      render: (_: any, row: { description: string | undefined }) => (
        <FISTableCell content={row.description} textAlign='left' />
      )
    },
    {
      title: () => <FISTableHeaderCell label='' />,
      dataIndex: 'actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: UserGroupI) => (
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
    <PageWrapper className='py-5' title='Nhóm người dùng' breadcrumbItems={userGroup.breadcrumbItems}>
      <div className='flex gap-5 flex-col h-full'>
        {/* Table Toolbar with Filter */}
        <TableToolbar
          filterContent={<UserGroupFilter control={userGroup.control} />}
          actionButtons={
            <FISButton variant='primary' startIcon={<AddIcon />} onClick={handleAddNew}>
              Thêm mới
            </FISButton>
          }
          {...userGroup}
          searchPlaceholder='Tìm kiếm nhóm người dùng...'
        />

        {/* FISTable */}
        <div className='flex-1 bg-white rounded-lg overflow-hidden p-4'>
          {isLoading ? (
            <div className='flex items-center justify-center h-64'>
              <div className='flex items-center gap-2 text-gray-600'>
                <svg
                  className='animate-spin h-5 w-5'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                <span>Đang tải dữ liệu...</span>
              </div>
            </div>
          ) : (
            <FISTable
              dataSource={dataSource}
              columns={columns}
              rowSelection={rowSelection}
              scroll={{ x: 'max-content' }}
              expandable={{
                expandedRowKeys,
                expandedRowRender: (record) => <div className='p-4'>{record.description}</div>,
                onExpand: (_expanded, record) => toggleExpand(record.key),
                expandIcon: () => null,
                expandIconColumnIndex: -1
              }}
            />
          )}
          {error && (
            <div className='mt-2 text-sm text-orange-600'>
              ⚠️ Không thể tải dữ liệu từ API. Đang sử dụng dữ liệu mặc định.
            </div>
          )}
        </div>
      </div>

      {/* User Group Modal */}
      <UserGroupModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        initialData={editingUserGroup}
        isLoading={isCreating || isUpdating}
      />
    </PageWrapper>
  )
}

export default UserManagementUserGroup
