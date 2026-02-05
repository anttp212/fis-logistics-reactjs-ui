import React from 'react'
import { TFunction } from 'i18next'
import { ROUTES } from './Routes'
import {
  DashboardIcon,
  PackageIcon,
  FileContractIcon,
  WarehouseIcon,
  DepotIcon,
  TransportationIcon,
  ConfigIcon
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
    to: ROUTES.costGroup,
    icon: <FileContractIcon className='w-5 h-5' />,
    label: t('common.menu.constGroup')
  },
  {
    to: ROUTES.config,
    icon: <ConfigIcon className='w-5 h-5' />,
    label: t('common.menu.config'),
    subItems: [
      {
        to: ROUTES.roleGroup,
        label: t('common.menu.roleGroup')
      },
      {
        to: ROUTES.user,
        label: t('common.menu.user')
      }
    ]
  }
]
