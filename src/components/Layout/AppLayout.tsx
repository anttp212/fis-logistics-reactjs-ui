import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header.tsx'
import Sidebar from './Sidebar.tsx'

const AppLayout: React.FC = () => {
  return (
    <div className='h-screen bg-[#242173] overflow-hidden flex flex-col'>
      {/* Header */}
      <Header />

      {/* Main Content Area */}
      <div className='flex-1 flex overflow-hidden'>
        <Sidebar />

        <main className='flex-1 bg-[#EFF3FD] rounded-tl-[28px] pt-4 px-6 overflow-hidden'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppLayout
