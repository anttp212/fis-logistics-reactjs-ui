import React from 'react'

/**
 * Left side illustration panel for authentication pages
 * Displays dark blue background with isometric financial/data-themed illustrations
 */
const AuthIllustrationPanel: React.FC = () => {
  return (
    <div className='hidden lg:flex lg:w-1/2 bg-[#1e3a5f] relative overflow-hidden'>
      {/* Grid pattern background */}
      <div className='absolute inset-0 opacity-10'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Isometric illustrations */}
      <div className='relative z-10 w-full h-full flex items-center justify-center p-12'>
        <div className='relative w-full max-w-2xl'>
          {/* Smartphone/Tablet with charts */}
          <div className='absolute top-10 left-10 transform rotate-[-5deg]'>
            <div className='relative w-48 h-64 bg-blue-400 rounded-lg shadow-2xl'>
              <div className='absolute inset-2 bg-white rounded'>
                {/* Charts on screen */}
                <div className='p-3 space-y-2'>
                  <div className='h-8 bg-blue-200 rounded'></div>
                  <div className='h-6 bg-green-200 rounded w-3/4'></div>
                  <div className='h-6 bg-orange-200 rounded w-2/3'></div>
                  <div className='flex gap-1'>
                    <div className='h-12 bg-blue-300 rounded flex-1'></div>
                    <div className='h-16 bg-blue-400 rounded flex-1'></div>
                    <div className='h-10 bg-blue-500 rounded flex-1'></div>
                  </div>
                </div>
              </div>
              {/* Magnifying glass with checkmark */}
              <div className='absolute -top-4 -right-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center'>
                <svg className='w-6 h-6 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path
                    fillRule='evenodd'
                    d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                    clipRule='evenodd'
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Tax document */}
          <div className='absolute top-32 right-20 transform rotate-[8deg]'>
            <div className='w-32 h-40 bg-blue-300 rounded shadow-xl p-3'>
              <div className='bg-white h-full rounded p-2'>
                <div className='text-xs font-bold text-gray-800 mb-2'>TAX</div>
                <div className='space-y-1'>
                  <div className='h-1 bg-gray-300 rounded'></div>
                  <div className='h-1 bg-gray-300 rounded'></div>
                  <div className='h-1 bg-gray-300 rounded w-3/4'></div>
                  <div className='h-1 bg-gray-300 rounded'></div>
                </div>
              </div>
            </div>
          </div>

          {/* Envelope */}
          <div className='absolute bottom-32 left-20 transform rotate-[-12deg]'>
            <div className='w-36 h-24 bg-blue-400 rounded shadow-xl relative'>
              <div className='absolute top-0 left-0 right-0 h-8 bg-blue-500 rounded-t'></div>
              <div className='absolute bottom-2 left-2 right-2 h-16 bg-white rounded'>
                <div className='p-2'>
                  <div className='text-xs font-bold text-gray-800'>TAX</div>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator */}
          <div className='absolute bottom-20 right-32 transform rotate-[5deg]'>
            <div className='w-24 h-32 bg-blue-300 rounded-lg shadow-xl p-2'>
              <div className='bg-white h-full rounded p-2'>
                <div className='grid grid-cols-3 gap-1'>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <div key={num} className='h-6 bg-blue-200 rounded text-xs flex items-center justify-center text-blue-800 font-bold'>
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Money stack */}
          <div className='absolute top-1/2 left-1/4 transform -translate-y-1/2 rotate-[-3deg]'>
            <div className='relative'>
              <div className='w-20 h-28 bg-blue-500 rounded shadow-lg'></div>
              <div className='absolute top-2 left-2 w-20 h-28 bg-blue-400 rounded shadow-lg'></div>
              <div className='absolute top-4 left-4 w-20 h-28 bg-blue-300 rounded shadow-lg flex items-center justify-center'>
                <span className='text-white font-bold text-2xl'>$</span>
              </div>
            </div>
          </div>

          {/* Percentage icons */}
          <div className='absolute top-[20%] left-[60%] transform rotate-12'>
            <div className='w-16 h-16 bg-blue-400 rounded-lg shadow-lg flex items-center justify-center'>
              <span className='text-white font-bold text-xl'>%</span>
            </div>
          </div>
          <div className='absolute top-[50%] right-[10%] transform -rotate-8'>
            <div className='w-16 h-16 bg-blue-400 rounded-lg shadow-lg flex items-center justify-center'>
              <span className='text-white font-bold text-xl'>%</span>
            </div>
          </div>
          <div className='absolute bottom-[30%] left-[50%] transform rotate-[15deg]'>
            <div className='w-16 h-16 bg-blue-400 rounded-lg shadow-lg flex items-center justify-center'>
              <span className='text-white font-bold text-xl'>%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthIllustrationPanel
