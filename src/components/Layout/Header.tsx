import React from 'react'
import { useAppSelector } from '@hooks'
import { HelpCircleIcon, BellIcon, SettingsIcon } from '@images'

const Header: React.FC = () => {
  const user = useAppSelector((state) => state.auth?.user)

  return (
    <header className='bg-[#242173] text-white px-4 py-3 flex items-center justify-end'>
      {/* Right Side - Actions */}
      <div className='flex items-center gap-1'>
        {/* Help Button */}
        <button className='p-1.5 hover:bg-white/10 rounded-md transition-colors'>
          <HelpCircleIcon className='w-4 h-4' />
        </button>

        {/* Notification Button with Badge */}
        <div className='relative'>
          <button className='p-1.5 hover:bg-white/10 rounded-md transition-colors'>
            <BellIcon className='w-4 h-4' />
          </button>
          {/* Notification Badge */}
          <span className='absolute -top-0.5 -right-0.5 bg-[#DF3E3F] text-white text-[10px] font-medium px-1 rounded min-w-[16px] h-4 flex items-center justify-center'>
            15
          </span>
        </div>

        {/* Settings Button */}
        <button className='p-1.5 hover:bg-white/10 rounded-md transition-colors'>
          <SettingsIcon className='w-4 h-4' />
        </button>

        {/* User Profile */}
        <div className='flex items-center gap-2 p-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer'>
          {/* Avatar */}
          <div className='w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border border-white/20'>
            <span className='text-white text-xs font-medium'>{user?.name?.charAt(0) || 'U'}</span>
          </div>

          {/* User Name */}
          <span className='text-sm font-medium'>{user?.name || 'User Name'}</span>
        </div>
      </div>
    </header>
  )
}

export default Header
