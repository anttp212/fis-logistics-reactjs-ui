import { PageWrapper, TableToolbar } from '@components'
import { AddIcon } from '@images'
import { FISButton } from 'fis-component'
import { useUser } from './useUser'
import { createContext, useContext } from 'react'
import UserFilter from './components/UserFilter'

type UserContextT = ReturnType<typeof useUser>
const UserContext = createContext<UserContextT>({} as UserContextT)

// eslint-disable-next-line react-refresh/only-export-components
export const useUserContext = (): UserContextT => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within UserContext.Provider')
  }
  return context
}

const User = () => {
  const user = useUser()
  return (
    <UserContext.Provider value={user}>
      <PageWrapper className='p-5' title='Người dùng' breadcrumbItems={user.breadcrumbItems}>
        <div className='flex gap-5 flex-col h-full'>
          <TableToolbar
            filterContent={<UserFilter control={user.control} />}
            actionButtons={<FISButton startIcon={<AddIcon />}>Thêm mới</FISButton>}
            {...user}
          />
          <div className='flex-1 bg-white rounded-lg p-4'>
            <p className='text-gray-600'>Nội dung quản lý người dùng sẽ được hiển thị tại đây</p>
          </div>
        </div>
      </PageWrapper>
    </UserContext.Provider>
  )
}

export default User
