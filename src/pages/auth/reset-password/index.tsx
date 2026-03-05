import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ROUTES } from '@constants'
import LanguageSelector from '../../../components/Auth/LanguageSelector'
import logo1 from '@images/logo1.png'

interface ResetPasswordFormDataI {
  newPassword: string
  confirmPassword: string
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const token = searchParams.get('token')

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError
  } = useForm<ResetPasswordFormDataI>({
    defaultValues: {
      newPassword: '',
      confirmPassword: ''
    }
  })

  const newPassword = watch('newPassword')

  const onSubmit = async (data: ResetPasswordFormDataI) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock validation
      if (data.newPassword === data.confirmPassword) {
        setIsSuccess(true)
        // Auto redirect to login after 2 seconds
        setTimeout(() => {
          navigate(ROUTES.login)
        }, 2000)
      } else {
        setError('confirmPassword', {
          message: 'Mật khẩu xác nhận không khớp'
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
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Đặt lại mật khẩu thành công!</h2>
            <p className='text-sm text-gray-600 mb-6'>
              Mật khẩu của bạn đã được cập nhật. Bạn có thể đăng nhập ngay bây giờ.
            </p>
            <Link
              to={ROUTES.login}
              className='inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
            >
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!token) {
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
            <div className='mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6 mt-4'>
              <svg className='h-8 w-8 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Link không hợp lệ</h2>
            <p className='text-sm text-gray-600 mb-6'>Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
            <Link
              to={ROUTES.forgotPassword}
              className='inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium'
            >
              Yêu cầu link mới
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
            <div className='flex justify-center mb-6'>
              <img src={logo1} alt='Logiverse Digital Logistics Platform' className='h-[180px] w-auto object-contain' />
            </div>
            <h2 className='text-3xl font-bold text-gray-900 mb-2'>Đặt lại mật khẩu</h2>
            <p className='text-sm text-gray-600'>Nhập mật khẩu mới cho tài khoản của bạn</p>
          </div>

          {/* Form */}
          <form className='space-y-5' onSubmit={handleSubmit(onSubmit)}>
            {/* New Password */}
            <div>
              <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                Mật khẩu mới
              </label>
              <div className='relative'>
                <input
                  {...register('newPassword', {
                    required: 'Mật khẩu mới là bắt buộc',
                    minLength: {
                      value: 6,
                      message: 'Mật khẩu phải có ít nhất 6 ký tự'
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.newPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Nhập mật khẩu mới'
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
              {errors.newPassword && <p className='mt-1 text-sm text-red-600'>{errors.newPassword.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                Xác nhận mật khẩu
              </label>
              <div className='relative'>
                <input
                  {...register('confirmPassword', {
                    required: 'Xác nhận mật khẩu là bắt buộc',
                    validate: (value) => value === newPassword || 'Mật khẩu xác nhận không khớp'
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder='Nhập lại mật khẩu mới'
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700'
                >
                  {showConfirmPassword ? (
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
              {errors.confirmPassword && <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword.message}</p>}
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
                    Đang cập nhật...
                  </div>
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <Link to={ROUTES.login} className='text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors'>
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
