import { FilterIcon, SearchIcon } from '@images'
import { FISIconButton, FISInputText } from 'fis-component'
import { FC, useMemo, useState } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import FISDrawer from '../Drawer'

const hasActiveFilters = (filters?: Record<string, any>): boolean => {
  if (!filters || typeof filters !== 'object') return false
  return Object.values(filters).some((v) => {
    if (Array.isArray(v)) return v.length > 0
    return v != null && String(v).trim() !== ''
  })
}

type TableToolbarPropsT<TFormValues extends FieldValues = any> = {
  actionButtons?: React.ReactNode
  searchPlaceholder?: string
  control: Control<TFormValues>
  handleSearchChange: (value: string) => void
  handleSaveFilter: () => void
  handleResetFilter: () => void
  loadSavedFilterValues: () => void
  filterContent: React.ReactNode
  filterTitle?: string
  search?: string
  filters?: Record<string, any>
}

const TableToolbar: FC<TableToolbarPropsT> = ({
  actionButtons,
  searchPlaceholder = 'Search...',
  control,
  handleSearchChange,
  handleSaveFilter,
  handleResetFilter,
  loadSavedFilterValues,
  filterContent,
  filterTitle = 'Bộ lọc',
  search = '',
  filters
}) => {
  const [filterOpen, setFilterOpen] = useState(false)

  const hasActiveSearch = useMemo(
    () => (search && search.trim() !== '') || hasActiveFilters(filters),
    [search, filters]
  )

  // Filter handlers
  const handleFilterOpen = () => {
    loadSavedFilterValues()
    setFilterOpen(true)
  }

  const handleFilterClose = () => {
    setFilterOpen(false)
  }

  const handleFilterSave = () => {
    handleSaveFilter()
    setFilterOpen(false)
  }

  const handleFilterReset = () => {
    handleResetFilter()
  }

  return (
    <div className='flex justify-between items-center'>
      <FISDrawer
        open={filterOpen}
        title={filterTitle}
        onClose={handleFilterClose}
        onSave={handleFilterSave}
        onReset={handleFilterReset}
        textCancel='Hủy'
        textSave='Tìm kiếm'
      >
        {filterContent}
      </FISDrawer>
      <div className='flex gap-2'>
        <Controller
          name={'search' as any}
          control={control}
          render={({ field }) => (
            <FISInputText
              className='!w-[320px]'
              placeholder={searchPlaceholder}
              iconPrefix={<SearchIcon />}
              {...field}
              onChange={(e) => {
                field.onChange(e.target.value)
                handleSearchChange(e.target.value)
              }}
            />
          )}
        />
        <div className='relative'>
          <FISIconButton variant='tertiary' icon={<FilterIcon />} onClick={handleFilterOpen} />
          {hasActiveSearch && (
            <span
              className='absolute top-[-5px] right-[-5px] w-3 h-3 bg-blue-500 rounded-full'
              aria-label='Đang tìm kiếm'
            />
          )}
        </div>
      </div>
      {actionButtons}
    </div>
  )
}

export default TableToolbar
