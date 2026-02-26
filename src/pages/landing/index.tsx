import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@constants'
import { useAppSelector } from '@hooks'

const LandingPage: React.FC = () => {
  const navigate = useNavigate()
  const isAuthenticated = !!useAppSelector((s) => s.auth?.accessToken)
  const isRehydrated = useAppSelector((s) => s._persist?.rehydrated ?? false)

  React.useEffect(() => {
    if (isRehydrated && isAuthenticated) {
      navigate(ROUTES.home, { replace: true })
    }
  }, [isRehydrated, isAuthenticated, navigate])

  if (!isRehydrated || isAuthenticated) {
    return (
      <div className='flex justify-center items-center min-h-screen bg-slate-900'>
        <div className='text-white/80'>Đang chuyển hướng...</div>
      </div>
    )
  }

  return (
    <div className='relative min-h-screen flex items-center justify-center overflow-hidden'>
      {/* Background image */}
      <div
        className='absolute inset-0 bg-cover bg-center bg-no-repeat'
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920')`
        }}
      />
      {/* Dark overlay */}
      <div className='absolute inset-0 bg-slate-900/60' />

      {/* Content */}
      <div className='relative z-10 max-w-4xl mx-auto px-6 text-center'>
        <h1 className='text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight'>
          Giải pháp Depot & Warehouse thông minh cho doanh nghiệp logistics
        </h1>
        <p className='mt-6 text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed'>
          Quản lý nhập – xuất – lưu kho hiệu quả với nền tảng WMS hiện đại, minh bạch và theo thời gian thực.
        </p>
        <div className='mt-10 flex flex-wrap justify-center gap-4'>
          <Link
            to={ROUTES.login}
            className='inline-flex items-center px-6 py-3 rounded-lg text-base font-semibold bg-white text-slate-900 hover:bg-slate-100 transition-colors'
          >
            🔐 Đăng nhập hệ thống
          </Link>
          <Link
            to={ROUTES.portalRequest}
            className='inline-flex items-center px-6 py-3 rounded-lg text-base font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors'
          >
            📩 Gửi yêu cầu dịch vụ
          </Link>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
