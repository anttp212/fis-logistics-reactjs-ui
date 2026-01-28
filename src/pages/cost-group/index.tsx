import { PageWrapper, TableToolbar } from '@components'
import { AddIcon } from '@images'
import { FISButton } from 'fis-component'
import { useCostGroup } from './useCostGroup'
import { createContext, useContext } from 'react'
import CostGroupFilter from './components/CostGroupFilter'
import CostGroupTable from './components/CostGroupTable'

type CostGroupContextT = ReturnType<typeof useCostGroup>
const CostGroupContext = createContext<CostGroupContextT>({} as CostGroupContextT)

// eslint-disable-next-line react-refresh/only-export-components
export const useCostGroupContext = (): CostGroupContextT => {
  const context = useContext(CostGroupContext)
  if (!context) {
    throw new Error('useCostGroupContext must be used within CostGroupContext.Provider')
  }
  return context
}

const CostGroup = () => {
  const costGroup = useCostGroup()
  return (
    <CostGroupContext.Provider value={costGroup}>
      <PageWrapper className='p-5' title='Cost Group' breadcrumbItems={costGroup.breadcrumbItems}>
        <div className='flex gap-5 flex-col h-full'>
          <TableToolbar
            filterContent={<CostGroupFilter />}
            actionButtons={<FISButton startIcon={<AddIcon />}>Thêm mới</FISButton>}
            {...costGroup}
          />
          <CostGroupTable />
        </div>
      </PageWrapper>
    </CostGroupContext.Provider>
  )
}

export default CostGroup
