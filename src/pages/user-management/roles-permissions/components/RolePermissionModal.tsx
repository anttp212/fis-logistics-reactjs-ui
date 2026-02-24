import { Modal, Checkbox } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { FISButton, FISInputText } from 'fis-component'
import { FC, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { getMenuEntriesForPermissionMatrix } from '@constants'
import type { MenuPermissionI } from '@app-types/permission'
import { PERMISSION_ACTIONS } from '@app-types/permission'

interface RolePermissionFormDataI {
  name: string
  description: string
  menuPermissions: MenuPermissionI[]
}

interface RolePermissionI {
  key: string
  name: string
  description: string
  menuPermissions: MenuPermissionI[]
  status?: string
}

interface RolePermissionModalPropsI {
  open: boolean
  onClose: () => void
  onSubmit: (data: RolePermissionFormDataI) => void
  initialData?: RolePermissionI | null
  isLoading?: boolean
}

const ACTION_LABELS: Record<(typeof PERMISSION_ACTIONS)[number], string> = {
  view: 'Xem',
  create: 'Tạo',
  edit: 'Chỉnh sửa',
  delete: 'Xóa',
  search: 'Tìm kiếm'
}

const RolePermissionModal: FC<RolePermissionModalPropsI> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false
}) => {
  const isEditMode = !!initialData
  const { t } = useTranslation()

  const menuEntries = useMemo(() => getMenuEntriesForPermissionMatrix(t), [t])

  const defaultMenuPermissions: MenuPermissionI[] = useMemo(
    () =>
      menuEntries.map((e) => ({
        menuKey: e.permissionKey,
        view: true,
        create: false,
        edit: false,
        delete: false,
        search: true
      })),
    [menuEntries]
  )

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<RolePermissionFormDataI>({
    defaultValues: {
      name: '',
      description: '',
      menuPermissions: defaultMenuPermissions
    }
  })

  const menuPermissions = watch('menuPermissions')

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          name: initialData.name || '',
          description: initialData.description || '',
          menuPermissions: initialData.menuPermissions?.length ? initialData.menuPermissions : defaultMenuPermissions
        })
      } else {
        reset({
          name: '',
          description: '',
          menuPermissions: defaultMenuPermissions
        })
      }
    }
  }, [open, initialData, reset, defaultMenuPermissions])

  const handleFormSubmit = (data: RolePermissionFormDataI) => {
    onSubmit(data)
  }

  const handleCancel = () => {
    reset()
    onClose()
  }

  const handlePermissionChange = (
    menuKey: string,
    action: keyof Omit<MenuPermissionI, 'menuKey'>,
    checked: boolean
  ) => {
    const next = (menuPermissions || []).map((p) => (p.menuKey === menuKey ? { ...p, [action]: checked } : p))
    setValue('menuPermissions', next, { shouldDirty: true })
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      title={isEditMode ? 'Chỉnh sửa Vai trò & phân quyền' : 'Tạo mới Vai trò & phân quyền'}
      width={800}
      destroyOnClose
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className='mt-4'>
        <div className='space-y-4'>
          <Controller
            name='name'
            control={control}
            rules={{
              required: 'Tên vai trò là bắt buộc',
              minLength: { value: 2, message: 'Tên vai trò phải có ít nhất 2 ký tự' }
            }}
            render={({ field }) => (
              <div>
                <FISInputText {...field} textLabel='Tên vai trò' placeholder='Nhập tên vai trò' />
                {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name.message}</p>}
              </div>
            )}
          />

          <Controller
            name='description'
            control={control}
            rules={{
              required: 'Mô tả là bắt buộc',
              minLength: { value: 3, message: 'Mô tả phải có ít nhất 3 ký tự' }
            }}
            render={({ field }) => (
              <div>
                <FISInputText {...field} textLabel='Mô tả' placeholder='Nhập mô tả vai trò' />
                {errors.description && <p className='mt-1 text-sm text-red-600'>{errors.description.message}</p>}
              </div>
            )}
          />

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>Phân quyền theo menu</label>
            <p className='text-xs text-gray-500 mb-2'>Mỗi menu có các quyền: Xem, Tạo, Chỉnh sửa, Xóa, Tìm kiếm</p>
            <div className='border border-gray-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto'>
              <table className='w-full text-sm'>
                <thead className='bg-gray-50 sticky top-0'>
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
                  {menuEntries.map((entry) => {
                    const perm = (menuPermissions || []).find((p) => p.menuKey === entry.permissionKey)
                    return (
                      <tr key={entry.permissionKey} className='border-t border-gray-100 hover:bg-gray-50/50'>
                        <td className='py-2 px-3 text-gray-900'>{entry.label}</td>
                        {PERMISSION_ACTIONS.map((action) => (
                          <td key={action} className='py-2 px-2 text-center'>
                            <Checkbox
                              checked={perm?.[action] ?? false}
                              onChange={(e) => handlePermissionChange(entry.permissionKey, action, e.target.checked)}
                            />
                          </td>
                        ))}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200'>
          <FISButton variant='secondary' onClick={handleCancel} disabled={isLoading}>
            Hủy
          </FISButton>
          <FISButton type='submit' variant='primary' disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : isEditMode ? 'Cập nhật' : 'Tạo mới'}
          </FISButton>
        </div>
      </form>
    </Modal>
  )
}

export default RolePermissionModal
