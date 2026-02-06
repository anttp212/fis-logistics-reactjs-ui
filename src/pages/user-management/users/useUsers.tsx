import { useTableToolbar } from '@hooks/useTableToolbar'

// Default filter values
const DEFAULT_FILTER_VALUES = {
  search: '',
  name: '',
  userGroup: '',
  role: '',
  status: ''
}

// Breadcrumb items
const BREADCRUMB_ITEMS = [{ label: 'Trang chủ' }, { label: 'Quản lý người dùng' }]

export const useUsers = () => {
  const tableToolbar = useTableToolbar({
    defaultFilterValues: DEFAULT_FILTER_VALUES
  })

  return {
    ...tableToolbar,
    breadcrumbItems: BREADCRUMB_ITEMS
  }
}
