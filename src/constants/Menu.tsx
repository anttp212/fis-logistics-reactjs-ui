import React from 'react'
import { TFunction } from 'i18next'
import { ROUTES } from './Routes'
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

export interface MenuItemConfigI {
  to: string
  icon: React.ReactNode
  label: string
  subItems?: {
    to: string
    label: string
  }[]
}

export const getMenuItems = (t: TFunction): MenuItemConfigI[] => [
  {
    to: ROUTES.home,
    icon: <DashboardIcon className='w-5 h-5' />,
    label: t('common.menu.dashboard')
  },
  {
    to: ROUTES.warehouse,
    icon: <WarehouseIcon className='w-5 h-5' />,
    label: t('common.menu.warehouse')
  },
  {
    to: ROUTES.depot,
    icon: <DepotIcon className='w-5 h-5' />,
    label: t('common.menu.depot')
  },
  {
    to: ROUTES.transportation,
    icon: <TransportationIcon className='w-5 h-5' />,
    label: t('common.menu.transportation')
  },
  {
    to: ROUTES.profile,
    icon: <PackageIcon className='w-5 h-5' />,
    label: t('common.menu.profile'),
    subItems: [
      {
        to: ROUTES.profile,
        label: t('common.menu.overview')
      }
    ]
  },
  {
    to: ROUTES.userManagement,
    icon: <SettingsIcon className='w-5 h-5' />,
    label: t('common.menu.userManagement'),
    subItems: [
      {
        to: ROUTES.userManagementUsers,
        label: t('common.menu.userManagementUsers')
      },
      {
        to: ROUTES.userManagementUserGroup,
        label: t('common.menu.userManagementUserGroup')
      },
      {
        to: ROUTES.userManagementAuthSecurity,
        label: t('common.menu.userManagementAuthSecurity')
      },
      {
        to: ROUTES.userManagementRolesPermissions,
        label: t('common.menu.userManagementRolesPermissions')
      }
    ]
  },
  {
    to: ROUTES.categoryManagement,
    icon: <PackageIcon className='w-5 h-5' />,
    label: t('common.menu.categoryManagement'),
    subItems: [
      {
        to: ROUTES.categoryManagementLandAndPort,
        label: t('common.menu.categoryManagementLandAndPort')
      },
      {
        to: ROUTES.categoryManagementGoodsAndStandards,
        label: t('common.menu.categoryManagementGoodsAndStandards')
      },
      {
        to: ROUTES.categoryManagementFeesAndVas,
        label: t('common.menu.categoryManagementFeesAndVas')
      },
      {
        to: ROUTES.categoryManagementCustomerProfile,
        label: t('common.menu.categoryManagementCustomerProfile')
      },
      {
        to: ROUTES.categoryManagementEmployeeProfile,
        label: t('common.menu.categoryManagementEmployeeProfile')
      },
      {
        to: ROUTES.categoryManagementVehiclesAndEquipment,
        label: t('common.menu.categoryManagementVehiclesAndEquipment')
      },
      {
        to: ROUTES.categoryManagementLoadingPlan,
        label: t('common.menu.categoryManagementLoadingPlan')
      },
      {
        to: ROUTES.categoryManagementWarehouseAndYardLayout,
        label: t('common.menu.categoryManagementWarehouseAndYardLayout')
      },
      {
        to: ROUTES.categoryManagementShifts,
        label: t('common.menu.categoryManagementShifts')
      }
    ]
  },
  {
    to: ROUTES.notificationManagement,
    icon: <BellIcon className='w-5 h-5' />,
    label: t('common.menu.notificationManagement'),
    subItems: [
      {
        to: ROUTES.notificationManagementTemplateConfig,
        label: t('common.menu.notificationManagementTemplateConfig')
      }
    ]
  },
  {
    to: ROUTES.systemConfig,
    icon: <ConfigIcon className='w-5 h-5' />,
    label: t('common.menu.systemConfig'),
    subItems: [
      {
        to: ROUTES.systemConfigOperatingParams,
        label: t('common.menu.systemConfigOperatingParams')
      }
    ]
  }
]
