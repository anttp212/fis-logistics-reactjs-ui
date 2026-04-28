import React, { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@constants'

type PortalMenuKeyT = 'inbound' | 'outbound' | 'storage' | 'vas' | 'cross-docking'

interface PortalLayoutPropsI {
  activeKey: PortalMenuKeyT
  children: ReactNode
}

const PortalLayout: React.FC<PortalLayoutPropsI> = ({ activeKey, children }) => {
  const navigate = useNavigate()

  const menuItems: { key: PortalMenuKeyT; label: string; route: string }[] = [
    { key: 'inbound', label: 'Inbound (Nhập kho)', route: ROUTES.portalInbound },
    { key: 'outbound', label: 'Outbound (Xuất kho)', route: ROUTES.portalOutbound },
    { key: 'storage', label: 'Storage (Lưu kho)', route: ROUTES.portalStorage },
    { key: 'vas', label: 'VAS (Gia công, đóng gói, dán tem)', route: ROUTES.portalVas },
    { key: 'cross-docking', label: 'Cross-docking', route: ROUTES.portalCrossDocking }
  ]

  return (
    <div className='min-h-screen w-full flex bg-slate-50'>
      <aside className='w-64 bg-white shadow-md border-r border-gray-100 flex flex-col'>
        <div className='px-5 py-4 border-b border-gray-100'>
          <h1 className='text-lg font-semibold text-gray-900'>Portal</h1>
          <p className='mt-1 text-xs text-gray-500'>Truy cập nhanh các yêu cầu dịch vụ</p>
        </div>

        <nav className='flex-1 py-3'>
          <ul className='space-y-1'>
            {menuItems.map((item) => {
              const isActive = item.key === activeKey
              return (
                <li key={item.key}>
                  <button
                    type='button'
                    onClick={() => navigate(item.route)}
                    className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      <main className='flex-1 flex flex-col p-5'>
        <div className='flex-1 flex flex-col'>{children}</div>
      </main>
    </div>
  )
}

export default PortalLayout
