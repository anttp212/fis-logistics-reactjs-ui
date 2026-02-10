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
  // 🔄 Root redirect first
  {
    index: true,
    element: <SmartRedirect />
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
        path: ROUTES.warehouse,
        lazy: async () => {
          const WarehouseComponent = await import('../pages/warehouse')
          return { Component: WarehouseComponent.default }
        }
      },
      {
        path: ROUTES.depot,
        lazy: async () => {
          const DepotComponent = await import('../pages/depot')
          return { Component: DepotComponent.default }
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
      {
        path: ROUTES.transportation,
        lazy: async () => {
          const TransportationComponent = await import('../pages/transportation')
          return { Component: TransportationComponent.default }
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
