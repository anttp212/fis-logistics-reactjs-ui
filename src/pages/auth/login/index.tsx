import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ROUTES } from '@constants'
import { useAppDispatch } from '@hooks'
import { setTokenData, setUser } from '@slices/auth.slice'
import LanguageSelector from '../../../components/Auth/LanguageSelector'

interface LoginFormDataI {
  username: string
  password: string
  rememberMe: boolean
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormDataI>({
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false
    }
  })

  const onSubmit = async (data: LoginFormDataI) => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock: 3 tài khoản admin, taixe, baove (mật khẩu 123456)
      const mockAccounts: Array<{ user: string; pass: string; name: string; email: string; role: string }> = [
        { user: 'admin', pass: '123456', name: 'Admin', email: 'admin@example.com', role: 'Admin' },
        { user: 'taixe', pass: '123456', name: 'Tài xế', email: 'taixe@example.com', role: 'Tài xế' },
        { user: 'baove', pass: '123456', name: 'Bảo vệ', email: 'baove@example.com', role: 'Bảo vệ' }
      ]
      const account = mockAccounts.find((a) => a.user === data.username && a.pass === data.password)

      if (account) {
        dispatch(
          setTokenData({
            accessToken: 'mock-access-token-123456',
            tokenType: 'Bearer',
            expiresIn: 3600,
            refreshToken: 'mock-refresh-token-789'
          })
        )
        dispatch(
          setUser({
            id: account.user,
            name: account.name,
            email: account.email,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(account.name)}&background=6366f1&color=fff`,
            role: account.role
          })
        )
        const redirectTo = searchParams.get('redirect') || ROUTES.home
        navigate(redirectTo, { replace: true })
      } else {
        setError('root', {
          message: 'Tên đăng nhập hoặc mật khẩu không đúng'
        })
      }
    } catch (_error) {
      setError('root', {
        message: 'Có lỗi xảy ra, vui lòng thử lại'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className='min-h-screen flex items-center justify-center p-4 lg:p-8 bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: 'url(/bg.png)' }}
    >
      <div className='w-full max-w-lg'>
        {/* Form Card */}
        <div className='bg-white rounded-2xl shadow-xl p-10 relative'>
          {/* Language Selector */}
          <div className='absolute top-4 left-4'>
            <LanguageSelector />
          </div>

          {/* Logo and Title */}
          <div className='text-center mb-8 mt-12'>
            <div className='flex items-center justify-center gap-2 mb-6'>
              {/* Logo with checkmark graphic */}
              <div className='relative'>
                <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-white'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={3}
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
                  </svg>
                </div>
                <div className='absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full'></div>
              </div>
              <h1 className='text-2xl font-bold text-gray-900'>Logisverse</h1>
            </div>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Đăng nhập</h2>
          </div>

          {/* Form */}
          <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
            {/* Username */}
            <div>
              <label htmlFor='username' className='block text-sm font-medium text-gray-700 mb-2'>
                Tên đăng nhập
              </label>
              <input
                {...register('username', {
                  required: 'Tên đăng nhập là bắt buộc',
                  minLength: {
                    value: 3,
                    message: 'Tên đăng nhập phải có ít nhất 3 ký tự'
                  }
                })}
                type='text'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Nhập tên đăng nhập'
              />
              {errors.username && <p className='mt-1 text-sm text-red-600'>{errors.username.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                Mật khẩu
              </label>
              <div className='relative'>
                <input
                  {...register('password', {
                    required: 'Mật khẩu là bắt buộc',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Nhập mật khẩu'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                >
                  {showPassword ? (
                    <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21'
                      />
                    </svg>
                  ) : (
                    <svg className='w-5 h-5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  {...register('rememberMe')}
                  id='rememberMe'
                  type='checkbox'
                  className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                />
                <label htmlFor='rememberMe' className='ml-2 block text-sm text-gray-700'>
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <div className='text-sm'>
                <Link
                  to={ROUTES.forgotPassword}
                  className='font-medium text-blue-600 hover:text-blue-500 transition-colors'
                >
                  Quên mật khẩu?
                </Link>
              </div>
            </div>

            {/* Error Message */}
            {errors.root && (
              <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                <div className='flex'>
                  <div className='flex-shrink-0'>
                    <svg className='h-5 w-5 text-red-400' fill='currentColor' viewBox='0 0 20 20'>
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                  <div className='ml-3'>
                    <p className='text-sm text-red-800'>{errors.root.message}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type='submit'
                className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className='flex items-center justify-center'>
                    <svg
                      className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                    >
                      <circle
                        className='opacity-25'
                        cx='12'
                        cy='12'
                        r='10'
                        stroke='currentColor'
                        strokeWidth='4'
                      ></circle>
                      <path
                        className='opacity-75'
                        fill='currentColor'
                        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                      ></path>
                    </svg>
                    Đang đăng nhập...
                  </div>
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Chưa có tài khoản?{' '}
              <Link to={ROUTES.register} className='font-medium text-blue-600 hover:text-blue-500 transition-colors'>
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
