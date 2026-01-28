import { FilterIcon, SearchIcon } from '@images'
import { FISIconButton, FISInputText } from 'fis-component'
import { FC, useState } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import FISDrawer from '../Drawer'

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
  filterTitle = 'Filter'
}) => {
  const [filterOpen, setFilterOpen] = useState(false)

  // Filter handlers
  const handleFilterOpen = () => {
    loadSavedFilterValues()
    setFilterOpen(true)
  }

  const handleFilterClose = () => {
    handleResetFilter()
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
              value={field.value}
              onChange={(e) => {
                field.onChange(e.target.value)
                handleSearchChange(e.target.value)
              }}
            />
          )}
        />
        <FISIconButton variant='tertiary' icon={<FilterIcon />} onClick={handleFilterOpen} />
      </div>
      {actionButtons}
    </div>
  )
}

export default TableToolbar
