import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@hooks'
import { ROUTES } from '@constants'
import { clearAuth } from '@slices/auth.slice'
import { HelpCircleIcon, BellIcon, SettingsIcon, ChevronDownIcon } from '@images'

const Header: React.FC = () => {
  const user = useAppSelector((state) => state.auth?.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleLogout = () => {
    dispatch(clearAuth())
    navigate(ROUTES.login, { replace: true })
    setIsDropdownOpen(false)
  }

  const handleProfileClick = () => {
    navigate(ROUTES.userManagementProfile)
    setIsDropdownOpen(false)
  }

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

        {/* User Profile with Dropdown */}
        <div className='relative' ref={dropdownRef}>
          <div
            className='flex items-center gap-2 p-1 hover:bg-white/10 rounded-md transition-colors cursor-pointer'
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            {/* Avatar */}
            <div className='w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center border border-white/20'>
              <span className='text-white text-xs font-medium'>{user?.name?.charAt(0) || 'U'}</span>
            </div>

            {/* User Name */}
            <span className='text-sm font-medium'>{user?.name || 'User Name'}</span>

            {/* Chevron Icon */}
            <ChevronDownIcon
              size={16}
              stroke='white'
              className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            />
          </div>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200'>
              <button
                onClick={handleProfileClick}
                className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2'
              >
                <span>Thông tin tài khoản</span>
              </button>
              <div className='border-t border-gray-200 my-1' />
              <button
                onClick={handleLogout}
                className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2'
              >
                <span>Đăng xuất</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
