import { PageWrapper, TableToolbar } from '@components'
import { AddIcon } from '@images'
import { FISButton } from 'fis-component'
import { useDepot } from './useDepot'
import { createContext, useContext } from 'react'
import DepotFilter from './components/DepotFilter'

type DepotContextT = ReturnType<typeof useDepot>
const DepotContext = createContext<DepotContextT>({} as DepotContextT)

// eslint-disable-next-line react-refresh/only-export-components
export const useDepotContext = (): DepotContextT => {
  const context = useContext(DepotContext)
  if (!context) {
    throw new Error('useDepotContext must be used within DepotContext.Provider')
  }
  return context
}

const Depot = () => {
  const depot = useDepot()
  return (
    <DepotContext.Provider value={depot}>
      <PageWrapper className='py-5' title='Quản lý bãi depot' breadcrumbItems={depot.breadcrumbItems}>
        <div className='flex gap-5 flex-col h-full'>
          <TableToolbar
            filterContent={<DepotFilter control={depot.control} />}
            actionButtons={<FISButton startIcon={<AddIcon />}>Thêm mới</FISButton>}
            {...depot}
          />
          <div className='flex-1 bg-white rounded-lg p-4'>
            <p className='text-gray-600'>Nội dung quản lý bãi depot sẽ được hiển thị tại đây</p>
          </div>
        </div>
      </PageWrapper>
    </DepotContext.Provider>
  )
}

export default Depot
