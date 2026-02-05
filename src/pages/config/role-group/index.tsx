import { PageWrapper, TableToolbar } from '@components'
import { AddIcon } from '@images'
import { FISButton } from 'fis-component'
import { useRoleGroup } from './useRoleGroup'
import { createContext, useContext } from 'react'
import RoleGroupFilter from './components/RoleGroupFilter'

type RoleGroupContextT = ReturnType<typeof useRoleGroup>
const RoleGroupContext = createContext<RoleGroupContextT>({} as RoleGroupContextT)

// eslint-disable-next-line react-refresh/only-export-components
export const useRoleGroupContext = (): RoleGroupContextT => {
  const context = useContext(RoleGroupContext)
  if (!context) {
    throw new Error('useRoleGroupContext must be used within RoleGroupContext.Provider')
  }
  return context
}

const RoleGroup = () => {
  const roleGroup = useRoleGroup()
  return (
    <RoleGroupContext.Provider value={roleGroup}>
      <PageWrapper className='p-5' title='Nhóm quyền' breadcrumbItems={roleGroup.breadcrumbItems}>
        <div className='flex gap-5 flex-col h-full'>
          <TableToolbar
            filterContent={<RoleGroupFilter control={roleGroup.control} />}
            actionButtons={<FISButton startIcon={<AddIcon />}>Thêm mới</FISButton>}
            {...roleGroup}
          />
          <div className='flex-1 bg-white rounded-lg p-4'>
            <p className='text-gray-600'>Nội dung quản lý nhóm quyền sẽ được hiển thị tại đây</p>
          </div>
        </div>
      </PageWrapper>
    </RoleGroupContext.Provider>
  )
}

export default RoleGroup
