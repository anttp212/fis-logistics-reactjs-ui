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
  // {
  //   path: ROUTES.warehouse,
  //   permissionKey: 'warehouse',
  //   labelKey: 'common.menu.warehouse',
  //   parentKey: '__root'
  // },
  // {
  //   path: ROUTES.warehouseServiceRegistrationPortal,
  //   permissionKey: 'warehouse.service-registration-portal',
  //   labelKey: 'Đăng ký dịch vụ (Portal)',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseAssessmentApproval,
  //   permissionKey: 'warehouse.assessment-approval',
  //   labelKey: 'Thẩm định & Phê duyệt',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehousePaymentManagement,
  //   permissionKey: 'warehouse.payment-management',
  //   labelKey: 'Payment Management',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseYcdvListTracking,
  //   permissionKey: 'warehouse.ycdv-list-tracking',
  //   labelKey: 'Danh sách & Theo dõi YCDV',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseStockApprovalLock,
  //   permissionKey: 'warehouse.stock-approval-lock',
  //   labelKey: 'Duyệt & Lock tồn kho',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseYcdvExecutionTracking,
  //   permissionKey: 'warehouse.ycdv-execution-tracking',
  //   labelKey: 'Theo dõi thực hiện YCDV',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehousePlanningReceiveYcdv,
  //   permissionKey: 'warehouse.planning-receive-ycdv',
  //   labelKey: 'Tiếp nhận & Chi tiết YCDV',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehousePlanningOperations,
  //   permissionKey: 'warehouse.planning-operations',
  //   labelKey: 'Lập kế hoạch khai thác',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehousePlanningApproval,
  //   permissionKey: 'warehouse.planning-approval',
  //   labelKey: 'Kiểm tra & Phê duyệt kế hoạch',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseExecutionOperations,
  //   permissionKey: 'warehouse.execution-operations',
  //   labelKey: 'Thực hiện nghiệp vụ',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseExecutionReconciliation,
  //   permissionKey: 'warehouse.execution-reconciliation',
  //   labelKey: 'Đối soát & Điều chỉnh',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseExecutionConfirmLock,
  //   permissionKey: 'warehouse.execution-confirm-lock',
  //   labelKey: 'Xác nhận & Khóa dữ liệu',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseStorageFee,
  //   permissionKey: 'warehouse.storage-fee',
  //   labelKey: 'Phí lưu kho',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseVasFee,
  //   permissionKey: 'warehouse.vas-fee',
  //   labelKey: 'Phí phát sinh & VAS',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseTallyJobSheet,
  //   permissionKey: 'warehouse.tally-job-sheet',
  //   labelKey: 'Tally & Job Sheet',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseBillingErpSync,
  //   permissionKey: 'warehouse.billing-erp-sync',
  //   labelKey: 'Billing & ERP Sync',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseExecutionResult,
  //   permissionKey: 'warehouse.execution-result',
  //   labelKey: 'Kết quả khai thác & Đối soát',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseReportWms,
  //   permissionKey: 'warehouse.report-wms',
  //   labelKey: 'Báo cáo WMS',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.warehouseLogAudit,
  //   permissionKey: 'warehouse.log-audit',
  //   labelKey: 'Log & Audit',
  //   parentKey: 'warehouse'
  // },
  // {
  //   path: ROUTES.depot,
  //   permissionKey: 'depot',
  //   labelKey: 'common.menu.depot',
  //   parentKey: '__root'
  // },
  // {
  //   path: ROUTES.depotServiceRegistration,
  //   permissionKey: 'depot.service-registration',
  //   labelKey: 'Quản lý đăng ký dịch vụ Depot',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotFeeConfig,
  //   permissionKey: 'depot.fee-config',
  //   labelKey: 'Cấu hình biểu phí dịch vụ',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotBorrowEmpty,
  //   permissionKey: 'depot.borrow-empty',
  //   labelKey: 'Đăng ký mượn vỏ rỗng',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotReturnEmpty,
  //   permissionKey: 'depot.return-empty',
  //   labelKey: 'Đăng ký trả vỏ rỗng',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotBorrowReturnOrders,
  //   permissionKey: 'depot.borrow-return-orders',
  //   labelKey: 'Lệnh mượn / tiếp nhận trả',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotContainerLifecycle,
  //   permissionKey: 'depot.container-lifecycle',
  //   labelKey: 'Vòng đời container',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotPaymentGateway,
  //   permissionKey: 'depot.payment-gateway',
  //   labelKey: 'Cổng thanh toán',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotInvoiceDocs,
  //   permissionKey: 'depot.invoice-docs',
  //   labelKey: 'Hóa đơn & chứng từ',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotYardPlanning,
  //   permissionKey: 'depot.yard-planning',
  //   labelKey: 'Kế hoạch bãi',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotOperationalSchedule,
  //   permissionKey: 'depot.operational-schedule',
  //   labelKey: 'Lập lịch khai thác',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotStaffEquipment,
  //   permissionKey: 'depot.staff-equipment',
  //   labelKey: 'Nhân sự & thiết bị',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotJobOrder,
  //   permissionKey: 'depot.job-order',
  //   labelKey: 'Job Order (Lệnh tác nghiệp)',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotRecognitionReconciliation,
  //   permissionKey: 'depot.recognition-reconciliation',
  //   labelKey: 'Nhận diện & đối soát',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotBarrierDisplay,
  //   permissionKey: 'depot.barrier-display',
  //   labelKey: 'Điều khiển barie & hiển thị',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotDmsConfirmation,
  //   permissionKey: 'depot.dms-confirmation',
  //   labelKey: 'Xác nhận khai thác (DMS)',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotOutputBilling,
  //   permissionKey: 'depot.output-billing',
  //   labelKey: 'Sản lượng & Billing',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotVehicleServiceLog,
  //   permissionKey: 'depot.vehicle-service-log',
  //   labelKey: 'Nhật ký phương tiện & dịch vụ',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotPerformanceStats,
  //   permissionKey: 'depot.performance-stats',
  //   labelKey: 'Thống kê hiệu suất',
  //   parentKey: 'depot'
  // },
  // {
  //   path: ROUTES.depotOperationsDashboard,
  //   permissionKey: 'depot.operations-dashboard',
  //   labelKey: 'Dashboard điều hành',
  //   parentKey: 'depot'
  // },
  {
    path: ROUTES.transportation,
    permissionKey: 'transportation',
    labelKey: 'common.menu.transportation',
    parentKey: '__root'
  },
  {
    path: ROUTES.transportationVehicleDispatch,
    permissionKey: 'transportation.vehicle-dispatch',
    labelKey: 'Điều xe',
    parentKey: 'transportation'
  },
  {
    path: ROUTES.reportGateInOut,
    permissionKey: 'report.gate-in-out',
    labelKey: 'Báo cáo Ra/Vào cổng',
    parentKey: 'transportation'
  },
  {
    path: ROUTES.reportTransportation,
    permissionKey: 'report.transportation',
    labelKey: 'Báo cáo Vận Tải',
    parentKey: 'transportation'
  }
  // {
  //   path: ROUTES.transportationVehicleApproval,
  //   permissionKey: 'transportation.vehicle-approval',
  //   labelKey: 'Phê duyệt danh sách xe đủ điều kiện vận hành',
  //   parentKey: 'transportation'
  // },
  // {
  //   path: ROUTES.transportationServiceRequestPortal,
  //   permissionKey: 'transportation.service-request-portal',
  //   labelKey: 'Yêu cầu Dịch vụ (Customer Portal)',
  //   parentKey: 'transportation'
  // },
  // {
  //   path: ROUTES.transportationReceptionAssessment,
  //   permissionKey: 'transportation.reception-assessment',
  //   labelKey: 'Tiếp nhận & Thẩm định nội bộ',
  //   parentKey: 'transportation'
  // },
  // {
  //   path: ROUTES.transportationDispatchPlanning,
  //   permissionKey: 'transportation.dispatch-planning',
  //   labelKey: 'Điều phối & Lập Plan',
  //   parentKey: 'transportation'
  // },
  // {
  //   path: ROUTES.transportationTripMonitoring,
  //   permissionKey: 'transportation.trip-monitoring',
  //   labelKey: 'Theo dõi & Giám sát chuyến',
  //   parentKey: 'transportation'
  // },
  // {
  //   path: ROUTES.transportationTripSettlement,
  //   permissionKey: 'transportation.trip-settlement',
  //   labelKey: 'Quyết toán chi phí chuyến',
  //   parentKey: 'transportation'
  // },
  // {
  //   path: ROUTES.transportationTallyBilling,
  //   permissionKey: 'transportation.tally-billing',
  //   labelKey: 'Tally & Billing',
  //   parentKey: 'transportation'
  // },
  ,
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
  // {
  //   path: ROUTES.organizationStructure,
  //   permissionKey: 'organization-structure',
  //   labelKey: 'Cơ cấu Tổ chức',
  //   parentKey: '__root'
  // },
  // {
  //   path: ROUTES.organizationStructureBranches,
  //   permissionKey: 'organization-structure.branches',
  //   labelKey: 'Chi nhánh',
  //   parentKey: 'organization-structure'
  // },
  // {
  //   path: ROUTES.organizationStructureDepartments,
  //   permissionKey: 'organization-structure.departments',
  //   labelKey: 'Phòng ban',
  //   parentKey: 'organization-structure'
  // },
  // {
  //   path: ROUTES.categoryManagement,
  //   permissionKey: 'category-management',
  //   labelKey: 'common.menu.categoryManagement',
  //   parentKey: '__root'
  // },
  // {
  //   path: ROUTES.employeeProfileList,
  //   permissionKey: 'category-management.employee-profile',
  //   labelKey: 'Hồ sơ nhân viên',
  //   parentKey: 'category-management'
  // },
  // {
  //   path: ROUTES.categoryManagementCustomerProfile,
  //   permissionKey: 'category-management.customer-profile',
  //   labelKey: 'common.menu.categoryManagementCustomerProfile',
  //   parentKey: 'category-management'
  // },
  // {
  //   path: ROUTES.categoryManagementPartnerProfile,
  //   permissionKey: 'category-management.partner-profile',
  //   labelKey: 'common.menu.categoryManagementPartnerProfile',
  //   parentKey: 'category-management'
  // },
  // {
  //   path: ROUTES.categoryManagementLandAndPort,
  //   permissionKey: 'category-management.land-and-port',
  //   labelKey: 'common.menu.categoryManagementLandAndPort',
  //   parentKey: 'category-management'
  // },
  // {
  //   path: ROUTES.categoryManagementVehiclesAndEquipment,
  //   permissionKey: 'category-management.vehicles-and-equipment',
  //   labelKey: 'common.menu.categoryManagementVehiclesAndEquipment',
  //   parentKey: 'category-management'
  // },
  // {
  //   path: ROUTES.categoryManagementGoodsAndStandards,
  //   permissionKey: 'category-management.goods-and-standards',
  //   labelKey: 'common.menu.categoryManagementGoodsAndStandards',
  //   parentKey: 'category-management'
  // },
  // {
  //   path: ROUTES.categoryManagementLoadingPlan,
  //   permissionKey: 'category-management.loading-plan',
  //   labelKey: 'common.menu.categoryManagementLoadingPlan',
  //   parentKey: 'category-management'
  // },
  // {
  //   path: ROUTES.categoryManagementWarehouseInfrastructure,
  //   permissionKey: 'category-management.warehouse-infrastructure',
  //   labelKey: 'common.menu.categoryManagementWarehouseInfrastructure',
  //   parentKey: 'category-management'
  // },
  // {
  //   path: ROUTES.categoryManagementYardInfrastructure,
  //   permissionKey: 'category-management.yard-infrastructure',
  //   labelKey: 'common.menu.categoryManagementYardInfrastructure',
  //   parentKey: 'category-management'
  // },
  // {
  //   path: ROUTES.notificationManagement,
  //   permissionKey: 'notification-management',
  //   labelKey: 'common.menu.notificationManagement',
  //   parentKey: '__root'
  // },
  // {
  //   path: ROUTES.notificationManagementTemplateConfig,
  //   permissionKey: 'notification-management.template-config',
  //   labelKey: 'common.menu.notificationManagementTemplateConfig',
  //   parentKey: 'notification-management'
  // },
  // {
  //   path: ROUTES.systemConfig,
  //   permissionKey: 'system-config',
  //   labelKey: 'common.menu.systemConfig',
  //   parentKey: '__root'
  // },
  // {
  //   path: ROUTES.systemConfigOperatingParams,
  //   permissionKey: 'system-config.operating-params',
  //   labelKey: 'common.menu.systemConfigOperatingParams',
  //   parentKey: 'system-config'
  // },
  // {
  //   path: ROUTES.systemConfigNotificationTemplate,
  //   permissionKey: 'system-config.notification-template',
  //   labelKey: 'common.menu.systemConfigNotificationTemplate',
  //   parentKey: 'system-config'
  // }
]

/** Icon map theo permissionKey (cho menu cha) - keys phải khớp permissionKey trong MENU_ENTRIES */
/* eslint-disable @typescript-eslint/naming-convention */
const MENU_ICONS: Record<string, React.ReactNode> = {
  warehouse: <WarehouseIcon className='w-5 h-5' />,
  depot: <DepotIcon className='w-5 h-5' />,
  transportation: <TransportationIcon className='w-5 h-5' />,
  'user-management': <SettingsIcon className='w-5 h-5' />,
  'organization-structure': <ConfigIcon className='w-5 h-5' />,
  'category-management': <PackageIcon className='w-5 h-5' />,
  'notification-management': <BellIcon className='w-5 h-5' />,
  'system-config': <ConfigIcon className='w-5 h-5' />
}
/* eslint-enable @typescript-eslint/naming-convention */

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
          root.permissionKey === 'home' ? (
            <DashboardIcon className='w-5 h-5' />
          ) : root.permissionKey === 'warehouse' ? (
            <WarehouseIcon className='w-5 h-5' />
          ) : root.permissionKey === 'depot' ? (
            <DepotIcon className='w-5 h-5' />
          ) : root.permissionKey === 'transportation' ? (
            <TransportationIcon className='w-5 h-5' />
          ) : root.permissionKey?.startsWith('report.') ? (
            <ConfigIcon className='w-5 h-5' />
          ) : (
            <DashboardIcon className='w-5 h-5' />
          ),
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
    label: typeof e.labelKey === 'string' && e.labelKey.startsWith('common.menu') ? t(e.labelKey as never) : e.labelKey
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
export function buildMenuPermissions(fullAccessKeys: string[], grantOthersViewSearch = false): MenuPermissionI[] {
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
