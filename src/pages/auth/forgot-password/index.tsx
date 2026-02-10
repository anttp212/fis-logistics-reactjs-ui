import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { ROUTES } from '@constants'
import LanguageSelector from '../../../components/Auth/LanguageSelector'

interface ForgotPasswordFormDataI {
  email: string
}

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm<ForgotPasswordFormDataI>({
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = async (data: ForgotPasswordFormDataI) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock validation
      if (data.email === 'admin@example.com') {
        setIsSuccess(true)
        // Auto redirect to login after 3 seconds
        setTimeout(() => {
          navigate(ROUTES.login)
        }, 3000)
      } else {
        setError('root', {
          message: 'Email không tồn tại trong hệ thống'
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

  if (isSuccess) {
    return (
      <div
        className='min-h-screen flex items-center justify-center p-4 lg:p-8 bg-cover bg-center bg-no-repeat'
        style={{ backgroundImage: 'url(/bg.png)' }}
      >
        <div className='w-full max-w-lg'>
          <div className='bg-white rounded-2xl shadow-xl p-10 text-center relative'>
            <div className='absolute top-4 left-4'>
              <LanguageSelector />
            </div>
            <div className='mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6 mt-4'>
              <svg className='h-8 w-8 text-green-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Email đã được gửi!</h2>
            <p className='text-sm text-gray-600 mb-6'>
              Chúng tôi đã gửi link đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư.
            </p>
            <Link to={ROUTES.login} className='text-blue-600 hover:text-blue-500 font-medium text-sm'>
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    )
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
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Quên mật khẩu</h2>
            <p className='text-sm text-gray-600'>Nhập email để nhận link đặt lại mật khẩu</p>
          </div>

          {/* Form */}
          <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Nhập email của bạn'
              />
              {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>}
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
                    Đang gửi...
                  </div>
                ) : (
                  'Gửi link đặt lại mật khẩu'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className='mt-6 text-center space-y-2'>
            <Link
              to={ROUTES.login}
              className='block text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors'
            >
              ← Quay lại đăng nhập
            </Link>
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

export default ForgotPassword
