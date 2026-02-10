import React from 'react'

/**
 * Left side illustration panel for authentication pages
 * Displays logo image centered with 500x500 size
 */
const AuthIllustrationPanel: React.FC = () => {
  return (
    <div className='hidden lg:flex lg:w-1/2 bg-[#1e3a5f] relative overflow-hidden'>
      {/* Centered Logo Image */}
      <div className='w-full h-full flex items-center justify-center'>
        <img src='/logowithcont.png' alt='Logisverse Logo' className='w-[500px] h-[500px] object-contain' />
      </div>
    </div>
  )
}

export default AuthIllustrationPanel
