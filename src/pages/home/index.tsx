import { FISButton } from 'fis-component'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@constants'
import { clearAuth } from '@slices/auth.slice'
import { useAppSelector, useAppDispatch } from '@hooks'

const Home = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(clearAuth())
    navigate(ROUTES.login, { replace: true })
  }

  // Mock contract data based on Figma design
  const contractData = [
    {
      id: 'HD1',
      client: 'Marvis 1',
      status: 'awaiting',
      products: 'Kyta, Geobase v2 and 3 more',
      amDepartment: 'PMO',
      revenue: '25.000.000.000.000',
      signedDate: '30/5/2025'
    },
    {
      id: 'HD2',
      client: 'Marvis 2',
      status: 'approved',
      products: 'Kyta, Geobase v2 and 3 more',
      amDepartment: 'PMO',
      revenue: '25.000.000.000.000',
      signedDate: '30/5/2025'
    },
    {
      id: 'HD3',
      client: 'Marvis 3',
      status: 'rejected',
      products: 'Kyta, Geobase v2 and 3 more',
      amDepartment: 'PMO',
      revenue: '25.000.000.000.000',
      signedDate: '30/5/2025'
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'awaiting':
        return (
          <span className='inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-[#FDEBD0] text-[#7A4300] border border-[#FBD797]'>
            <div className='w-3 h-3 border border-current rounded-full animate-spin' />
            Awaiting approval
          </span>
        )
      case 'approved':
        return (
          <span className='inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-[#DBF6E8] text-[#006535] border border-[#B3E9CF]'>
            <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
            </svg>
            Approved
          </span>
        )
      case 'rejected':
        return (
          <span className='inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-[#FFE9E5] text-[#A7051E] border border-[#FBD3CE]'>
            <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
            </svg>
            Rejected
          </span>
        )
      default:
        return (
          <span className='inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200'>
            Draft
          </span>
        )
    }
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex flex-col gap-1'>
        {/* Breadcrumb */}
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6'
            />
          </svg>
          <span>/</span>
        </div>

        {/* Page Title */}
        <h1 className='text-2xl font-medium text-[#1E2225]'>Contract list</h1>
      </div>

      {/* Main Content */}
      <div className='bg-white rounded-t-[20px] shadow-lg'>
        {/* Summary Card */}
        <div className='p-5 border-b border-gray-200'>
          <div className='flex items-center justify-between'>
            <span className='text-sm font-medium text-gray-700'>Total revenue (of displayed contracts)</span>
            <span className='text-sm font-medium text-[#2A3034]'>50.000.000.000.000 VND</span>
          </div>
        </div>

        {/* Tabs */}
        <div className='border-b border-gray-200'>
          <div className='flex gap-6 px-5'>
            <button className='flex items-center gap-2 px-0 py-3 border-b-2 border-[#2F3CC1] text-[#2A30A0] font-medium'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' />
                <polyline points='14,2 14,8 20,8' />
              </svg>
              Contract list
            </button>
            <button className='flex items-center gap-2 px-0 py-3 text-gray-600 hover:text-gray-900'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' />
              </svg>
              Invoice
            </button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className='flex items-center justify-between gap-4 p-5 border-b border-gray-200'>
          <div className='flex items-center gap-2 flex-1 max-w-md'>
            <div className='relative flex-1'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <svg className='w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <circle cx='11' cy='11' r='8' />
                  <path d='m21 21-4.35-4.35' />
                </svg>
              </div>
              <input
                type='text'
                placeholder='Enter contract ID to search'
                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              />
            </div>
            <button className='p-2 border border-gray-300 rounded-lg hover:bg-gray-50'>
              <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <polygon points='22,3 2,3 10,12.46 10,19 14,21 14,12.46' />
              </svg>
            </button>
          </div>

          <FISButton variant='primary' className='flex items-center gap-2'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <line x1='12' y1='5' x2='12' y2='19' />
              <line x1='5' y1='12' x2='19' y2='12' />
            </svg>
            Create contract
          </FISButton>
        </div>

        {/* Table */}
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-[#E9EDF1]'>
              <tr>
                <th className='text-left py-3 px-4 font-medium text-gray-700'>Contract ID</th>
                <th className='text-left py-3 px-4 font-medium text-gray-700'>Client company name</th>
                <th className='text-left py-3 px-4 font-medium text-gray-700'>Approval status</th>
                <th className='text-left py-3 px-4 font-medium text-gray-700'>Product(s)</th>
                <th className='text-left py-3 px-4 font-medium text-gray-700'>AM department</th>
                <th className='text-right py-3 px-4 font-medium text-gray-700'>Contract revenue (VND)</th>
                <th className='text-left py-3 px-4 font-medium text-gray-700'>Signed date</th>
                <th className='py-3 px-4'></th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {contractData.map((contract) => (
                <tr key={contract.id} className='hover:bg-gray-50'>
                  <td className='py-3 px-4'>
                    <a href='#' className='text-[#2F3CC1] font-medium hover:underline'>
                      {contract.id}
                    </a>
                  </td>
                  <td className='py-3 px-4 text-gray-900'>{contract.client}</td>
                  <td className='py-3 px-4'>{getStatusBadge(contract.status)}</td>
                  <td className='py-3 px-4 text-gray-700'>{contract.products}</td>
                  <td className='py-3 px-4 text-gray-700'>{contract.amDepartment}</td>
                  <td className='py-3 px-4 text-right font-medium text-gray-900'>{contract.revenue}</td>
                  <td className='py-3 px-4 text-gray-700'>{contract.signedDate}</td>
                  <td className='py-3 px-4'>
                    <button className='p-1 hover:bg-gray-100 rounded'>
                      <svg className='w-4 h-4 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between px-5 py-4 border-t border-gray-200'>
          <div className='flex items-center gap-1 text-sm text-gray-600'>
            <span>Hiển thị</span>
            <span className='font-medium'>1-10</span>
            <button className='p-1 hover:bg-gray-100 rounded'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <circle cx='12' cy='12' r='10' />
                <path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3' />
                <path d='M12 17h.01' />
              </svg>
            </button>
          </div>

          <div className='flex items-center gap-1'>
            <button disabled className='p-1 text-gray-400 cursor-not-allowed'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>

            <button className='px-2 py-1 bg-[#E7F1FA] text-[#2A30A0] rounded font-medium text-sm min-w-[28px]'>
              1
            </button>
            <button className='px-2 py-1 text-gray-600 hover:bg-gray-100 rounded font-medium text-sm min-w-[28px]'>
              2
            </button>
            <button className='px-2 py-1 text-gray-600 hover:bg-gray-100 rounded font-medium text-sm min-w-[28px]'>
              3
            </button>
            <span className='px-2 text-gray-400'>...</span>
            <button className='px-2 py-1 text-gray-600 hover:bg-gray-100 rounded font-medium text-sm min-w-[28px]'>
              20
            </button>

            <button className='p-1 text-gray-600 hover:bg-gray-100 rounded'>
              <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>
          </div>

          <div className='flex items-center gap-2'>
            <select className='px-2 py-1 border border-gray-300 rounded text-sm bg-white'>
              <option>10 / trang</option>
              <option>20 / trang</option>
              <option>50 / trang</option>
            </select>
          </div>
        </div>
      </div>

      {/* User Actions (for testing) */}
      <div className='mt-6 bg-white rounded-lg shadow p-4'>
        <h3 className='font-medium text-gray-900 mb-3'>User Actions</h3>
        <div className='flex gap-3'>
          <FISButton variant='secondary' onClick={() => navigate(ROUTES.profile)}>
            View Profile
          </FISButton>
          <FISButton variant='secondary-negative' onClick={handleLogout}>
            Logout
          </FISButton>
        </div>
        {user && (
          <p className='text-sm text-gray-600 mt-2'>
            Logged in as: <strong>{user.name}</strong> ({user.email})
          </p>
        )}
      </div>
    </div>
  )
}

export default Home
