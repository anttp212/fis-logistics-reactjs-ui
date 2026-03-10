import { PageWrapper, TableToolbar } from '@components'
import { AddIcon } from '@images'
import { FISButton } from 'fis-component'
import { useTransportation } from './useTransportation'
import { createContext, useContext } from 'react'
import TransportationFilter from './components/TransportationFilter'

type TransportationContextT = ReturnType<typeof useTransportation>
const TransportationContext = createContext<TransportationContextT>({} as TransportationContextT)

// eslint-disable-next-line react-refresh/only-export-components
export const useTransportationContext = (): TransportationContextT => {
  const context = useContext(TransportationContext)
  if (!context) {
    throw new Error('useTransportationContext must be used within TransportationContext.Provider')
  }
  return context
}

const Transportation = () => {
  const transportation = useTransportation()
  return (
    <TransportationContext.Provider value={transportation}>
      <PageWrapper className='py-5' title='Quản lý vận chuyển' breadcrumbItems={transportation.breadcrumbItems}>
        <div className='flex gap-5 flex-col h-full'>
          <TableToolbar
            filterContent={<TransportationFilter control={transportation.control} />}
            actionButtons={<FISButton startIcon={<AddIcon />}>Thêm mới</FISButton>}
            {...transportation}
          />
          <div className='flex-1 bg-white rounded-lg p-4'>
            <p className='text-gray-600'>Nội dung quản lý vận chuyển sẽ được hiển thị tại đây</p>
          </div>
        </div>
      </PageWrapper>
    </TransportationContext.Provider>
  )
}

export default Transportation
