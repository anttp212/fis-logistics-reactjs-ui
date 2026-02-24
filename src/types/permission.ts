// ============================================
// PERMISSION TYPES
// ============================================

/** Các hành động phân quyền theo menu */
export const PERMISSION_ACTIONS = ['view', 'create', 'edit', 'delete', 'search'] as const
export type PermissionActionT = (typeof PERMISSION_ACTIONS)[number]

/** Phân quyền cho một menu: xem, tạo, sửa, xóa, tìm kiếm */
export interface MenuPermissionI {
  menuKey: string
  view: boolean
  create: boolean
  edit: boolean
  delete: boolean
  search: boolean
}

/** Vai trò với danh sách phân quyền theo menu */
export interface RoleWithPermissionsI {
  key: string
  name: string
  description: string
  status?: string
  menuPermissions: MenuPermissionI[]
}
