import React from 'react'
import { TFunction } from 'i18next'
import { ROUTES } from './Routes'
import { DashboardIcon, PackageIcon, FileContractIcon } from '@images'

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
  }
]
