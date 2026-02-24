// ============================================
// usePermissions - Phân quyền theo menu (view, create, edit, delete, search)
// ============================================

import { useMemo } from 'react'
import { useAppSelector } from './useRedux'
import type { MenuPermissionI } from '@app-types/permission'
import { getMenuEntriesForPermissionMatrix, buildMenuPermissions, getAllPermissionKeys } from '@constants'
import { useTranslation } from 'react-i18next'

function buildPermissionsFromEntries(
  entries: { permissionKey: string }[],
  grant: Partial<Record<keyof MenuPermissionI, boolean>>
): MenuPermissionI[] {
  const view = grant.view ?? false
  const create = grant.create ?? false
  const edit = grant.edit ?? false
  const del = grant.delete ?? false
  const search = grant.search ?? false
  return entries.map((e) => ({
    menuKey: e.permissionKey,
    view,
    create,
    edit,
    delete: del,
    search
  }))
}

export function usePermissions() {
  const user = useAppSelector((state) => state.auth?.user)
  const { t } = useTranslation()

  const permissions = useMemo(() => {
    const entries = getMenuEntriesForPermissionMatrix(t)
    const roleName = (user?.role ?? '').trim()
    const roleLower = roleName.toLowerCase()
    let list: MenuPermissionI[]

    if (roleLower === 'admin' || roleName === 'Admin') {
      list = buildMenuPermissions(getAllPermissionKeys())
    } else if (roleName === 'Tài xế') {
      list = buildMenuPermissions(['depot'])
    } else if (roleName === 'Bảo vệ') {
      list = buildMenuPermissions(['warehouse'])
    } else if (roleLower === 'quản trị viên' || roleLower === 'administrator') {
      list = buildPermissionsFromEntries(entries, {
        view: true,
        create: true,
        edit: true,
        delete: true,
        search: true
      })
    } else if (roleLower === 'người xem' || roleLower === 'viewer') {
      list = buildPermissionsFromEntries(entries, { view: true, search: true })
    } else {
      list = buildPermissionsFromEntries(entries, { view: true, search: true })
    }

    const byKey = list.reduce(
      (acc, p) => {
        acc[p.menuKey] = p
        return acc
      },
      {} as Record<string, MenuPermissionI>
    )
    return { list, byKey }
  }, [user?.role, t])

  const canView = (menuKey: string): boolean => permissions.byKey[menuKey]?.view ?? false
  const canCreate = (menuKey: string): boolean => permissions.byKey[menuKey]?.create ?? false
  const canEdit = (menuKey: string): boolean => permissions.byKey[menuKey]?.edit ?? false
  const canDelete = (menuKey: string): boolean => permissions.byKey[menuKey]?.delete ?? false
  const canSearch = (menuKey: string): boolean => permissions.byKey[menuKey]?.search ?? false

  return {
    permissions: permissions.list,
    permissionsByKey: permissions.byKey,
    canView,
    canCreate,
    canEdit,
    canDelete,
    canSearch
  }
}
