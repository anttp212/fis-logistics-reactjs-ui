import { useTableToolbar } from '@hooks/useTableToolbar'

// Default filter values
const DEFAULT_FILTER_VALUES = {
  search: '',
  name: ''
}

// Breadcrumb items
const BREADCRUMB_ITEMS = [{ label: 'Trang chủ' }, { label: 'Cấu hình' }, { label: 'Nhóm quyền' }]

export const useRoleGroup = () => {
  const tableToolbar = useTableToolbar({
    defaultFilterValues: DEFAULT_FILTER_VALUES
  })

  return {
    ...tableToolbar,
    breadcrumbItems: BREADCRUMB_ITEMS
  }
}
