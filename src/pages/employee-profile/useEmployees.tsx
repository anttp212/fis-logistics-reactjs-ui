import { useTableToolbar } from '@hooks/useTableToolbar'

// Default filter values
const DEFAULT_FILTER_VALUES = {
  search: '',
  name: '',
  employeeCode: '',
  department: '',
  skillGroup: '',
  status: ''
}

// Breadcrumb items
const BREADCRUMB_ITEMS = [{ label: 'Trang chủ' }, { label: 'Quản lý danh mục' }, { label: 'Hồ sơ nhân viên' }]

export const useEmployees = () => {
  const tableToolbar = useTableToolbar({
    defaultFilterValues: DEFAULT_FILTER_VALUES
  })

  return {
    ...tableToolbar,
    breadcrumbItems: BREADCRUMB_ITEMS
  }
}
