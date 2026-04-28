import { PageWrapper, TableToolbar } from '@components'
import { AddIcon } from '@images'
import { FISButton } from 'fis-component'
import { useWarehouse } from './useWarehouse'
import { createContext, useContext } from 'react'
import WarehouseFilter from './components/WarehouseFilter'

type WarehouseContextT = ReturnType<typeof useWarehouse>
const WarehouseContext = createContext<WarehouseContextT>({} as WarehouseContextT)

// eslint-disable-next-line react-refresh/only-export-components
export const useWarehouseContext = (): WarehouseContextT => {
  const context = useContext(WarehouseContext)
  if (!context) {
    throw new Error('useWarehouseContext must be used within WarehouseContext.Provider')
  }
  return context
}

const Warehouse = () => {
  const warehouse = useWarehouse()
  return (
    <WarehouseContext.Provider value={warehouse}>
      <PageWrapper className='py-5' title='Quản lý kho' breadcrumbItems={warehouse.breadcrumbItems}>
        <div className='flex gap-5 flex-col h-full'>
          <TableToolbar
            filterContent={<WarehouseFilter control={warehouse.control} />}
            actionButtons={<FISButton startIcon={<AddIcon />}>Thêm mới</FISButton>}
            {...warehouse}
          />
          <div className='flex-1 bg-white rounded-lg p-4'>
            <p className='text-gray-600'>Nội dung quản lý kho sẽ được hiển thị tại đây</p>
          </div>
        </div>
      </PageWrapper>
    </WarehouseContext.Provider>
  )
}

export default Warehouse
