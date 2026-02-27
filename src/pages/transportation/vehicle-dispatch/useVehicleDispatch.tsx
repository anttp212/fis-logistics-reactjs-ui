import { useTableToolbar } from '@hooks/useTableToolbar'

const DEFAULT_FILTER_VALUES = {
  search: '',
  billBooking: '',
  owner: '',
  opr: ''
}

const BREADCRUMB_ITEMS = [{ label: 'Trang chủ' }, { label: 'Quản lý vận chuyển' }, { label: 'Điều xe' }]

export const useVehicleDispatch = () => {
  const tableToolbar = useTableToolbar({
    defaultFilterValues: DEFAULT_FILTER_VALUES
  })

  return {
    ...tableToolbar,
    breadcrumbItems: BREADCRUMB_ITEMS
  }
}
