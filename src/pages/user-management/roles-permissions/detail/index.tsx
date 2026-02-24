import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { PageWrapper } from '@components'
import { ROUTES, getMenuEntriesForPermissionMatrix, buildMenuPermissions, getAllPermissionKeys } from '@constants'
import { FISButton } from 'fis-component'
import { BackIcon } from '@images'
import { useTranslation } from 'react-i18next'
import type { MenuPermissionI } from '@app-types/permission'
import { PERMISSION_ACTIONS } from '@app-types/permission'

interface RolePermissionDetailI {
  key: string
  name: string
  description: string
  menuPermissions: MenuPermissionI[]
  status?: string
  createdAt?: string
  updatedAt?: string
  userCount?: number
}

// Fake API function to get role permission detail (3 vai trò: Admin, Tài xế, Bảo vệ)
const fetchRolePermissionDetail = async (roleId: string): Promise<RolePermissionDetailI | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500))

  const fakeRoles: Record<string, RolePermissionDetailI> = {
    admin: {
      key: 'admin',
      name: 'Admin',
      description: 'Toàn quyền hệ thống',
      menuPermissions: buildMenuPermissions(getAllPermissionKeys()),
      status: 'active',
      createdAt: '2024-01-10',
      updatedAt: '2024-12-15',
      userCount: 1
    },
    driver: {
      key: 'driver',
      name: 'Tài xế',
      description: 'Tất cả quyền quản lý depot',
      menuPermissions: buildMenuPermissions(['depot']),
      status: 'active',
      createdAt: '2024-02-15',
      updatedAt: '2024-12-10',
      userCount: 1
    },
    security: {
      key: 'security',
      name: 'Bảo vệ',
      description: 'Tất cả quyền quản lý kho',
      menuPermissions: buildMenuPermissions(['warehouse']),
      status: 'active',
      createdAt: '2024-03-20',
      updatedAt: '2024-12-05',
      userCount: 1
    }
  }

  return fakeRoles[roleId] || null
}

const ACTION_LABELS: Record<(typeof PERMISSION_ACTIONS)[number], string> = {
  view: 'Xem',
  create: 'Tạo',
  edit: 'Chỉnh sửa',
  delete: 'Xóa',
  search: 'Tìm kiếm'
}

const RoleDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [role, setRole] = useState<RolePermissionDetailI | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRoleDetail = async () => {
      if (!id) {
        setError('ID vai trò không hợp lệ')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const roleData = await fetchRolePermissionDetail(id)
        if (roleData) {
          setRole(roleData)
        } else {
          setError('Không tìm thấy thông tin vai trò')
        }
      } catch (err) {
        setError('Có lỗi xảy ra khi tải thông tin vai trò')
        console.error('Error loading role detail:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadRoleDetail()
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
        Không hoạt động
      </span>
    )
  }

  const getPermissionCategoryGroups = () => {
    if (!role?.menuPermissions?.length) return []
    const entries = getMenuEntriesForPermissionMatrix(t)
    return entries.map((entry) => {
      const perm = role.menuPermissions.find((p) => p.menuKey === entry.permissionKey)
      return { entry, perm }
    })
  }

  const handleActivateDeactivate = () => {
    if (!role) return

    const isDeactivating = role.status === 'active'
    const actionText = isDeactivating ? 'vô hiệu hóa' : 'kích hoạt'

    Modal.confirm({
      title: `Xác nhận ${actionText} vai trò`,
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn {actionText} vai trò này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{role.name}</p>
          <p className='mt-1 text-sm text-gray-500'>{role.description}</p>
          {isDeactivating && (
            <p className='mt-1 text-sm text-gray-500'>
              Vai trò sẽ không thể được sử dụng sau khi bị vô hiệu hóa. Người dùng có vai trò này sẽ bị ảnh hưởng.
            </p>
          )}
        </div>
      ),
      okText: isDeactivating ? 'Vô hiệu hóa' : 'Kích hoạt',
      okType: isDeactivating ? 'danger' : 'default',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // TODO: Call API to activate/deactivate role
          // eslint-disable-next-line no-console
          console.log(`${isDeactivating ? 'Deactivate' : 'Activate'} role:`, role.key)

          // Update local state
          setRole({
            ...role,
            status: isDeactivating ? 'inactive' : 'active',
            updatedAt: new Date().toISOString().split('T')[0]
          })

          // TODO: Show success notification
        } catch (error) {
          console.error(`Error ${actionText} role:`, error)
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

  const handleDelete = () => {
    if (!role) return

    Modal.confirm({
      title: 'Xác nhận xóa vai trò',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa vai trò này không?</p>
          <p className='mt-2 font-medium text-gray-900'>{role.name}</p>
          <p className='mt-1 text-sm text-gray-500'>{role.description}</p>
          <p className='mt-1 text-sm text-red-600 font-medium'>
            Hành động này không thể hoàn tác. Vai trò sẽ bị xóa vĩnh viễn khỏi hệ thống.
          </p>
          {role.userCount && role.userCount > 0 && (
            <p className='mt-1 text-sm text-orange-600'>
              Cảnh báo: Có {role.userCount} người dùng đang sử dụng vai trò này. Họ sẽ bị ảnh hưởng sau khi xóa.
            </p>
          )}
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // TODO: Call API to delete role
          // eslint-disable-next-line no-console
          console.log('Delete role:', role.key)

          // Navigate back to list after deletion
          navigate(ROUTES.userManagementRolesPermissions)

          // TODO: Show success notification
        } catch (error) {
          console.error('Error deleting role:', error)
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

  const breadcrumbItems = [
    { label: 'Trang chủ' },
    { label: 'Vai trò & phân quyền', onClick: () => navigate(ROUTES.userManagementRolesPermissions) },
    { label: 'Chi tiết vai trò' }
  ]

  return (
    <PageWrapper
      className='p-5'
      title='Chi tiết vai trò & phân quyền'
      breadcrumbItems={breadcrumbItems}
      hasBackButton
      actionButtons={
        <div className='flex gap-2'>
          {role && (
            <>
              <FISButton
                variant={role.status === 'active' ? 'secondary-negative' : 'primary'}
                onClick={handleActivateDeactivate}
              >
                {role.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
              </FISButton>
              {role.status === 'inactive' && (
                <FISButton variant='secondary-negative' onClick={handleDelete}>
                  Xóa
                </FISButton>
              )}
            </>
          )}
          <FISButton
            variant='tertiary'
            startIcon={<BackIcon />}
            onClick={() => navigate(ROUTES.userManagementRolesPermissions)}
          >
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

        {role && !isLoading && (
          <>
            {/* Basic Information */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {/* Left Column */}
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin cơ bản</h3>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Tên vai trò</label>
                        <p className='text-sm text-gray-900'>{role.name}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Mô tả</label>
                        <p className='text-sm text-gray-900'>{role.description}</p>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-500 mb-1'>Trạng thái</label>
                        <div className='mt-1'>{getStatusBadge(role.status)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className='space-y-6'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900 mb-4'>Thông tin hệ thống</h3>
                    <div className='space-y-4'>
                      {role.userCount !== undefined && (
                        <div>
                          <label className='block text-sm font-medium text-gray-500 mb-1'>Số người dùng</label>
                          <p className='text-sm text-gray-900'>{role.userCount} người dùng</p>
                        </div>
                      )}
                      {role.createdAt && (
                        <div>
                          <label className='block text-sm font-medium text-gray-500 mb-1'>Ngày tạo</label>
                          <p className='text-sm text-gray-900'>{role.createdAt}</p>
                        </div>
                      )}
                      {role.updatedAt && (
                        <div>
                          <label className='block text-sm font-medium text-gray-500 mb-1'>Cập nhật lần cuối</label>
                          <p className='text-sm text-gray-900'>{role.updatedAt}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className='bg-white rounded-lg border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Phân quyền theo menu</h3>
              <p className='text-sm text-gray-500 mb-4'>
                Mỗi menu có các quyền: Xem, Tạo, Chỉnh sửa, Xóa, Tìm kiếm
              </p>
              <div className='border border-gray-200 rounded-lg overflow-hidden overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='text-left py-2 px-3 font-medium text-gray-700'>Menu</th>
                      {PERMISSION_ACTIONS.map((action) => (
                        <th key={action} className='text-center py-2 px-2 font-medium text-gray-700'>
                          {ACTION_LABELS[action]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getPermissionCategoryGroups().map(({ entry, perm }) => (
                      <tr key={entry.permissionKey} className='border-t border-gray-100'>
                        <td className='py-2 px-3 text-gray-900'>{entry.label}</td>
                        {PERMISSION_ACTIONS.map((action) => (
                          <td key={action} className='py-2 px-2 text-center'>
                            {perm?.[action] ? (
                              <span className='text-green-600'>✓</span>
                            ) : (
                              <span className='text-gray-300'>—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  )
}

export default RoleDetail
