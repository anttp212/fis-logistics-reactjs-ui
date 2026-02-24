// ============================================
// MENU CONFIG - Single source for sidebar & permission matrix
// Tổng hợp từ ROUTES, mỗi menu có permissionKey để phân quyền: view, create, edit, delete, search
// ============================================

import React from 'react'
import type { TFunction } from 'i18next'
import { ROUTES } from './Routes'
import type { MenuPermissionI } from '@app-types/permission'
import {
  DashboardIcon,
  PackageIcon,
  WarehouseIcon,
  DepotIcon,
  TransportationIcon,
  ConfigIcon,
  SettingsIcon,
  BellIcon
} from '@images'

export interface MenuEntryI {
  /** Path dùng cho NavLink (route) */
  path: string
  /** Key dùng cho phân quyền (menuKey) */
  permissionKey: string
  /** Label hiển thị (i18n key hoặc text) */
  labelKey: string
  /** Icon cho menu cha (chỉ item có subItems) */
  icon?: React.ReactNode
  /** Nếu có: là menu cha, subItems sẽ lấy từ các entry có parentKey = permissionKey */
  parentKey?: string
}

/** Danh sách phẳng tất cả menu (cho ma trận phân quyền và build tree) */
export const MENU_ENTRIES: MenuEntryI[] = [
  { path: ROUTES.home, permissionKey: 'home', labelKey: 'common.menu.dashboard' },
  { path: ROUTES.warehouse, permissionKey: 'warehouse', labelKey: 'common.menu.warehouse' },
  { path: ROUTES.depot, permissionKey: 'depot', labelKey: 'common.menu.depot' },
  { path: ROUTES.transportation, permissionKey: 'transportation', labelKey: 'common.menu.transportation' },
  {
    path: ROUTES.userManagement,
    permissionKey: 'user-management',
    labelKey: 'common.menu.userManagement',
    parentKey: '__root'
  },
  {
    path: ROUTES.userManagementUsers,
    permissionKey: 'user-management.users',
    labelKey: 'common.menu.userManagementUsers',
    parentKey: 'user-management'
  },
  {
    path: ROUTES.userManagementRolesPermissions,
    permissionKey: 'user-management.roles-permissions',
    labelKey: 'common.menu.userManagementRolesPermissions',
    parentKey: 'user-management'
  },
  {
    path: ROUTES.userManagementAuthSecurity,
    permissionKey: 'user-management.auth-security',
    labelKey: 'common.menu.userManagementAuthSecurity',
    parentKey: 'user-management'
  },
  {
    path: ROUTES.userManagementProfile,
    permissionKey: 'user-management.profile',
    labelKey: 'common.menu.userManagementProfile',
    parentKey: 'user-management'
  },
  {
    path: ROUTES.organizationStructure,
    permissionKey: 'organization-structure',
    labelKey: 'Cơ cấu Tổ chức',
    parentKey: '__root'
  },
  {
    path: ROUTES.organizationStructureBranches,
    permissionKey: 'organization-structure.branches',
    labelKey: 'Chi nhánh',
    parentKey: 'organization-structure'
  },
  {
    path: ROUTES.organizationStructureDepartments,
    permissionKey: 'organization-structure.departments',
    labelKey: 'Phòng ban',
    parentKey: 'organization-structure'
  },
  {
    path: ROUTES.categoryManagement,
    permissionKey: 'category-management',
    labelKey: 'common.menu.categoryManagement',
    parentKey: '__root'
  },
  {
    path: ROUTES.employeeProfileList,
    permissionKey: 'category-management.employee-profile',
    labelKey: 'Hồ sơ nhân viên',
    parentKey: 'category-management'
  },
  {
    path: ROUTES.categoryManagementCustomerProfile,
    permissionKey: 'category-management.customer-profile',
    labelKey: 'common.menu.categoryManagementCustomerProfile',
    parentKey: 'category-management'
  },
  {
    path: ROUTES.categoryManagementPartnerProfile,
    permissionKey: 'category-management.partner-profile',
    labelKey: 'common.menu.categoryManagementPartnerProfile',
    parentKey: 'category-management'
  },
  {
    path: ROUTES.categoryManagementLandAndPort,
    permissionKey: 'category-management.land-and-port',
    labelKey: 'common.menu.categoryManagementLandAndPort',
    parentKey: 'category-management'
  },
  {
    path: ROUTES.categoryManagementVehiclesAndEquipment,
    permissionKey: 'category-management.vehicles-and-equipment',
    labelKey: 'common.menu.categoryManagementVehiclesAndEquipment',
    parentKey: 'category-management'
  },
  {
    path: ROUTES.categoryManagementGoodsAndStandards,
    permissionKey: 'category-management.goods-and-standards',
    labelKey: 'common.menu.categoryManagementGoodsAndStandards',
    parentKey: 'category-management'
  },
  {
    path: ROUTES.categoryManagementLoadingPlan,
    permissionKey: 'category-management.loading-plan',
    labelKey: 'common.menu.categoryManagementLoadingPlan',
    parentKey: 'category-management'
  },
  {
    path: ROUTES.categoryManagementWarehouseInfrastructure,
    permissionKey: 'category-management.warehouse-infrastructure',
    labelKey: 'common.menu.categoryManagementWarehouseInfrastructure',
    parentKey: 'category-management'
  },
  {
    path: ROUTES.categoryManagementYardInfrastructure,
    permissionKey: 'category-management.yard-infrastructure',
    labelKey: 'common.menu.categoryManagementYardInfrastructure',
    parentKey: 'category-management'
  },
  {
    path: ROUTES.notificationManagement,
    permissionKey: 'notification-management',
    labelKey: 'common.menu.notificationManagement',
    parentKey: '__root'
  },
  {
    path: ROUTES.notificationManagementTemplateConfig,
    permissionKey: 'notification-management.template-config',
    labelKey: 'common.menu.notificationManagementTemplateConfig',
    parentKey: 'notification-management'
  },
  {
    path: ROUTES.systemConfig,
    permissionKey: 'system-config',
    labelKey: 'common.menu.systemConfig',
    parentKey: '__root'
  },
  {
    path: ROUTES.systemConfigOperatingParams,
    permissionKey: 'system-config.operating-params',
    labelKey: 'common.menu.systemConfigOperatingParams',
    parentKey: 'system-config'
  },
  {
    path: ROUTES.systemConfigNotificationTemplate,
    permissionKey: 'system-config.notification-template',
    labelKey: 'common.menu.systemConfigNotificationTemplate',
    parentKey: 'system-config'
  }
]

/** Icon map theo permissionKey (cho menu cha) */
const MENU_ICONS: Record<string, React.ReactNode> = {
  'user-management': <SettingsIcon className='w-5 h-5' />,
  'organization-structure': <ConfigIcon className='w-5 h-5' />,
  'category-management': <PackageIcon className='w-5 h-5' />,
  'notification-management': <BellIcon className='w-5 h-5' />,
  'system-config': <ConfigIcon className='w-5 h-5' />
}

export interface MenuItemConfigI {
  to: string
  icon: React.ReactNode
  label: string
  subItems?: { to: string; label: string; permissionKey: string }[]
  permissionKey?: string
}

/**
 * Build cây menu cho sidebar (chỉ items có parentKey === '__root' hoặc không có parent là item gốc;
 * các item có parentKey = X được gom vào subItems của item có permissionKey = X).
 */
export function getMenuTree(t: TFunction): MenuItemConfigI[] {
  const roots = MENU_ENTRIES.filter((e) => e.parentKey === '__root' || !e.parentKey)
  const byParent = MENU_ENTRIES.reduce(
    (acc, entry) => {
      const p = entry.parentKey || '__root'
      if (p === '__root') return acc
      if (!acc[p]) acc[p] = []
      acc[p].push(entry)
      return acc
    },
    {} as Record<string, MenuEntryI[]>
  )

  const result: MenuItemConfigI[] = []

  for (const root of roots) {
    const children = byParent[root.permissionKey]
    if (children?.length) {
      result.push({
        to: root.path,
        icon: MENU_ICONS[root.permissionKey] ?? <DashboardIcon className='w-5 h-5' />,
        label:
          typeof root.labelKey === 'string' && root.labelKey.startsWith('common.menu')
            ? t(root.labelKey as never)
            : root.labelKey,
        permissionKey: root.permissionKey,
        subItems: children.map((c) => ({
          to: c.path,
          label:
            typeof c.labelKey === 'string' && c.labelKey.startsWith('common.menu')
              ? t(c.labelKey as never)
              : c.labelKey,
          permissionKey: c.permissionKey
        }))
      })
    } else {
      result.push({
        to: root.path,
        icon:
          root.permissionKey === 'home'
            ? <DashboardIcon className='w-5 h-5' />
            : root.permissionKey === 'warehouse'
              ? <WarehouseIcon className='w-5 h-5' />
              : root.permissionKey === 'depot'
                ? <DepotIcon className='w-5 h-5' />
                : root.permissionKey === 'transportation'
                  ? <TransportationIcon className='w-5 h-5' />
                  : <DashboardIcon className='w-5 h-5' />,
        label:
          typeof root.labelKey === 'string' && root.labelKey.startsWith('common.menu')
            ? t(root.labelKey as never)
            : root.labelKey,
        permissionKey: root.permissionKey
      })
    }
  }

  return result
}

/** Danh sách menu phẳng cho ma trận phân quyền (chỉ item có path cụ thể, bỏ menu cha trùng path redirect) */
export function getMenuEntriesForPermissionMatrix(
  t: TFunction
): { permissionKey: string; path: string; label: string }[] {
  return MENU_ENTRIES.filter((e) => !e.parentKey || e.parentKey !== '__root').map((e) => ({
    permissionKey: e.permissionKey,
    path: e.path,
    label:
      typeof e.labelKey === 'string' && e.labelKey.startsWith('common.menu')
        ? t(e.labelKey as never)
        : e.labelKey
  }))
}

/** Lấy permissionKey từ path (để check quyền theo route) */
export function getPermissionKeyByPath(pathname: string): string | null {
  const normalized = pathname.replace(/\/$/, '')
  const entry = MENU_ENTRIES.find((e) => {
    if (e.path === normalized) return true
    const base = e.path.replace(/\/:id$/, '')
    return normalized.startsWith(base + '/')
  })
  return entry?.permissionKey ?? null
}

/** Danh sách tất cả permissionKey (bao gồm cả menu cha) — Admin cần đủ để hiển thị toàn bộ sidebar */
export function getAllPermissionKeys(): string[] {
  return MENU_ENTRIES.map((e) => e.permissionKey)
}

/**
 * Tạo menuPermissions: các menu trong fullAccessKeys được full quyền (view, create, edit, delete, search);
 * các menu còn lại chỉ view + search (hoặc không quyền nếu grantOthersView = false).
 */
export function buildMenuPermissions(
  fullAccessKeys: string[],
  grantOthersViewSearch = false
): MenuPermissionI[] {
  const keys = getAllPermissionKeys()
  const fullSet = new Set(fullAccessKeys)
  return keys.map((menuKey) => {
    const full = fullSet.has(menuKey)
    return {
      menuKey,
      view: full || grantOthersViewSearch,
      create: full,
      edit: full,
      delete: full,
      search: full || grantOthersViewSearch
    }
  })
}
