import { redirect } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import SmartRedirect from './SmartRedirect'
import { ROUTES, buildLoginWithRedirect } from '@constants'
import { store } from '@redux/index'
import { AppLayout } from '@components'

// ============================================
// UTILITIES
// ============================================

// ✅ Safe auth check utility - Works with redux-persist
const isAuthenticated = (): boolean => {
  try {
    const state = store.getState()

    // Check if redux-persist has loaded (_persist.rehydrated = true)
    // If not rehydrated yet, assume not authenticated for safety
    if (!state._persist?.rehydrated) {
      return false
    }

    const hasToken = !!state.auth?.accessToken
    return hasToken
  } catch (error) {
    console.error('Error checking auth state:', error)
    return false
  }
}

// Protected route loader - redirects to login with intended URL
const protectedLoader = async ({ request }: { request: Request }) => {
  // Wait a bit for redux-persist to potentially rehydrate
  let attempts = 0
  const maxAttempts = 20 // Max 1 second wait (20 * 50ms)

  while (attempts < maxAttempts) {
    const state = store.getState()

    // If rehydrated, we can make the auth decision
    if (state._persist?.rehydrated) {
      const authenticated = isAuthenticated()

      if (!authenticated) {
        // Save the intended URL that user wanted to access
        const url = new URL(request.url)
        const intendedPath = url.pathname + url.search

        // URL approach: Pass redirect in query parameter (recommended)
        const redirectUrl = buildLoginWithRedirect(intendedPath)
        throw redirect(redirectUrl)
      }
      return null
    }

    // Wait a bit more for rehydration
    await new Promise((resolve) => setTimeout(resolve, 50))
    attempts++
  }

  // If we timeout waiting for rehydration, assume not authenticated for security
  const url = new URL(request.url)
  const intendedPath = url.pathname + url.search
  const redirectUrl = buildLoginWithRedirect(intendedPath)
  throw redirect(redirectUrl)
}

// Auth route loader - redirects authenticated users away from login
const authLoader = async () => {
  // Wait a bit for redux-persist to potentially rehydrate
  // This is a fallback - ideally PersistGate should handle this
  let attempts = 0
  const maxAttempts = 20 // Max 1 second wait (20 * 50ms)

  while (attempts < maxAttempts) {
    const state = store.getState()

    // If rehydrated, we can make the auth decision
    if (state._persist?.rehydrated) {
      const authenticated = isAuthenticated()

      if (authenticated) {
        // User is already logged in, redirect to home
        throw redirect(ROUTES.home)
      }
      return null
    }

    // Wait a bit more for rehydration
    await new Promise((resolve) => setTimeout(resolve, 50))
    attempts++
  }

  // If we timeout waiting for rehydration, assume not authenticated
  return null
}

// ============================================
// ROUTES CONFIGURATION
// ============================================

export const routes: RouteObject[] = [
  // 🏠 Landing page (public home at /)
  {
    index: true,
    lazy: async () => {
      const LandingPage = await import('../pages/landing')
      return { Component: LandingPage.default }
    }
  },

  // 🌐 Public portal routes (no layout / no auth)
  {
    path: ROUTES.portalInbound,
    lazy: async () => {
      const C = await import('../pages/portal/inbound')
      return { Component: C.default }
    }
  },
  {
    path: ROUTES.portalOutbound,
    lazy: async () => {
      const C = await import('../pages/portal/outbound')
      return { Component: C.default }
    }
  },
  {
    path: ROUTES.portalStorage,
    lazy: async () => {
      const C = await import('../pages/portal/storage')
      return { Component: C.default }
    }
  },
  {
    path: ROUTES.portalVas,
    lazy: async () => {
      const C = await import('../pages/portal/vas')
      return { Component: C.default }
    }
  },
  {
    path: ROUTES.portalCrossDocking,
    lazy: async () => {
      const C = await import('../pages/portal/cross-docking')
      return { Component: C.default }
    }
  },
  {
    path: ROUTES.portalRequest,
    loader: async () => {
      throw redirect(ROUTES.portalInbound)
    }
  },
  {
    path: ROUTES.portal,
    loader: async () => {
      throw redirect(ROUTES.portalInbound)
    }
  },

  // 🔐 Protected routes with layout
  {
    path: ROUTES.root,
    element: <AppLayout />,
    loader: protectedLoader,
    children: [
      {
        path: ROUTES.home,
        lazy: async () => {
          const HomeComponent = await import('../pages/home')
          return { Component: HomeComponent.default }
        }
      },
      {
        path: 'report/gate-in-out',
        lazy: async () => {
          const C = await import('../pages/report/gate-in-out')
          return { Component: C.default }
        }
      },
      {
        path: 'report/transportation',
        lazy: async () => {
          const C = await import('../pages/report/transportation')
          return { Component: C.default }
        }
      },
      // Quản lý kho: path tương đối, sub-routes trước, redirect sau
      {
        path: 'warehouse/service-registration-portal',
        lazy: async () => {
          const C = await import('../pages/warehouse/service-registration-portal')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/assessment-approval',
        lazy: async () => {
          const C = await import('../pages/warehouse/assessment-approval')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/payment-management',
        lazy: async () => {
          const C = await import('../pages/warehouse/payment-management')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/ycdv-list-tracking',
        lazy: async () => {
          const C = await import('../pages/warehouse/ycdv-list-tracking')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/stock-approval-lock',
        lazy: async () => {
          const C = await import('../pages/warehouse/stock-approval-lock')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/ycdv-execution-tracking',
        lazy: async () => {
          const C = await import('../pages/warehouse/ycdv-execution-tracking')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/planning-receive-ycdv',
        lazy: async () => {
          const C = await import('../pages/warehouse/planning-receive-ycdv')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/planning-operations',
        lazy: async () => {
          const C = await import('../pages/warehouse/planning-operations')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/planning-approval',
        lazy: async () => {
          const C = await import('../pages/warehouse/planning-approval')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/execution-operations',
        lazy: async () => {
          const C = await import('../pages/warehouse/execution-operations')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/execution-reconciliation',
        lazy: async () => {
          const C = await import('../pages/warehouse/execution-reconciliation')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/execution-confirm-lock',
        lazy: async () => {
          const C = await import('../pages/warehouse/execution-confirm-lock')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/storage-fee',
        lazy: async () => {
          const C = await import('../pages/warehouse/storage-fee')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/vas-fee',
        lazy: async () => {
          const C = await import('../pages/warehouse/vas-fee')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/tally-job-sheet',
        lazy: async () => {
          const C = await import('../pages/warehouse/tally-job-sheet')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/billing-erp-sync',
        lazy: async () => {
          const C = await import('../pages/warehouse/billing-erp-sync')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/execution-result',
        lazy: async () => {
          const C = await import('../pages/warehouse/execution-result')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/report-wms',
        lazy: async () => {
          const C = await import('../pages/warehouse/report-wms')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse/log-audit',
        lazy: async () => {
          const C = await import('../pages/warehouse/log-audit')
          return { Component: C.default }
        }
      },
      {
        path: 'warehouse',
        loader: async () => {
          throw redirect(ROUTES.warehouseServiceRegistrationPortal)
        }
      },
      // Depot: dùng path tương đối (không dấu /) để chắc chắn match dưới layout
      {
        path: 'depot/service-registration',
        lazy: async () => {
          const C = await import('../pages/depot/service-registration')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/fee-config',
        lazy: async () => {
          const C = await import('../pages/depot/fee-config')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/borrow-empty',
        lazy: async () => {
          const C = await import('../pages/depot/borrow-empty')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/return-empty',
        lazy: async () => {
          const C = await import('../pages/depot/return-empty')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/borrow-return-orders',
        lazy: async () => {
          const C = await import('../pages/depot/borrow-return-orders')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/container-lifecycle',
        lazy: async () => {
          const C = await import('../pages/depot/container-lifecycle')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/payment-gateway',
        lazy: async () => {
          const C = await import('../pages/depot/payment-gateway')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/invoice-docs',
        lazy: async () => {
          const C = await import('../pages/depot/invoice-docs')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/yard-planning',
        lazy: async () => {
          const C = await import('../pages/depot/yard-planning')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/operational-schedule',
        lazy: async () => {
          const C = await import('../pages/depot/operational-schedule')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/staff-equipment',
        lazy: async () => {
          const C = await import('../pages/depot/staff-equipment')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/job-order',
        lazy: async () => {
          const C = await import('../pages/depot/job-order')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/recognition-reconciliation',
        lazy: async () => {
          const C = await import('../pages/depot/recognition-reconciliation')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/barrier-display',
        lazy: async () => {
          const C = await import('../pages/depot/barrier-display')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/dms-confirmation',
        lazy: async () => {
          const C = await import('../pages/depot/dms-confirmation')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/output-billing',
        lazy: async () => {
          const C = await import('../pages/depot/output-billing')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/vehicle-service-log',
        lazy: async () => {
          const C = await import('../pages/depot/vehicle-service-log')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/performance-stats',
        lazy: async () => {
          const C = await import('../pages/depot/performance-stats')
          return { Component: C.default }
        }
      },
      {
        path: 'depot/operations-dashboard',
        lazy: async () => {
          const C = await import('../pages/depot/operations-dashboard')
          return { Component: C.default }
        }
      },
      {
        path: 'depot',
        loader: async () => {
          throw redirect(ROUTES.depotServiceRegistration)
        }
      },
      {
        path: ROUTES.userManagement,
        loader: async () => {
          throw redirect(ROUTES.userManagementUsers)
        }
      },
      {
        path: ROUTES.userManagementUsers,
        lazy: async () => {
          const UserManagementUsersComponent = await import('../pages/user-management/users')
          return { Component: UserManagementUsersComponent.default }
        }
      },
      {
        path: ROUTES.userManagementUserDetail,
        lazy: async () => {
          const UserDetailComponent = await import('../pages/user-management/users/detail')
          return { Component: UserDetailComponent.default }
        }
      },
      {
        path: ROUTES.userManagementRolesPermissions,
        lazy: async () => {
          const UserManagementRolesPermissionsComponent = await import('../pages/user-management/roles-permissions')
          return { Component: UserManagementRolesPermissionsComponent.default }
        }
      },
      {
        path: ROUTES.userManagementRoleDetail,
        lazy: async () => {
          const RoleDetailComponent = await import('../pages/user-management/roles-permissions/detail')
          return { Component: RoleDetailComponent.default }
        }
      },
      {
        path: ROUTES.userManagementAuthSecurity,
        lazy: async () => {
          const UserManagementAuthSecurityComponent = await import('../pages/user-management/auth-security')
          return { Component: UserManagementAuthSecurityComponent.default }
        }
      },
      {
        path: ROUTES.userManagementProfile,
        lazy: async () => {
          const ProfileComponent = await import('../pages/user-management/profile')
          return { Component: ProfileComponent.default }
        }
      },
      {
        path: ROUTES.organizationStructure,
        loader: async () => {
          throw redirect(ROUTES.organizationStructureBranches)
        }
      },
      {
        path: ROUTES.organizationStructureBranches,
        lazy: async () => {
          const BranchesComponent = await import('../pages/organization-structure/branches')
          return { Component: BranchesComponent.default }
        }
      },
      {
        path: ROUTES.organizationStructureBranchDetail,
        lazy: async () => {
          const BranchDetailComponent = await import('../pages/organization-structure/branches/detail')
          return { Component: BranchDetailComponent.default }
        }
      },
      {
        path: ROUTES.organizationStructureDepartments,
        lazy: async () => {
          const DepartmentsComponent = await import('../pages/organization-structure/departments')
          return { Component: DepartmentsComponent.default }
        }
      },
      {
        path: ROUTES.organizationStructureDepartmentDetail,
        lazy: async () => {
          const DepartmentDetailComponent = await import('../pages/organization-structure/departments/detail')
          return { Component: DepartmentDetailComponent.default }
        }
      },
      {
        path: ROUTES.employeeProfile,
        loader: async () => {
          throw redirect(ROUTES.employeeProfileList)
        }
      },
      {
        path: ROUTES.employeeProfileList,
        lazy: async () => {
          const EmployeesComponent = await import('../pages/employee-profile')
          return { Component: EmployeesComponent.default }
        }
      },
      {
        path: ROUTES.employeeProfileDetail,
        lazy: async () => {
          const EmployeeDetailComponent = await import('../pages/employee-profile/detail')
          return { Component: EmployeeDetailComponent.default }
        }
      },
      {
        path: ROUTES.categoryManagement,
        loader: async () => {
          throw redirect(ROUTES.categoryManagementCustomerProfile)
        }
      },
      {
        path: ROUTES.categoryManagementCustomerProfile,
        lazy: async () => {
          const CategoryManagementCustomerProfileComponent =
            await import('../pages/category-management/customer-profile')
          return { Component: CategoryManagementCustomerProfileComponent.default }
        }
      },
      {
        path: ROUTES.categoryManagementCustomerProfileDetail,
        lazy: async () => {
          const CustomerDetailComponent = await import('../pages/category-management/customer-profile/detail')
          return { Component: CustomerDetailComponent.default }
        }
      },
      {
        path: ROUTES.categoryManagementPartnerProfile,
        lazy: async () => {
          const CategoryManagementPartnerProfileComponent = await import('../pages/category-management/partner-profile')
          return { Component: CategoryManagementPartnerProfileComponent.default }
        }
      },
      {
        path: ROUTES.categoryManagementPartnerProfileDetail,
        lazy: async () => {
          const PartnerDetailComponent = await import('../pages/category-management/partner-profile/detail')
          return { Component: PartnerDetailComponent.default }
        }
      },
      {
        path: ROUTES.categoryManagementLandAndPort,
        lazy: async () => {
          const CategoryManagementLandAndPortComponent = await import('../pages/category-management/land-and-port')
          return { Component: CategoryManagementLandAndPortComponent.default }
        }
      },
      {
        path: ROUTES.categoryManagementVehiclesAndEquipment,
        lazy: async () => {
          const CategoryManagementVehiclesAndEquipmentComponent =
            await import('../pages/category-management/vehicles-and-equipment')
          return { Component: CategoryManagementVehiclesAndEquipmentComponent.default }
        }
      },
      {
        path: ROUTES.categoryManagementGoodsAndStandards,
        lazy: async () => {
          const CategoryManagementGoodsAndStandardsComponent =
            await import('../pages/category-management/goods-and-standards')
          return { Component: CategoryManagementGoodsAndStandardsComponent.default }
        }
      },
      {
        path: ROUTES.categoryManagementLoadingPlan,
        lazy: async () => {
          const CategoryManagementLoadingPlanComponent = await import('../pages/category-management/loading-plan')
          return { Component: CategoryManagementLoadingPlanComponent.default }
        }
      },
      {
        path: ROUTES.categoryManagementWarehouseInfrastructure,
        lazy: async () => {
          const CategoryManagementWarehouseInfrastructureComponent =
            await import('../pages/category-management/warehouse-infrastructure')
          return { Component: CategoryManagementWarehouseInfrastructureComponent.default }
        }
      },
      {
        path: ROUTES.categoryManagementYardInfrastructure,
        lazy: async () => {
          const CategoryManagementYardInfrastructureComponent =
            await import('../pages/category-management/yard-infrastructure')
          return { Component: CategoryManagementYardInfrastructureComponent.default }
        }
      },
      {
        path: ROUTES.notificationManagement,
        loader: async () => {
          throw redirect(ROUTES.notificationManagementTemplateConfig)
        }
      },
      {
        path: ROUTES.notificationManagementTemplateConfig,
        lazy: async () => {
          const NotificationManagementTemplateConfigComponent =
            await import('../pages/notification-management/template-config')
          return { Component: NotificationManagementTemplateConfigComponent.default }
        }
      },
      {
        path: ROUTES.systemConfig,
        loader: async () => {
          throw redirect(ROUTES.systemConfigOperatingParams)
        }
      },
      {
        path: ROUTES.systemConfigOperatingParams,
        lazy: async () => {
          const SystemConfigOperatingParamsComponent = await import('../pages/system-config/operating-params')
          return { Component: SystemConfigOperatingParamsComponent.default }
        }
      },
      {
        path: ROUTES.systemConfigNotificationTemplate,
        lazy: async () => {
          const SystemConfigNotificationTemplateComponent = await import('../pages/system-config/notification-template')
          return { Component: SystemConfigNotificationTemplateComponent.default }
        }
      },
      // Quản lý vận chuyển: path tương đối, sub-routes trước, redirect sau
      {
        path: 'transportation/vehicle-dispatch/:id',
        lazy: async () => {
          const C = await import('../pages/transportation/vehicle-dispatch/detail')
          return { Component: C.default }
        }
      },
      {
        path: 'transportation/vehicle-dispatch',
        lazy: async () => {
          const C = await import('../pages/transportation/vehicle-dispatch')
          return { Component: C.default }
        }
      },
      {
        path: 'transportation/vehicle-approval',
        lazy: async () => {
          const C = await import('../pages/transportation/vehicle-approval')
          return { Component: C.default }
        }
      },
      {
        path: 'transportation/service-request-portal',
        lazy: async () => {
          const C = await import('../pages/transportation/service-request-portal')
          return { Component: C.default }
        }
      },
      {
        path: 'transportation/reception-assessment',
        lazy: async () => {
          const C = await import('../pages/transportation/reception-assessment')
          return { Component: C.default }
        }
      },
      {
        path: 'transportation/dispatch-planning',
        lazy: async () => {
          const C = await import('../pages/transportation/dispatch-planning')
          return { Component: C.default }
        }
      },
      {
        path: 'transportation/trip-monitoring',
        lazy: async () => {
          const C = await import('../pages/transportation/trip-monitoring')
          return { Component: C.default }
        }
      },
      {
        path: 'transportation/trip-settlement',
        lazy: async () => {
          const C = await import('../pages/transportation/trip-settlement')
          return { Component: C.default }
        }
      },
      {
        path: 'transportation/tally-billing',
        lazy: async () => {
          const C = await import('../pages/transportation/tally-billing')
          return { Component: C.default }
        }
      },
      {
        path: 'transportation',
        loader: async () => {
          throw redirect(ROUTES.transportationVehicleDispatch)
        }
      }
    ]
  },

  // 🔐 Auth routes (no layout)
  {
    path: ROUTES.login,
    lazy: async () => {
      const LoginComponent = await import('../pages/auth/login')
      return { Component: LoginComponent.default }
    },
    loader: authLoader
  },
  {
    path: ROUTES.register,
    lazy: async () => {
      const RegisterComponent = await import('../pages/auth/register')
      return { Component: RegisterComponent.default }
    },
    loader: authLoader
  },
  {
    path: ROUTES.forgotPassword,
    lazy: async () => {
      const ForgotPasswordComponent = await import('../pages/auth/forgot-password')
      return { Component: ForgotPasswordComponent.default }
    }
  },
  {
    path: ROUTES.resetPassword,
    lazy: async () => {
      const ResetPasswordComponent = await import('../pages/auth/reset-password')
      return { Component: ResetPasswordComponent.default }
    }
  },

  // 🔄 Wildcard redirect
  {
    path: ROUTES.wildcard,
    element: <SmartRedirect />
  }
]
