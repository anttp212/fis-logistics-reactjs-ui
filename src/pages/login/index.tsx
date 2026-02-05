import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FISButton } from 'fis-component'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ROUTES } from '@constants'
import { useAppDispatch } from '@hooks'
import { setTokenData, setUser } from '@slices/auth.slice'

interface LoginFormDataI {
  email: string
  password: string
  rememberMe: boolean
}

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useAppDispatch()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<LoginFormDataI>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  })

  const onSubmit = async (data: LoginFormDataI) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock login validation
      if (data.email === 'admin@example.com' && data.password === '123456') {
        // ✅ Set mock token and user data in Redux
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
            id: 'user-123',
            name: 'Admin User',
            email: data.email,
            avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff',
            role: 'admin'
          })
        )

        const redirectTo = searchParams.get('redirect') || ROUTES.home
        navigate(redirectTo, { replace: true })

        // Note: Redux-persist automatically saves to localStorage!
      } else {
        setError('root', {
          message: 'Email hoặc mật khẩu không đúng'
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
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <div className='max-w-md w-full space-y-8'>
        {/* Header */}
        <div className='text-center'>
          <div className='mx-auto h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center mb-6'>
            <svg className='h-8 w-8 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
              />
            </svg>
          </div>
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>Đăng nhập</h2>
          <p className='text-sm text-gray-600'>Đăng nhập vào tài khoản của bạn</p>
        </div>

        {/* Form */}
        <div className='bg-white shadow-xl rounded-2xl px-8 py-10'>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email là bắt buộc',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email không hợp lệ'
                  }
                })}
                type='email'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Nhập email của bạn'
              />
              {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-2'>
                Mật khẩu
              </label>
              <input
                {...register('password', {
                  required: 'Mật khẩu là bắt buộc',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự'
                  }
                })}
                type='password'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Nhập mật khẩu'
              />
              {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className='flex items-center justify-between'>
              <div className='flex items-center'>
                <input
                  {...register('rememberMe')}
                  id='rememberMe'
                  type='checkbox'
                  className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
                />
                <label htmlFor='rememberMe' className='ml-2 block text-sm text-gray-700'>
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <div className='text-sm'>
                <Link
                  to={ROUTES.forgotPassword}
                  className='font-medium text-indigo-600 hover:text-indigo-500 transition-colors'
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
              <FISButton type='submit' size='lg' className='w-full' disabled={isLoading}>
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
              </FISButton>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className='mt-6 p-4 bg-gray-50 rounded-lg'>
            <p className='text-xs text-gray-600 text-center mb-2'>
              <strong>Demo credentials:</strong>
            </p>
            <p className='text-xs text-gray-500 text-center'>
              Email: <span className='font-mono'>admin@example.com</span>
              <br />
              Password: <span className='font-mono'>123456</span>
            </p>
          </div>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <p className='text-sm text-gray-600'>
              Chưa có tài khoản?{' '}
              <Link
                to={ROUTES.register}
                className='font-medium text-indigo-600 hover:text-indigo-500 transition-colors'
              >
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
