import { useTableToolbar } from '@hooks/useTableToolbar'

const DEFAULT_FILTER_VALUES = {
  search: '',
  name: '',
  code: '',
  branch: '',
  status: ''
}

const BREADCRUMB_ITEMS = [{ label: 'Trang chủ' }, { label: 'Cơ cấu Tổ chức' }, { label: 'Phòng ban' }]

export const useDepartments = () => {
  const tableToolbar = useTableToolbar({
    defaultFilterValues: DEFAULT_FILTER_VALUES
  })

  return {
    ...tableToolbar,
    breadcrumbItems: BREADCRUMB_ITEMS
  }
}
