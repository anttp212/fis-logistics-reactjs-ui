import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { getMenuItems } from '@constants'
import { ChevronDownIcon, ExpandIcon } from '@images'
import { FISIconButton, FISText } from 'fis-component'

interface SubMenuItemI {
  to: string
  label: string
}

interface MenuItemPropsI {
  to: string
  icon: React.ReactNode
  label: string
  subItems?: SubMenuItemI[]
  isCollapsed?: boolean
}

// Shared styles
const baseMenuStyles = 'flex gap-3 rounded-lg transition-all duration-300 ease-in-out text-white items-center'
const activeMenuStyles = 'bg-white/20'
const hoverMenuStyles = 'hover:bg-white/10 hover:text-white'

// SubMenu Component
const SubMenu: React.FC<{
  subItems: SubMenuItemI[]
  isExpanded: boolean
  currentPath: string
}> = React.memo(({ subItems, isExpanded, currentPath }) => (
  <div
    className={`flex gap-2 overflow-hidden transition-all duration-300 ease-in-out  ${
      isExpanded ? 'opacity-100' : 'max-h-0 opacity-0'
    }`}
  >
    {/* <div className='w-[14px] h-full flex flex-col mt-1'>
      {subItems.map((_, index) => (
        <div key={index} className='h-[36px] relative flex'>
          <div className='w-[14px] h-[17px] border-l border-b border-white rounded-bl-[4px]' />
          {index !== subItems.length - 1 && <div className='bottom-0 absolute h-full w-px bg-white mt-[-4px]' />}
        </div>
      ))}
    </div> */}
    <div className='w-full'>
      {subItems.map((subItem) => {
        const isActiveOrChild = currentPath === subItem.to || currentPath.startsWith(subItem.to + '/')
        return (
          <NavLink
            key={subItem.to}
            to={subItem.to}
            className={`flex h-[36px] pl-[52px] items-center mt-1 rounded-lg transition-all text-white text-base font-medium ${
              isActiveOrChild ? 'bg-white/15' : hoverMenuStyles
            }`}
          >
            <FISText variant='Paragraph/Sm' color='com/navigation/label/default' className='line-clamp-1'>
              {subItem.label}
            </FISText>
          </NavLink>
        )
      })}
    </div>
  </div>
))

SubMenu.displayName = 'SubMenu'

const MenuItem: React.FC<MenuItemPropsI> = ({ to, icon, label, subItems, isCollapsed = false }) => {
  const [isMenuExpanded, setIsMenuExpanded] = useState(false)
  const location = useLocation()

  // Check if any submenu item is active
  const hasActiveSubItem = useMemo(
    () =>
      subItems?.some((subItem) => location.pathname === subItem.to || location.pathname.startsWith(subItem.to + '/')) ||
      false,
    [subItems, location.pathname]
  )

  // Auto expand if any submenu item is active
  useEffect(() => {
    if (hasActiveSubItem) {
      setIsMenuExpanded(true)
    }
  }, [hasActiveSubItem])

  const toggleExpanded = useCallback(() => {
    if (!isCollapsed && subItems) {
      setIsMenuExpanded((prev) => !prev)
    }
  }, [isCollapsed, subItems])

  const paddingClass = isCollapsed ? 'px-[10px] py-[10px]' : 'px-2 h-[36px]'

  // Simple menu item without subItems
  if (!subItems) {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `${baseMenuStyles} ${isActive ? activeMenuStyles : hoverMenuStyles} ${paddingClass}`
        }
        title={isCollapsed ? label : undefined}
      >
        <div className='flex items-center'>{icon}</div>
        {!isCollapsed && (
          <FISText variant='Paragraph/Sm' color='com/navigation/label/default'>
            {label}
          </FISText>
        )}
      </NavLink>
    )
  }

  // Menu item with submenu
  return (
    <div>
      <div
        className={`${baseMenuStyles} cursor-pointer ${
          hasActiveSubItem ? activeMenuStyles : hoverMenuStyles
        } ${paddingClass}`}
        onClick={toggleExpanded}
        title={isCollapsed ? label : undefined}
      >
        <div className='flex items-center'>{icon}</div>
        {!isCollapsed && (
          <>
            <FISText className='flex flex-1' variant='Paragraph/Sm' color='com/navigation/label/default'>
              {label}
            </FISText>
            <ChevronDownIcon
              size={20}
              stroke='white'
              className={`transition-transform duration-300 ease-in-out ${isMenuExpanded ? 'rotate-180' : 'rotate-0'}`}
            />
          </>
        )}
      </div>

      {!isCollapsed && <SubMenu subItems={subItems} isExpanded={isMenuExpanded} currentPath={location.pathname} />}
    </div>
  )
}

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { t } = useTranslation()

  // Get menu items with translations
  const menuItems = useMemo(() => getMenuItems(t), [t])

  return (
    <div
      className={`${isCollapsed ? 'w-[80px]' : 'w-[280px]'} flex-shrink-0 bg-[#242173] text-white flex flex-col justify-between transition-all duration-500 gap-3`}
    >
      <div
        className={`flex w-full mt-8 px-4 relative transition-all duration-500 ease-in-out ${isCollapsed ? 'justify-center' : 'justify-between'}`}
      >
        <strong>Fis</strong>
        <div
          className={`transition-all duration-500 ease-in-out ${isCollapsed ? 'absolute top-0 right-[-12px]' : 'relative'}`}
        >
          <FISIconButton
            size='sm'
            icon={
              <ExpandIcon
                className={` transition-transform duration-500 ease-in-out ${isCollapsed ? 'rotate-180' : 'rotate-0'}`}
              />
            }
            variant='primary-white'
            onClick={() => setIsCollapsed(!isCollapsed)}
          />
        </div>
      </div>

      {/* Navigation Menu */}
      <div
        className={`overflow-y-scroll flex-1 transition-all duration-500 ease-in-out ${isCollapsed ? 'px-5' : 'px-4'}`}
        style={{
          msOverflowStyle: 'none', // IE & Edge
          scrollbarWidth: 'none' // Firefox
        }}
      >
        <nav className='gap-1 flex flex-col transition-all duration-500 ease-in-out'>
          {menuItems?.map((item, index) => (
            <MenuItem
              key={item.to || index}
              to={item.to}
              icon={item.icon}
              label={item.label}
              subItems={item.subItems}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>
    </div>
  )
}

export default Sidebar
