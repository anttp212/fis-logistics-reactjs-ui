import { useTableToolbar } from '@hooks/useTableToolbar'
import type { CostGroupFilterT } from './types'

// Default filter values
const DEFAULT_FILTER_VALUES: CostGroupFilterT = {
  code: '',
  name: '',
  remark: '',
  status: null
}

// Breadcrumb items
const BREADCRUMB_ITEMS = [{ label: 'Home' }, { label: 'Cost Group' }]

export const useCostGroup = () => {
  const tableToolbar = useTableToolbar<CostGroupFilterT>({
    defaultFilterValues: DEFAULT_FILTER_VALUES
  })

  return {
    ...tableToolbar,
    breadcrumbItems: BREADCRUMB_ITEMS
  }
}
