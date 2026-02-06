import { useTableToolbar } from '@hooks/useTableToolbar'

// Default filter values
const DEFAULT_FILTER_VALUES = {
  search: '',
  name: '',
  description: ''
}

// Breadcrumb items
const BREADCRUMB_ITEMS = [{ label: 'Trang chủ' }, { label: 'Nhóm người dùng' }]

export const useUserGroup = () => {
  const tableToolbar = useTableToolbar({
    defaultFilterValues: DEFAULT_FILTER_VALUES
  })

  return {
    ...tableToolbar,
    breadcrumbItems: BREADCRUMB_ITEMS
  }
}
