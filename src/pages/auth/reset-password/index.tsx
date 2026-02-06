import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FISButton } from 'fis-component'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { ROUTES } from '@constants'

interface ResetPasswordFormDataI {
  newPassword: string
  confirmPassword: string
}

const ResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

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
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
        <div className='max-w-md w-full'>
          <div className='bg-white shadow-xl rounded-2xl px-8 py-10 text-center'>
            <div className='mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-6'>
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
              className='inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium'
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
      <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
        <div className='max-w-md w-full'>
          <div className='bg-white shadow-xl rounded-2xl px-8 py-10 text-center'>
            <div className='mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-6'>
              <svg className='h-8 w-8 text-red-600' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>Link không hợp lệ</h2>
            <p className='text-sm text-gray-600 mb-6'>Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.</p>
            <Link
              to={ROUTES.forgotPassword}
              className='inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium'
            >
              Yêu cầu link mới
            </Link>
          </div>
        </div>
      </div>
    )
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
          <h2 className='text-3xl font-bold text-gray-900 mb-2'>Đặt lại mật khẩu</h2>
          <p className='text-sm text-gray-600'>Nhập mật khẩu mới cho tài khoản của bạn</p>
        </div>

        {/* Form */}
        <div className='bg-white shadow-xl rounded-2xl px-8 py-10'>
          <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
            {/* New Password */}
            <div>
              <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                Mật khẩu mới
              </label>
              <input
                {...register('newPassword', {
                  required: 'Mật khẩu mới là bắt buộc',
                  minLength: {
                    value: 6,
                    message: 'Mật khẩu phải có ít nhất 6 ký tự'
                  }
                })}
                type='password'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.newPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Nhập mật khẩu mới'
              />
              {errors.newPassword && <p className='mt-1 text-sm text-red-600'>{errors.newPassword.message}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                Xác nhận mật khẩu
              </label>
              <input
                {...register('confirmPassword', {
                  required: 'Xác nhận mật khẩu là bắt buộc',
                  validate: (value) => value === newPassword || 'Mật khẩu xác nhận không khớp'
                })}
                type='password'
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder='Nhập lại mật khẩu mới'
              />
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
                    Đang cập nhật...
                  </div>
                ) : (
                  'Đặt lại mật khẩu'
                )}
              </FISButton>
            </div>
          </form>

          {/* Footer */}
          <div className='mt-6 text-center'>
            <Link
              to={ROUTES.login}
              className='text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors'
            >
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
